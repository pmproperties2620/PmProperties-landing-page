import styles from "./TrustMarquee.module.css";

const trustMarkers = [
  "RERA REGISTERED",
  "500+ FAMILIES SETTLED",
  "KDRA MEMBER",
  <>REGENCY <span aria-hidden="true">{"\u00b7"}</span> LODHA <span aria-hidden="true">{"\u00b7"}</span> RUNWAL PARTNER</>,
  "5 YEARS IN DOMBIVLI",
];

function MarkerGroup() {
  return (
    <div className={styles.group}>
      {trustMarkers.map((marker, index) => (
        <span key={index} className="inline-flex items-center gap-4 sm:gap-6">
          <span className={`${styles.item} text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-slate-700`}>
            {marker}
          </span>
          <span aria-hidden="true" className="text-brand-600/80 text-lg sm:text-xl font-semibold">
            {"\u2014"}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <section
      aria-label="Trust markers: RERA registered, 500 plus families settled, KDRA member, Regency Lodha Runwal partner, 5 years in Dombivli"
      className="relative overflow-hidden bg-white mt-0"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(167,4,2,0.08),transparent_32%,transparent_68%,rgba(167,4,2,0.08))]" />

      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-6 sm:h-8 z-10 pointer-events-none bg-gradient-to-b from-white via-white/90 to-transparent backdrop-blur-[1px]" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 z-10 pointer-events-none bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-[1px]" />

      <div className={`relative ${styles.viewport}`}>
        <div className="sr-only">
          RERA registered. 500 plus families settled. KDRA member. Regency, Lodha, and Runwal
          partner. 5 years in Dombivli.
        </div>
        <div aria-hidden="true" className={`${styles.track} py-7 sm:py-9`}>
          <MarkerGroup />
          <MarkerGroup />
          <MarkerGroup />
          <MarkerGroup />
        </div>
      </div>
    </section>
  );
}
