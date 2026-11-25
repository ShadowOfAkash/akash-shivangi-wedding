"use client";

import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const counterTime = 1100;
const crossfadeTime = 180;

function createLanterns() {
  const compact = window.matchMedia("(max-width: 650px)").matches;
  const random = (min, max) => min + Math.random() * (max - min);

  // Origins are measured from the ridge in the hero photograph. Farther
  // lanterns stay close to the mandap and cover less distance on screen.
  const layers = [
    { count: compact ? 3 : 6, x: [31, 69], aboveRidge: [3, 9], size: [5, 10], rise: [4, 9], drift: 2, opacity: .55, duration: [1.3, 1.55] },
    { count: compact ? 2 : 4, x: [17, 83], aboveRidge: [11, 21], size: [12, 20], rise: [20, 42], drift: 6, opacity: .73, duration: [1.1, 1.4] },
    { count: compact ? 2 : 3, x: [8, 92], aboveRidge: [22, 34], size: [25, 39], rise: [60, 105], drift: 10, opacity: .9, duration: [1, 1.25] },
  ];

  return layers.flatMap(layer => {
    const [left, right] = layer.x;
    const lane = (right - left) / layer.count;
    return Array.from({ length: layer.count }, (_, index) => ({
      "--left": `${left + (index + random(.1, .9)) * lane}%`,
      "--above-ridge": `${random(...layer.aboveRidge)}cqh`,
      "--size": `${random(...layer.size) * (compact ? .8 : 1)}px`,
      "--rise": `${random(...layer.rise)}px`,
      "--duration": `${random(...layer.duration)}s`,
      "--delay": `${random(0, .16)}s`,
      "--drift": `${random(-layer.drift, layer.drift)}px`,
      "--tilt": `${random(-8, 8)}deg`,
      "--peak-opacity": layer.opacity,
    }));
  });
}

function LanternFlight({ onComplete }) {
  const [lanterns] = useState(createLanterns);
  const finished = useRef(new Set());
  function finishFlight(event) {
    const id = event.target.dataset.lantern;
    if (id === undefined) return;
    finished.current.add(id);
    if (finished.current.size === lanterns.length) onComplete();
  }
  const sky = (
    <div className="lantern-sky" aria-hidden="true" onAnimationEnd={finishFlight}>
      {lanterns.map((style, index) => (
        <i key={index} className="sky-lantern flying-lantern" data-lantern={index} style={style} />
      ))}
    </div>
  );
  const scenery = document.querySelector(".journey .scenery");
  return scenery ? createPortal(sky, scenery) : sky;
}

export default function InvitationIntro() {
  const pathname = usePathname();
  return pathname === "/" ? <OpeningSequence /> : null;
}

function OpeningSequence() {
  const [phase, setPhase] = useState("counting");
  const overlay = useRef(null);
  const percentage = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const page = document.getElementById("invitation-page");
    page.inert = true;
    return () => { page.inert = false; };
  }, []);

  useEffect(() => {
    if (phase !== "counting") return;
    const mountedAt = performance.now();
    let firstPaint;
    let last = -1;
    let frame;
    function tick(now) {
      firstPaint ??= performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
      const elapsed = Math.max(0, now - (firstPaint ?? mountedAt));
      const value = Math.min(100, Math.floor(elapsed / (counterTime - crossfadeTime) * 100));
      if (value !== last) {
        percentage.current.textContent = String(value);
        track.current.style.transform = `scaleX(${value / 100})`;
        last = value;
      }
      if (value === 100) overlay.current.style.opacity = Math.max(0, (counterTime - elapsed) / crossfadeTime);
      if (elapsed >= counterTime) setPhase("lanterns");
      else frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "lanterns") return;
    document.getElementById("invitation-page").inert = false;
    const target = document.getElementById(window.location.hash.slice(1));
    target?.scrollIntoView({ behavior: "instant" });
  }, [phase]);

  if (phase === "done") return null;
  if (phase === "lanterns") return <LanternFlight onComplete={() => setPhase("done")} />;
  return (
    <div className="invitation-intro" ref={overlay} role="status" aria-label="Opening your wedding invitation">
      <div className="intro-counter" aria-hidden="true">
        <i className="sky-lantern intro-lantern" />
        <span className="intro-caption">Opening your invitation</span>
        <div className="intro-number"><span ref={percentage}>0</span><span>%</span></div>
        <div className="intro-track"><i ref={track} /></div>
      </div>
    </div>
  );
}
