import { useRef, useEffect, useState } from "react";
import "./style.css";
import Probabilities from "./components/Probabilities";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    predicted_class: string;
    probabilities: number[];
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parentElement = canvas.parentElement;
    if (!parentElement) return;

    // Set canvas dimensions to match CSS dimensions but increase pixel density
    canvas.width = parentElement.clientWidth * 2; // Adjust to parent width
    canvas.height = parentElement.clientHeight * 2; // Adjust to parent height
    canvas.style.width = `${parentElement.clientWidth}px`;
    canvas.style.height = `${parentElement.clientHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 10;
    contextRef.current = context;
    clearCanvas();
  }, []);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (context) {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    const context = contextRef.current;
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      const context = contextRef.current;
      if (context) {
        context.lineTo(offsetX, offsetY);
        context.stroke();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      // Fill the canvas with a white background
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const sendCanvasData = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to a data URL
    const dataUrl = canvas.toDataURL("image/png");

    // console.log("Canvas Data (Base64):", dataUrl); // Log the canvas data before sending

    // Convert data URL to Blob
    const blob = await fetch(dataUrl).then((res) => res.blob());

    // Send the image as form data to the FastAPI backend
    const formData = new FormData();
    formData.append("file", blob, "canvas.png");

    try {
      const response = await fetch("http://localhost:8000/file-upload", {
        method: "POST",
        body: formData,
      });

      // Wait for the API response
      const result = await response.json();
      setApiResponse(result);
      console.log(result);
    } catch (error) {
      console.error("Error uploading the image:", error);
      setApiResponse(null);
    }
  };

  function displayApiResponse() {
    return apiResponse === null ? (
      <Probabilities predicted_class="None" probabilities={[0]} />
    ) : (
      <Probabilities
        predicted_class={apiResponse.predicted_class}
        probabilities={apiResponse.probabilities}
      />
    );
  }

  return (
    <div className="container">
      <div id="canvas-container">
        <canvas
          id="canvas"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
        <button
          id="clear-button"
          type="button"
          className="btn btn-primary"
          onClick={clearCanvas}
        >
          Clear
        </button>
        <button
          id="submit-button"
          type="button"
          className="btn btn-primary"
          onClick={sendCanvasData}
        >
          Submit
        </button>
      </div>

      {displayApiResponse()}
    </div>
  );
}

export default Canvas;
