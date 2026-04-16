# Batch 4: Advanced Components

## Avatar
Premium user avatars with status indicators.
```jsx
<Avatar src="/path.jpg" size="lg" status="online" />
```

## Tabs
Switch between different views with smooth animations.
```jsx
<Tabs 
  tabs={[
    { id: '1', label: 'Overview', content: <Overview /> },
    { id: '2', label: 'Settings', content: <Settings /> }
  ]} 
/>
```

## Accordion
Collapsible content sections for FAQs or structured data.
```jsx
<Accordion 
  items={[
    { title: 'Section 1', content: 'Details here...' },
    { title: 'Section 2', content: 'More details...' }
  ]} 
/>
```
