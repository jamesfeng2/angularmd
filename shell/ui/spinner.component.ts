// src/app/shell/ui/spinner.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="overlay">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})

// 负责：

// 全局 Loading 遮罩

// ShellService.loading 控制显示

export class SpinnerComponent {}
