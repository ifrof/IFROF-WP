import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { ArrowLeft, Save, Eye } from "lucide-react";

interface BlogPostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  featured: boolean;
  published: boolean;
}

export default function BlogEditor() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState<BlogPostForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Tips & Tricks",
    tags: "",
    featured: false,
    published: false,
  });

  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // في بيئة الإنتاج، ستقوم بإرسال البيانات إلى API
      console.log("Saving article:", form);
      // محاكاة التأخير
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Article saved successfully!");
      setLocation("/blog");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    "Supplier Verification",
    "Payment & Finance",
    "Shipping & Logistics",
    "Quality Assurance",
    "Tips & Tricks",
    "Business Strategy",
  ];

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

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">
              Create New Article
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreview(!preview)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {preview ? "Edit" : "Preview"}
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Article"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Article Title *
              </label>
              <Input
                type="text"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Enter article title"
                className="w-full"
              />
            </Card>

            {/* Slug */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                URL Slug (Auto-generated)
              </label>
              <Input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="article-slug"
                className="w-full"
              />
            </Card>

            {/* Excerpt */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Excerpt (Short Summary) *
              </label>
              <Textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Write a brief summary of the article (150-200 characters)"
                rows={3}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {form.excerpt.length}/200 characters
              </p>
            </Card>

            {/* Content */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Article Content (Markdown supported) *
              </label>
              <Textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder={`# Article Title

## Section 1
Your content here...

## Section 2
More content...

### Subsection
- Bullet point 1
- Bullet point 2`}
                rows={15}
                className="w-full font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Markdown formatting is supported
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags (comma-separated)
              </label>
              <Input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="supplier, verification, china"
                className="w-full"
              />
            </Card>

            {/* Status */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Status</h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={form.published}
                  onChange={handleChange}
                  id="published"
                  className="w-4 h-4 rounded border-border"
                />
                <label
                  htmlFor="published"
                  className="text-sm text-foreground cursor-pointer"
                >
                  Publish this article
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  id="featured"
                  className="w-4 h-4 rounded border-border"
                />
                <label
                  htmlFor="featured"
                  className="text-sm text-foreground cursor-pointer"
                >
                  Mark as featured
                </label>
              </div>
            </Card>

            {/* Help */}
            <Card className="p-6 bg-secondary/50">
              <h3 className="font-semibold text-foreground mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Use clear, descriptive titles</li>
                <li>✓ Write compelling excerpts</li>
                <li>✓ Use markdown for formatting</li>
                <li>✓ Add relevant tags</li>
                <li>✓ Review before publishing</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
