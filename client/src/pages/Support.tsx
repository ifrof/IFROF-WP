import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, MessageSquare, AlertTriangle, Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Support() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [ticketType, setTicketType] = useState<"support" | "complaint" | "dispute">("support");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");

  const { data: user } = trpc.auth.me.useQuery();
  const { data: myTickets, refetch } = trpc.support.getMyTickets.useQuery(undefined, {
    enabled: !!user,
  });
  const createTicketMutation = trpc.support.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !description) {
      toast.error(t("errors.required"));
      return;
    }

    try {
      await createTicketMutation.mutateAsync({
        type: ticketType,
        subject,
        description,
        priority,
      });

      toast.success(t("support.ticketCreated"));
      setSubject("");
      setDescription("");
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error(t("errors.server"));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      open: { variant: "default", label: t("support.status.open") },
      in_progress: { variant: "secondary", label: t("support.status.inProgress") },
      resolved: { variant: "default", label: t("support.status.resolved") },
      closed: { variant: "secondary", label: t("support.status.closed") },
    };
    const config = statusMap[status] || statusMap.open;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { variant: any; label: string }> = {
      low: { variant: "secondary", label: t("support.priority.low") },
      medium: { variant: "default", label: t("support.priority.medium") },
      high: { variant: "default", label: t("support.priority.high") },
      urgent: { variant: "destructive", label: t("support.priority.urgent") },
    };
    const config = priorityMap[priority] || priorityMap.medium;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t("support.title")}</h1>
          <p className="text-xl text-blue-100">{t("support.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Mail className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t("support.general.title")}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t("support.general.desc")}</p>
              <a href="mailto:support@ifrof.com" className="text-blue-600 hover:underline">
                support@ifrof.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t("support.complaints.title")}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t("support.complaints.desc")}</p>
              <a href="mailto:complain@ifrof.com" className="text-orange-600 hover:underline">
                complain@ifrof.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t("support.disputes.title")}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t("support.disputes.desc")}</p>
              <a href="mailto:dispute@ifrof.com" className="text-red-600 hover:underline">
                dispute@ifrof.com
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Notice */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
              <p className="text-blue-900 font-medium">{t("support.responseTime")}</p>
            </div>
          </CardContent>
        </Card>

        {user ? (
          <>
            {/* Create Ticket Button */}
            {!showForm && (
              <div className="text-center mb-8">
                <Button onClick={() => setShowForm(true)} size="lg">
                  <Send className="w-5 h-5 mr-2" />
                  {t("support.createTicket")}
                </Button>
              </div>
            )}

            {/* Create Ticket Form */}
            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{t("support.createTicket")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("support.ticketType")}
                      </label>
                      <Select value={ticketType} onValueChange={(v: any) => setTicketType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="support">{t("support.type.support")}</SelectItem>
                          <SelectItem value="complaint">{t("support.type.complaint")}</SelectItem>
                          <SelectItem value="dispute">{t("support.type.dispute")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("support.priority.title")}
                      </label>
                      <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{t("support.priority.low")}</SelectItem>
                          <SelectItem value="medium">{t("support.priority.medium")}</SelectItem>
                          <SelectItem value="high">{t("support.priority.high")}</SelectItem>
                          <SelectItem value="urgent">{t("support.priority.urgent")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("support.subject")}
                      </label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={t("support.subjectPlaceholder")}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("support.description")}
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t("support.descriptionPlaceholder")}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={createTicketMutation.isPending}>
                        {createTicketMutation.isPending && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {t("common.submit")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* My Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>{t("support.myTickets")}</CardTitle>
              </CardHeader>
              <CardContent>
                {myTickets && myTickets.length > 0 ? (
                  <div className="space-y-4">
                    {myTickets.map((ticket: any) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{ticket.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t("support.ticketId")}: #{ticket.id} •{" "}
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {ticket.description}
                        </p>
                        <Link href={`/support/tickets/${ticket.id}`}>
                          <Button variant="outline" size="sm">
                            {t("common.viewDetails")}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t("support.noTickets")}
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">{t("support.loginRequired")}</p>
              <Link href="/login">
                <Button>{t("nav.login")}</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
