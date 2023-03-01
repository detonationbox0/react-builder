import {useEffect, useLayoutEffect, useRef, useState} from "react"
import {Stage, Layer, Rect, Image, Group, Transformer} from 'react-konva';
import useImage from 'use-image'


    // Create the transformer shape.
    // This part is complicated, consider moving to own component?
    // https://konvajs.org/docs/react/Transformer.html
    // https://blog.logrocket.com/canvas-manipulation-react-konva/

    const TransformerRect = ({ shapeProps, isSelected, onSelect, onChange }) => {

        const shapeRef = useRef();
        const trRef = useRef();

        useEffect(() => {
            if (isSelected) {
                trRef.current.setNode(shapeRef.current);
                trRef.current.getLayer().batchDraw();
            }
        }, [isSelected]);

        return (
            <>
                <Rect
                    onClick={onSelect}
                    ref={shapeRef}
                    {... shapeProps}
                    draggable
                    onDragEnd = {e => {
                        onChange({
                            ...shapeProps,
                            x: e.target.x(),
                            y: e.target.y()
                        })
                    }}
                    onTransformEnd = {e => {
                        const node = shapeRef.current;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        node.scaleX(1);
                        node.scaleY(1);

                        onChange({
                            ...shapeProps,
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY)
                        })

                    }}
                />
                {isSelected && (
                    <Transformer
                        ref={trRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                    />
                )}
            </>
        )


    }

const initialRects = [
        {
            x: (width / 2) - (movWidth / 2),
            y: (height / 2) - (movHeight / 2) - verticalAdjust,
            width: 100,
            height: 100,
            fill: "blue",
            id: "circ1"
          },
          {
            x: (width / 2) - (movWidth / 2),
            y: (height / 2) - (movHeight / 2) - (verticalAdjust  + 100),
            width: 100,
            height: 100,
            fill: "green",
            id: "circ2"
          }
    ]


const View = () => {

    // Create reference to Konva's container element
    const divRef = useRef(null)

    // Create reference to the Transformer
    const trRef = useRef(null)



    // When the window resizes, we should get the
    // width and height of the Konva's container
    const useWindowResize = () => {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            const updateSize = () => {
                setSize([
                    divRef.current.offsetWidth,
                    divRef.current.offsetHeight
                ]);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize)
        }, [])
        return size;
    }

    // Get width and height of Konva's container element
    const [width, height] = useWindowResize();


    // When the user scrolls the mouse wheel,
    // the canvas should zoom in and out
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


    // The Shirt Image
    // https://konvajs.org/docs/react/Images.html
    const ShirtImage = ({imgProps}) => {
        const [image] = useImage('https://portal.themailshark.net/franchisepromoF/Apparels/Apparel_front_12_356_305.png');
        return <Image
            image={image}
            x={imgProps.posX}
            y={imgProps.posY}
            width={imgProps.width}
            height={imgProps.height}
            fill={imgProps.fillColor}
        />;
    };


    // Set the desired properties of the shirt image
    const ratio = [4500, 6000]
    const imgWidth = 600;
    const imgHeight = (ratio[1] * imgWidth) / ratio[0]
    const imgProps = {
        posX:(width / 2) - (imgWidth / 2),
        posY:(height / 2) - (imgHeight / 2),
        width:imgWidth,
        height:imgHeight,
        fillColor:"white"
    }


    // Set the desired width and height of the mask area.
    // verticalAdjust describes how high up on the shirt
    // the mask will be
    const [maskWidth, maskHeight, verticalAdjust] = [300, 400, 80]

    // Set the desired properties of the movable object
    const [movWidth, movHeight] = [100, 100]
    

    const [rectangles, setCircles] = useState(initialRectangles);
    const [selectedId, selectShape] = useState(null);   

    return (
        <div ref={divRef} id="Stage-container">
            <Stage
                id="Stage"
                width={width}
                height={height}
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

                    {rectangles.map((rect, i) => {
                        return (
                            <TransformerRect
                                key={i}
                                shapeProps={circ}
                                isSelected={circ.id === selectedId}
                                onSelect={() => {
                                    selectShape(circ.id);
                                }}
                                onChange={newAttrs => {
                                    const circs = circles.slice();
                                    circs[i] = newAttrs;
                                    setCircles(circs);
                                }}
                            />
                        )
                    })}

                    {/* Image of the shirt */}
                    <ShirtImage 
                        imgProps={imgProps}
                    />
                    {/* Clip Group consists of rectangle and a shape */}
                    <Group
                        clipHeight={maskHeight}
                        clipWidth={maskWidth}
                        clipX={(width / 2) - (maskWidth / 2)}
                        clipY={(height / 2) - (maskHeight / 2) - verticalAdjust}
                    >
                        <Rect
                            width={maskWidth}
                            height={maskHeight}
                            x={(width / 2) - (maskWidth / 2)}
                            y={(height / 2) - (maskHeight / 2) - verticalAdjust}
                            fillEnabled={false}
                            stroke={"black"}
                            strokeWidth={1}
                        />

                        <Rect
                            x={(width / 2) - (movWidth / 2)}
                            y={(height / 2) - (movHeight / 2) - verticalAdjust}
                            width={movWidth}
                            height={movWidth}
                            fill={"blue"}
                            stroke={"black"}
                            strokeWidth={1}
                        />

                        
                    </Group>

                    {/* Invisible rectangle to move outside of the clip */}
                    <Rect
                        fillEnabled={false}
                        x={(width / 2) - (movWidth / 2)}
                        y={(height / 2) - (movHeight / 2) - verticalAdjust}
                        width={movWidth}
                        height={movWidth} 
                    />


                </Layer>

            </Stage>
        </div>
    );
}

export default View;
