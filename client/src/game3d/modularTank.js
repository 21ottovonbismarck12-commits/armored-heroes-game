import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export const PARTS = {
  hull: {
    panzer3: { label: 'Chasis Panzer III', armor: 78, hp: 900, scale: [2.8, 0.72, 1.45] },
    t34: { label: 'Chasis T-34/85', armor: 88, hp: 980, scale: [3.05, 0.78, 1.55] },
    is2: { label: 'Chasis IS-2', armor: 125, hp: 1320, scale: [3.35, 0.95, 1.7] },
  },
  tracks: {
    bt5: { label: 'Orugas BT-5', speed: 6.8, scale: [1.06, 1, 1.08] },
    panzer4: { label: 'Orugas Panzer IV', speed: 5.7, scale: [1.16, 1.05, 1.12] },
    t34: { label: 'Orugas T-34/85', speed: 6.25, scale: [1.12, 1.04, 1.14] },
  },
  turret: {
    panzer4: { label: 'Torreta Panzer IV', armor: 38, reload: 1.1, scale: [1.05, 0.72, 1.05] },
    t34: { label: 'Torreta T-34/85', armor: 55, reload: 0.95, scale: [1.1, 0.78, 1.1] },
    stug: { label: 'Casamata StuG III', armor: 68, reload: 1.2, scale: [1.18, 0.8, 1.06] },
  },
  gun: {
    stuart37: { label: 'Cañón M3 37 mm', damage: 42, penetration: 48, length: 2.45, radius: 0.12 },
    panzer50: { label: 'Cañón KwK 38 50 mm', damage: 58, penetration: 66, length: 2.9, radius: 0.14 },
    is2_122: { label: 'Cañón D-25T 122 mm', damage: 112, penetration: 132, length: 3.2, radius: 0.22 },
  },
};

export const DEFAULT_LOADOUT = { hull: 't34', tracks: 't34', turret: 't34', gun: 'panzer50' };

export function calculateStats(loadout) {
  const hull = PARTS.hull[loadout.hull];
  const tracks = PARTS.tracks[loadout.tracks];
  const turret = PARTS.turret[loadout.turret];
  const gun = PARTS.gun[loadout.gun];
  return {
    hp: hull.hp,
    armor: hull.armor + turret.armor,
    speed: tracks.speed,
    damage: gun.damage,
    penetration: gun.penetration,
    reload: turret.reload,
  };
}

function box(name, options, material, parent) {
  const mesh = MeshBuilder.CreateBox(name, options, parent.getScene());
  mesh.parent = parent;
  mesh.material = material;
  return mesh;
}

export class ModularTank {
  constructor(scene, materials, loadout = DEFAULT_LOADOUT) {
    this.scene = scene;
    this.materials = materials;
    this.root = new TransformNode('modularTankRoot', scene);
    this.turretPivot = new TransformNode('turretPivot', scene);
    this.turretPivot.parent = this.root;
    this.gunPivot = new TransformNode('gunPivot', scene);
    this.gunPivot.parent = this.turretPivot;
    this.parts = {};
    this.loadout = { ...loadout };
    this.position = this.root.position;
    this.speed = 0;
    this.turretAngle = 0;
    this.recoil = 0;
    this.flash = 0;
    this.rebuild();
  }

  clearPart(name) {
    this.parts[name]?.dispose();
    delete this.parts[name];
  }

  rebuild() {
    ['hull', 'tracks', 'turret', 'gun'].forEach((part) => this.clearPart(part));
    const hull = PARTS.hull[this.loadout.hull];
    const tracks = PARTS.tracks[this.loadout.tracks];
    const turret = PARTS.turret[this.loadout.turret];
    const gun = PARTS.gun[this.loadout.gun];

    const trackL = box('leftTrack', { width: 0.42, height: 0.62, depth: 2.25 }, this.materials.rubber, this.root);
    trackL.position = new Vector3(-hull.scale[0] * 0.34, 0.36, 0);
    trackL.scaling.copyFromFloats(tracks.scale[0], tracks.scale[1], tracks.scale[2]);
    const trackR = trackL.clone('rightTrack');
    trackR.position.x = hull.scale[0] * 0.34;
    this.parts.tracks = trackL;

    const hullMesh = box('hull', { width: hull.scale[0], height: hull.scale[1], depth: hull.scale[2] }, this.materials.steel, this.root);
    hullMesh.position.y = 0.77;
    this.parts.hull = hullMesh;

    const glacis = box('glacis', { width: hull.scale[0] * 0.82, height: hull.scale[1] * 0.45, depth: hull.scale[2] * 0.9 }, this.materials.steelLight, this.root);
    glacis.position = new Vector3(-0.28, 1.18, 0);

    this.turretPivot.position = new Vector3(0.15, 1.4, 0);
    const turretMesh = box('turret', { width: 1.35, height: 0.64, depth: 1.25 }, this.materials.steel, this.turretPivot);
    turretMesh.scaling.copyFromFloats(turret.scale[0], turret.scale[1], turret.scale[2]);
    this.parts.turret = turretMesh;

    this.gunPivot.position = new Vector3(0.68, 0.05, 0);
    const gunMesh = box('gun', { width: gun.length, height: gun.radius, depth: gun.radius }, this.materials.steelLight, this.gunPivot);
    gunMesh.position.x = gun.length / 2;
    this.parts.gun = gunMesh;

    const mantlet = box('mantlet', { width: 0.28, height: 0.38, depth: 0.72 }, this.materials.steelDark, this.gunPivot);
    mantlet.position.x = 0.12;
    this.stats = calculateStats(this.loadout);
  }

  setLoadout(nextLoadout) {
    this.loadout = { ...this.loadout, ...nextLoadout };
    this.rebuild();
  }

  update(input, delta) {
    const forward = (input.forward ? 1 : 0) - (input.backward ? 1 : 0);
    const turn = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    this.root.rotation.y += turn * delta * 0.8;
    this.root.translate(new Vector3(0, 0, forward * this.stats.speed * delta), 1);
    this.turretAngle += ((input.turretRight ? 1 : 0) - (input.turretLeft ? 1 : 0)) * delta * 1.2;
    this.turretPivot.rotation.y = this.turretAngle;
    this.recoil = Math.max(0, this.recoil - delta * 4);
    this.gunPivot.position.x = 0.68 - this.recoil * 0.18;
    this.flash = Math.max(0, this.flash - delta * 5);
  }

  fire() {
    if (this.recoil > 0.05) return false;
    this.recoil = 1;
    this.flash = 1;
    return true;
  }

  dispose() { this.root.dispose(); }
}
