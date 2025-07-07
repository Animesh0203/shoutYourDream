'use client';

import { useState } from "react";
import ColorPicker from "./components/ColorPicker";
import Button from "./components/button";
import { Sun, PaintBucket } from "lucide-react";

export default function Home() {
  const [textType, setTextType] = useState(1);
  const [bgColor, setBgColor] = useState("#111111");
  const [textColor, setTextColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const flipColors = () => {
    setBgColor((prev) => (prev === "#ffffff" ? "#111111" : "#ffffff"));
    setTextColor((prev) => (prev === "#111111" ? "#ffffff" : "#111111"));
  };

  return (
    <>
      {/* Top Bar */}
      <div
        className="absolute space-x-4 pl-10 pt-10 flex items-center"
        style={{ backgroundColor: bgColor, color: textColor }}
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
          className={`${textType === 1 ? "bg-black text-white" : ""}`}
        />
        <Button
          onClick={() => setTextType(2)}
          text="Single Line"
          style={{ color: textColor, backgroundColor: bgColor }}
          className={`${textType === 2 ? "bg-black text-white" : ""}`}
        />
      </div>

      <div
        className="font-mono min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {textType === 2 && (
          <input
            contentEditable="true"
            type="text"
            className="focus:outline-none w-6xl text-4xl p-2"
            style={{ color: textColor }}
          />
        )}
        {textType === 1 && (
          <textarea contentEditable="true"
            className="focus:outline-none w-6xl text-4xl p-2 resize-none"
            rows={10}
            style={{ color: textColor }}
          />
        )}
      </div>

      {showColorPicker && (
        <div className="absolute space-x-4 bottom-0 right-0 m-5 flex items-center justify-center">
          <div>
            <p className="text-sm mb-1 text-gray-500">Background</p>
            <ColorPicker color={bgColor} onColorChange={setBgColor} />
          </div>
          <div>
            <p className="text-sm mb-1 text-gray-500">Text</p>
            <ColorPicker color={textColor} onColorChange={setTextColor} />
          </div>
        </div>
      )}
    </>
  );
}
