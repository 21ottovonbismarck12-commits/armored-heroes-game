import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import '@babylonjs/loaders/glTF';
import { ModularTank, DEFAULT_LOADOUT } from './modularTank';
import { createMaterials } from './materials';

function createRuins(scene, materials) {
  const ruins = [
    [-8, 0.9, -6, 4.4, 1.8, 1.2],
    [8, 1.2, 6, 2.5, 2.4, 2],
    [5, 0.7, -8, 3, 1.4, 1.2],
    [-10, 0.5, 8, 2.2, 1, 2.6],
  ];
  ruins.forEach(([x, y, z, w, h, d], index) => {
    const wall = MeshBuilder.CreateBox(`ruin-${index}`, { width: w, height: h, depth: d }, scene);
    wall.position.set(x, y, z);
    wall.rotation.y = index * 0.42;
    wall.material = materials.ruins;
    const gap = MeshBuilder.CreateBox(`ruin-gap-${index}`, { width: w * 0.42, height: h * 0.55, depth: d * 1.08 }, scene);
    gap.position.set(x + (index % 2 ? 0.35 : -0.35), y + h * 0.14, z);
    gap.rotation.y = wall.rotation.y;
    gap.material = materials.mud;
  });
}

function createArena(scene, materials) {
  const ground = MeshBuilder.CreateGround('muddy battlefield', { width: 42, height: 34, subdivisions: 20 }, scene);
  ground.material = materials.mud;
  const grass = MeshBuilder.CreateGround('grass edge', { width: 62, height: 52, subdivisions: 12 }, scene);
  grass.position.y = -0.06;
  grass.material = materials.grass;
  createRuins(scene, materials);

  for (let i = 0; i < 24; i += 1) {
    const crater = MeshBuilder.CreateCylinder(`crater-${i}`, { diameter: 0.3 + (i % 4) * 0.13, height: 0.03, tessellation: 12 }, scene);
    crater.position.set(((i * 17) % 30) - 15, 0.02, ((i * 11) % 22) - 11);
    crater.material = materials.rubber;
  }
}

function createMuzzleFlash(scene, materials, tank) {
  const flash = MeshBuilder.CreateSphere('muzzle flash', { diameter: 0.5, segments: 8 }, scene);
  flash.parent = tank.gunPivot;
  flash.position.x = 2.2;
  flash.material = materials.fire;
  flash.isVisible = false;
  return flash;
}

async function loadImportedTank(scene, fileName, position, rotationY, displayHeight = 1.8) {
  const imported = await SceneLoader.ImportMeshAsync('', '/assets/tanks/', fileName, scene);
  const root = new TransformNode(`${fileName}-display-root`, scene);
  imported.meshes.forEach((mesh) => {
    if (mesh !== root) mesh.parent = root;
  });
  const bounds = root.getHierarchyBoundingVectors(true);
  const height = Math.max(0.001, bounds.max.y - bounds.min.y);
  const factor = displayHeight / height;
  root.scaling.setAll(factor);
  root.position.set(position.x, position.y - bounds.min.y * factor, position.z);
  root.rotation.y = rotationY;
  return root;
}

export async function createGameScene(engine, canvas, options = {}) {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.035, 0.045, 0.04, 0.18);
  const materials = createMaterials(scene);
  const camera = new ArcRotateCamera('third-person camera', -Math.PI / 2, 1.05, 13, new Vector3(0, 0.8, 0), scene);
  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 22;
  camera.wheelPrecision = 45;
  camera.attachControl(canvas, true);
  const hemi = new HemisphericLight('soft sky', new Vector3(0, 1, 0), scene);
  hemi.intensity = 0.65;
  hemi.diffuse = Color3.FromHexString('#c7d0b1');
  const sun = new DirectionalLight('low war sun', new Vector3(-0.6, -1, 0.4), scene);
  sun.position = new Vector3(12, 18, -10);
  sun.intensity = 1.4;

  createArena(scene, materials);
  const tank = new ModularTank(scene, materials, options.loadout || DEFAULT_LOADOUT);
  tank.root.position.y = 0;
  const muzzleFlash = createMuzzleFlash(scene, materials, tank);
  const importedTanks = await Promise.all([
    loadImportedTank(scene, 'a34-comet.glb', new Vector3(-6, 0, -5), Math.PI * 0.18, 1.9),
    loadImportedTank(scene, 'm4a2-sherman.glb', new Vector3(6, 0, -6), -Math.PI * 0.22, 1.85),
  ]);
  const input = { forward: false, backward: false, left: false, right: false, turretLeft: false, turretRight: false };
  const onKey = (event) => {
    const down = event.type === 'keydown';
    if (event.code === 'KeyW' || event.code === 'ArrowUp') input.forward = down;
    if (event.code === 'KeyS' || event.code === 'ArrowDown') input.backward = down;
    if (event.code === 'KeyA') input.left = down;
    if (event.code === 'KeyD') input.right = down;
    if (event.code === 'ArrowLeft') input.turretLeft = down;
    if (event.code === 'ArrowRight') input.turretRight = down;
    if (down && event.code === 'Space' && tank.fire()) muzzleFlash.isVisible = true;
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);

  scene.onBeforeRenderObservable.add(() => {
    const delta = Math.min(0.05, engine.getDeltaTime() / 1000);
    tank.update(input, delta);
    camera.target = Vector3.Lerp(camera.target, tank.root.position.add(new Vector3(0, 0.9, 0)), 0.08);
    muzzleFlash.isVisible = tank.flash > 0;
  });

  return {
    scene,
    tank,
    camera,
    importedTanks,
    setLoadout(loadout) { tank.setLoadout(loadout); },
    dispose() {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      tank.dispose();
      importedTanks.forEach((model) => model.dispose(false, true));
      scene.dispose();
    },
  };
}
