# Avatar Component

Premium user avatars with support for images, initials, and status indicators.

## Usage
```jsx
import Avatar from './components/common/Avatar';

// With image and status
<Avatar 
  src="https://example.com/photo.jpg" 
  size="lg" 
  status="online" 
/>

// With initials
<Avatar 
  initials="JD" 
  size="md" 
  status="busy" 
/>
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | String | - | Image URL |
| alt | String | "User" | Alternative text |
| initials | String | - | Initials to display if no image |
| size | String | "md" | sm, md, lg, xl |
| status | String | - | online, offline, busy, away |
| className | String | "" | Extra CSS classes |
