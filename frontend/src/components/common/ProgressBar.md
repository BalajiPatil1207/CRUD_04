# ProgressBar

A visual indicator of progress or completion percentage.

## Usage

```jsx
import ProgressBar from './components/common/ProgressBar';

<ProgressBar 
  value={65} 
  max={100} 
  label="Upload Progress" 
  showPercentage 
  variant="success" 
  size="md"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current progress value. |
| `max` | `number` | `100` | Maximum possible value. |
| `label` | `string` | `undefined` | Optional top-left label. |
| `showPercentage` | `boolean` | `false` | Show % number on the right. |
| `variant` | `string` | `'primary'` | `primary`, `success`, `warning`, `danger`, `info`. |
| `size` | `string` | `'md'` | `sm`, `md`, `lg`. |

## Features
- **Smooth Animations**: Uses CSS transitions for value changes.
- **Variant Support**: Different colors for semantic feedback.
- **Flexible Sizing**: Choose from three thickness levels.
