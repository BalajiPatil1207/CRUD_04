# Alert Component Usage

Premium, semantic alert messages for feedback.

## Basic Usage

```jsx
import Alert from './components/common/Alert';

<Alert variant="success" title="Payment Received">
  Your subscription has been renewed successfully.
</Alert>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `string` | `'info'` | `info`, `success`, `warning`, `danger` |
| `title` | `string` | - | Bold heading text |
| `onClose` | `function` | - | Shows a close button if provided |
| `className` | `string` | `''` | Extra styles |
