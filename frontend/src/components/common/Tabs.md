# Tabs Component

A clean, animated tab system for switching between different views.

## Usage
```jsx
import Tabs from './components/common/Tabs';
import { User, Settings } from 'lucide-react';

const tabs = [
  { id: '1', label: 'Profile', icon: User, content: <ProfileView /> },
  { id: '2', label: 'Settings', icon: Settings, content: <SettingsView /> }
];

<Tabs tabs={tabs} defaultTab="1" />
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tabs | Array | [] | Array of { id, label, icon, content } objects |
| defaultTab | String | - | ID of the initially active tab |
| onChange | Function | - | Callback when tab changes |
| className | String | "" | Extra CSS classes |
