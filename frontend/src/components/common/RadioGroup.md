# RadioGroup Component Usage

A premium selection group for mutually exclusive options.

## Basic Usage

```jsx
import RadioGroup from './components/common/RadioGroup';

<RadioGroup 
  label="Choose your plan"
  name="plans"
  value={selectedPlan}
  onChange={(e) => setSelectedPlan(e.target.value)}
  options={[
    { label: 'Basic', value: 'basic' },
    { label: 'Pro', value: 'pro' },
    { label: 'Ultimate', value: 'ultimate' }
  ]}
/>
```

## Layouts
Use `orientation="horizontal"` for a row-based layout.
