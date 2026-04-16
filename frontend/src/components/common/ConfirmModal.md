# ConfirmModal Component Usage

A specialized modal for critical user confirmations (e.g., delete actions).

## Basic Usage

```jsx
import ConfirmModal from './components/common/ConfirmModal';

const [isOpen, setIsOpen] = useState(false);

<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  variant="danger"
  title="Delete Project?"
  message="This action cannot be undone. All data will be permanently removed."
  confirmText="Yes, Delete"
/>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | `false` | Controls visibility |
| `onClose` | `function` | - | Callback when cancelled/closed |
| `onConfirm` | `function` | - | Callback when confirmed |
| `title` | `string` | `'Are you sure?'` | Modal heading |
| `message` | `string` | - | Body text explanation |
| `variant` | `string` | `'danger'` | `danger`, `warning`, `info`, `success` |
| `confirmText` | `string` | `'Confirm'` | Text for the primary action button |
| `cancelText` | `string` | `'Cancel'` | Text for the secondary action button |
| `isLoading` | `boolean` | `false` | Shows loading state on confirm button |
