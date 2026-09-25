import {
  CanvasTexture, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry,
  Scene, ShaderMaterial, SRGBColorSpace, Vector2, WebGLRenderer,
} from "three";

export type PrismFrame = {
  spineX: number;
  spineY: number;
  halfWidth: number;
  halfLength: number;
  takeover: number;
  rail: number;
  panel: number;
  warp: number;
  chromatic: number;
  rainbow: number;
};

export type PrismSurface = { render: (frame: PrismFrame) => void; dispose: () => void };

const vertexShader = `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = `
precision highp float;
uniform sampler2D uBackdrop;
uniform vec2 uResolution;
uniform vec2 uSpine;
uniform vec2 uNormal;
uniform float uHalfWidth;
uniform float uHalfLength;
uniform float uTakeover;
uniform float uRail;
uniform float uPanel;
uniform float uWarp;
uniform float uChromatic;
uniform float uRainbow;
uniform float uDpr;

void main() {
  vec2 point = gl_FragCoord.xy;
  vec2 tangent = vec2(-uNormal.y, uNormal.x);
  float across = dot(point - uSpine, uNormal);
  float along = dot(point - uSpine, tangent);
  float edgeDistance = abs(across) - uHalfWidth;
  float lengthMask = 1.0 - smoothstep(uHalfLength - 5.0 * uDpr, uHalfLength + 3.0 * uDpr, abs(along));
  float body = 1.0 - smoothstep(uHalfWidth - 2.0 * uDpr, uHalfWidth + 2.0 * uDpr, abs(across));
  body *= lengthMask;
  // The measured rail rectangle reaches every corner; the final blend also
  // guarantees opaque coverage despite subpixel clipping at the viewport rim.
  body = mix(body, 1.0, uTakeover);

  vec2 uv = point / uResolution;
  vec2 bend = vec2(
    sin(uv.y * 12.0 + sin(uv.x * 5.5) * 1.6) + 0.42 * sin(uv.y * 24.0 - uv.x * 8.0),
    cos(uv.x * 10.0 + sin(uv.y * 6.5) * 1.5) - 0.38 * cos(uv.x * 21.0 + uv.y * 7.0)
  );
  vec2 warped = clamp(uv + bend * (0.028 * uWarp), 0.002, 0.998);
  vec2 split = uNormal * uChromatic * (0.7 + 0.3 * sin(uv.x * 9.0 + uv.y * 6.0));
  vec3 destination = vec3(
    texture2D(uBackdrop, clamp(warped + split, 0.002, 0.998)).r,
    texture2D(uBackdrop, warped).g,
    texture2D(uBackdrop, clamp(warped - split, 0.002, 0.998)).b
  );

  float core = exp(-pow(edgeDistance / (1.7 * uDpr), 2.0)) * lengthMask;
  float fringe = exp(-pow(edgeDistance / (14.0 * uDpr), 2.0)) * lengthMask;
  vec3 spectral = vec3(
    exp(-pow((edgeDistance - 7.0 * uDpr) / (7.0 * uDpr), 2.0)),
    exp(-pow((edgeDistance + 3.0 * uDpr) / (7.0 * uDpr), 2.0)),
    exp(-pow((edgeDistance + 9.0 * uDpr) / (8.0 * uDpr), 2.0))
  ) * lengthMask;
  vec3 edge = vec3(0.83, 0.88, 0.91) * core + spectral * uRainbow * 0.72 * fringe;
  float alpha = max(body * uPanel, uRail * (core * 0.95 + fringe * uRainbow * 0.22));
  vec3 color = destination * body * uPanel + edge * uRail;
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

function makeBackdrop() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 768;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Prism backdrop canvas unavailable");
  const gradient = context.createLinearGradient(0, 0, 768, 768);
  gradient.addColorStop(0, "#1d252b");
  gradient.addColorStop(0.55, "#0d1318");
  gradient.addColorStop(1, "#252a30");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 768, 768);
  context.strokeStyle = "rgba(230,235,234,.17)";
  context.lineWidth = 1;
  for (let x = 0; x <= 768; x += 64) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 768); context.stroke();
  }
  for (let y = 0; y <= 768; y += 64) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(768, y); context.stroke();
  }
  context.strokeStyle = "rgba(239,241,236,.42)";
  context.lineWidth = 3;
  context.beginPath();
  context.ellipse(500, 405, 285, 160, -0.47, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = "rgba(239,241,236,.16)";
  context.lineWidth = 12;
  context.beginPath();
  context.ellipse(500, 405, 225, 115, -0.47, 0, Math.PI * 2);
  context.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function createPrismSurface(canvas: HTMLCanvasElement): PrismSurface | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  try {
    const texture = makeBackdrop();
    const uniforms = {
      uBackdrop: { value: texture },
      uResolution: { value: new Vector2(1, 1) },
      uSpine: { value: new Vector2() },
      uNormal: { value: new Vector2(1, 0) },
      uHalfWidth: { value: 0 }, uHalfLength: { value: 0 }, uTakeover: { value: 0 },
      uRail: { value: 0 }, uPanel: { value: 0 },
      uWarp: { value: 0 }, uChromatic: { value: 0 },
      uRainbow: { value: 0 }, uDpr: { value: 1 },
    };
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthTest: false, depthWrite: false });
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene();
    scene.add(new Mesh(geometry, material));
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 2);
    camera.position.z = 1;
    let previousWidth = 0, previousHeight = 0, previousDpr = 0;

    return {
      render(frame) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia("(max-width: 767px)").matches ? 1.15 : 1.5);
        if (width !== previousWidth || height !== previousHeight || dpr !== previousDpr) {
          renderer.setPixelRatio(dpr);
          renderer.setSize(width, height, false);
          previousWidth = width; previousHeight = height; previousDpr = dpr;
        }
        uniforms.uResolution.value.set(width * dpr, height * dpr);
        uniforms.uSpine.value.set(frame.spineX * dpr, (height - frame.spineY) * dpr);
        uniforms.uNormal.value.set(1, 0);
        uniforms.uHalfWidth.value = frame.halfWidth * dpr;
        uniforms.uHalfLength.value = frame.halfLength * dpr;
        uniforms.uTakeover.value = frame.takeover;
        uniforms.uRail.value = frame.rail;
        uniforms.uPanel.value = frame.panel;
        uniforms.uWarp.value = frame.warp;
        uniforms.uChromatic.value = frame.chromatic;
        uniforms.uRainbow.value = frame.rainbow;
        uniforms.uDpr.value = dpr;
        renderer.render(scene, camera);
      },
      dispose() {
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      },
    };
  } catch {
    renderer.dispose();
    return null;
  }
}
