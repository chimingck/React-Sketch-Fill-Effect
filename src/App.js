import "./App.css";
import SketchFill from "./SketchFill";

function App() {
  return (
    <div className="App">
      {/* Place the background image and top image inside the public folder */}
      <SketchFill
        background="bg.svg"
        top="bg-top.svg"
        // resolution of the two images. Have to be the same
        imagewidth="1920"
        imageheight="1210"
        fillradius="50"
      />
    </div>
  );
}

export default App;
