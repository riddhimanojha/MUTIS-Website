import { Link } from "react-router";
import { useReveal } from "@/app/hooks/useReveal";

// Gallery is intentionally empty for now (photos to be added later).
// To enable auto-loading from assets/events, uncomment the glob below and
// set GALLERY_IMAGES to its result.
//
// const galleryModules = import.meta.glob(
//   "../../assets/events/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
//   { eager: true, import: "default" },
// ) as Record<string, string>;
// const GALLERY_IMAGES = Object.entries(galleryModules)
//   .sort(([a], [b]) => a.localeCompare(b))
//   .map(([, src]) => src);

const GALLERY_IMAGES: string[] = [];

export function Gallery() {
  useReveal([GALLERY_IMAGES.length]);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <div className="crumb">
              <Link to="/">MUTIS</Link><span>/</span><span>Media</span><span>/</span><span>Gallery</span>
            </div>
            <div className="page-eyebrow r-up"><span className="bar" />Media</div>
            <h1 className="page-title r-up">Moments from<br />the <span className="accent">MUTIS year</span></h1>
          </div>
          <p className="page-sub r-up">
            Conferences, socials, simulations, and speaker nights — a look back at the
            people and events that make up the society.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="inner">
          <div className="page-eyebrow r-up"><span className="bar" />Photo Gallery</div>
          <h2 className="r-up">Event photography</h2>

          {GALLERY_IMAGES.length === 0 ? (
            <p className="lede r-up">
              Coming soon — we&apos;ll be adding event photos here shortly.
            </p>
          ) : (
            <div className="gallery-grid r-up">
              {GALLERY_IMAGES.map((src, i) => (
                <figure className="gallery-item" key={src + i}>
                  <img
                    src={src}
                    alt="MUTIS event photo"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
