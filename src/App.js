import { useEffect, useRef, useState } from "react"
import './App.css';

import Toolbox from "./components/Toolbox"
import View from "./components/View"

function App() {
  return (
    <div id="App-container">
      <View></View>
      <Toolbox></Toolbox>
    </div>
  )
}

export default App;
