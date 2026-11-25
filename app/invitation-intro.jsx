"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const counterTime = 1100;
const crossfadeTime = 180;

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
      if (elapsed >= counterTime) setPhase("done");
      else frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    document.getElementById("invitation-page").inert = false;
    const target = document.getElementById(window.location.hash.slice(1));
    target?.scrollIntoView({ behavior: "instant" });
  }, [phase]);

  if (phase === "done") return null;
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
