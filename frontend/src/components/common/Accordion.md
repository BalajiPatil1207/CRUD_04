# Accordion Component

A smooth, animated accordion system for collapsible content sections.

## Usage
```jsx
import Accordion from './components/common/Accordion';

const items = [
  { title: "Question 1", content: "Answer to question 1" },
  { title: "Question 2", content: "Answer to question 2" }
];

<Accordion items={items} allowMultiple={false} />
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | Array | [] | Array of { title, content } objects |
| allowMultiple | Boolean | false | Whether multiple items can be open at once |
