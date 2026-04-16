# Table Component Usage

A premium, responsive data table with hover and striped row support.

## Basic Usage

```jsx
import Table from './components/common/Table';

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Status', accessor: 'status', render: (val) => <Badge>{val}</Badge> }
];

const data = [
  { id: 1, status: 'Active' },
  { id: 2, status: 'Inactive' }
];

<Table columns={columns} data={data} hoverable />
```

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `Array` | `[]` | List of `{ header, accessor, render }` |
| `data` | `Array` | `[]` | List of data objects |
| `hoverable` | `boolean`| `true` | Highlights row on hover |
| `striped` | `boolean`| `false` | Adds zebra striping to rows |
| `className` | `string` | `''` | Container styling |
