import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const SketchCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);

  const [isPointerDown, setIsPointerDown] = useState(false);

  const [lsatPointerMoveX, setLsatPointerMoveX] = useState(0);
  const [lsatPointerMoveY, setLsatPointerMoveY] = useState(0);

  // can be called by parent using React.useRef
  useImperativeHandle(ref, () => ({
    rerender() {
      draw();
    },
  }));

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    var bgTop = new Image();
    bgTop.src = props.top;
    bgTop.onload = () => {
      // ctx.drawImage(bgTop, 0, 0, canvas.width, canvas.height);
      var hRatio = canvas.width / bgTop.width;
      var vRatio = canvas.height / bgTop.height;
      var ratio = Math.max(hRatio, vRatio);
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      ctx.drawImage(
        bgTop, // image
        0, // read image offset x
        0, // read image offset y
        bgTop.width, // read image width
        bgTop.height, // read image height
        -((bgTop.width * ratio) / 2 - canvas.width / 2), // draw canvas offset x, offset to screen center if width overflow
        0, // draw canvas offset y
        bgTop.width * ratio, // draw canvas width
        bgTop.height * ratio // draw canvas height
      );
    };
  };

  // SketchFill will call rerender as th canvas resizes at the beginning, so no useEffect's needed
  // useEffect(() => {
  //   draw();
  // }, []);

  const handleOnPointerDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (!isPointerDown) setIsPointerDown(true);
    eraseCircle(x, y);
  };

  const handleOnPointerMove = (e) => {
    if (isPointerDown) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      // smooth out the path by drawing more circles between two points if the Pointer moves fast
      if (lsatPointerMoveX && lsatPointerMoveY) {
        const dx = Math.abs(lsatPointerMoveX - x);
        const dy = Math.abs(lsatPointerMoveY - y);
        const max = Math.max(dx, dy);

        // draw 1 circle per drawInterval pixels
        // smaller the drawInterval, smoother the path, more calculation needed
        const drawInterval = 5;
        if (max > drawInterval) {
          const numOfFillCircles = Math.floor(max / drawInterval);

          for (let i = 0; i < numOfFillCircles; i++) {
            let fx = (dx / numOfFillCircles) * i;
            if (x < lsatPointerMoveX) fx *= -1;

            let fy = (dy / numOfFillCircles) * i;
            if (y < lsatPointerMoveY) fy *= -1;

            eraseCircle(lsatPointerMoveX + fx, lsatPointerMoveY + fy);
          }
        }
      }

      setLsatPointerMoveX(x);
      setLsatPointerMoveY(y);

      eraseCircle(x, y);
    }
  };

  const handleOnPointerUp = (e) => {
    if (isPointerDown) {
      setIsPointerDown(false);
      setLsatPointerMoveX(0);
      setLsatPointerMoveY(0);
    }
  };

  const handleOnPointerLeave = (e) => {
    if (isPointerDown) {
      setIsPointerDown(false);
      setLsatPointerMoveX(0);
      setLsatPointerMoveY(0);
    }
  };

  const eraseCircle = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    var radius = props.fillradius || 50;

    ctx.save();
    ctx.fillStyle = "#ffffff"; // doesn't matter
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handleOnPointerDown}
      onPointerMove={handleOnPointerMove}
      onPointerUp={handleOnPointerUp}
      onPointerLeave={handleOnPointerLeave}
      {...props}
    />
  );
});

export default SketchCanvas;
