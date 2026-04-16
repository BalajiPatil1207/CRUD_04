# Button Component Usage

A high-end Button component with various styles and loading states.

## Basic Usage

```jsx
import Button from './components/common/Button';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

## Features
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`.
- **Sizes**: `sm`, `md`, `lg`, `xl`.
- **Icons**: Supports Lucide icons with `icon` and `iconPosition` props.
- **Loading**: Use `loading` prop to show a spinner.

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `string` | `'primary'` | Button style |
| `size` | `string` | `'md'` | Button size |
| `icon` | `element` | - | Lucide icon component |
| `iconPosition`| `string` | `'left'` | Position of the icon |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `fullWidth` | `boolean` | `false` | Button takes 100% width |
