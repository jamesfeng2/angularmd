


// src/app/shell/ui/error-banner.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-error-banner',
    standalone: true,
    template: `
    <div class="error-banner">
    <span>{{ message }}</span>
    <button (click)="close.emit()">✕</button>
    </div>
    `,
    styles: [`
        .error-banner {
            background: #ffdddd;
            color: #900;
            padding: 12px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #cc0000;
            }
            `]
})

        export class ErrorBannerComponent {
            @Input() message = '';
            @Output() close = new EventEmitter<void>();
}

// 负责：
// 显示 ShellService.globalError
// 可关闭