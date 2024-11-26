import { memo, useState, useCallback, useEffect } from "react";
import { ColorPicker, useColor as useColorPicker } from "react-color-palette";
import "react-color-palette/css";
import { CgPokemon } from "react-icons/cg";
import "../../css/pokemonMainPage.css"
import { useColor } from '../../contexts/ColorContext';

// eslint-disable-next-line react/display-name
export const ColorChanger = memo(() => {
    const [click, setClick] = useState(false);
    const { backgroundColor, setBackgroundColor, textColor, setTextColor } = useColor();
    const [color_palate, setColor] = useColorPicker("rgb", backgroundColor);

    const updateColors = useCallback((newColor) => {
        const textColorValue = newColor.hex;
        const bgColorValue = `rgba(${255 - newColor.rgb.r}, ${255 - newColor.rgb.g}, ${255 - newColor.rgb.b}, ${newColor.rgb.a})`;

        setTextColor(bgColorValue);
        setBackgroundColor(textColorValue);

        document.body.style.backgroundColor = textColorValue;
        document.body.style.color = bgColorValue;

        // Update all elements with class 'dynamic-color'
        const elements = document.getElementsByClassName('dynamic-color');
        for (let element of elements) {
            element.style.backgroundColor = textColorValue;
            element.style.color = bgColorValue;
        }
    }, [setTextColor, setBackgroundColor]);

    const handleColorChange = useCallback((newColor) => {
        setColor(newColor);
        updateColors(newColor);
    }, [setColor, updateColors]);

    const handleClick = useCallback(() => {
        setClick(prev => !prev);
    }, []);

    useEffect(() => {
        // Initial application of colors
        document.body.style.backgroundColor = backgroundColor;
        document.body.style.color = textColor;

        const elements = document.getElementsByClassName('dynamic-color');
        for (let element of elements) {
            element.style.backgroundColor = backgroundColor;
            element.style.color = textColor;
        }
    }, [backgroundColor, textColor]);
    return (
        <div
            style={{
                height: "50px",
                width: "200px",
                marginLeft: "20px",
                position: "relative"
            }}
        >
            <CgPokemon 
                onClick={handleClick}
                className="dynamic-color"
                style={{
                    cursor: "pointer",
                    fontSize: "2rem"
                }}
            />
            {click && (
                <div className="color-picker-popup">
                    <ColorPicker
                        width={300}
                        height={200}
                        color={color_palate}
                        onChange={handleColorChange}
                        hideHSV
                        dark
                    />
                </div>
            )}
        </div>
    );
});

