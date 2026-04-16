# Drawer (Sheet)

A side-sliding panel for viewing extra information without leaving the current context.

## Usage

```jsx
import Drawer from './components/common/Drawer';

const [isOpen, setIsOpen] = useState(false);

<Drawer 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  position="right"
>
  <p>Your drawer content here...</p>
</Drawer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls visibility. |
| `onClose` | `function` | `required` | Triggered on overlay click or close button. |
| `title` | `string` | `undefined` | Header title. |
| `position` | `string` | `'right'` | `right`, `left`, `top`, `bottom`. |
| `size` | `string` | `'md'` | `sm`, `md`, `lg`. |

## Features
- **Multi-Position**: Slide from any edge of the screen.
- **Backdrop Blur**: Premium frosted glass effect on the overlay.
- **Scroll Lock**: Automatically disables page scrolling when open.
- **Transitions**: Smooth slide-in/out animations via Tailwind v4.
