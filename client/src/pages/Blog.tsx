import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Fetch blog posts
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery({
    search: searchQuery,
    category: selectedCategory,
  });

  const categories = ["تكنولوجيا", "تجارة", "لوجستيات", "جودة", "نصائح"];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IF</span>
            </div>
            <span className="font-bold text-xl text-blue-900">IFROF</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-900 transition-colors">
              الرئيسية
            </Link>
            <a href="/#features" className="text-gray-700 hover:text-blue-900 transition-colors">
              المميزات
            </a>
            <a href="/#services" className="text-gray-700 hover:text-blue-900 transition-colors">
              الخدمات
            </a>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              ابدأ الآن
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            مدونة IFROF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف أحدث المقالات والنصائح حول التجارة الإلكترونية والمصانع والتكنولوجيا
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن مقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === undefined
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-900"
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">جاري تحميل المقالات...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد مقالات حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                          {post.category || "عام"}
                        </span>
                        {post.featured && (
                          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            مميز
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-blue-900 line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.createdAt).toLocaleDateString("ar-SA")}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            اشترك في النشرة البريدية
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              اشترك
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">IF</span>
                </div>
                <span className="font-bold text-white">IFROF</span>
              </div>
              <p className="text-sm">منصة ذكية للبحث عن المصانع وإدارة العمليات التجارية</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">الروابط</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
                <li><a href="/#features" className="hover:text-white transition-colors">المميزات</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">الخدمات</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">الشركة</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">عن الشركة</a></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">المدونة</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">الوظائف</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">القانونية</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 منصة IFROF. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
