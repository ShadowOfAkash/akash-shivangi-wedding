"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const counterTime = 1100;
const crossfadeTime = 180;

function createLanterns() {
  const compact = window.matchMedia("(max-width: 650px)").matches;
  const count = compact ? 56 : 112;
  const maxSize = compact ? 62 : 84;
  const random = (min, max) => min + Math.random() * (max - min);

  // Spread launches across the sky. Each lantern gets an independent flight.
  return Array.from({ length: count }, (_, index) => {
    const size = 12 + (maxSize - 12) * Math.random() ** 1.6;
    return {
      "--left": `${(index + Math.random()) / count * 100}%`,
      "--size": `${size}px`,
      "--duration": `${random(.9, 1.2)}s`,
      "--delay": `${random(0, .15)}s`,
      "--drift": `${random(-6, 6)}vw`,
      "--tilt": `${random(-9, 9)}deg`,
      "--rest-height": `${random(5, 95)}%`,
      "--peak-opacity": 0.55 + 0.45 * size / maxSize,
      zIndex: Math.round(size),
    };
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
  return (
    <div className="lantern-sky" aria-hidden="true" onAnimationEnd={finishFlight}>
      {lanterns.map((style, index) => (
        <i key={index} className="sky-lantern flying-lantern" data-lantern={index} style={style} />
      ))}
    </div>
  );
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
