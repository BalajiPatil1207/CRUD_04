# Tooltip Component Usage

A small popover to provide additional context on hover.

## Basic Usage

```jsx
import Tooltip from './components/common/Tooltip';

<Tooltip content="Helper information" position="top">
  <button>Hover Me</button>
</Tooltip>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `node` | - | Text or component to show in tooltip |
| `position` | `string` | `'top'` | `top`, `bottom`, `left`, `right` |
| `children` | `node` | - | The trigger element |
