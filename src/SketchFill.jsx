import React, { useRef, useEffect, useState } from "react";
import SketchCanvas from "./SketchCanvas";
import "./SketchFill.css";

const SketchFill = (props) => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  const [canvasHeight, setCanvasHeight] = useState(300);
  const [canvasWidth, setCanvasWidth] = useState(150);

  // resize canvas to parent div size
  useEffect(() => {
    const resizeCanvas = () => {
      // console.log("resize canvas");
      if (boxRef.current) {
        setCanvasHeight(boxRef.current.getBoundingClientRect().height);
        setCanvasWidth(
          Math.min(
            boxRef.current.getBoundingClientRect().width,
            boxRef.current.getBoundingClientRect().height *
              ((props.imagewidth || 300) / (props.imageheight || 150))
          )
        );
      }
    };
    resizeCanvas();

    // resize canvas again if window size changed
    const handleResize = (e) => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line
  }, [boxRef.current, props.imagewidth, props.imageheight]);

  // rerender canvas after resize
  useEffect(() => {
    if (canvasRef.current) {
      // console.log("rerender canvas");
      canvasRef.current.rerender();
    }
  }, [canvasWidth, canvasHeight]);

  return (
    <div
      className="box"
      style={{
        backgroundImage: `url('${process.env.PUBLIC_URL}/${props.background}')`,
      }}
      ref={boxRef}
    >
      <SketchCanvas
        ref={canvasRef}
        className="cas"
        height={canvasHeight}
        width={canvasWidth}
        {...props}
      />
    </div>
  );
};

export default SketchFill;
