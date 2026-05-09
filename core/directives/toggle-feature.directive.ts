

// <div *feature="'new-dashboard'"></div>

@Directive({
  selector: '[feature]'
})
export class FeatureDirective {
  @Input() set feature(key: string) {
    this.flags.enabled(key)
      ? this.vcr.createEmbeddedView(this.tpl)
      : this.vcr.clear();
  }
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private flags: FeatureService
  ) {}
}