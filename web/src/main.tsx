import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "./Canvas.tsx";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <p>
      Draw a number in the box. When you click submit, the image will be passed
      through a simple convolutional neural network trained on the MNIST dataset
      which will try to accurately classify the number you have drawn. The model
      has an accuracy of ~98% on the MNIST dataset. To the right of the box you
      will see what probabilities the model has assigned each number 0 - 9.
    </p>
    <Canvas />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem
      excepturi enim libero. Consequatur quos aliquid esse soluta quae iste
      doloremque, similique alias voluptatem recusandae quidem doloribus
      expedita reprehenderit architecto! Dolorum id, minima eos harum ullam esse
      fugit consectetur explicabo soluta distinctio illo eveniet hic, incidunt
      similique, velit saepe odit rem neque. Facere, tenetur accusamus harum rem
      temporibus corrupti? Odio inventore dicta deleniti nihil nam architecto
      debitis voluptas, itaque corrupti hic. Reiciendis libero voluptatem error
      quisquam quod voluptatibus perspiciatis at praesentium, expedita dolorem
      eligendi corrupti obcaecati delectus eos quaerat quas qui cumque id
      laborum repellendus ipsa inventore quo! Deserunt, consectetur minus.{" "}
    </p>
  </StrictMode>
);
