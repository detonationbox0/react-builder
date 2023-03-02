import {useEffect, useLayoutEffect, useRef, useState} from "react"
import {Stage, Layer, Rect, Image, Group} from 'react-konva';
import TransformerRect from "./TransformerRect";


/* -----------------------------------------------------------------*\
| When the window is resized                                         |
\* -----------------------------------------------------------------*/
//#region

function useWindowDimensions() {
    const [windowWidth, setWidth] = useState(window.innerHeight)
    const [windowHeight, setHeight] = useState(window.innerHeight)
    
    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }
    
    useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => {
            window.removeEventListener("resize", updateWidthAndHeight);
        }
    }, [])

    return {
        windowWidth,
        windowHeight
    }
}



const View = ({stageRef, clipRef}) => {

    const {windowWidth, windowHeight} = useWindowDimensions();
    const [width, height] = [window.innerWidth, window.innerHeight]


    /* -----------------------------------------------------------------*\
    | When the user scrolls, zoom the stage                              |
    \* -----------------------------------------------------------------*/
    //#region

        // https://stackoverflow.com/questions/52054848/how-to-react-konva-zooming-on-scroll

        // Make some state for the scale
        const [scaleState, setScaleState] = useState({
            stageScale: 1,
            stageX: 0,
            stageY: 0
        })

        // Function passed to the onWheel event of the Stage
        const handleWheel = (e) => {
            e.evt.preventDefault();
        
            const scaleBy = 1.1;  // Scroll Threshold
            const stage = e.target.getStage();
            const oldScale = stage.scaleX();
            const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
            };
        
            const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            setScaleState({
                stageScale: newScale,
                stageX:
                -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
                stageY:
                -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
            })
        };

    //#endregion




    /* -----------------------------------------------------------------*\
    | Load the image for the <Image /> of the shirt                      |
    \* -----------------------------------------------------------------*/
    //#region

        // https://konvajs.org/docs/react/Images.html
        // https://blog.logrocket.com/canvas-manipulation-react-konva/
        const [image, setImage] = useState(new window.Image());
        useEffect(() => {
            const img = new window.Image();
            img.src = "https://portal.themailshark.net/franchisepromoF/Apparels/Apparel_front_12_356_305.png"
            setImage(img);
        }, [])

        // Set the desired properties of the shirt image
        const ratio = [4500, 6000]
        const imgWidth = 600;
        const imgHeight = (ratio[1] * imgWidth) / ratio[0]
        const imgProps = {
            x:(width / 2) - (imgWidth / 2),
            y:(height / 2) - (imgHeight / 2),
            width:imgWidth,
            height:imgHeight,
            fillColor:"white"
        }

    //#endregion

    /* -----------------------------------------------------------------*\
    | Set up the properties for the masked area                          |
    \* -----------------------------------------------------------------*/
    //#region

        // Set the desired width and height of the mask area.
        // verticalAdjust describes how high up on the shirt
        // the mask will be
        const [maskWidth, maskHeight, verticalAdjust] = [300, 400, 80]

    //#endregion

    /* -----------------------------------------------------------------*\
    | Create the rectangles that are loaded to the Stage by default      |
    \* -----------------------------------------------------------------*/
    //#region

        // https://blog.logrocket.com/canvas-manipulation-react-konva/
        // Some initial rectangles to use
        // Set the desired properties of the movable objects
        const [movWidth, movHeight] = [100, 100]
        
 
        // States for the rectangles and whether they are selected
        const [rectProps, setRectProps] = useState({
            x: 0,
            y: 0,
            width: movWidth,
            height: movHeight,
            fill: "blue",
            id: "rect"
        });
        const [selectedId, selectShape] = useState(null);

    //#endregion

    return (
        <div id="Stage-container">
            <Stage
                ref={stageRef}
                id="Stage"
                width={windowWidth}
                height={windowHeight}
                onWheel={handleWheel}
                x = {scaleState.stageX}
                y = {scaleState.stageY}
                scaleX = {scaleState.stageScale}
                scaleY = {scaleState.stageScale}
                draggable={true}
                onMouseDown={e => {
                const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                      selectShape(null); // Deselect things if clicked off
                    }
                }}
            >
                <Layer>
                    

                    {/* Image of the shirt */}
                    <Image 
                        {...imgProps}
                        image={image} 
                        fill={"white"}
                    />
                    {/* Clip Group consists of rectangle and a shape */}
                    <Group
                        clipHeight={maskHeight}
                        clipWidth={maskWidth}
                        clipX={(width / 2) - (maskWidth / 2)}
                        clipY={(height / 2) - (maskHeight / 2) - verticalAdjust}
                        ref={clipRef}
                    >
                        <Rect
                            width={maskWidth}
                            height={maskHeight}
                            x={(width / 2) - (maskWidth / 2)}
                            y={(height / 2) - (maskHeight / 2) - verticalAdjust}
                            fillEnabled={false}
                            stroke={"black"}
                            strokeWidth={3}
                        />
                        <TransformerRect
                            x={(width / 2) - (movWidth / 2)}
                            y={(height / 2) - (movHeight / 2)}
                            shapeProps={rectProps}
                            isSelected={rectProps.id === selectedId}
                            onSelect={() => {
                                selectShape(rectProps.id);
                            }}
                            onChange={newAttrs => {
                                setRectProps(newAttrs);
                            }}
                        />
                    </Group>

                    {/* Invisible rectangle to move outside of the clip */}

                    

                </Layer>

            </Stage>
        </div>
    );
}

export default View;
