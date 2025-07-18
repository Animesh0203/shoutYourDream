'use client';
import { useState, useEffect } from "react";

export default function GradientPicker({
    onGradientChange,
    colors,
    setColors,
    centerX,
    setCenterX,
    centerY,
    setCenterY,
    linearGradColor1,
    setLinearGradColor1,
    linearGradColor2,
    setLinearGradColor2,
    showNoise,
    setShowNoise,
    saveGradient
}) {


    const noiseSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;


    const handleUpdate = (
        x = centerX,
        y = centerY,
        newColors = colors,
        noise = showNoise
    ) => {
        const gradient = `linear-gradient(0deg, ${linearGradColor1}, ${linearGradColor2}), radial-gradient(at ${x}% ${y}%, ${newColors
            .map((c) => `${c.color} ${c.stop}%`)
            .join(", ")})`;

        const noiseSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;

        const overlay = noise ? `, url("${noiseSvg}")` : "";

        onGradientChange(gradient + overlay);
    };

    useEffect(() => { handleUpdate(); }, [centerX, centerY, colors, showNoise]);

    const updateColor = (idx, newColor) => {
        const updated = [...colors];
        updated[idx].color = newColor;
        setColors(updated);
    };

    const updateStop = (idx, newStop) => {
        const updated = [...colors];
        updated[idx].stop = newStop;
        setColors(updated);
    };

    const addColor = () => {
        const lastStop = colors.length ? colors[colors.length - 1].stop + 10 : 50;
        setColors([...colors, { color: "#ffffff", stop: lastStop > 100 ? 100 : lastStop }]);
    };

    const removeColor = (idx) => {
        const updated = colors.filter((_, i) => i !== idx);
        setColors(updated);
    };

    const copyCSS = () => {
        const gradient = `
            background-image: 
            linear-gradient(0deg, rgb(238, 161, 255, 1), rgba(0,0,0,0)),
            radial-gradient(circle at ${centerX}% ${centerY}%, ${colors.map((c) => `${c.color} ${c.stop}%`).join(", ")})
            ${showNoise ? `, url("${noiseSvg}")` : ""};
        `;
        navigator.clipboard.writeText(gradient);
    };

    const randomHex = () =>
        "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

    const randomize = () => {
        const randomColors = Array.from({ length: 3 }, (_, i) => ({
            color: randomHex(),
            stop: 20 + i * 30
        }));
        setColors(randomColors);
        setCenterX(Math.floor(Math.random() * 101));
        setCenterY(Math.floor(Math.random() * 101));
    };

    const reset = () => {
        setColors([
            { color: "#ff0000", stop: 10 },
            { color: "#00ff00", stop: 60 },
            { color: "#0000ff", stop: 90 }
        ]);
        setCenterX(50);
        setCenterY(50);
        setShowNoise(false);
    };

    return (
        <div className="p-5 bg-white rounded-xl shadow-sm space-y-5 w-full border border-gray-100">
            <h2 className="text-base font-medium text-gray-800">Gradient Editor</h2>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>X: {centerX}%</span>
                        <span>Y: {centerY}%</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={centerX}
                            onChange={(e) => setCenterX(Number(e.target.value))}
                            className="flex-1 accent-gray-800"
                        />
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={centerY}
                            onChange={(e) => setCenterY(Number(e.target.value))}
                            className="flex-1 accent-gray-800"
                        />
                    </div>
                </div>

                {/* <div className="text-xs flex items-center space-x-2 text-gray-500 mb-1">Linear Gradient Colors: 
                    <div className="flex items-center space-x-2">
                    <input
                        type="color"
                        value={linearGradColor1}
                        onChange={(e) => setLinearGradColor1(e.target.value)}
                        className="w-8 h-8 cursor-pointer rounded border border-gray-200"></input>
                    <input
                        type="color"
                        value={linearGradColor2}
                        onChange={(e) => setLinearGradColor2(e.target.value)}
                        className="w-8 h-8 cursor-pointer rounded border border-gray-200"></input>
                    </div>
                </div> */}

                <div className="space-y-2">
                    {colors.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="color"
                                value={c.color}
                                onChange={(e) => updateColor(idx, e.target.value)}
                                className="w-8 h-8 cursor-pointer rounded border border-gray-200"
                            />
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={c.stop}
                                onChange={(e) => updateStop(idx, Number(e.target.value))}
                                className="flex-1 accent-gray-800"
                            />
                            <span className="w-8 text-xs text-gray-500 text-right">{c.stop}%</span>
                            {colors.length > 2 && (
                                <button
                                    className="text-gray-400 hover:text-gray-600 text-sm w-5 h-5 flex items-center justify-center"
                                    onClick={() => removeColor(idx)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={addColor}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                    + Color
                </button>
                <button
                    onClick={randomize}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-blue-50 text-blue-600"
                >
                    Random
                </button>
                <button
                    onClick={reset}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                    Reset
                </button>
                <button
                    onClick={copyCSS}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-white hover:bg-gray-700"
                >
                    Copy CSS
                </button>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-white hover:bg-gray-700" onClick={saveGradient}>
                    Save Gradient
                </button>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="noise-toggle"
                    checked={showNoise}
                    onChange={() => setShowNoise(!showNoise)}
                    className="w-4 h-4 accent-gray-800"
                />
                <label htmlFor="noise-toggle" className="text-xs text-gray-600">Noise overlay</label>
            </div>
        </div>
    );
}