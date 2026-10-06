import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export function createMaterials(scene) {
  const material = (name, color, roughness = 0.75, metallic = 0.05) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(color);
    m.specularColor = new Color3(0.16, 0.16, 0.14);
    m.specularPower = Math.max(8, 64 * (1 - roughness));
    m.metallic = metallic;
    return m;
  };

  return {
    mud: material('Wet battlefield mud', '#34251c', 0.95),
    grass: material('Muddy grass', '#35462b', 0.9),
    ruins: material('Damaged masonry', '#5c5142', 0.92),
    steel: material('Worn olive steel', '#4d5737', 0.72, 0.18),
    steelDark: material('Track steel', '#20251c', 0.82, 0.22),
    steelLight: material('Gun metal', '#6f7358', 0.58, 0.32),
    rubber: material('Track rubber', '#11130f', 0.98),
    glass: material('Optic glass', '#6da7a6', 0.2, 0.1),
    fire: material('Muzzle fire', '#ff9b32', 0.35),
    smoke: material('Smoke', '#6e6b5d', 1),
    accent: material('Garage accent', '#c89a43', 0.5, 0.16),
  };
}
