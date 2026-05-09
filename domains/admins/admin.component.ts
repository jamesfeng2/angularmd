

<!-- admin-dashboard.component.html -->
<div *feature="['adminPanel']; featureMode: 'all'">
  <h1>Admin Dashboard</h1>

  <button *feature="'debug-tools'">Debug Tools</button>

  <div *feature="'ai-tools'">
    <ai-analytics></ai-analytics>
  </div>
</div>
