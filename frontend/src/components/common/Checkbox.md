# Checkbox Component Usage

A modern, animated Checkbox component built with Tailwind CSS v4.

## Basic Usage

```jsx
import Checkbox from './components/common/Checkbox';

<Checkbox 
  label="I agree to the terms" 
  checked={isChecked} 
  onChange={(e) => setIsChecked(e.target.checked)} 
/>
```

## States

```jsx
<Checkbox label="Disabled Item" disabled />
<Checkbox label="Error State" error="Required field" />
```
