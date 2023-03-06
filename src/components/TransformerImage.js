import {useEffect, useRef} from "react"
import {Image, Transformer} from 'react-konva';

// Create the transformer shape.
// This part is complicated
// https://konvajs.org/docs/react/Transformer.html
// https://blog.logrocket.com/canvas-manipulation-react-konva/

const TransformerImage = ({x, y, img, shapeProps, isSelected, onSelect, onChange }) => {

    console.log(img)

    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
            trRef.current.setNode(shapeRef.current);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    console.log(shapeProps)

    return (
        <>
            <Image
                onClick={onSelect}
                ref={shapeRef}
                image={img}
                {... shapeProps}

                x={x}
                y={y}
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

export default TransformerImage