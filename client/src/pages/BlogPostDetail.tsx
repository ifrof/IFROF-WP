import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  featured: number;
  published: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data: post,
    isLoading,
    error,
  } = trpc.blog.getBySlug.useQuery({
    slug: slug || "",
  });

## Introduction
When sourcing from China, one of the most critical decisions is determining whether you're dealing with a real factory or a trading company. This distinction can significantly impact your business operations, costs, and quality control.

## Key Differences

### Real Factories (Manufacturers)
- **Own Production Lines**: They have their own equipment and machinery
- **Direct Control**: Full control over quality and production processes
- **Technical Expertise**: Staff with deep technical knowledge
- **Customization Capability**: Can modify products according to specifications
- **Inventory**: Maintain raw materials and finished goods inventory
- **Minimum Order Quantity (MOQ)**: Usually higher but more flexible on price

### Trading Companies
- **No Production**: Source products from multiple factories
- **Middleman Role**: Act as intermediaries between buyers and manufacturers
- **Lower MOQ**: Can fulfill smaller orders
- **Faster Delivery**: May have existing inventory
- **Less Technical Knowledge**: Limited ability to customize
- **Higher Markup**: Add profit margin to factory prices

## How to Identify a Real Factory

### 1. Company Registration and Licenses
- Check the Unified Social Credit Code (USCC) on Qcc.com
- Verify manufacturing licenses and certifications
- Look for ISO certifications (ISO 9001, ISO 14001, etc.)

### 2. Physical Location
- Real factories are located in industrial zones
- Trading companies are usually in office buildings
- Use Google Maps or satellite imagery to verify

### 3. Production Capacity
- Ask for production capacity in units per month
- Request photos/videos of production lines
- Inquire about number of employees

### 4. Technical Knowledge
- Ask detailed technical questions about the product
- Real factories can answer immediately
- Trading companies may need to consult with factories

### 5. Price Structure
- Factory prices are usually lower
- Trading companies add 20-40% markup
- Compare prices across multiple suppliers

## Red Flags 🚩

1. **Vague Answers**: Cannot provide specific technical details
2. **No Factory Photos**: Refuses to provide factory images/videos
3. **High Prices**: Significantly higher than industry average
4. **No Minimum Order Flexibility**: Rigid MOQ requirements
5. **Poor Communication**: Slow responses or language barriers
6. **No Certifications**: Cannot provide quality certificates
7. **Pressure to Pay**: Requests payment before verification
8. **Generic Website**: Poorly designed or copied content

## Green Flags ✅

1. **Detailed Factory Information**: Clear description of facilities
2. **Video Tours**: Willing to provide factory video tours
3. **Competitive Pricing**: Reasonable prices with volume discounts
4. **Technical Expertise**: Quick, detailed answers to technical questions
5. **Certifications**: ISO and product-specific certifications
6. **References**: Can provide customer references
7. **Flexible MOQ**: Willing to negotiate on order quantities
8. **Professional Communication**: Clear, prompt responses

## Verification Methods

### Online Verification
- Check company on Qcc.com, Tianyancha, or Aiqcc
- Search for company reviews on industry platforms
- Verify business registration status

### Direct Verification
- Request factory video call
- Ask for production line photos
- Request sample orders
- Verify through trade associations

### Third-Party Verification
- Use professional verification services
- Hire local inspection agencies
- Use trade verification platforms

## Conclusion
Taking time to properly verify whether you're dealing with a real factory or trading company can save you significant time and money in the long run. Use multiple verification methods and trust your instincts when something doesn't feel right.

## Next Steps
1. Use the IFROF verification system to check suppliers
2. Request factory documentation
3. Schedule a video call with the supplier
4. Request samples before placing large orders
5. Build a long-term relationship with verified suppliers
          `,
          excerpt: "Learn the key differences between real factories and trading companies.",
          category: "Supplier Verification",
          tags: '["factories", "trading", "verification", "china"]',
          featured: 1,
          published: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPost(mockPost);
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "ar" ? "جاري تحميل المقال..." : "Loading article..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            {language === "ar" ? "المقال غير موجود" : "Article Not Found"}
          </h1>
          <Button
            onClick={() => setLocation("/blog")}
            className="bg-blue-900 text-white"
          >
            {language === "ar" ? "العودة للمدونة" : "Back to Blog"}
          </Button>
        </div>
      </div>
    );
  }

  const tags = JSON.parse(post.tags || "[]");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/blog")}
            className="mb-4 gap-2"
          >
            <ArrowLeft
              className={`w-4 h-4 ${language === "ar" ? "rotate-180" : ""}`}
            />
            {language === "ar" ? "العودة للمدونة" : "Back to Blog"}
          </Button>

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
              {new Date(post.createdAt).toLocaleDateString(
                language === "ar" ? "ar-SA" : "en-US"
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {language === "ar" ? "قراءة 5 دقائق" : "5 min read"}
            </div>
          </div>
        </div>
      </div>

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
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

        {/* Share & Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              {language === "ar" ? "مشاركة" : "Share"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="w-4 h-4" />
              {language === "ar" ? "حفظ" : "Save"}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2026 IFROF.{" "}
            {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
}
