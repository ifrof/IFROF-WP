import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share2, Bookmark, MessageCircle } from "lucide-react";
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // في بيئة الإنتاج، ستحصل على البيانات من API
        // للآن، نستخدم بيانات وهمية
        const mockPost: BlogPost = {
          id: 1,
          title: "How to Identify Real Factories vs Trading Companies in China",
          slug: slug || "how-to-identify-real-factories",
          content: `
# How to Identify Real Factories vs Trading Companies in China

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Button onClick={() => setLocation("/blog")}>Back to Blog</Button>
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
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>

          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
            <span className="bg-secondary px-3 py-1 rounded-full">{post.category}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>5 min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-8">
              <Streamdown>{post.content}</Streamdown>
            </Card>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/blog?tag=${tag}`)}
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="flex gap-4 py-8 border-t border-border">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </div>

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6">Comments</h3>
              <Card className="p-6 bg-secondary/50">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts..."
                      className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                    />
                    <Button className="mt-4">Post Comment</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Related Articles</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition"
                    onClick={() => setLocation("/blog")}
                  >
                    <h4 className="font-medium text-foreground text-sm mb-2">
                      Top 10 Supplier Verification Tips
                    </h4>
                    <p className="text-xs text-muted-foreground">6 min read</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
              <h3 className="text-lg font-semibold text-foreground mb-2">Subscribe to Updates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest sourcing tips delivered to your inbox
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              />
              <Button className="w-full">Subscribe</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
