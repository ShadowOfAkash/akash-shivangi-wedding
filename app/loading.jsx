export function WeddingRings() {
  return <span className="wedding-rings" aria-hidden="true"><i /><i /></span>;
}

export default function Loading() {
  return (
    <div className="invitation-loading" role="status">
      <noscript><style>{`
        .invitation-loading, .hero-loading { display: none; }
        div[hidden]:has(main#top) { display: block !important; }
      `}</style></noscript>
      <WeddingRings />
      <span>Opening your invitation…</span>
    </div>
  );
}
