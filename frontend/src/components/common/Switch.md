# Switch Component Usage

A high-end toggle switch for binary settings.

## Basic Usage

```jsx
import Switch from './components/common/Switch';

<Switch 
  label="Dark Mode" 
  checked={isDark} 
  onChange={(e) => setIsDark(e.target.checked)} 
/>
```
