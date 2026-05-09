import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';


/**
 * 
 * <button *hasPermission="'user.write'">Edit</button>

 * <button *hasPermission="['user.write', 'user.manage']">Manage</button>

 * <li *hasPermission="'dashboard.access'">Dashboard</li>

 * <div *hasPermission="'admin.panel'">
    <admin-panel></admin-panel>
   </div>

 */


 
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private tpl = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);
  private store = inject(AuthStore);

  private required: string[] = [];

  @Input()
  set hasPermission(permissions: string | string[]) {
    this.required = Array.isArray(permissions) ? permissions : [permissions];
    this.updateView();
  }

  private updateView() {
    const userPermissions = this.store.permissions();

    const has = this.required.some(p => userPermissions.includes(p));

    this.vcr.clear();
    if (has) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
