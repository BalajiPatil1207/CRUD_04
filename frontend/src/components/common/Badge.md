# Badge Component Usage

A small, versatile status indicator with multiple variants.

## Basic Usage

```jsx
import Badge from './components/common/Badge';

<Badge variant="primary">New</Badge>
<Badge variant="success" dot>Active</Badge>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `string` | `'primary'` | Color style: `primary`, `success`, `warning`, `danger`, `info`, `neutral`, `brand` |
| `size` | `string` | `'md'` | Size: `sm`, `md`, `lg` |
| `dot` | `boolean` | `false` | Shows a pulse dot before label |
| `pill` | `boolean` | `true` | Circular or rounded-lg shape |
| `className` | `string` | `''` | Custom styles |
