"use client";

import { useEffect, useRef, useState } from "react";

function createLanterns() {
  const compact = window.matchMedia("(max-width: 650px)").matches;
  const random = (min, max) => min + Math.random() * (max - min);

  // Origins are measured from the ridge in the hero photograph. Farther
  // lanterns launch near the mandap and rise more slowly.
  const layers = [
    { count: compact ? 3 : 6, x: [31, 69], aboveRidge: [3, 9], size: [5, 10], drift: 2, opacity: .55, duration: [95, 125] },
    { count: compact ? 2 : 4, x: [17, 83], aboveRidge: [11, 21], size: [12, 20], drift: 6, opacity: .73, duration: [25, 37] },
    { count: compact ? 2 : 3, x: [8, 92], aboveRidge: [22, 34], size: [25, 39], drift: 10, opacity: .9, duration: [7, 11] },
  ];

  return layers.flatMap(layer => {
    const [left, right] = layer.x;
    const lane = (right - left) / layer.count;
    // Evenly stagger each layer so its lanterns never all restart together.
    const duration = random(...layer.duration);
    const phase = Math.random();
    return Array.from({ length: layer.count }, (_, index) => ({
      "--left": `${left + (index + random(.1, .9)) * lane}%`,
      "--above-ridge": `${random(...layer.aboveRidge)}cqh`,
      "--size": `${random(...layer.size) * (compact ? .8 : 1)}px`,
      "--duration": `${duration}s`,
      "--delay": `${-duration * ((phase + index / layer.count) % 1)}s`,
      "--drift": `${random(-layer.drift, layer.drift)}px`,
      "--tilt": `${random(-8, 8)}deg`,
      "--peak-opacity": layer.opacity,
    }));
  });
}

export default function LanternSky() {
  const sky = useRef(null);
  const [lanterns, setLanterns] = useState([]);

  useEffect(() => {
    setLanterns(createLanterns());
    const observer = new IntersectionObserver(([entry]) => {
      entry.target.toggleAttribute("data-paused", !entry.isIntersecting);
    });
    observer.observe(sky.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lantern-sky" aria-hidden="true" ref={sky}>
      {lanterns.map((style, index) => (
        <i key={index} className="sky-lantern flying-lantern" style={style} />
      ))}
    </div>
  );
}
