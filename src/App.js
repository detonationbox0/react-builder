import { useEffect, useRef, useState } from "react"
import './App.css';

import Toolbox from "./components/Toolbox"
import View from "./components/View"

function App() {
  // Store the stage in a global reference
  const stageRef = useRef(null)
  // Store the clipping area in a global reference
  const clipRef = useRef(null)
  return (
    <div id="App-container">
      <View
        stageRef={stageRef}
        clipRef={clipRef}
      ></View>
      <Toolbox
        stageRef={stageRef}
        clipRef={clipRef}
      ></Toolbox>
    </div>
  )
}

export default App;
