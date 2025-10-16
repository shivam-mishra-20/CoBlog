# Component Examples & Usage Guide

## 🎨 Button Component

### Variants

```tsx
import { Button } from "@/components/ui/button";

// Default - Royal brown with shadow
<Button variant="default">Default Button</Button>

// Luxury - Gradient button with premium look
<Button variant="luxury">Luxury Button</Button>

// Outline - Bordered style
<Button variant="outline">Outline Button</Button>

// Secondary - Brown variant
<Button variant="secondary">Secondary Button</Button>

// Ghost - Transparent with hover
<Button variant="ghost">Ghost Button</Button>

// Link - Text style
<Button variant="link">Link Button</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon">📍</Button>
```

### With Icons

```tsx
import { Plus, Edit, Trash2 } from "lucide-react";

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Create New
</Button>

<Button variant="ghost" size="sm">
  <Edit className="h-4 w-4 mr-1" />
  Edit
</Button>

<Button variant="ghost" size="sm" className="text-red-600">
  <Trash2 className="h-4 w-4 mr-1" />
  Delete
</Button>
```

### As Link (with asChild)

```tsx
import Link from "next/link";

<Button asChild variant="luxury" size="xl">
  <Link href="/blog">Explore Articles</Link>
</Button>;
```

## 🃏 Card Component

### Basic Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Luxury Card

```tsx
<Card className="card-luxury">
  <CardHeader>
    <CardTitle>Premium Card</CardTitle>
  </CardHeader>
  <CardContent>Enhanced with gradient background</CardContent>
</Card>
```

### Interactive Card

```tsx
<Card className="hover:scale-105 transition-all duration-300 hover:shadow-royal-xl">
  <CardHeader>
    <CardTitle>Hover Me</CardTitle>
  </CardHeader>
  <CardContent>I have a subtle hover effect!</CardContent>
</Card>
```

## 🏷️ Badge Component

### Variants

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="luxury">Luxury</Badge>
```

### Usage Examples

```tsx
// Status indicator
<Badge variant="default" className="bg-green-100 text-green-800">
  Published
</Badge>

// Category tag
<Badge variant="luxury">Technology</Badge>

// Count badge
<Badge variant="outline">12 posts</Badge>
```

## 🎨 Custom Utility Classes

### Gradients

```tsx
// Background gradients
<div className="bg-gradient-royal">...</div>
<div className="bg-gradient-brown">...</div>
<div className="bg-gradient-luxury">...</div>

// Text gradient
<h1 className="text-gradient-royal">Gradient Text</h1>
```

### Cards

```tsx
// Standard royal card
<div className="card-royal p-6">...</div>

// Luxury card with gradient
<div className="card-luxury p-6">...</div>
```

### Shadows

```tsx
<div className="shadow-royal">Standard shadow</div>
<div className="shadow-royal-lg">Medium shadow</div>
<div className="shadow-royal-xl">Large shadow</div>
<div className="shadow-royal-2xl">Extra large shadow</div>
```

## 🎬 Animations

```tsx
// Fade in
<div className="animate-fade-in">...</div>

// Slide up
<div className="animate-slide-up">...</div>

// Slide down
<div className="animate-slide-down">...</div>

// Combined with transitions
<div className="transition-all duration-300 hover:scale-105">...</div>
```

## 📐 Layout Patterns

### Hero Section

```tsx
<section className="relative overflow-hidden">
  {/* Decorative background */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-royal-200/30 rounded-full blur-3xl" />
    <div className="absolute top-60 -left-40 w-96 h-96 bg-brown-200/20 rounded-full blur-3xl" />
  </div>

  <div className="relative max-w-7xl mx-auto px-4 py-24">
    <h1 className="text-6xl font-serif font-bold text-royal-900">Hero Title</h1>
  </div>
</section>
```

### Content Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {/* Your content */}
</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map((item) => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

### Centered Content

```tsx
<div className="min-h-screen bg-gradient-luxury">
  <div className="flex items-center justify-center min-h-screen">
    <Card className="max-w-md w-full">{/* Centered card */}</Card>
  </div>
</div>
```

## 🎯 Icons with Lucide

```tsx
import {
  Sparkles,
  BookOpen,
  Feather,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  ArrowLeft,
  Menu,
  X,
  LayoutDashboard,
  Folder,
  Tag
} from "lucide-react";

<Sparkles className="h-8 w-8 text-royal-600" />
<BookOpen className="h-10 w-10 text-royal-600" />
```

## 🌈 Color Usage

```tsx
// Backgrounds
bg - royal - 50; // Lightest
bg - royal - 100;
bg - royal - 200;
bg - royal - 700; // Primary
bg - royal - 900; // Darkest
bg - royal - 950; // Ultra dark

// Text
text - royal - 600; // Light text
text - royal - 700; // Primary text
text - royal - 900; // Dark text

// Borders
border - royal - 200; // Light borders
border - royal - 700; // Primary borders
```

## 📝 Form Elements

```tsx
// Input with royal styling
<input
  type="text"
  className="input-royal"
  placeholder="Enter text..."
/>

// Textarea
<textarea
  className="input-royal"
  rows={4}
  placeholder="Description..."
/>

// Select
<select className="input-royal">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## 🎭 Loading States

```tsx
// Spinner
<div className="text-center py-20">
  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-royal-600 border-r-transparent"></div>
  <p className="mt-6 text-royal-700 text-lg">Loading...</p>
</div>
```

## 📱 Responsive Utilities

```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Responsive text sizes
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  Responsive Heading
</h1>

// Responsive padding
<div className="p-4 md:p-8 lg:p-12">
  Content
</div>
```

## 🎨 Tips for Best Results

1. **Combine utilities**: Mix shadows, hover effects, and transitions

   ```tsx
   <Card className="card-luxury hover:scale-105 hover:shadow-royal-xl transition-all duration-300">
   ```

2. **Use semantic colors**: Match colors to content meaning

   ```tsx
   <Badge className="bg-green-100 text-green-800">Published</Badge>
   <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
   ```

3. **Layer animations**: Start subtle, enhance on interaction

   ```tsx
   <div className="animate-fade-in hover:animate-pulse">
   ```

4. **Maintain hierarchy**: Use font sizes and weights consistently
   ```tsx
   <h1 className="text-5xl font-serif font-bold">Main Title</h1>
   <h2 className="text-3xl font-serif font-semibold">Subtitle</h2>
   <p className="text-base font-sans">Body text</p>
   ```

---

**💡 Experiment with combinations to create unique, on-brand designs!**
