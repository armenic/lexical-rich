// import EditorPlain from "./EditorPlain";
// import EditorMin from "./repRex";
import EditorRich from "./EditorRich";

import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div className="App">
      <h1>Worksheet</h1>
      <EditorRich />
      {/* <EditorMin /> */}
      {/* <EditorPlain /> */}
    </div>
  );
}
