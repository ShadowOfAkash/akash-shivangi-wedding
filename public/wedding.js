const journey = document.querySelector(".journey");
const stage = journey.querySelector(".stage");
const film = stage.querySelector(".mandap-film");
const poster = stage.querySelector(".mandap-scene");
const heroLoading = stage.querySelector(".hero-loading");
const touchLayout = window.matchMedia("(pointer: coarse)");
const connection = navigator.connection;
const skyWash = stage.querySelector(".sky-wash");
const arrivalShade = stage.querySelector(".arrival-shade");
const clouds = stage.querySelector(".clouds");
const invitation = stage.querySelector(".invitation");
const invitationMessage = stage.querySelector(".invitation-message");
const invitationWords = invitationMessage.querySelectorAll(".invitation-word");
const masthead = stage.querySelector(".masthead");
const weddingNav = document.querySelector(".wedding-nav");
const cue = stage.querySelector(".scroll-cue");
const photoScenes = Array.from(document.querySelectorAll(".photo-scene"), (section) => ({
  section,
  panel: section.querySelector(".photo-stage"),
}));
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const sceneLayers = [
  skyWash, arrivalShade, clouds, invitation, invitationMessage, masthead, cue,
  ...photoScenes.map(({ panel }) => panel),
];

let frame = 0;
let filmProgress = 0;
let navigationHeight = 0;

function finishPosterLoad() {
  heroLoading.hidden = true;
  if (!motionPreference.matches) scheduleRender();
}

if (poster.complete) finishPosterLoad();
else {
  poster.addEventListener("load", finishPosterLoad, { once: true });
  poster.addEventListener("error", finishPosterLoad, { once: true });
}

invitationWords.forEach((word, index) => word.style.setProperty("--word-index", index));

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}

function ease(start, end, progress) {
  const position = clamp((progress - start) / (end - start));
  return position * position * (3 - 2 * position);
}

function pinnedProgress(bounds, panelHeight, top = 0) {
  const travel = bounds.height - panelHeight;
  return travel > 0 ? clamp((top - bounds.top) / travel) : 0;
}

function renderPhotoScenes(viewportHeight) {
  const availableHeight = Math.max(1, viewportHeight - navigationHeight);
  for (const { section, panel } of photoScenes) {
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= viewportHeight) continue;
    const panelHeight = panel.offsetHeight;
    const reveal = ease(0.18, 0.86, 1 - (bounds.top - navigationHeight) / availableHeight);
    const progress = pinnedProgress(bounds, panelHeight, navigationHeight);

    panel.style.setProperty("--scene-opacity", reveal);
    panel.style.setProperty("--scene-lift", `${18 * (1 - reveal)}px`);
    panel.style.setProperty("--scene-drift", `${panelHeight * 0.03 * (1 - 2 * progress)}px`);
    if (section.id === "story") {
      panel.style.setProperty("--story-names-rise", ease(0.06, 0.56, progress));
      panel.style.setProperty("--story-date-rise", ease(0.48, 0.86, progress));
    }
  }
}

function seekFilm() {
  if (motionPreference.matches || !Number.isFinite(film.duration) || film.seeking) return;

  const lastFrame = Math.max(0, film.duration - 1 / 24);
  const time = filmProgress * lastFrame;
  if (Math.abs(film.currentTime - time) >= 1 / 60) film.currentTime = time;
}

function showDecodedFrame() {
  film.toggleAttribute("data-frame-ready", filmProgress > 0 && film.readyState >= 2);
  seekFilm();
}

