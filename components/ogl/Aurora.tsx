"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

/**
 * OGL aurora field, adapted from React Bits (MIT + Commons Clause) for the
 * CARLTSOLAS footer: recolored to blueprint blues and given a real start/stop
 * `active` gate (the original ran an unconditional rAF). WebGL only, no eval /
 * wasm / workers, so it needs no CSP changes. Imported through
 * next/dynamic({ssr:false}) via AuroraBackground.
 */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  active?: boolean;
}

/** Convert the hex color stops to the [r,g,b] triples the shader wants. Hoisted
 *  out of the render loop so it never allocates per frame (it did, from a const). */
function toStops(colorStops: [string, string, string]): number[][] {
  return colorStops.map((hex) => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  });
}

export function Aurora({ colorStops, amplitude = 1.0, blend = 0.5, speed = 0.6, active = true }: AuroraProps) {
  const ctnRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<{ renderer: Renderer; program: Program; mesh: Mesh } | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const lostRef = useRef(false);
  const [gen, setGen] = useState(0);

  // set up the OGL context (re-runs after a context-restore to rebuild the scene)
  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return;

    // WebGL can be unavailable for reasons that have nothing to do with the
    // device being weak: a GPU blocklist entry, hardware acceleration switched
    // off, a driver fault, remote desktop, a headless browser. OGL's Renderer
    // dereferences the context inside its constructor, so that case THROWS —
    // and an uncaught throw in an effect tears down the entire React root. The
    // symptom is brutal and easy to miss: the page renders fine, then blanks
    // completely the moment the footer scrolls into view and this lazy-mounts.
    // Caught here, the static bg-ink behind the footer is the fallback and the
    // rest of the page is untouched.
    let scene: { renderer: Renderer; program: Program; mesh: Mesh; canvas: HTMLCanvasElement };
    try {
      const renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5),
      });
      const gl = renderer.gl;
      if (!gl) throw new Error("no webgl context");
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = "transparent";

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      // Shader compilation is the other throw site worth covering here.
      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: toStops(colorStops) },
          uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
          uBlend: { value: blend },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });
      scene = { renderer, program, mesh, canvas: gl.canvas };
    } catch {
      return;
    }

    const { renderer, program, mesh, canvas } = scene;
    ctn.appendChild(canvas);

    const resize = () => {
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    window.addEventListener("resize", resize);

    // recover from a dropped GL context (iOS memory pressure / GPU reset) instead
    // of leaving a permanently blank canvas.
    const onLost = (e: Event) => {
      e.preventDefault();
      lostRef.current = true;
    };
    const onRestored = () => {
      lostRef.current = false;
      setGen((g) => g + 1);
    };
    canvas.addEventListener("webglcontextlost", onLost as EventListener);
    canvas.addEventListener("webglcontextrestored", onRestored as EventListener);

    glRef.current = { renderer, program, mesh };

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onLost as EventListener);
      canvas.removeEventListener("webglcontextrestored", onRestored as EventListener);
      if (canvas.parentNode === ctn) ctn.removeChild(canvas);
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      glRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gen]);

  // sync the visual uniforms on change (not per frame — the old loop allocated
  // three Color objects every frame from a constant).
  useEffect(() => {
    const g = glRef.current;
    if (!g) return;
    g.program.uniforms.uAmplitude.value = amplitude;
    g.program.uniforms.uBlend.value = blend;
    g.program.uniforms.uColorStops.value = toStops(colorStops);
  }, [amplitude, blend, colorStops, gen]);

  // Render loop only while active, driven by the GSAP ticker rather than a
  // private requestAnimationFrame.
  //
  // One clock for the whole page. Lenis already runs inside gsap.ticker, so a
  // second rAF loop meant two independent callbacks waking the main thread each
  // frame and no ordering guarantee between them. Joining the existing ticker
  // costs one more callback on a loop that is already running.
  //
  // The ~60fps clamp stays per-callback and is never applied via
  // `gsap.ticker.fps()`, which is global and would coarsen Lenis on a 120Hz
  // display. `time` is seconds here, where the old loop took milliseconds; the
  // uniform rate is unchanged (ms * 0.01 * 0.1 == s * 1.0).
  useEffect(() => {
    if (!active) return;
    registerGsap();
    const FRAME_S = 1 / 60;
    let last = -Infinity;
    let start = -1;
    const tick = (time: number) => {
      if (start < 0) start = time;
      if (time - last < FRAME_S) return;
      last = time;
      const g = glRef.current;
      if (!g || lostRef.current) return;
      g.program.uniforms.uTime.value = (time - start) * speedRef.current;
      g.renderer.render({ scene: g.mesh });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [active]);

  return <div ref={ctnRef} className="absolute inset-0 h-full w-full" />;
}
