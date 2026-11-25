"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const loadingTime = 5000;
const rows = Array.from({ length: 8 }, (_, index) => index);
const lamps = Array.from({ length: 14 }, (_, index) => index);

export default function InvitationIntro() {
  const pathname = usePathname();
  return pathname === "/" ? <OpeningSequence /> : null;
}

function OpeningSequence() {
  const [phase, setPhase] = useState("counting");
  const percentage = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const page = document.getElementById("invitation-page");
    page.inert = true;
    return () => { page.inert = false; };
  }, []);

  useEffect(() => {
    if (phase !== "counting") return;
    const start = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? performance.now();
    let last = -1;
    let frame;
    function tick(now) {
      const elapsed = Math.max(0, now - start);
      const ready = elapsed >= loadingTime && pageReady();
      const value = ready ? 100 : Math.min(99, Math.floor(elapsed / loadingTime * 100));
      if (value !== last) {
        percentage.current.textContent = String(value);
        track.current.style.transform = `scaleX(${value / 100})`;
        last = value;
      }
      if (ready) setPhase("lamps");
      else frame = requestAnimationFrame(tick);
    }
    function pageReady() {
      const invitation = document.getElementById("top");
      return invitation && !invitation.closest("[hidden]");
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
    <div className="invitation-intro" data-phase={phase} role="status" aria-label="Opening your wedding invitation">
      <div className="intro-counter" aria-hidden="true">
        <i className="diya intro-diya" />
        <span className="intro-caption">Opening your invitation</span>
        <div className="intro-number"><span ref={percentage}>0</span><span>%</span></div>
        <div className="intro-track"><i ref={track} /></div>
      </div>
      {phase === "lamps" && (
        <div className="diya-field" aria-hidden="true" onAnimationEnd={event => {
          if (event.target === event.currentTarget) setPhase("done");
        }}>
          {rows.map(row => (
            <div className="diya-row" key={row}>
              {lamps.map(lamp => <i className="diya" key={lamp} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
