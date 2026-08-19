/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/build-image-manifest.mjs
 *
 * Intrinsic pixel dimensions for everything under public/images, so <img> can
 * declare width/height and reserve its space before the bytes arrive. Without
 * these the page reflows as each image lands (Cumulative Layout Shift).
 */
export const imageManifest: Record<string, readonly [number, number]> = {
  "/images/marine/fsi-boat-deck.jpg": [800, 600],
  "/images/marine/fsi-boat-deck.webp": [800, 600],
  "/images/marine/fsi-deck-washdown.jpg": [1435, 1097],
  "/images/marine/fsi-deck-washdown.webp": [1435, 1097],
  "/images/marine/fsi-extinguishers.jpg": [1200, 675],
  "/images/marine/fsi-extinguishers.webp": [1200, 675],
  "/images/marine/fsi-hero-engineroom.jpg": [1600, 720],
  "/images/marine/fsi-hero-engineroom.webp": [1600, 720],
  "/images/marine/fsi-lsa-locker.jpg": [1000, 750],
  "/images/marine/fsi-lsa-locker.webp": [1000, 750],
  "/images/marine/fsi-rov.jpg": [1024, 1024],
  "/images/marine/fsi-rov.webp": [1024, 1024],
  "/images/marine/fsi-terminal.jpg": [1200, 658],
  "/images/marine/fsi-terminal.webp": [1200, 658],
  "/images/marine/hero-oilgas.jpg": [1600, 1067],
  "/images/marine/hero-oilgas.webp": [1600, 1067],
  "/images/marine/lb-davit.jpg": [800, 800],
  "/images/marine/lb-davit.webp": [800, 800],
  "/images/marine/lb-deployment.jpg": [1600, 1200],
  "/images/marine/lb-deployment.webp": [1600, 1200],
  "/images/marine/lb-ga-drawing.jpg": [844, 573],
  "/images/marine/lb-ga-drawing.webp": [844, 573],
  "/images/marine/lb-service-crew.jpg": [1200, 900],
  "/images/marine/lb-service-crew.webp": [1200, 900],
  "/images/marine/lb-underway.jpg": [1200, 840],
  "/images/marine/lb-underway.webp": [1200, 840],
  "/images/marine/lifeboat-hero.jpg": [2000, 1338],
  "/images/marine/lifeboat-hero.webp": [2000, 1338],
  "/images/marine/lifeboat-intro.jpg": [800, 500],
  "/images/marine/lifeboat-intro.webp": [800, 500],
  "/images/marine/marine-intro.jpg": [1000, 667],
  "/images/marine/marine-intro.webp": [1000, 667],
  "/images/marine/mo-co2-bank.jpg": [776, 1036],
  "/images/marine/mo-co2-bank.webp": [776, 1036],
  "/images/marine/mo-confined-space.jpg": [1200, 797],
  "/images/marine/mo-confined-space.webp": [1200, 797],
  "/images/marine/mo-crew-night.jpg": [1200, 1600],
  "/images/marine/mo-crew-night.webp": [1200, 1600],
  "/images/marine/mo-rig-sunset.jpg": [1600, 1200],
  "/images/marine/mo-rig-sunset.webp": [1600, 1200],
  "/images/marine/mo-ultrasonic.jpg": [1200, 675],
  "/images/marine/mo-ultrasonic.webp": [1200, 675],
};

/** Intrinsic size for a public image path, or undefined if it is not tracked. */
export function intrinsicSize(src: string): readonly [number, number] | undefined {
  return imageManifest[src];
}
