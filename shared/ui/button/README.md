Primary（默认）
 
`<app-button>Save</app-button>`
Secondary
 
`<app-button variant="secondary">Cancel</app-button>`
Danger
 
`<app-button variant="danger">Delete</app-button>`
Text Button
 
`<app-button variant="text">Learn more</app-button>`
Outline Button
  
`<app-button variant="outline">More</app-button>`
Small / Medium / Large
  
`<app-button size="sm">Small</app-button>
<app-button size="md">Medium</app-button>
<app-button size="lg">Large</app-button>`
Disabled
  
`<app-button disabled="true">Disabled</app-button>`
Loading
  
`<app-button loading="true">Loading…</app-button>`
Full Width
  
`<app-button fullWidth="true">Submit</app-button>`
With Icon
  
`<app-button>
  <span icon>🔍</span>
  Search
</app-button>`
Icon + Loading + Disabled + Variant + Size（组合场景）

  ```
<app-button
  variant="danger"
  size="lg"
  loading="true"
  fullWidth="true"
>
  <span icon>🗑️</span>
  Deleting…
</app-button>
```