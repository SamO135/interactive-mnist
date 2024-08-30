import { useRef, useEffect, useState } from "react";
import "./Canvas.css";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    context.lineWidth = 5;
    contextRef.current = context;
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

  return (
    <div style={{ position: "relative", width: "280px", height: "280px" }}>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}

export default Canvas;
