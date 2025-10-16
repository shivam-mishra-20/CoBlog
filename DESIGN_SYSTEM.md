# Royal Brown & White Design System

## 🎨 Color Palette

### Royal Colors

- **Royal 50-950**: Luxurious golden-brown gradient palette
- **Primary**: `royal-700` (#8b6f4f) - Main brand color
- **Secondary**: `brown-700` (#73513b) - Complementary warm brown
- **Accent**: `cream-100` (#faf8f5) - Elegant cream background

### Usage

```tsx
// Backgrounds
className = "bg-royal-700"; // Primary background
className = "bg-gradient-royal"; // Luxury gradient
className = "bg-gradient-luxury"; // Full page gradient

// Text
className = "text-royal-900"; // Headings
className = "text-royal-700"; // Body text
className = "text-gradient-royal"; // Gradient text

// Borders
className = "border-royal-200"; // Subtle borders
```

## 🎯 Typography

### Font Families

- **Serif**: Playfair Display (headings, logo)
- **Sans**: Inter (body text, UI elements)

### Usage

```tsx
className = "font-serif font-bold text-5xl"; // Large headings
className = "font-sans text-base"; // Body text
```

## 🎭 Components

### Buttons

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Default</Button>
<Button variant="luxury">Luxury Gradient</Button>
<Button variant="outline">Outlined</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card className="card-luxury">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>;
```

### Badges

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="luxury">Luxury</Badge>
<Badge variant="outline">Outlined</Badge>
```

## ✨ Shadows

Custom royal-themed shadows for depth:

```tsx
className = "shadow-royal"; // Standard elevation
className = "shadow-royal-lg"; // Medium elevation
className = "shadow-royal-xl"; // High elevation
className = "shadow-royal-2xl"; // Maximum elevation
```

## 🎬 Animations

Built-in animations for smooth transitions:

```tsx
className = "animate-fade-in"; // Fade in effect
className = "animate-slide-up"; // Slide up from bottom
className = "animate-slide-down"; // Slide down from top
```

## 🌊 Smooth Scroll

Lenis smooth scroll is integrated throughout the entire application:

- Automatic smooth scrolling on all pages
- Configurable duration and easing
- Optimized for performance

## 🎨 Custom CSS Classes

### Utility Classes

```css
.card-royal       /* Standard card styling */
/* Standard card styling */
.card-luxury      /* Premium card with gradient */
.btn-royal        /* Primary button style */
.btn-royal-outline /* Outlined button style */
.input-royal      /* Form input styling */
.badge-royal; /* Badge styling */
```

## 📐 Layout Patterns

### Hero Section

```tsx
<section className="relative overflow-hidden">
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-royal-200/30 rounded-full blur-3xl" />
  </div>
  <div className="relative max-w-7xl mx-auto px-4 py-24">{/* Content */}</div>
</section>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

## 🎯 Best Practices

1. **Consistency**: Use the defined color palette throughout
2. **Hierarchy**: Use serif fonts for headings, sans for body
3. **Spacing**: Follow the spacing scale (4, 8, 12, 16, 24, 32px)
4. **Shadows**: Apply royal shadows for elevation
5. **Animations**: Use sparingly for meaningful interactions
6. **Accessibility**: Maintain sufficient color contrast

## 🔧 Customization

To customize the design system, edit:

- `tailwind.config.js` - Colors, shadows, animations
- `src/app/globals.css` - Global styles and utilities
- `src/components/ui/*` - Individual components

## 📱 Responsive Design

All components are mobile-first and responsive:

- Mobile: Base styles
- Tablet: `md:` breakpoint (768px)
- Desktop: `lg:` breakpoint (1024px)
- Large Desktop: `xl:` breakpoint (1280px)

## 🎨 Design Principles

1. **Luxury**: Premium feel through colors, typography, and spacing
2. **Warmth**: Brown tones create inviting atmosphere
3. **Elegance**: Clean layouts with generous whitespace
4. **Professionalism**: Sophisticated color palette and typography
5. **Smoothness**: Lenis scroll for buttery smooth experience
