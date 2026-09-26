import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";
import type { ShelfItem } from "@/data/shelfItems";

const makeCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Book texture canvas unavailable");
  return { canvas, context };
};

const texture = (canvas: HTMLCanvasElement) => {
  const result = new CanvasTexture(canvas);
  result.colorSpace = SRGBColorSpace;
  result.minFilter = LinearFilter;
  result.magFilter = LinearFilter;
  result.generateMipmaps = false;
  return result;
};

const label = (item: ShelfItem) => item.kind === "ysws" ? "HACK CLUB / YSWS" : "HACKISTAN / WORKSHOP";

function wrap(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width <= maxWidth || !line) line = next;
    else { lines.push(line); line = word; }
    if (lines.length === maxLines - 1) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
}

function loadImage(path: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = path;
  });
}

/** A supplied cover is composited under the item's own editorial title. */
export async function makeCoverTexture(item: ShelfItem) {
  const { canvas, context } = makeCanvas(512, 768);
  context.fillStyle = item.color;
  context.fillRect(0, 0, 512, 768);
  const image = item.coverImage ? await loadImage(item.coverImage) : null;
  if (image) {
    const scale = Math.max(512 / image.width, 768 / image.height);
    const width = image.width * scale, height = image.height * scale;
    context.drawImage(image, (512 - width) / 2, (768 - height) / 2, width, height);
    const shade = context.createLinearGradient(0, 0, 0, 768);
    shade.addColorStop(0, "rgba(7,10,12,.48)");
    shade.addColorStop(0.45, "rgba(7,10,12,.12)");
    shade.addColorStop(1, "rgba(7,10,12,.82)");
    context.fillStyle = shade;
    context.fillRect(0, 0, 512, 768);
  } else {
    context.strokeStyle = "rgba(242,240,234,.17)";
    context.lineWidth = 1;
    for (let x = 36; x < 512; x += 44) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 768); context.stroke();
    }
  }
  context.strokeStyle = item.foil;
  context.globalAlpha = 0.67;
  context.lineWidth = 2;
  context.strokeRect(25, 25, 462, 718);
  context.globalAlpha = 1;
  context.fillStyle = item.foil;
  context.font = "600 17px Geist, Arial, sans-serif";
  context.fillText(label(item), 42, 62);
  context.font = "500 51px Geist, Arial, sans-serif";
  wrap(context, item.title.toUpperCase(), 42, 540, 428, 57, 4);
  context.font = "600 17px Geist, Arial, sans-serif";
  context.fillText(item.dateLabel.toUpperCase(), 42, 713);
  if (item.logoImage) {
    const logo = await loadImage(item.logoImage);
    if (logo) context.drawImage(logo, 376, 85, 82, 82);
  }
  return texture(canvas);
}

export function makeSpineTexture(item: ShelfItem) {
  const { canvas, context } = makeCanvas(160, 640);
  context.fillStyle = item.color;
  context.fillRect(0, 0, 160, 640);
  const shade = context.createLinearGradient(0, 0, 160, 0);
  shade.addColorStop(0, "rgba(0,0,0,.24)");
  shade.addColorStop(0.35, "rgba(255,255,255,.08)");
  shade.addColorStop(1, "rgba(0,0,0,.2)");
  context.fillStyle = shade;
  context.fillRect(0, 0, 160, 640);
  context.save();
  context.translate(80, 320);
  context.rotate(Math.PI / 2);
  context.fillStyle = item.foil;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "500 29px Geist, Arial, sans-serif";
  context.fillText(`${item.title.toUpperCase()}  /  ${item.kind.toUpperCase()}`, 0, 0, 570);
  context.restore();
  return texture(canvas);
}

export function makePageTexture(item: ShelfItem, side: "left" | "right") {
  const { canvas, context } = makeCanvas(512, 768);
  context.fillStyle = "#f2f0ea";
  context.fillRect(0, 0, 512, 768);
  context.fillStyle = "#151718";
  context.font = "600 17px Geist, Arial, sans-serif";
  context.fillText(label(item), 34, 70);
  if (side === "left") {
    context.font = "500 48px Geist, Arial, sans-serif";
    wrap(context, item.title.toUpperCase(), 34, 180, 445, 56, 5);
    context.font = "600 18px Geist, Arial, sans-serif";
    context.fillText(item.status.toUpperCase(), 34, 643);
    context.fillText(item.dateLabel.toUpperCase(), 34, 690);
  } else {
    context.font = "400 29px Geist, Arial, sans-serif";
    wrap(context, item.shortDescription, 34, 166, 440, 41, 9);
    context.font = "600 18px Geist, Arial, sans-serif";
    context.fillText(item.href ? (item.kind === "ysws" ? "EXPLORE PROGRAM ↗" : "VIEW DETAILS ↗") : "DETAILS COMING SOON", 34, 690);
  }
  return texture(canvas);
}
