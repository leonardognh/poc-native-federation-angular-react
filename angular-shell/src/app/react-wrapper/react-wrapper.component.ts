// src/app/components/react-mfe-wrapper/react-mfe-wrapper.component.ts
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
    mfeReact?: any;
  }
}

@Component({
  selector: 'app-react-mfe-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #reactContainer class="react-mfe-container">
      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Carregando React MFE...</p>
        <small>Método: {{ loadMethod }}</small>
      </div>
      <div class="error" *ngIf="error">
        <h4>❌ Erro ao carregar MFE</h4>
        <p>{{ error }}</p>
        <div class="debug-info">
          <p><strong>Método tentado:</strong> {{ loadMethod }}</p>
          <p><strong>Global disponível:</strong> {{ globalAvailable }}</p>
        </div>
        <button (click)="retryLoad()" class="retry-btn">
          🔄 Tentar Novamente
        </button>
      </div>
      <div class="success" *ngIf="!isLoading && !error">
        ✅ React MFE carregado com sucesso!
      </div>
    </div>
  `,
  styles: [
    `
      .react-mfe-container {
        width: 100%;
        min-height: 400px;
        position: relative;
        border: 2px dashed #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
      }
      .loading,
      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        text-align: center;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .error {
        color: #e74c3c;
      }
      .debug-info {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
        border-left: 4px solid #dc3545;
      }
      .debug-info p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
      }
      .retry-btn {
        background: #3498db;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
        font-size: 0.9rem;
      }
      .retry-btn:hover {
        background: #2980b9;
      }
      .retry-btn.secondary {
        background: #95a5a6;
      }
      .retry-btn.secondary:hover {
        background: #7f8c8d;
      }
      .success {
        text-align: center;
        color: #27ae60;
        font-weight: bold;
        padding: 1rem;
      }
    `,
  ],
})
export class ReactMfeWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('reactContainer', { static: true })
  reactContainer!: ElementRef<HTMLDivElement>;

  private unmountReact?: () => void;
  isLoading = true;
  error: string | null = null;
  loadMethod = '';
  globalAvailable = 'Verificando...';

  ngOnInit(): void {
    this.loadReactMfe();
  }

  ngOnDestroy(): void {
    if (this.unmountReact) {
      this.unmountReact();
    }
  }

  private async loadReactMfe(): Promise<void> {
    this.loadMethod = 'Script dinâmico';

    try {
      this.isLoading = true;
      this.error = null;

      console.log('🔍 Carregando React MFE com script dinâmico...');

      // Carrega o remoteEntry.js dinamicamente
      await this.loadScript('http://localhost:3000/remoteEntry.js');

      // Aguarda o Module Federation estar disponível
      await this.waitForGlobal('mfeReact', 5000);
      this.globalAvailable = 'Sim';

      // Acessa o container do Module Federation
      const container = window.mfeReact;
      if (!container) {
        throw new Error('Container mfeReact não encontrado no window');
      }

      console.log('📦 Container encontrado:', container);

      // Tenta inicializar o container (pode não ser necessário)
      if (container.init && typeof container.init === 'function') {
        try {
          await container.init({});
          console.log('🔧 Container inicializado');
        } catch (initError) {
          console.log('⚠️ Erro na inicialização (continuando):', initError);
        }
      }

      // Obtém o módulo exposto
      if (!container.get || typeof container.get !== 'function') {
        throw new Error('Método container.get não encontrado');
      }

      const factory = await container.get('./Component');
      const reactModule = factory();

      console.log('📦 Módulo carregado:', reactModule);

      if (reactModule?.mount && this.reactContainer) {
        console.log('🚀 Montando React MFE...');
        this.unmountReact = reactModule.mount(
          this.reactContainer.nativeElement
        );
        console.log('✅ React MFE montado com sucesso!');
      } else if (reactModule?.default?.mount) {
        console.log('🚀 Montando React MFE (via default)...');
        this.unmountReact = reactModule.default.mount(
          this.reactContainer.nativeElement
        );
        console.log('✅ React MFE montado com sucesso!');
      } else if (reactModule?.default) {
        // Tenta montar diretamente o default
        console.log('🚀 Tentando montar default diretamente...');
        this.unmountReact = reactModule.default(
          this.reactContainer.nativeElement
        );
        console.log('✅ React MFE montado (default direto)!');
      } else {
        console.error(
          '❌ Estrutura do módulo:',
          Object.keys(reactModule || {})
        );
        throw new Error('Função mount não encontrada no módulo React');
      }

      this.isLoading = false;
    } catch (err) {
      console.error('❌ Erro detalhado:', err);
      this.error = err instanceof Error ? err.message : 'Erro desconhecido';
      this.globalAvailable = window.mfeReact ? 'Sim' : 'Não';
      this.isLoading = false;
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Remove script anterior se existir
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        console.log('✅ Script carregado:', src);
        resolve();
      };

      script.onerror = () => {
        console.error('❌ Erro ao carregar script:', src);
        reject(new Error(`Falha ao carregar script: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  private waitForGlobal(globalName: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
        if (window[globalName as keyof Window]) {
          console.log(`✅ Global ${globalName} encontrado`);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          console.error(`❌ Timeout aguardando ${globalName}`);
          reject(new Error(`Timeout aguardando ${globalName} (${timeout}ms)`));
        } else {
          setTimeout(check, 100);
        }
      };

      check();
    });
  }

  retryLoad(): void {
    // Limpa container antes de tentar novamente
    if (this.reactContainer) {
      this.reactContainer.nativeElement.innerHTML = '';
    }
    this.loadReactMfe();
  }
}
