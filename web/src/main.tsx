import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "./Canvas.tsx";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Canvas />
  </StrictMode>
);
