# Modal Component Usage

A high-end, animated modal dialog.

## Basic Usage

```jsx
import Modal from './components/common/Modal';

<Modal 
  isOpen={true} 
  onClose={closeAction} 
  title="System Settings"
  footer={<Button onClick={closeAction}>Close</Button>}
>
  <p>Modal content goes here...</p>
</Modal>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | `false` | Controls visibility |
| `onClose` | `function` | - | Close callback |
| `title` | `string` | - | Header text |
| `size` | `string` | `'md'` | `sm`, `md`, `lg`, `xl`, `full` |
| `footer` | `node` | - | Footer components |
