# Framer Motion Animations in GovAid AI

This document outlines all the Framer Motion animations implemented in the GovAid AI application to enhance user experience and provide smooth, engaging interactions.

## 🎯 Overview

The application now includes comprehensive animations using Framer Motion (v12.23.0) that provide:
- Smooth page transitions
- Staggered element animations
- Interactive hover effects
- Loading states
- Scroll-triggered animations
- Background floating elements

## 📁 Animation Components

### 1. Page Transition Components
**Location**: `src/components/ui/page-transition.tsx`

- **`PageTransition`**: Wraps pages with fade-in/fade-out animations
- **`StaggerContainer`**: Container for staggered child animations
- **`StaggerItem`**: Individual items with staggered timing

### 2. Animated Button Components
**Location**: `src/components/ui/animated-button.tsx`

- **`AnimatedButton`**: Enhanced button with hover and tap animations
- **`AnimatedIconButton`**: Icon buttons with rotation effects
- **`AnimatedCard`**: Cards with lift and shadow effects on hover

### 3. Loading Animation Components
**Location**: `src/components/ui/loading-animation.tsx`

- **`LoadingAnimation`**: Spinning loader with text
- **`PulseAnimation`**: Pulsing dot animation
- **`DotsAnimation`**: Bouncing dots animation
- **`SkeletonAnimation`**: Skeleton loading effect

## 🎨 Animation Utilities

### 1. Animation Variants
**Location**: `src/lib/animation-utils.ts`

Pre-defined animation variants for consistent animations:

```typescript
// Fade animations
fadeInUp, fadeInDown, fadeInLeft, fadeInRight

// Scale animations
scaleIn

// Stagger animations
staggerContainer(delay), staggerItem

// Hover effects
hoverScale, hoverLift, hoverRotate

// Page transitions
pageTransition

// Loading animations
spinAnimation, pulseAnimation, bounceAnimation
```

### 2. Custom Hooks
**Location**: `src/hooks/use-scroll-animation.tsx`

Reusable hooks for scroll-triggered animations:

- **`useScrollAnimation`**: Basic scroll detection
- **`useStaggerAnimation`**: Staggered animations
- **`useParallaxAnimation`**: Parallax effects
- **`useFadeInAnimation`**: Fade-in with delay
- **`useSlideInAnimation`**: Slide-in from different directions

## 🚀 Enhanced Components

### 1. Hero Section (`src/components/hero-section.tsx`)
- Floating background elements
- Staggered text animations
- Interactive button hover effects
- Smooth entrance animations

### 2. Feature Cards (`src/components/ui/feature.tsx`)
- Card lift on hover
- Staggered feature list animations
- Check icon spring animations
- Smooth entrance with viewport detection

### 3. Logo Carousel (`src/components/logos3.tsx`)
- Staggered logo appearances
- Hover scale effects
- Smooth fade-in animations

### 4. Navigation (`src/components/ui/navbar-1.tsx`)
- Logo rotation on hover
- Staggered menu item animations
- Mobile menu slide animations
- Button hover effects

### 5. Upload Page (`src/pages/Upload.tsx`)
- Page transition wrapper
- Staggered form elements
- Interactive upload area
- File selection feedback
- Button animations

### 6. Home Page (`src/pages/Home.tsx`)
- Page transition wrapper
- Section fade-in animations
- Staggered feature grid
- Interactive benefit cards
- CTA button animations

### 7. Footer (`src/components/ui-custom/footer.tsx`)
- Logo hover effects
- Smooth fade-in animation

## 🎭 Animation Types

### 1. Entrance Animations
- **Fade In**: Elements fade in with optional upward movement
- **Slide In**: Elements slide in from different directions
- **Scale In**: Elements scale up from smaller size
- **Stagger**: Multiple elements animate in sequence

### 2. Interactive Animations
- **Hover Effects**: Scale, lift, and color changes on hover
- **Tap Effects**: Scale down on button press
- **Focus Effects**: Subtle scaling on input focus

### 3. Background Animations
- **Floating Elements**: Subtle floating dots in hero section
- **Parallax**: Elements move at different speeds on scroll

### 4. Loading States
- **Spinner**: Rotating loader icon
- **Pulse**: Pulsing dot animation
- **Bounce**: Bouncing dots sequence
- **Skeleton**: Pulsing placeholder content

## 🛠 Usage Examples

### Basic Page Transition
```tsx
import { PageTransition } from "@/components/ui/page-transition";

const MyPage = () => (
  <PageTransition>
    <div>Page content</div>
  </PageTransition>
);
```

### Staggered List
```tsx
import { StaggerContainer, StaggerItem } from "@/components/ui/page-transition";

const MyList = () => (
  <StaggerContainer>
    {items.map(item => (
      <StaggerItem key={item.id}>
        <div>{item.content}</div>
      </StaggerItem>
    ))}
  </StaggerContainer>
);
```

### Animated Button
```tsx
import { AnimatedButton } from "@/components/ui/animated-button";

const MyButton = () => (
  <AnimatedButton variant="default" size="lg">
    Click me
  </AnimatedButton>
);
```

### Scroll-triggered Animation
```tsx
import { useFadeInAnimation } from "@/hooks/use-scroll-animation";
import { motion } from "motion/react";

const MyComponent = () => {
  const { ref, fadeInVariants, isInView } = useFadeInAnimation(0.2);
  
  return (
    <motion.div
      ref={ref}
      variants={fadeInVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      Content
    </motion.div>
  );
};
```

## 🎨 Animation Configuration

### Timing Functions
All animations use consistent easing curves:
- **Primary**: `[0.4, 0.0, 0.2, 1]` (smooth, natural feel)
- **Linear**: For continuous animations like spinners
- **EaseInOut**: For bouncing and floating effects

### Duration Standards
- **Quick**: 0.2s (hover effects, button taps)
- **Standard**: 0.6s (entrance animations)
- **Slow**: 0.8s (page transitions, complex animations)

### Stagger Delays
- **Tight**: 0.05s (closely related elements)
- **Standard**: 0.1s (general staggered lists)
- **Loose**: 0.2s (section transitions)

## 🔧 Performance Considerations

1. **Viewport Detection**: Animations only trigger when elements enter viewport
2. **Once Flag**: Most animations only play once to avoid repetition
3. **Hardware Acceleration**: Transform properties used for smooth performance
4. **Reduced Motion**: Respects user's motion preferences

## 🎯 Best Practices

1. **Consistency**: Use predefined variants for similar animations
2. **Subtlety**: Animations enhance UX without being distracting
3. **Accessibility**: Respect reduced motion preferences
4. **Performance**: Use transform and opacity for smooth animations
5. **Timing**: Stagger animations for natural flow

## 🚀 Future Enhancements

Potential additions for future versions:
- Gesture-based animations
- Advanced parallax effects
- Micro-interactions
- Animation presets for different content types
- Performance monitoring for animations

---

*This animation system provides a modern, engaging user experience while maintaining performance and accessibility standards.* 