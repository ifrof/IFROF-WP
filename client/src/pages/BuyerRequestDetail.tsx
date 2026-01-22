import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import BuyerDashboardLayout from "@/components/BuyerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ArrowRight, Package, FileText, Factory, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function BuyerRequestDetail() {
  const { id } = useParams();
  const { language, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: quotes, isLoading: quotesLoading } = trpc.inquiries.getQuotes.useQuery({ requestId: Number(id) });

  const createCheckout = trpc.payments.createCommissionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(false);
    }
  });

  const handleAccept = async (quoteId: number) => {
    setIsProcessing(true);
    createCheckout.mutate({ quoteId });
  };

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6" dir={dir}>
        <Button variant="ghost" onClick={() => setLocation("/buyer/requests")} className="gap-2">
          {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {language === 'ar' ? 'العودة لطلباتي' : 'Back to My Requests'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'المنتج' : 'Product'}</p>
                    <p className="font-medium">Cotton T-shirts</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{language === 'ar' ? 'الكمية' : 'Quantity'}</p>
                    <p className="font-medium">1000</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'المواصفات' : 'Specifications'}</p>
                  <p className="text-sm">100% Organic Cotton, White, Various Sizes</p>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {language === 'ar' ? 'عروض الأسعار المستلمة' : 'Received Quotes'}
            </h2>

            {quotesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : quotes && quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((quote: any) => (
                  <Card key={quote.id} className="border-2 border-blue-100">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Factory className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-bold">Elite Manufacturing Co.</p>
                            <p className="text-xs text-gray-500">Verified Factory</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">${(quote.price / 100).toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{language === 'ar' ? 'السعر الإجمالي' : 'Total Price'}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-sm font-medium mb-1">{language === 'ar' ? 'الشروط:' : 'Terms:'}</p>
                        <p className="text-sm text-gray-600">{quote.terms || 'No specific terms provided.'}</p>
                      </div>
                      <Button 
                        onClick={() => handleAccept(quote.id)} 
                        className="w-full bg-orange-500 hover:bg-orange-600 gap-2"
                        disabled={isProcessing}
                      >
                        <CreditCard className="w-4 h-4" />
                        {language === 'ar' ? 'قبول العرض والدفع' : 'Accept & Pay Commission'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center text-gray-500">
                  {language === 'ar' ? 'لا توجد عروض أسعار بعد.' : 'No quotes received yet.'}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'كيف يعمل الدفع؟' : 'How Payment Works'}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <p>
                  {language === 'ar' 
                    ? 'عند قبول العرض، ستقوم بدفع عمولة المنصة فقط (3%).'
                    : 'When you accept a quote, you only pay the platform commission (3%).'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'يتم دفع باقي المبلغ للمصنع مباشرة حسب الاتفاق بينكما.'
                    : 'The remaining balance is paid directly to the factory as per your agreement.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BuyerDashboardLayout>
  );
}
