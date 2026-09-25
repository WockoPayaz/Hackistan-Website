import {
  CanvasTexture, DoubleSide, EdgesGeometry, ExtrudeGeometry, Group, LinearFilter,
  LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, OrthographicCamera,
  PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace,
  Vector2, Vector3, WebGLRenderer,
} from "three";
import { markGeometry } from "@/components/brand/geometry";
import { extrudeMarkPath } from "@/components/brand/markExtrusion";

export type PrismQuad = [[number, number], [number, number], [number, number], [number, number]];

export type PrismFrame = {
  quad: PrismQuad;
  takeover: number;
  markOpacity: number;
  yaw: number;
  markSize: number;
  rail: number;
  panel: number;
  warp: number;
  chromatic: number;
  rainbow: number;
};

export type PrismSurface = {
  projectLeftWall: (markSize: number, yaw: number) => PrismQuad;
  render: (frame: PrismFrame) => void;
  dispose: () => void;
};

const extrusionDepth = 26;
const cameraFov = 32;

const vertexShader = `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = `
precision highp float;
uniform sampler2D uBackdrop;
uniform vec2 uResolution;
uniform vec2 uA;
uniform vec2 uB;
uniform vec2 uC;
uniform vec2 uD;
uniform float uTakeover;
uniform float uRail;
uniform float uPanel;
uniform float uWarp;
uniform float uChromatic;
uniform float uRainbow;
uniform float uDpr;

