import { useState, useEffect } from "react";

export const useAnimation = () => {
  const [glowValue, setGlowValue] = useState(0);
  const [pulseValue, setPulseValue] = useState(1);
  const [floatValue, setFloatValue] = useState(0);

  useEffect(() => {
    // Glow animation
    const glowInterval = setInterval(() => {
      setGlowValue((prev) => (prev === 0 ? 1 : 0));
    }, 2000);

    // Pulse animation
    const pulseInterval = setInterval(() => {
      setPulseValue((prev) => (prev === 1 ? 1.02 : 1));
    }, 1500);

    // Float animation
    const floatInterval = setInterval(() => {
      setFloatValue((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) return -1;
        return 0;
      });
    }, 3000);

    return () => {
      clearInterval(glowInterval);
      clearInterval(pulseInterval);
      clearInterval(floatInterval);
    };
  }, []);

  return {
    glowValue,
    pulseValue,
    floatValue,
  };
};
