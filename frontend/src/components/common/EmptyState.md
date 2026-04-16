# Empty State

A beautiful placeholder for scenarios where no data is available to display.

## Usage

```jsx
import EmptyState from './components/common/EmptyState';
import { Database } from 'lucide-react';

<EmptyState 
  icon={Database}
  title="No entries found"
  description="Try adding a new entry or clearing your filters."
  action={<Button variant="primary">Add Item</Button>}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `component` | `Database` | Lucide icon component. |
| `title` | `string` | `"No data found"` | Main headline. |
| `description` | `string` | `string` | Explanatory subtext. |
| `action` | `node` | `undefined` | Optional CTA button/link. |
| `className` | `string` | `''` | Extra CSS classes. |

## Features
- **Visual Appeal**: Includes a subtle bounce animation for the icon.
- **Flexible Action**: Pass any CTA component via the `action` prop.
- **Centered Layout**: Perfectly balanced for empty dashboard widgets or tables.