void main() {
  vec2 point = gl_FragCoord.xy;
  float direction = sign((uB.x-uA.x)*(uD.y-uA.y)-(uB.y-uA.y)*(uD.x-uA.x));
  float top = direction * ((uB.x-uA.x)*(point.y-uA.y)-(uB.y-uA.y)*(point.x-uA.x)) / max(length(uB-uA), 0.001);
  float right = direction * ((uC.x-uB.x)*(point.y-uB.y)-(uC.y-uB.y)*(point.x-uB.x)) / max(length(uC-uB), 0.001);
  float bottom = direction * ((uD.x-uC.x)*(point.y-uC.y)-(uD.y-uC.y)*(point.x-uC.x)) / max(length(uD-uC), 0.001);
  float left = direction * ((uA.x-uD.x)*(point.y-uD.y)-(uA.y-uD.y)*(point.x-uD.x)) / max(length(uA-uD), 0.001);
  float cap = smoothstep(-2.0*uDpr, 2.0*uDpr, min(top, bottom));
  float body = smoothstep(-2.0*uDpr, 2.0*uDpr, min(min(top,right), min(bottom,left)));
  // The measured rail rectangle reaches every corner; the final blend also
  // guarantees opaque coverage despite subpixel clipping at the viewport rim.
  body = mix(body, 1.0, uTakeover);

  vec2 uv = point / uResolution;
  vec2 bend = vec2(
    sin(uv.y * 12.0 + sin(uv.x * 5.5) * 1.6) + 0.42 * sin(uv.y * 24.0 - uv.x * 8.0),
    cos(uv.x * 10.0 + sin(uv.y * 6.5) * 1.5) - 0.38 * cos(uv.x * 21.0 + uv.y * 7.0)
  );
  vec2 warped = clamp(uv + bend * (0.028 * uWarp), 0.002, 0.998);
  vec2 split = vec2(uChromatic, 0.0) * (0.7 + 0.3 * sin(uv.x * 9.0 + uv.y * 6.0));
  vec3 destination = vec3(
    texture2D(uBackdrop, clamp(warped + split, 0.002, 0.998)).r,
    texture2D(uBackdrop, warped).g,
    texture2D(uBackdrop, clamp(warped - split, 0.002, 0.998)).b
  );

  float edgeDistance = min(abs(left), abs(right));
  float core = exp(-pow(edgeDistance / (1.7 * uDpr), 2.0)) * cap;
  float fringe = exp(-pow(edgeDistance / (14.0 * uDpr), 2.0)) * cap;
  vec3 spectral = vec3(
    exp(-pow((edgeDistance - 7.0 * uDpr) / (7.0 * uDpr), 2.0)),
    exp(-pow((edgeDistance + 3.0 * uDpr) / (7.0 * uDpr), 2.0)),
    exp(-pow((edgeDistance + 9.0 * uDpr) / (8.0 * uDpr), 2.0))
  ) * cap;
  vec3 edge = vec3(0.83, 0.88, 0.91) * core + spectral * uRainbow * 0.72 * fringe;
  float alpha = max(body * uPanel, uRail * (core * 0.95 + fringe * uRainbow * 0.22));
  float across = left / max(left + right, 0.001);
  vec3 innerSpectrum = vec3(
    exp(-pow((across - 0.18) / 0.24, 2.0)),
    exp(-pow((across - 0.52) / 0.23, 2.0)),
    exp(-pow((across - 0.82) / 0.24, 2.0))
  );
  vec3 color = mix(destination, innerSpectrum, uRainbow * 0.38) * body * uPanel + edge * uRail;
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
    let shaderFailed = false;
    renderer.debug.onShaderError = () => { shaderFailed = true; };
    const texture = makeBackdrop();
    const uniforms = {
      uBackdrop: { value: texture },
      uResolution: { value: new Vector2(1, 1) },
      uA: { value: new Vector2() }, uB: { value: new Vector2() },
      uC: { value: new Vector2() }, uD: { value: new Vector2() },
      uTakeover: { value: 0 },
      uRail: { value: 0 }, uPanel: { value: 0 },
      uWarp: { value: 0 }, uChromatic: { value: 0 },
      uRainbow: { value: 0 }, uDpr: { value: 1 },
    };
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthTest: false, depthWrite: false });
    const geometry = new PlaneGeometry(2, 2);
    const prismScene = new Scene();
    prismScene.add(new Mesh(geometry, material));
    const prismCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 2);
    prismCamera.position.z = 1;
    const markScene = new Scene();
    const group = new Group();
    group.position.set(-2, 2, 0); // Match the SVG's -8 -8 420 420 viewBox center.
    markScene.add(group);
    const markCamera = new PerspectiveCamera(cameraFov, 1, 1, 5000);
    const faceMaterial = new MeshBasicMaterial({ color: 0x576063, transparent: true, opacity: 0.025, depthWrite: false, side: DoubleSide });
    const wallMaterial = new MeshBasicMaterial({ color: 0x626b6e, transparent: true, opacity: 0.12, depthWrite: false, side: DoubleSide });
    const edgeMaterial = new LineBasicMaterial({ color: 0x62686a, transparent: true, opacity: 0.57, depthWrite: false });
    const markGeometries: ExtrudeGeometry[] = [];
    const edgeGeometries: EdgesGeometry[] = [];
    try {
      for (const path of Object.values(markGeometry)) {
        const part = extrudeMarkPath(path, extrusionDepth, 0);
        markGeometries.push(part);
        group.add(new Mesh(part, [faceMaterial, wallMaterial]));
        const edges = new EdgesGeometry(part, 20);
        edgeGeometries.push(edges);
        group.add(new LineSegments(edges, edgeMaterial));
      }
    } catch {
      markGeometries.forEach((item) => item.dispose());
      edgeGeometries.forEach((item) => item.dispose());
      faceMaterial.dispose(); wallMaterial.dispose(); edgeMaterial.dispose();
      geometry.dispose(); material.dispose(); texture.dispose();
      throw new Error("Transition mark geometry unavailable");
    }
    let previousWidth = 0, previousHeight = 0, previousDpr = 0;

    const configureCamera = (markSize: number, width: number, height: number) => {
      markCamera.aspect = width / height;
      markCamera.position.set(0, 0, height * 420 / (2 * Math.tan(cameraFov * Math.PI / 360) * markSize));
      markCamera.lookAt(0, 0, 0);
      markCamera.updateProjectionMatrix();
      group.updateMatrixWorld(true);
    };
    const project = (point: Vector3, width: number, height: number): [number, number] => {
      const projected = group.localToWorld(point).project(markCamera);
      return [(projected.x + 1) * width / 2, (1 - projected.y) * height / 2];
    };

    return {
      projectLeftWall(markSize, yaw) {
        const width = canvas.clientWidth, height = canvas.clientHeight;
        configureCamera(markSize, width, height);
        group.rotation.y = yaw;
        group.updateMatrixWorld(true);
        // x=0 is the outside of the left pillar in markGeometry. The four
        // actual extrusion corners bound its outer wall (front z+, back z-).
        const x = -200, front = extrusionDepth / 2, back = -front;
        return [
          project(new Vector3(x, 200, back), width, height),
          project(new Vector3(x, 200, front), width, height),
          project(new Vector3(x, -200, front), width, height),
          project(new Vector3(x, -200, back), width, height),
        ];
      },
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
        ([uniforms.uA, uniforms.uB, uniforms.uC, uniforms.uD] as const).forEach((uniform, i) => {
          uniform.value.set(frame.quad[i][0] * dpr, (height - frame.quad[i][1]) * dpr);
        });
        uniforms.uTakeover.value = frame.takeover;
        uniforms.uRail.value = frame.rail;
        uniforms.uPanel.value = frame.panel;
        uniforms.uWarp.value = frame.warp;
        uniforms.uChromatic.value = frame.chromatic;
        uniforms.uRainbow.value = frame.rainbow;
        uniforms.uDpr.value = dpr;
        configureCamera(frame.markSize, width, height);
        group.rotation.y = frame.yaw;
        group.updateMatrixWorld(true);
        faceMaterial.opacity = 0.025 * frame.markOpacity;
        wallMaterial.opacity = 0.12 * frame.markOpacity;
        edgeMaterial.opacity = 0.57 * frame.markOpacity;
        renderer.autoClear = false;
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(prismScene, prismCamera);
        renderer.clearDepth();
        if (frame.markOpacity > 0) renderer.render(markScene, markCamera);
        if (shaderFailed) throw new Error("Transition shader unavailable");
      },
      dispose() {
        markGeometries.forEach((item) => item.dispose());
        edgeGeometries.forEach((item) => item.dispose());
        faceMaterial.dispose(); wallMaterial.dispose(); edgeMaterial.dispose();
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
