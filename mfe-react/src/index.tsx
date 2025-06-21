import { createRoot } from "react-dom/client";
import App from "./App";

const mount = (el: HTMLElement) => {
  if (!el) {
    return () => {};
  }

  try {
    const root = createRoot(el);
    root.render(<App />);

    return () => root.unmount();
  } catch (error) {
    console.error("❌ React MFE: Erro na montagem:", error);
    return () => {};
  }
};

if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("root");
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };
export default mount;
