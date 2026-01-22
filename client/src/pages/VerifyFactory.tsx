import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Loader2, ShieldCheck, Search, Factory, Globe, MapPin, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

const verifySchema = z.object({
  factory_name: z.string().min(2, "Factory name is required"),
  location: z.string().optional(),
  website: z.string().optional(),
});

type VerifyForm = z.infer<typeof verifySchema>;

export default function VerifyFactory() {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = trpc.factoryVerification.verify.useMutation({
    onSuccess: (data) => {
      setReport(data);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message);
      setReport(null);
    }
  });

  const onSubmit = (data: VerifyForm) => {
    verifyMutation.mutate({ ...data, language: 'en' });
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4 flex items-center justify-center gap-3">
          <ShieldCheck className="h-10 w-10 text-green-600" />
          AI Factory Verification
        </h1>
        <p className="text-gray-600 text-lg">
          Instantly verify if a Chinese supplier is a real direct manufacturer or just a trading company.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Verify Supplier</CardTitle>
            <CardDescription>Enter factory details for AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="factory_name">Factory Name</Label>
                <div className="relative">
                  <Factory className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="factory_name" placeholder="e.g. Foshan Furniture Co." className="pl-10" {...register("factory_name")} />
                </div>
                {errors.factory_name && <p className="text-sm text-red-500">{errors.factory_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="location" placeholder="e.g. Guangdong, China" className="pl-10" {...register("location")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="website" placeholder="https://..." className="pl-10" {...register("website")} />
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#2a5282]" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify Now
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!report && !verifyMutation.isPending && !error && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No report generated yet</h3>
              <p className="text-gray-400">Fill out the form to start the AI verification process.</p>
            </div>
          )}

          {verifyMutation.isPending && (
            <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">AI is Researching...</h3>
              <p className="text-gray-500">Searching official records, Alibaba profiles, and business licenses across the web.</p>
            </div>
          )}

          {report && (
            <Card className="border-t-4 border-t-blue-600 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Verification Report</CardTitle>
                  <CardDescription>Generated by IFROF AI Auditor</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#1e3a5f]">{report.score}/10</div>
                  <Badge variant={report.is_verified ? "default" : "destructive"} className={report.is_verified ? "bg-green-600" : ""}>
                    {report.is_verified ? "VERIFIED FACTORY" : "CAUTION ADVISED"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    Key Findings
                  </h4>
                  <ul className="space-y-3">
                    {report.evidence.map((item: any, i: number) => (
                      <li key={i} className="bg-gray-50 p-3 rounded-lg border-l-4 border-l-blue-400">
                        <p className="text-sm font-medium">{item.finding}</p>
                        {item.source && (
                          <a href={item.source} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                            Source: {item.source}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2">AI Recommendation</h4>
                  <p className="text-blue-800">{report.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
