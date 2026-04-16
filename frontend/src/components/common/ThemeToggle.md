# Theme Toggle Component Usage

The `ThemeToggle` component provides a global way for users to switch between Light and Dark modes.

## Basic Usage

```jsx
import ThemeToggle from './components/common/ThemeToggle';

// Place it anywhere in your app (usually header or navigation)
<ThemeToggle />
```

## How it Works
1.  **Global Apply**: It toggles the `dark` class on the `document.documentElement` (the `<html>` tag).
2.  **Persistence**: Automatically saves the user's preference in `localStorage` under the key `theme`.
3.  **System Preference**: If no preference is saved, it automatically respects the user's operating system dark mode setting.
4.  **Animations**: Uses smooth internal animations for the Sun/Moon icon transitions.

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `''` | Additional CSS classes for the button container |

## Styling Requirements
This component relies on the `.dark` class being handled in your CSS. Since you are using our `index.css` setup, it works perfectly out of the box.
```css
/* Example of how classes respond in index.css */
.bg-white dark:bg-gray-900 { 
  /* Changes from white to gray-900 when theme is toggled */
}
```
