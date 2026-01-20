import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share2, Bookmark, Calendar, Clock, Tag } from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { language, dir } = useLanguage();

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ 
    slug: slug || "" 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...'}</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            {language === 'ar' ? 'المقال غير موجود' : 'Article Not Found'}
          </h1>
          <Button onClick={() => setLocation("/blog")} className="bg-blue-900 text-white">
            {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
          </Button>
        </div>
      </div>
    );
  }

  const tags = JSON.parse(post.tags || "[]");

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation("/blog")}
            className="gap-2 text-blue-900"
          >
            <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            {language === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
          </Button>
          <div className="font-bold text-xl text-blue-900">IFROF</div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-white border-b border-gray-200 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-6 items-center text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {language === 'ar' ? 'قراءة 5 دقائق' : '5 min read'}
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-6 md:p-12 shadow-sm border-gray-200 bg-white overflow-hidden">
          <article className="prose prose-blue max-w-none">
            <Streamdown>{post.content}</Streamdown>
          </article>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Share & Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              {language === 'ar' ? 'مشاركة' : 'Share'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 IFROF. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  );
}
