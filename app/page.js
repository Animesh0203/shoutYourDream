'use client';

import { useState, useEffect } from "react";
import ColorPicker from "./components/ColorPicker";
import Button from "./components/button";
import { Sun, PaintBucket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GradientPicker from "./components/GradientPicker";

export default function Home() {
  const [textType, setTextType] = useState(1);
  const [bgColor, setBgColor] = useState("#111111");
  const [textColor, setTextColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [gradientBg, setGradientBg] = useState("");
  const [isGradientEnabled, setIsGradientEnabled] = useState(false);
  const [gradients, setGradients] = useState([]);

  // Gradient editor state
  const [gradientColors, setGradientColors] = useState([
    { color: "#ff0000", stop: 10 },
    { color: "#00ff00", stop: 60 },
    { color: "#0000ff", stop: 90 }
  ]);
  const [gradientCenterX, setGradientCenterX] = useState(50);
  const [gradientCenterY, setGradientCenterY] = useState(50);
  const [linearGradColor1, setLinearGradColor1] = useState("rgba(235,123,255,1)");
  const [linearGradColor2, setLinearGradColor2] = useState("rgba(0,0,0,0)");
  const [showNoise, setShowNoise] = useState(false);

  const flipColors = () => {
    setBgColor(prev => (prev === "#ffffff" ? "#111111" : "#ffffff"));
    setTextColor(prev => (prev === "#111111" ? "#ffffff" : "#111111"));
  };

  useEffect(() => {
    const savedColors = localStorage.getItem("gradient-colors");
    if (savedColors) {
      setGradientColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gradient-colors", JSON.stringify(gradientColors));
  }, [gradientColors]);


  return (
    <div
      style={
        isGradientEnabled && gradientBg
          ? { backgroundImage: gradientBg }
          : { backgroundColor: bgColor }
      }
      className="relative min-h-screen w-full transition-all"
    >
      {/* Top Controls */}
      <div
        className="absolute flex flex-wrap gap-2 px-4 py-4 sm:px-10 sm:py-10 items-center z-20"
        style={{ color: textColor }}
      >
        <Sun className="cursor-pointer" onClick={flipColors} />
        <PaintBucket
          className="cursor-pointer"
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        <Button
          onClick={() => setTextType(1)}
          text="Paragraph"
          style={{ color: textColor, backgroundColor: bgColor }}
          className={`px-3 py-1 rounded-md text-sm ${textType === 1 ? "bg-black text-white" : ""
            }`}
        />
        <Button
          onClick={() => setTextType(2)}
          text="Single Line"
          style={{ color: textColor, backgroundColor: bgColor }}
          className={`px-3 py-1 rounded-md text-sm ${textType === 2 ? "bg-black text-white" : ""
            }`}
        />
      </div>

      {/* Editable Text Area */}
      <div
        className="font-mono min-h-screen flex items-center justify-center p-4 pt-32 sm:pt-40"
        style={
          isGradientEnabled && gradientBg
            ? { backgroundImage: gradientBg, color: textColor }
            : { backgroundColor: bgColor, color: textColor }
        }
      >
        {textType === 2 && (
          <input
            type="text"
            className="focus:outline-none w-full max-w-3xl text-2xl sm:text-4xl p-2 bg-transparent"
            style={{ color: textColor }}
          />
        )}
        {textType === 1 && (
          <textarea
            className="focus:outline-none w-full max-w-3xl text-xl sm:text-4xl p-2 resize-none bg-transparent"
            rows={10}
            style={{ color: textColor }}
          />
        )}
      </div>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            className="fixed w-full bottom-0 right-0 z-50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <div className="flex flex-col h-screen sm:h-1/2 sm:flex-row gap-6 sm:gap-10 justify-between overflow-y-auto items-start sm:items-center p-6 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-2xl rounded-t-xl">
              {/* Solid Color Pickers */}
              <div className="space-y-4 w-full sm:w-1/4">
                <div>
                  <p className="text-sm mb-2 text-white font-medium">Background</p>
                  <ColorPicker color={bgColor} onColorChange={setBgColor} />
                </div>
                <div>
                  <p className="text-sm mb-2 text-white font-medium">Text</p>
                  <ColorPicker color={textColor} onColorChange={setTextColor} />
                </div>
              </div>

              {/* Gradient Picker Section */}
              <div className="flex-1 w-full">
                <label className="flex items-center gap-3 text-white mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGradientEnabled}
                    onChange={(e) => setIsGradientEnabled(e.target.checked)}
                    className="w-4 h-4 block accent-pink-500"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white"
                    style={{ backgroundImage: gradientBg }}
                  />
                  <span className="text-sm font-medium">Enable Gradient</span>
                </label>

                <GradientPicker
                  colors={gradientColors}
                  setColors={setGradientColors}
                  centerX={gradientCenterX}
                  setCenterX={setGradientCenterX}
                  centerY={gradientCenterY}
                  setCenterY={setGradientCenterY}
                  linearGradColor1={linearGradColor1}
                  setLinearGradColor1={setLinearGradColor1}
                  linearGradColor2={linearGradColor2}
                  setLinearGradColor2={setLinearGradColor2}
                  showNoise={showNoise}
                  setShowNoise={setShowNoise}
                  saveGradient={() =>
                    setGradients(prev => [
                      ...prev,
                      {
                        id: Date.now(),
                        colors: [...gradientColors],
                        centerX: gradientCenterX,
                        centerY: gradientCenterY,
                        linearGradColor1,
                        linearGradColor2,
                        showNoise
                      }
                    ])
                  }
                  onGradientChange={(g) => {
                    if (isGradientEnabled) setGradientBg(g);
                  }}
                />
              <div className="flex flex-wrap gap-4 mt-6">
                {gradients.map((g) => {
                  const gradientPreview = `
                      linear-gradient(0deg, ${g.linearGradColor1}, ${g.linearGradColor2}),
                      radial-gradient(at ${g.centerX}% ${g.centerY}%, ${g.colors
                                      .map((c) => `${c.color} ${c.stop}%`)
                                      .join(", ")})
                      ${g.showNoise ? `, url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` : ""}
                    `;

                  return (
                    <div
                      key={g.id}
                      className="w-10 h-10 rounded-md cursor-pointer border border-white/20"
                      style={{ backgroundImage: gradientPreview }}
                      onClick={() => {
                        // Load this gradient into the editor
                        setGradientColors(g.colors);
                        setGradientCenterX(g.centerX);
                        setGradientCenterY(g.centerY);
                        setLinearGradColor1(g.linearGradColor1);
                        setLinearGradColor2(g.linearGradColor2);
                        setShowNoise(g.showNoise);
                        setGradientBg(gradientPreview);
                        setIsGradientEnabled(true);
                      }}
                    />
                  );
                })}
              </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
