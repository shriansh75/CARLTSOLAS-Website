/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/build-image-manifest.mjs
 *
 * Intrinsic pixel dimensions for everything under public/images, so <img> can
 * declare width/height and reserve its space before the bytes arrive. Without
 * these the page reflows as each image lands (Cumulative Layout Shift).
 */
export const imageManifest: Record<string, readonly [number, number]> = {
  "/images/marine/flag-state-inspections.jpg": [1600, 720],
  "/images/marine/flag-state-inspections.webp": [1600, 720],
  "/images/marine/fsi-intro.jpg": [1650, 1097],
  "/images/marine/fsi-intro.webp": [1650, 1097],
  "/images/marine/hero-sunset.jpg": [2000, 1332],
  "/images/marine/hero-sunset.webp": [2000, 1332],
  "/images/marine/hero-tanker.jpg": [1800, 1014],
  "/images/marine/hero-tanker.webp": [1800, 1014],
  "/images/marine/hull-survey.jpg": [1200, 675],
  "/images/marine/hull-survey.webp": [1200, 675],
  "/images/marine/lifeboat-hero.jpg": [2000, 1338],
  "/images/marine/lifeboat-hero.webp": [2000, 1338],
  "/images/marine/lifeboat-intro.jpg": [800, 500],
  "/images/marine/lifeboat-intro.webp": [800, 500],
  "/images/marine/lifeboat-service.jpg": [800, 600],
  "/images/marine/lifeboat-service.webp": [800, 600],
  "/images/marine/marine-intro.jpg": [1000, 667],
  "/images/marine/marine-intro.webp": [1000, 667],
  "/images/marine/ndt-primary.jpg": [1600, 1066],
  "/images/marine/ndt-primary.webp": [1600, 1066],
  "/images/marine/tile-confined-space.jpg": [1200, 798],
  "/images/marine/tile-confined-space.webp": [1200, 798],
  "/images/marine/tile-lifeboat-crew.jpg": [1200, 900],
  "/images/marine/tile-lifeboat-crew.webp": [1200, 900],
  "/images/marine/tile-lifeboat-deployment.jpg": [1200, 900],
  "/images/marine/tile-lifeboat-deployment.webp": [1200, 900],
  "/images/marine/tile-lifeboat-launch.jpg": [1200, 900],
  "/images/marine/tile-lifeboat-launch.webp": [1200, 900],
  "/images/marine/tile-lsa-stowage.jpg": [1000, 750],
  "/images/marine/tile-lsa-stowage.webp": [1000, 750],
  "/images/marine/tile-offshore-rig.jpg": [1200, 800],
  "/images/marine/tile-offshore-rig.webp": [1200, 800],
  "/images/marine/tile-rig-tanker.jpg": [1200, 674],
  "/images/marine/tile-rig-tanker.webp": [1200, 674],
  "/images/marine/tile-ultrasonic.jpg": [1200, 676],
  "/images/marine/tile-ultrasonic.webp": [1200, 676],
};

/** Intrinsic size for a public image path, or undefined if it is not tracked. */
export function intrinsicSize(src: string): readonly [number, number] | undefined {
  return imageManifest[src];
}
