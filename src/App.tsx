import { useState } from "react";
import Drawer from "./Drawer";

const App = () => {
  const [ratio, setRatio] = useState(0);
  return (
    <div>
      <Drawer ratio={ratio} />
      <input
        type="range"
        min="0"
        max="1"
        step={0.01}
        value={ratio}
        onChange={(e) => setRatio(parseFloat(e.currentTarget.value))}
      />
    </div>
  );
};

export default App;
