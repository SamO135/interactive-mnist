import React, { useRef, useEffect, useState } from "react";
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

    canvas.width = parentElement.clientWidth * 2;
    canvas.height = parentElement.clientHeight * 2;
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

  const startMouseDrawing = ({
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

  const startTouchDrawing = ({
    nativeEvent,
  }: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = nativeEvent.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    const context = contextRef.current;
    if (context) {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  // const startDrawing = (
  //   e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  // ) => {
  //   if (e.type == "mousedown") {
  //     console.log("Mouse");
  //     startMouseDrawing(e as React.MouseEvent<HTMLCanvasElement>);
  //   } else if (e.type == "touchstart") {
  //     console.log("Touch");
  //     startTouchDrawing(e as React.TouchEvent<HTMLCanvasElement>);
  //   }
  // };

  const finishDrawing = () => {
    const context = contextRef.current;
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const touchDraw = ({ nativeEvent }: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const touch = nativeEvent.touches[0];
      const canvas = canvasRef.current;

      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = touch.clientX - rect.left;
      const offsetY = touch.clientY - rect.top;

      const context = contextRef.current;
      if (context) {
        context.lineTo(offsetX, offsetY);
        context.stroke();
      }
    }
  };

  const mouseDraw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      const context = contextRef.current;
      if (context) {
        context.lineTo(offsetX, offsetY);
        context.stroke();
      }
    }
  };

  // const draw = (
  //   e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  // ) => {
  //   if (e.nativeEvent instanceof MouseEvent) {
  //     mouseDraw(e as React.MouseEvent<HTMLCanvasElement>);
  //   } else if (e.nativeEvent instanceof TouchEvent) {
  //     touchDraw(e as React.TouchEvent<HTMLCanvasElement>);
  //   }
  // };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const sendCanvasData = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    const blob = await fetch(dataUrl).then((res) => res.blob());

    const formData = new FormData();
    formData.append("file", blob, "canvas.png");

    try {
      const response = await fetch("/file-upload", {
        method: "POST",
        body: formData,
      });

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
          onMouseDown={startMouseDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={mouseDraw}
          onTouchStart={startTouchDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={touchDraw}
          ref={canvasRef}
        />
        <div className="canvas-buttons">
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
      </div>

      {displayApiResponse()}
    </div>
  );
}

export default Canvas;
