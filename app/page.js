'use client';

import { useState, useEffect, useRef } from "react";
import ColorPicker from "./components/ColorPicker";
import Button from "./components/button";
import { Sun, PaintBucket, X, ArrowDownUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GradientPicker from "./components/GradientPicker";
import useKeyPress from "./hook/useKeyPress";

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
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();
  const [paragraphValue, setParagraphValue] = useState('');
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    const text = e.target.value;
    textareaRef.current.value = text;

    const fits = textareaRef.current.scrollHeight <= textareaRef.current.clientHeight;

    if (fits) {
      setParagraphValue(text);
    }
  };



  const handleInputChange = (e) => {
    const text = e.target.value;
    const style = getComputedStyle(inputRef.current);
    const font = `${style.fontSize} ${style.fontFamily}`;
    const textWidth = getPixelLength(text, font);

    if (textType === 2 && textWidth < window.innerWidth - 32) {
      setInputValue(text);
    } else if (textType === 1) {
      setInputValue(text);
    }
  };


  const onKeyPress = (event) => {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      const input = document.querySelector('input[type="text"]');
      const textarea = document.querySelector('textarea');
      if (textType === 2 && input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      } else if (textType === 1 && textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }
  };

  useKeyPress(["k"], onKeyPress, document);

  const flipColors = () => {
    setBgColor(prev => (prev === "#ffffff" ? "#111111" : "#ffffff"));
    setTextColor(prev => (prev === "#111111" ? "#ffffff" : "#111111"));
  };

  const getPixelLength = (text, font) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
  };


  useEffect(() => {
    const savedColors = localStorage.getItem("gradient-colors");
    if (savedColors) {
      setGradientColors(JSON.parse(savedColors));
    }
    const savedCenterX = localStorage.getItem("gradientCenterX");
    if (savedCenterX) {
      setGradientCenterX(JSON.parse(savedCenterX));
    }
    const savedCenterY = localStorage.getItem("gradientCenterY");
    if (savedCenterY) {
      setGradientCenterY(JSON.parse(savedCenterY));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gradient-colors", JSON.stringify(gradientColors));
    localStorage.setItem("gradientCenterX", JSON.stringify(gradientCenterX));
    localStorage.setItem("gradientCenterY", JSON.stringify(gradientCenterY));
  }, [gradientColors, gradientCenterX, gradientCenterY]);


  return (
    <div
      style={
        isGradientEnabled && gradientBg
          ? { backgroundImage: gradientBg }
          : { backgroundColor: bgColor }
      }
      className="relative font-mono min-h-screen w-full transition-colors duration-300"
    >
      {/* Top Controls - Simplified */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 p-6 z-20">
        <button
          onClick={flipColors}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: textColor }}
          aria-label="Flip colors"
        >
          <Sun size={20} />
        </button>

        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: textColor }}
          aria-label="Color picker"
        >
          <PaintBucket size={20} />
        </button>

        <div className="flex bg-white/10 border border-black backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setTextType(1)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${textType === 1 ? "bg-white text-gray-900" : "text-white/80 hover:text-white"}`}
          >
            Paragraph
          </button>
          <button
            onClick={() => setTextType(2)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${textType === 2 ? "bg-white text-gray-900" : "text-white/80 hover:text-white"}`}
          >
            Single Line
          </button>
        </div>

        <div className="flex bg-white/10 opacity-25 border border-black backdrop-blur-sm rounded-full p-1">
          <button
            className={`px-4 py-1 rounded-full text-sm transition-colors `}
          >
            Crtl + K
          </button>
        </div>
      </div>

      {/* Editable Text Area - Cleaner */}
      <div
        className="font-mono min-h-screen flex items-center justify-center p-4 pt-24"
        style={{ color: textColor }}
      >
        {textType === 2 && (
          <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            className="focus:outline-none w-full text-3xl sm:text-5xl p-2 bg-transparent text-center placeholder-white/50"
            style={{ color: textColor }}
          />
        )}
        {textType === 1 && (
          <textarea
            ref={textareaRef}
            value={paragraphValue}
            onChange={handleTextareaChange}
            className="focus:outline-none w-full max-w-3xl text-xl sm:text-4xl p-2 resize-none bg-transparent overflow-y-hidden h-[40vh]"
            style={{ color: textColor }}
          />
        )}
      </div>

      {/* Color Picker Modal - Modernized */}
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
                      <button
                        key={g.id}
                        type="button"
                        className="w-10 h-10 rounded-md cursor-pointer border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                        aria-label="Select gradient"
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
