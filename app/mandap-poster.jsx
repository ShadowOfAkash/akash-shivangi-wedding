export default function MandapPoster() {
  return (
    <picture>
      <source media="(max-aspect-ratio: 4/5)" srcSet="/assets/mandap-portrait.webp" />
      <img className="mandap-scene" src="/assets/mandap-wide.webp" fetchPriority="high" decoding="async"
        alt="A flower-lined meadow path leading to a distant mandap where the bride follows the groom around the havan fire." />
    </picture>
  );
}
