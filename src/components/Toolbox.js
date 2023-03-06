import { useState, useEffect } from "react"
import { Image } from "react-konva"

import zoomIn from "../img/zoom-in.png"
import zoomOut from "../img/zoom-out.png"
import share from "../img/share.png"
import chicken from "../img/rooster.png"
import text from "../img/text.png"
import alien from "../img/alien.png"




const Toolbox = ({chickens, stageRef, clipRef}) => {

    // Import the state of chickens
    const [numChickens, setChickens] = chickens;

    /* -----------------------------------------------------------------*\
    | User clicks "Zoom In" 
    \* -----------------------------------------------------------------*/ 
    // This can be combined with the zoom out function below
    
    const toolZoomIn = () => {
        const scaleBy = 1.1;  // Scroll Threshold
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const newScale =  oldScale * scaleBy;
        stage.scaleX(newScale)
        stage.scaleY(newScale)
    }

    /* -----------------------------------------------------------------*\
    | User clicks "Zoom Out" 
    \* -----------------------------------------------------------------*/ 
    const toolZoomOut = () => {
        const scaleBy = 0.9;  // Scroll Threshold
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const newScale =  oldScale * scaleBy;
        stage.scaleX(newScale)
        stage.scaleY(newScale)
    }

    /* -----------------------------------------------------------------*\
    | User clicks "Add Chicken" 
    \* -----------------------------------------------------------------*/ 
    
    const addChicken = () => {
        
        const newChicken = numChickens.numChickens + 1;
        const newChickenObj = {
            numChickens:newChicken
        }
        setChickens(newChickenObj)
        console.log("(Toolbox) Adding a chicken... There are currently ", numChickens.numChickens, " chickens.")
        // alert("Add a chicken!")
    }

    /* -----------------------------------------------------------------*\
    | User clicks "Add Text" 
    \* -----------------------------------------------------------------*/ 
    const addText= () => {
        console.log("Add text...")
    }


    /* -----------------------------------------------------------------*\
    | User clicks "Export" 
    \* -----------------------------------------------------------------*/ 
    const exportStage = () => {
        console.log(clipRef)
        const dataURL = clipRef.current.toDataURL({
            pixelRatio: 2 // or other value you need
        })
        downloadURI(dataURL, 'output.png');
    }




    // function from https://stackoverflow.com/a/15832662/512042
    function downloadURI(uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const getAlien = () => {
        alert("Get the alien!")
    } 

    /* -----------------------------------------------------------------*\
    | Available Buttons
    \* -----------------------------------------------------------------*/ 

    const availableButtons = [
        {img: zoomIn, name:"Zoom In", action:toolZoomIn},
        {img: zoomOut, name:"Zoom Out", action:toolZoomOut},
        {img: chicken, name:"Add Chicken", action:addChicken},
        {img: alien, name:"Add Alien", action:getAlien},
        {img: text, name:"Add Text", action:addText},
        {img: share, name:"Export", action:exportStage},
    ]

    const ToolboxButton = () => {
        return (
            <>
                {availableButtons.map((button, i) => {
                    return (
                        <div    id={i}
                                className="ToolboxButton"
                                onClick={button.action}
                        >

                            <img    className="ToolBoxButton_img"
                                    src={button.img}
                                    alt="" />

                            {/* <div className="ToolBoxButton_name">{button.name}</div> */}
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <div id="Toolbox">
            <ToolboxButton />
        </div>
    )
}

export default Toolbox
