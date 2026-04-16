# Select Component Usage

A premium styled dropdown for single selections.

## Basic Usage

```jsx
import Select from './components/common/Select';

<Select 
  label="Choose a Category"
  options={[
    { label: 'Technology', value: 'tech' },
    { label: 'Science', value: 'science' },
    { label: 'Arts', value: 'arts' }
  ]}
  placeholder="Please select..."
/>
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | - | Label text |
| `options` | `Array` | `[]` | List of `{ label, value }` objects |
| `placeholder` | `string` | `"Select an option"`| Default placeholder option |
| `error` | `string` | - | Error message |
| `className` | `string` | `''` | Container styling |
