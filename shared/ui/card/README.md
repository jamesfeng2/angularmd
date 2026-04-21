Primary（默认）
html
<app-button>Save</app-button>
Secondary
html
<app-button variant="secondary">Cancel</app-button>
Danger
html
<app-button variant="danger">Delete</app-button>
Text Button
html
<app-button variant="text">Learn more</app-button>
Outline Button
html
<app-button variant="outline">More</app-button>
Small / Medium / Large
html
<app-button size="sm">Small</app-button>
<app-button size="md">Medium</app-button>
<app-button size="lg">Large</app-button>
Disabled
html
<app-button disabled="true">Disabled</app-button>
Loading
html
<app-button loading="true">Loading…</app-button>
Full Width
html
<app-button fullWidth="true">Submit</app-button>
With Icon
html
<app-button>
  <span icon>🔍</span>
  Search
</app-button>
Icon + Loading + Disabled + Variant + Size（组合场景）
html
<app-button
  variant="danger"
  size="lg"
  loading="true"
  fullWidth="true"
>
  <span icon>🗑️</span>
  Deleting…
</app-button>