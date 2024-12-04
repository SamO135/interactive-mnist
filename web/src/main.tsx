import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "./Canvas.tsx";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <link
      href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Shadows+Into+Light&display=swap"
      rel="stylesheet"
    ></link>
    <h1 id="title-text">Interactive MNIST</h1>
    <p id="header-text">
      Draw a number (0 - 9) in the box. When you click submit, the image will be
      passed through a simple convolutional neural network trained on the MNIST
      dataset which will try to accurately classify the number you have drawn.
      The model scored an accuracy of ~98% on the validation dataset. To the
      right of the box you will see what probabilities the model has assigned
      each number 0 - 9.
      <br></br>
      <b>Note: The first couple submitions may take a few seconds</b>
    </p>
    <Canvas />
    <p id="footer-text">
      Source code on{" "}
      <a href="https://github.com/SamO135/interactive-mnist" target="_blank">
        GitHub
      </a>
    </p>
  </StrictMode>
);
