# Input Component Usage

The `Input` component is a reusable, premium-styled input field built with Tailwind CSS v4 and Lucide React icons.

## Basic Usage

```jsx
import Input from './components/common/Input';

<Input 
  label="Username" 
  placeholder="Enter your username" 
  onChange={(e) => console.log(e.target.value)} 
/>
```

## Advanced Features

### With Icons
You can add icons to either the left or right side of the input.

```jsx
import { Mail, lock } from 'lucide-react';

// Left Icon (Default position)
<Input 
  label="Email" 
  icon={Mail} 
  placeholder="email@example.com" 
/>

// Right Icon
<Input 
  label="Password" 
  icon={Lock} 
  iconPosition="right" 
  type="password" 
/>
```

### Validation Errors
To show a validation error, simply pass a string to the `error` prop.

```jsx
<Input 
  label="Password" 
  error="Password is too short" 
  value="123" 
/>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | - | Text displayed above the input field |
| `icon` | `LucideIcon` | - | An icon component from `lucide-react` |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Where to place the icon |
| `error` | `string` | - | Error message to display (triggers red styling) |
| `className` | `string` | `''` | Additional CSS classes for the container |
| `...props` | `any` | - | All other standard HTML input props (type, value, placeholder, etc.) |

## Design Features
- **Tailwind CSS v4**: Uses modern utility classes.
- **Dark Mode**: Fully supports dark mode automatically.
- **Premium Look**: Smooth focus rings, subtle borders, and elegant spacing.
- **Interactive**: The icon color changes when the input is focused using the CSS `group` utility.
