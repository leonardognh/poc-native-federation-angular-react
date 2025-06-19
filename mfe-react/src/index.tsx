import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Função de montagem que será exportada para o Module Federation
const mount = (el: HTMLElement) => {
  console.log("🚀 React MFE: Iniciando montagem...");

  if (!el) {
    console.error("❌ React MFE: Elemento container não fornecido");
    return () => {};
  }

  try {
    const root = createRoot(el);
    root.render(<App />);
    console.log("✅ React MFE: Montado com sucesso!");

    // Retorna função de cleanup
    return () => {
      console.log("🧹 React MFE: Desmontando...");
      root.unmount();
    };
  } catch (error) {
    console.error("❌ React MFE: Erro na montagem:", error);
    return () => {};
  }
};

// Modo standalone para desenvolvimento
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("root");
  if (devRoot) {
    console.log("🔧 React MFE: Modo standalone detectado");
    mount(devRoot);
  }
}

// Exportações para Module Federation
export { mount };
export default mount;

// Log para debugging
console.log(
  "📦 React MFE Bootstrap carregado. Mount function disponível:",
  typeof mount
);
