# Toast System

A premium notification system with multiple variants and hover-to-pause functionality.

## Setup
Wrap your app with `ToastProvider`:
```jsx
import { ToastProvider } from './components/common/Toast';

<ToastProvider>
  <App />
</ToastProvider>
```

## Usage
Use the `useToast` hook to trigger notifications:
```jsx
import { useToast } from './components/common/Toast';

const MyComponent = () => {
  const { addToast } = useToast();
  
  return (
    <button onClick={() => addToast('Saved successfully!', 'success')}>
      Show Toast
    </button>
  );
};
```

## Variants
- `success`
- `danger`
- `warning`
- `info` (default)

## Features
- **Hover to Pause**: Progress bar and dismissal timer pause on mouse hover.
- **Animated**: Responsive animations using Tailwind v4.
- **Stacked**: Multiple toasts stack neatly in the bottom-right corner.
