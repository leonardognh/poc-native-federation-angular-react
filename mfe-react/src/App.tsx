import React, { Suspense } from "react";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="app">
      <main className="main-content">
        <Suspense>
          <Home />
        </Suspense>
      </main>
    </div>
  );
};

export default App;
