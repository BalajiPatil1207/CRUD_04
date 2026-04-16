# Skeleton Component Usage

Loading placeholders to improve perceived performance.

## Basic Usage

```jsx
import Skeleton from './components/common/Skeleton';

// Text lines
<Skeleton variant="text" width="100%" />

// Circular avatar
<Skeleton variant="circular" width={40} height={40} />

// Large content area
<Skeleton variant="rectangular" height={200} />
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `string` | `'text'` | Type: `text`, `circular`, `rectangular` |
| `width` | `string|number` | - | Width of the placeholder |
| `height` | `string|number` | - | Height of the placeholder |
| `className` | `string` | `''` | Custom styles |
