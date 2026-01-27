import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function AdminFactoryVerification() {
  const { language } = useLanguage();

  const pendingVerifications = [
    {
      id: 1,
      name: "Guangzhou Electronics Co.",
      submitted: "2023-10-10",
      documents: ["Business License", "ISO 9001"],
      riskLevel: "Low",
    },
    {
      id: 2,
      name: "Shenzhen Toy Factory",
      submitted: "2023-10-12",
      documents: ["Business License", "Export Permit"],
      riskLevel: "Medium",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {language === "ar"
                ? "طلبات التحقق من المصانع"
                : "Factory Verification Queue"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "مراجعة واعتماد المصانع الجديدة في المنصة."
                : "Review and approve new factories on the platform."}
            </p>
          </div>
          <Badge variant="outline" className="px-4 py-1">
            <Clock className="w-4 h-4 mr-2" />
            {pendingVerifications.length}{" "}
            {language === "ar" ? "طلبات معلقة" : "Pending Requests"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {pendingVerifications.map(req => (
            <Card
              key={req.id}
              className="overflow-hidden border-l-4 border-l-primary"
            >
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{req.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "ar" ? "تاريخ التقديم:" : "Submitted on:"}{" "}
                      {req.submitted}
                    </p>
                  </div>
                  <Badge
                    variant={req.riskLevel === "Low" ? "default" : "secondary"}
                  >
                    {language === "ar" ? "مستوى المخاطر:" : "Risk:"}{" "}
                    {req.riskLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {language === "ar"
                        ? "المستندات المرفقة"
                        : "Attached Documents"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {req.documents.map((doc, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {doc}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {language === "ar" ? "رفض" : "Reject"}
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {language === "ar" ? "اعتماد" : "Approve"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verification Guidelines Skeleton */}
        <Card className="bg-primary/5 border-dashed">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2">
                {language === "ar"
                  ? "إرشادات التحقق"
                  : "Verification Guidelines"}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                <li>
                  {language === "ar"
                    ? "تأكد من مطابقة اسم الشركة في الرخصة مع المسجل."
                    : "Ensure company name matches business license."}
                </li>
                <li>
                  {language === "ar"
                    ? "تحقق من تاريخ انتهاء صلاحية التصاريح."
                    : "Check expiration dates of permits."}
                </li>
                <li>
                  {language === "ar"
                    ? "في حالة الشك، اطلب زيارة ميدانية أو مكالمة فيديو."
                    : "If in doubt, request a site visit or video call."}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
