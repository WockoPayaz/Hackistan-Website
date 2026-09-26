import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { ShelfItem } from "@/data/shelfItems";
import { makeCoverTexture, makePageTexture, makeSpineTexture } from "./shelfTextures";

export type BookRig = {
  item: ShelfItem;
  root: THREE.Group;
  frontPivot: THREE.Group;
  hit: THREE.Mesh;
  fadeMaterials: THREE.Material[];
  dispose: () => void;
};

/** One cloth-bound volume, a real hinged front board, and one fixed spread. */
export async function createBookRig(item: ShelfItem, index: number): Promise<BookRig> {
  const root = new THREE.Group();
  root.name = `book-${item.id}`;
  const width = item.width, height = item.height, depth = item.depth;
  const board = 0.034;
  const coverTexture = await makeCoverTexture(item);
  const spineTexture = makeSpineTexture(item);
  const leftTexture = makePageTexture(item, "left");
  const rightTexture = makePageTexture(item, "right");
  const cloth = new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.91, metalness: 0, transparent: true });
  const coverMaterial = new THREE.MeshStandardMaterial({ map: coverTexture, roughness: 0.88, metalness: 0, transparent: true });
  const spineMaterial = new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.91, metalness: 0, transparent: true, side: THREE.DoubleSide });
  const paper = new THREE.MeshStandardMaterial({ color: 0xece7dc, roughness: 0.97 });
  const leftMaterial = new THREE.MeshStandardMaterial({ map: leftTexture, roughness: 0.96, side: THREE.DoubleSide });
  const rightMaterial = new THREE.MeshStandardMaterial({ map: rightTexture, roughness: 0.96, side: THREE.DoubleSide });

  const pageBlock = new THREE.Mesh(new RoundedBoxGeometry(width - 0.07, height - 0.07, depth - 0.025, 2, 0.008), paper);
  pageBlock.position.x = 0.014;
  root.add(pageBlock);
  const back = new THREE.Mesh(new RoundedBoxGeometry(width, height, board, 2, 0.007), cloth);
  back.position.z = -depth / 2 - board / 2;
  root.add(back);
  const frontPivot = new THREE.Group();
  frontPivot.position.set(-width / 2, 0, depth / 2 + board / 2);
  root.add(frontPivot);
  const front = new THREE.Mesh(new RoundedBoxGeometry(width, height, board, 2, 0.007), cloth);
  front.position.x = width / 2;
  frontPivot.add(front);
  const cover = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.965, height * 0.965), coverMaterial);
  cover.position.set(width / 2, 0, board / 2 + 0.002);
  frontPivot.add(cover);
  const leftPage = new THREE.Mesh(new THREE.PlaneGeometry((width - 0.09) * 0.98, height - 0.11), leftMaterial);
  leftPage.position.set(width / 2, 0, -board / 2 - 0.002);
  leftPage.rotation.y = Math.PI;
  frontPivot.add(leftPage);
  const rightPage = new THREE.Mesh(new THREE.PlaneGeometry(width - 0.11, height - 0.11), rightMaterial);
  rightPage.position.set(0.014, 0, (depth - 0.025) / 2 + 0.006);
  root.add(rightPage);
  const spine = new THREE.Mesh(new RoundedBoxGeometry(0.055, height, depth + board, 2, 0.006), spineMaterial);
  spine.position.x = -width / 2 - 0.014;
  root.add(spine);
  const hit = new THREE.Mesh(new THREE.BoxGeometry(width * 1.05, height * 1.05, depth + 0.2), new THREE.MeshBasicMaterial({ visible: false }));
  hit.position.z = 0.05;
  hit.userData.index = index;
  root.add(hit);

  const materials = [cloth, coverMaterial, spineMaterial, paper, leftMaterial, rightMaterial];
  const textures = [coverTexture, spineTexture, leftTexture, rightTexture];
  return {
    item, root, frontPivot, hit,
    fadeMaterials: [cloth, coverMaterial, spineMaterial],
    dispose() {
      root.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          if (node === hit) (node.material as THREE.Material).dispose();
        }
      });
      materials.forEach((material) => material.dispose());
      textures.forEach((value) => value.dispose());
    },
  };
}
