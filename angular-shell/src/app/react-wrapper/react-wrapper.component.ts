import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    System: any;
  }
}

@Component({
  selector: 'app-react-mfe-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: ` <div #reactContainer id="root"></div> `,
  styles: [],
})
export class ReactMfeWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactContainer', { static: true })
  reactContainer!: ElementRef<HTMLDivElement>;

  private systemScriptEl?: HTMLScriptElement;
  private mfeScriptEl?: HTMLScriptElement;

  ngOnInit(): void {
    this.loadReactMfe();
  }

  ngOnDestroy(): void {
    this.systemScriptEl?.remove();
    this.mfeScriptEl?.remove();
  }

  private async loadReactMfe(): Promise<void> {
    try {
      if (!window.System) {
        this.systemScriptEl = await this.loadScript(
          'https://cdn.jsdelivr.net/npm/systemjs/dist/system.min.js'
        );
      }

      this.mfeScriptEl = await this.loadScript(
        'http://localhost:3000/remoteEntry.js'
      );

      await window.System.delete('http://localhost:3000/remoteEntry.js');

      await window.System.import('http://localhost:3000/remoteEntry.js');
    } catch (err: any) {
      console.error('❌ Erro ao carregar MFE:', err);
    }
  }

  private loadScript(src: string): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve(existingScript as HTMLScriptElement);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(script);
      script.onerror = () =>
        reject(new Error(`Falha ao carregar script: ${src}`));
      document.head.appendChild(script);
    });
  }
}
