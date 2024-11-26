/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from 'react';

const ColorContext = createContext();

export const useColor = () => {
    const context = useContext(ColorContext);
    if (!context) {
        throw new Error('useColor must be used within a ColorProvider');
    }
    return context;
};

export const ColorProvider = ({ children }) => {
    const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem("background-color") || "#FFFFFF");
    const [textColor, setTextColor] = useState(localStorage.getItem("text-color") || "#000000");

    useEffect(() => {
        localStorage.setItem("background-color", backgroundColor);
        localStorage.setItem("text-color", textColor);
    }, [backgroundColor, textColor]);

    return (
        <ColorContext.Provider value={{ backgroundColor, setBackgroundColor, textColor, setTextColor }}>
            {children}
        </ColorContext.Provider>
    );
};
