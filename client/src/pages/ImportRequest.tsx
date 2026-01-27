import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, 
  ArrowLeft, 
  Package, 
  Globe, 
  CheckCircle, 
  Loader2,
  Factory,
  Truck,
  DollarSign,
  Calendar,
  FileText,
  Shield,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { getLoginUrl } from '@/const';

export default function ImportRequest() {
  const { language, t, dir } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    specifications: '',
    budget: '',
    deadline: '',
    destination: '',
    shippingMethod: 'sea',
    notes: '',
    attachments: [] as File[],
    attachmentUrls: [] as string[],
  });

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error(language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    if (!formData.productName || !formData.quantity || !formData.destination) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields');
      return;
    }

    if (formData.attachments.length === 0 && formData.attachmentUrls.length === 0) {
      toast.error(language === 'ar' ? 'يرجى إضافة صور أو ملفات' : 'Please add images or files');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(language === 'ar' ? 'تم إرسال طلب الاستيراد بنجاح!' : 'Import request submitted successfully!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50" dir={dir}>
        {/* Success State */}
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Your Request Has Been Submitted!'}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === 'ar' 
                  ? 'سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة. سنبحث عن أفضل المصانع الصينية الموثقة لك.'
                  : 'Our team will review your request and contact you within 24 hours. We will search for the best verified Chinese manufacturers for you.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                  </Button>
                </Link>
                <Button onClick={() => setSubmitted(false)} className="bg-[#ff8c42] hover:bg-[#e67a35]">
                  {language === 'ar' ? 'إرسال طلب آخر' : 'Submit Another Request'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4">
            {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('importRequest.new')}
          </h1>
          <p className="text-gray-300">
            {language === 'ar' 
              ? 'أخبرنا ماذا تريد استيراده وسنجد لك أفضل المصانع الصينية الموثقة'
              : 'Tell us what you want to import and we will find the best verified Chinese manufacturers for you'
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('importRequest.title')}</CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'املأ النموذج التالي وسنتواصل معك خلال 24 ساعة'
                    : 'Fill out the form below and we will contact you within 24 hours'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isAuthenticated && !authLoading ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please Login First'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {language === 'ar' 
                        ? 'تحتاج إلى تسجيل الدخول لإرسال طلب استيراد'
                        : 'You need to login to submit an import request'
                      }
                    </p>
                    <a href={getLoginUrl()}>
                      <Button className="bg-[#ff8c42] hover:bg-[#e67a35]">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                      </Button>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <Label htmlFor="productName" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {t('importRequest.form.product')} *
                      </Label>
                      <Input
                        id="productName"
                        placeholder={language === 'ar' ? 'مثال: ملابس رجالية، إلكترونيات، أثاث...' : 'Example: Men\'s clothing, electronics, furniture...'}
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <Label htmlFor="quantity" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t('importRequest.form.quantity')} *
                      </Label>
                      <Input
                        id="quantity"
                        placeholder={language === 'ar' ? 'مثال: 1000 قطعة، 500 كرتون...' : 'Example: 1000 pieces, 500 cartons...'}
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>

                    {/* Specifications */}
                    <div>
                      <Label htmlFor="specifications" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t('importRequest.form.specifications')}
                      </Label>
                      <Textarea
                        id="specifications"
                        placeholder={language === 'ar' ? 'اكتب المواصفات المطلوبة بالتفصيل...' : 'Write the required specifications in detail...'}
                        value={formData.specifications}
                        onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <Label htmlFor="budget" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {t('importRequest.form.budget')}
                      </Label>
                      <Input
                        id="budget"
                        placeholder={language === 'ar' ? 'مثال: $5,000 - $10,000' : 'Example: $5,000 - $10,000'}
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    {/* Destination */}
                    <div>
                      <Label htmlFor="destination" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {t('importRequest.form.destination')} *
                      </Label>
                      <Input
                        id="destination"
                        placeholder={language === 'ar' ? 'مثال: مصر، السعودية، الإمارات...' : 'Example: Egypt, Saudi Arabia, UAE...'}
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <Label htmlFor="deadline" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {t('importRequest.form.deadline')}
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    {/* File Attachments */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {language === 'ar' ? 'صور/ملفات المنتج' : 'Product Images/Files'} *
                      </Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#ff8c42] transition">
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFormData({ 
                                ...formData, 
                                attachments: Array.from(e.target.files) 
                              });
                            }
                          }}
                          className="hidden"
                          id="fileInput"
                        />
                        <label htmlFor="fileInput" className="cursor-pointer">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {language === 'ar' 
                              ? 'اسحب الملفات هنا أو انقر للاختيار' 
                              : 'Drag files here or click to select'
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {language === 'ar' 
                              ? 'صور، PDF، مستندات Word' 
                              : 'Images, PDF, Word documents'
                            }
                          </p>
                        </label>
                      </div>
                      {formData.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    attachments: formData.attachments.filter((_, i) => i !== index)
                                  });
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* External Links */}
                    <div>
                      <Label htmlFor="attachmentUrls" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {language === 'ar' ? 'روابط خارجية (اختياري)' : 'External Links (Optional)'}
                      </Label>
                      <Textarea
                        id="attachmentUrls"
                        placeholder={language === 'ar' 
                          ? 'أضف روابط للصور أو المستندات (رابط واحد في كل سطر)' 
                          : 'Add links to images or documents (one link per line)'
                        }
                        value={formData.attachmentUrls.join('\n')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          attachmentUrls: e.target.value.split('\n').filter(url => url.trim()) 
                        })}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        {t('importRequest.form.shippingMethod')}
                      </Label>
                      <div className="flex gap-4 mt-2">
                        {[
                          { value: 'sea', label: language === 'ar' ? 'بحري' : 'Sea' },
                          { value: 'air', label: language === 'ar' ? 'جوي' : 'Air' },
                          { value: 'express', label: language === 'ar' ? 'سريع' : 'Express' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={option.value}
                              checked={formData.shippingMethod === option.value}
                              onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                              className="w-4 h-4 text-[#ff8c42]"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t('importRequest.form.notes')}
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#ff8c42] hover:bg-[#e67a35] text-white font-semibold py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin me-2" />
                          {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          {t('importRequest.submit')}
                          <Arrow className="w-5 h-5 ms-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why IFROF */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'لماذا IFROF؟' : 'Why IFROF?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Factory, text: language === 'ar' ? 'مصانع صينية موثقة' : 'Verified Chinese Manufacturers' },
                  { icon: Shield, text: language === 'ar' ? 'بدون وسطاء' : 'No Middlemen' },
                  { icon: DollarSign, text: language === 'ar' ? 'أسعار المصنع مباشرة' : 'Direct Factory Prices' },
                  { icon: CheckCircle, text: language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="bg-[#1e3a5f] text-white">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">
                  {language === 'ar' ? 'تحتاج مساعدة؟' : 'Need Help?'}
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  {language === 'ar' 
                    ? 'تواصل مع فريق الدعم'
                    : 'Contact our support team'
                  }
                </p>
                <a href="mailto:support@ifrof.com" className="text-[#ff8c42] font-semibold hover:underline">
                  support@ifrof.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
