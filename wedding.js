const journey = document.querySelector(".journey");
const stage = journey.querySelector(".stage");
const film = stage.querySelector(".mandap-film");
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
  const progress = pinnedProgress(journey.getBoundingClientRect(), stage.offsetHeight);
  const arrivalTime = ease(0.82, 1, progress);
  const titleFade = ease(0.015, 0.13, progress);
  const messageReveal = ease(0.12, 0.23, progress);
  const messageFill = clamp((progress - 0.25) / 0.45) * invitationWords.length;
  const messageFade = ease(0.82, 1, progress);
  const messageOpacity = messageReveal * (1 - messageFade);

  filmProgress = clamp((progress - 0.025) / 0.975);
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
  renderPhotoScenes(stage.offsetHeight);
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

const weddingMusic = document.querySelector("#wedding-music");
const musicToggle = document.querySelector(".music-toggle");
const musicIcon = musicToggle.querySelector(".music-icon");
const musicLabel = musicToggle.querySelector(".music-label");

function reflectMusicPlayback() {
  const playing = !weddingMusic.paused;
  musicToggle.toggleAttribute("data-playing", playing);
  musicToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  musicIcon.textContent = playing ? "Ⅱ" : "♪";
  musicLabel.textContent = playing ? "Pause music" : "Play music";
}

weddingMusic.volume = 0.4;
weddingMusic.addEventListener("play", reflectMusicPlayback);
weddingMusic.addEventListener("pause", reflectMusicPlayback);
weddingMusic.addEventListener("error", () => {
  musicToggle.disabled = true;
  musicToggle.setAttribute("aria-label", "Music unavailable");
  musicLabel.textContent = "Music unavailable";
});
musicToggle.addEventListener("click", () => {
  if (weddingMusic.paused) {
    weddingMusic.play().catch(reflectMusicPlayback);
  } else {
    weddingMusic.pause();
  }
});
musicToggle.hidden = false;