function render() {
  frame = 0;
  const bounds = journey.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  if (!touchLayout.matches) renderPhotoScenes(viewportHeight);
  if (bounds.bottom <= 0 || bounds.top >= viewportHeight) return;

  const progress = pinnedProgress(bounds, stage.offsetHeight);
  const arrivalTime = ease(0.82, 1, progress);
  const titleFade = ease(0.015, 0.13, progress);
  const messageReveal = ease(0.12, 0.23, progress);
  const messageFill = clamp((progress - 0.25) / 0.45) * invitationWords.length;
  const messageFade = ease(0.82, 1, progress);
  const messageOpacity = messageReveal * (1 - messageFade);

  filmProgress = clamp((progress - 0.025) / 0.975);
  if (filmProgress > 0 && !film.hasAttribute("src") && poster.complete &&
      !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType)) {
    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    film.preload = "auto";
    film.src = portrait ? "/assets/mandap-portrait.mp4" : "/assets/mandap-wide.mp4";
    film.load();
  }
  if (!filmProgress) film.removeAttribute("data-frame-ready");
  seekFilm();
  skyWash.style.opacity = 1 - messageFade;
  arrivalShade.style.opacity = arrivalTime;

  clouds.style.setProperty("--cloud-drift", ease(0, 0.7, progress));
  clouds.style.setProperty("--cloud-visibility", 1 - ease(0.27, 0.66, progress));

  invitation.style.opacity = 1 - titleFade;
  invitation.style.visibility = titleFade === 1 ? "hidden" : "visible";
  invitation.style.transform = `translateY(${-18 * titleFade}px)`;
  invitationMessage.style.opacity = messageOpacity;
  invitationMessage.style.setProperty("--invitation-fill", messageFill);
  invitationMessage.style.visibility = messageOpacity > 0 ? "visible" : "hidden";
  invitationMessage.style.transform = `translateY(${14 * (1 - messageReveal) - 18 * messageFade}px)`;
  cue.style.opacity = 1 - titleFade;
  cue.style.visibility = titleFade === 1 ? "hidden" : "visible";
  masthead.style.color = arrivalTime > 0.58 ? "#fff9ed" : "";
  masthead.style.textShadow = arrivalTime > 0.58 ? "0 1px 4px #142115" : "";
}

function scheduleRender() {
  if (!frame) frame = requestAnimationFrame(render);
}

function updateNavigationHeight() {
  navigationHeight = weddingNav.offsetHeight;
  document.documentElement.style.setProperty("--wedding-nav-height", `${navigationHeight}px`);
  if (!motionPreference.matches) scheduleRender();
}

function updateMotionPreference() {
  const animate = !motionPreference.matches;
  document.documentElement.classList.toggle("has-scroll-journey", animate);

  if (animate) {
    film.addEventListener("loadedmetadata", seekFilm);
    film.addEventListener("seeked", showDecodedFrame);
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);
    scheduleRender();
  } else {
    film.removeEventListener("loadedmetadata", seekFilm);
    film.removeEventListener("seeked", showDecodedFrame);
    film.removeAttribute("data-frame-ready");
    if (film.hasAttribute("src")) {
      film.removeAttribute("src");
      film.load();
    }
    window.removeEventListener("scroll", scheduleRender);
    window.removeEventListener("resize", scheduleRender);
    cancelAnimationFrame(frame);
    frame = 0;
    for (const layer of sceneLayers) layer.removeAttribute("style");
  }
}

motionPreference.addEventListener("change", updateMotionPreference);
updateNavigationHeight();
new ResizeObserver(updateNavigationHeight).observe(weddingNav);
updateMotionPreference();

const fluteMusic = document.querySelector("#wedding-flute");
const musicToggle = document.querySelector(".music-toggle");
const musicIcon = musicToggle.querySelector(".music-icon");
const musicLabel = musicToggle.querySelector(".music-label");

function reflectMusicPlayback() {
  const playing = !fluteMusic.paused;
  musicToggle.toggleAttribute("data-playing", playing);
  musicToggle.setAttribute("aria-label", playing ? "Pause flute music" : "Play flute music");
  musicIcon.textContent = playing ? "Ⅱ" : "♪";
  musicLabel.textContent = playing ? "Pause flute" : "Play flute";
}

fluteMusic.volume = 0.4;
fluteMusic.addEventListener("play", reflectMusicPlayback);
fluteMusic.addEventListener("pause", reflectMusicPlayback);
fluteMusic.addEventListener("error", () => {
  musicToggle.disabled = true;
  musicToggle.setAttribute("aria-label", "Flute music unavailable");
  musicLabel.textContent = "Music unavailable";
});
musicToggle.addEventListener("click", () => {
  if (fluteMusic.paused) {
    fluteMusic.play().catch(reflectMusicPlayback);
  } else {
    fluteMusic.pause();
  }
});
musicToggle.hidden = false;
