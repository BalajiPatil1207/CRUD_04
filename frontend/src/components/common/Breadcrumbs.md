# Breadcrumbs

A hierarchical navigation indicator for tracking user location within the app.

## Usage

```jsx
import Breadcrumbs from './components/common/Breadcrumbs';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Details' } // Last item doesn't need href
];

<Breadcrumbs items={items} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `array` | `required` | List of items `{ label, href }`. |
| `className` | `string` | `''` | Extra CSS classes. |

## Features
- **Dynamic Hierarchy**: Automatically renders separators.
- **Active State**: The current (last) item is highlighted and non-clickable.
- **Modern Look**: Uses Lucide icons and premium spacing.
