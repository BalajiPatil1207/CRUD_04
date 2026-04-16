# Card Component Usage

A premium container for grouping content with optional headers, footers, and hover effects.

## Basic Usage

```jsx
import Card from './components/common/Card';

<Card title="Analytics Overview" subtitle="Last 30 days performance">
  <p>Your content goes here...</p>
</Card>
```

## Hover Effect
Add `hoverable` prop to enable a premium shadow and lift effect on hover.

```jsx
<Card title="Interactive Card" hoverable>
  <p>Hover over me!</p>
</Card>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | - | Primary heading |
| `subtitle` | `string` | - | Smaller text below title |
| `footer` | `node` | - | Content for the bottom section |
| `headerAction`| `node` | - | Component/Icon to show in header right (e.g., a Button) |
| `hoverable` | `boolean`| `false` | Enable shadow/lift hover animation |
| `noPadding` | `boolean`| `false` | Remove padding from content area |
| `bordered` | `boolean`| `true` | Show/hide card border |
