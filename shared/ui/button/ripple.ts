onClick(event: MouseEvent) {
  if (this.disabled || this.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  this.createRipple(event);
  this.clicked.emit(event);
}

private createRipple(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement;
  const rippleContainer = button.querySelector('.ripple-container')!;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;

  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  rippleContainer.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}
