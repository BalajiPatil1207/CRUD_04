# TextArea Component Usage

The `TextArea` component is a premium, multi-line text input with support for labels, error messages, and auto-resizing.

## Basic Usage

```jsx
import TextArea from './components/common/TextArea';

<TextArea 
  label="Feedback" 
  placeholder="Tell us what you think..." 
  rows={4}
/>
```

## Auto-Height Feature
Set `autoHeight={true}` to make the textarea grow as the user types.

```jsx
<TextArea 
  label="Bio" 
  autoHeight 
  placeholder="Start typing your story..."
/>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | - | Label text displayed above the input |
| `placeholder` | `string` | - | Placeholder text inside the input |
| `value` | `string` | - | Controlled component value |
| `onChange` | `function` | - | Callback when value changes |
| `name` | `string` | - | Input name attribute |
| `error` | `string` | - | Error message to display (red border) |
| `autoHeight` | `boolean` | `false` | If true, Grows based on content |
| `rows` | `number` | `4` | Initial rows height |
| `className` | `string` | `''` | Additional CSS classes |
