'use client';

import React, { useEffect, useState } from 'react';

const AsciiSphere = () => {
  const [frame, setFrame] = useState(0);

  // Simple animation effect for the ASCII sphere
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Static approximation of the Figma ASCII art sphere
  // In a real scenario, this could be a dynamic generator, but for "exact match" 
  // we can use a pre-rendered or CSS-mask based approach.
  // Here I'll use a pre-defined set of characters that look like the sphere.
  
  const characters = [
    "          _.u[[/::,.              _.oo.",
    "      .o888uu[[[/;::-.  .o@P^   MMMA ' ",
    "    oN88888uu[[[/;::-.          dP^    ",
    "   dMMMMNN888UU[[[/;::-.  .o@P^        ",
    "  MMMMMMNN888UU[[[/;::-.  o@^          ",
    "  NNMMMMNN888UU[[[/~.o@P^              ",
    "  888888888uu[[[/o@^-.                 ",
    " oI8888uu[[[/o@P^:--..                 ",
    ".o@^  YUU[[[/o@^;::---..               ",
    "   OMP   ^/o@P^;:::---..               ",
    " . dMMM   .o@^ ^;::---...              ",
    "dMMMMMMMM@P^      ^^^^                 "
  ];

  // For a more "premium" feel, we can use a more complex pattern or even 
  // a SVG/Canvas based ASCII mask, but let's stick to a clean CSS implementation first.
  
  return (
    <div className="ascii-sphere-container">
      <div className="ascii-sphere">
        {characters.map((line, i) => (
          <div key={i} className="ascii-line">
            {line}
          </div>
        ))}
      </div>
      

    </div>
  );
};

export default AsciiSphere;
