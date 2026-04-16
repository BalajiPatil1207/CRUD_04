# Pagination

A premium, interactive pagination component for navigating large datasets.

## Usage

```jsx
import Pagination from './components/common/Pagination';

const [currentPage, setCurrentPage] = useState(1);

<Pagination 
  currentPage={currentPage}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | `required` | The currently active page. |
| `totalPages` | `number` | `required` | Total number of pages available. |
| `onPageChange` | `function` | `required` | Callback triggered when a page is clicked. |
| `className` | `string` | `''` | Extra CSS classes for styling. |

## Features
- **Smart Slicing**: Automatically shows an ellipsis (...) for large page ranges.
- **Active State**: Clear visual feedback for the selected page.
- **Responsive Controls**: Optimized previous/next buttons.
- **Dark Mode**: Fully supports the laboratory's dark aesthetic.
