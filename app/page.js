'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "./components/button";

export default function Home() {
  const [textType, setTextType] = useState(true);

  return (
    <>
    <div className="absolute pl-10 bg-white pt-10">
      <Button
        onClick={() => setTextType(true)}
        text="Paragraph"
      />
      <Button
        onClick={() => setTextType(false)}
        text="Single Line"
      />
    </div>
      <div className="bg-white font-mono min-h-screen flex items-center justify-center">
        {textType && <input
          contentEditable={textType}
          className="focus:outline-none w-6xl text-4xl text-black p-2"
        />}
        {!textType && <textarea contentEditable="true" className="focus:outline-none w-6xl text-4xl text-black p-2" placeholder="my dream is to ..." />}
      </div>
    </>
  );
}
