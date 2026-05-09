

// Use Attribute Directives to Enforce UX Rules

// usage <input type="text" autoFocus />

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective {
  constructor(private el: ElementRef) {
    setTimeout(() => this.el.nativeElement.focus());
  }
}