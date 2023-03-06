import { useRef, useState }  from "react"
import './App.css';

import Toolbox from "./components/Toolbox"
import View from "./components/View"

function App() {
  // Store the stage in a global reference
  const stageRef = useRef(null)
  // Store the clipping area in a global reference
  const clipRef = useRef(null)

  // How many chickens?
  const [numChickens, setChickens] = useState({
    numChickens:0
  }); 

  return (
    <div id="App-container">
      <View
        chickens = {[numChickens, setChickens]}
        stageRef={stageRef}
        clipRef={clipRef}
      ></View>
      <Toolbox
        chickens={[numChickens, setChickens]}
        stageRef={stageRef} // Send the stage references to the toolbox
        clipRef={clipRef}
      ></Toolbox>
    </div>
  )
}

export default App;
