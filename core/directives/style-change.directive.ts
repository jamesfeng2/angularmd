

// <div card>Content</div>

@Directive({
  selector: '[card]'
})
export class CardDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.padding = '16px';
    el.nativeElement.style.border = '1px solid #ddd';
  }
}