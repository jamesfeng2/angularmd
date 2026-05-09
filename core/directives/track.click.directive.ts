
// <button trackClick>Buy</button>
// 这段代码的功能是当用户点击这个按钮时，会触发一个名为 'clicked' 的事件，并将其发送到分析工具（analytics）进行跟踪和记录。
@Directive({
  selector: '[trackClick]'
})
export class TrackClickDirective {
  @HostListener('click')
  onClick() {
    analytics.track('clicked');
  }
}