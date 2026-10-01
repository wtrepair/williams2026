import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ORANGE = "#f36a27";
const WILLIAMS_BLUE = "#3c8bca";
const SEASONS = {
  spring: {
    grass: "#8fad72",
    grassLight: "#afc788",
    grassDark: "#718f60",
    evergreen: "#305b43",
    evergreenLight: "#528252",
    gravel: "#bfb7a1",
    roof: WILLIAMS_BLUE,
    water: "#339eae",
    sun: "#fff5dd",
    foliage: "#94b65c",
    foliageLight: "#c1cd7a",
    foliageWarm: "#78a850",
    snow: 0,
    growth: 1,
    crown: 0.86,
    leafFall: 0,
  },
  summer: {
    grass: "#7e936e",
    grassLight: "#98aa83",
    grassDark: "#627d61",
    evergreen: "#254e42",
    evergreenLight: "#3d6750",
    gravel: "#c0b6a0",
    roof: WILLIAMS_BLUE,
    water: "#1e8eae",
    sun: "#fff0cd",
    foliage: "#658949",
    foliageLight: "#8caa5b",
    foliageWarm: "#4e783e",
    snow: 0,
    growth: 0.32,
    crown: 1,
    leafFall: 0,
  },
  fall: {
    grass: "#969063",
    grassLight: "#b4aa77",
    grassDark: "#777958",
    evergreen: "#365343",
    evergreenLight: "#546b49",
    gravel: "#c5b59a",
    roof: WILLIAMS_BLUE,
    water: "#387f94",
    sun: "#ffe0b3",
    foliage: "#c99539",
    foliageLight: "#e3b54e",
    foliageWarm: "#b96635",
    snow: 0,
    growth: 0,
    crown: 0.96,
    leafFall: 1,
  },
  winter: {
    grass: "#e9eff0",
    grassLight: "#f8fbfb",
    grassDark: "#cedddd",
    evergreen: "#658a83",
    evergreenLight: "#87a6a0",
    gravel: "#d4dfdc",
    roof: "#e3e9e6",
    water: "#81b8c8",
    sun: "#e9f4ff",
    foliage: "#c99539",
    foliageLight: "#e3b54e",
    foliageWarm: "#b96635",
    snow: 1,
    growth: 0,
    crown: 0,
    leafFall: 0,
  },
};

const normalizeSeason = (season) =>
  Object.hasOwn(SEASONS, season) ? season : "summer";

// A small, locally generated piece of the North. No images or model downloads.
export default function Landscape({ season = "summer", className = "" }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [rendererStatus, setRendererStatus] = useState("pending");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    let disposed = false;
    let frame = 0;
    let visible = true;
    let contextLost = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6.6, 6.6, 5.8, -5.8, 0.1, 70);
    camera.position.set(12, 10, 14);
    camera.lookAt(0, 0.2, 0);
    const island = new THREE.Group();
    scene.add(island);
    const materials = [];
    const seasonalColors = [];
    const snowyMeshes = [];
    const deciduousCrowns = [];
    const springPlants = [];
    const autumnLeaves = [];
    const pointer = new THREE.Vector2();
    const currentPointer = new THREE.Vector2();
    const waterLines = [];

    const material = (color, options = {}) => {
      const value = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.84,
        flatShading: true,
        ...options,
      });
      materials.push(value);
      return value;
    };
    const seasonalMaterial = (key, options = {}) => {
      const value = material(SEASONS.summer[key], options);
      seasonalColors.push({ color: value.color, key });
      return value;
    };
    const mesh = (geometry, mat, position = [0, 0, 0], parent = island) => {
      const object = new THREE.Mesh(geometry, mat);
      object.position.set(...position);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    };
    const box = (size, mat, position, parent) =>
      mesh(new THREE.BoxGeometry(...size), mat, position, parent);
    const cylinder = (top, bottom, height, mat, position, sides = 12, parent) =>
      mesh(
        new THREE.CylinderGeometry(top, bottom, height, sides),
        mat,
        position,
        parent,
      );
    const beam = (start, end, radius, mat, parent = island) => {
      const a = new THREE.Vector3(...start);
      const b = new THREE.Vector3(...end);
      const object = cylinder(
        radius,
        radius,
        a.distanceTo(b),
        mat,
        a.clone().add(b).multiplyScalar(0.5).toArray(),
        8,
        parent,
      );
      object.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        b.sub(a).normalize(),
      );
      return object;
    };
    const polygon = (points, bottom, height, mat, parent = island) => {
      const shape = new THREE.Shape();
      points.forEach(([x, z], i) =>
        i ? shape.lineTo(x, -z) : shape.moveTo(x, -z),
      );
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
        steps: 1,
        curveSegments: 1,
      });
      geometry.rotateX(-Math.PI / 2);
      return mesh(geometry, mat, [0, bottom, 0], parent);
    };

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.28;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.cssText =
        "display:block;width:100%;height:100%;pointer-events:none";
      mount.appendChild(renderer.domElement);
    } catch {
      renderer?.dispose();
      setRendererStatus("fallback");
      return undefined;
    }

    const grass = seasonalMaterial("grass");
    const grassLight = seasonalMaterial("grassLight");
    const grassDark = seasonalMaterial("grassDark");
    const evergreen = seasonalMaterial("evergreen");
    const evergreenLight = seasonalMaterial("evergreenLight");
    const snow = material("#f7faf7");
    const snowCaps = material("#f7faf7", { transparent: true, opacity: 0 });
    const foliage = seasonalMaterial("foliage");
    const foliageLight = seasonalMaterial("foliageLight");
    const foliageWarm = seasonalMaterial("foliageWarm");
    const bark = material("#635647");
    const rock = material("#99a099");
    const rockDark = material("#747d79");
    const white = material("#ede9df");
    const trim = material("#faf8ec");
    const orange = material(ORANGE);
    const brandBlue = material(WILLIAMS_BLUE);
    const roofMat = seasonalMaterial("roof", {
      metalness: 0.08,
    });
    const roofEdge = material("#295777");
    const dark = material("#172b31");
    const windowMat = material("#254e5a", { metalness: 0.25, roughness: 0.3 });
    const windowGlow = material("#dfb477", {
      emissive: "#aa7131",
      emissiveIntensity: 0.15,
    });
    const metal = material("#9faeab", { metalness: 0.45, roughness: 0.44 });
    const pipeMat = material("#4cbdd2", {
      emissive: "#1789a4",
      emissiveIntensity: 0.25,
      metalness: 0.12,
    });
    const gravel = seasonalMaterial("gravel");
    const waterMat = seasonalMaterial("water", {
      metalness: 0.3,
      roughness: 0.26,
      transparent: true,
      opacity: 0.94,
    });
    const rippleMat = material("#8fd8da", {
      transparent: true,
      opacity: 0.53,
      roughness: 0.3,
    });

    scene.add(new THREE.HemisphereLight("#d9efff", "#655444", 2.4));
    const sun = new THREE.DirectionalLight("#fff0cd", 3.3);
    seasonalColors.push({ color: sun.color, key: "sun" });
    sun.position.set(-5, 11, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -9,
      right: 9,
      top: 9,
      bottom: -9,
      near: 0.5,
      far: 35,
    });
    sun.shadow.normalBias = 0.035;
    sun.shadow.bias = -0.0003;
    scene.add(sun);
    const rim = new THREE.DirectionalLight("#8ccada", 1.7);
    rim.position.set(6, 4, -6);
    scene.add(rim);

    // Several strata make the well's water connection visible beneath the land.
    const boundary = [
      [-4.7, -2.2],
      [-3.75, -3.1],
      [2.6, -3.1],
      [4.55, -1.7],
      [4.5, 1.6],
      [3.25, 2.85],
      [-3.25, 2.85],
      [-4.7, 1.5],
    ];
    const scaled = (amount) =>
      boundary.map(([x, z]) => [x * amount, z * amount]);
    polygon(scaled(0.96), -1.9, 0.24, material("#344b50"));
    polygon(scaled(0.98), -1.66, 0.36, material("#4f7271"));
    polygon(
      scaled(0.99),
      -1.3,
      0.15,
      material("#4597a1", { emissive: "#19616c", emissiveIntensity: 0.15 }),
    );
    polygon(boundary, -1.15, 0.5, material("#94755a"));
    polygon(boundary, -0.65, 0.42, material("#ad9370"));
    polygon(boundary, -0.23, 0.23, material("#665c45"));
    polygon(scaled(1.004), 0, 0.075, grass);

    // Gentle patches break up the silhouette without turning it into a board.
    polygon(
      [
        [-4.55, -1.5],
        [-3.3, -2.7],
        [-1.8, -2.7],
        [-2.35, -1.4],
        [-3.8, -0.35],
      ],
      0.077,
      0.009,
      grassDark,
    );
    polygon(
      [
        [-0.5, 0.25],
        [1.4, -0.15],
        [2, 1.1],
        [1.0, 2.5],
        [-0.6, 2.5],
        [-1.2, 1.55],
      ],
      0.078,
      0.01,
      grassLight,
    );
    polygon(
      [
        [-3.15, 0.12],
        [-1.65, 0.12],
        [-1.35, 1.4],
        [-1.55, 2.82],
        [-3.3, 2.82],
        [-3.4, 1.4],
      ],
      0.086,
      0.025,
      gravel,
    );
    // Driveway stones are deterministic so hydration and repeat visits agree.
    for (let i = 0; i < 24; i += 1) {
      const x = -3.12 + ((i * 13) % 19) / 14;
      const z = 0.7 + ((i * 7) % 23) / 12;
      const pebble = mesh(
        new THREE.DodecahedronGeometry(0.035 + (i % 3) * 0.007),
        i % 2 ? rock : rockDark,
        [x, 0.125, z],
      );
      pebble.scale.y = 0.35;
    }

    // An irregular northern lake, edged with small granite boulders.
    const lakePoints = [
      [0.75, -2.62],
      [2.28, -2.75],
      [3.75, -1.8],
      [4.03, -0.62],
      [3.6, -0.13],
      [2.88, -0.23],
      [2.05, -0.98],
      [1.06, -1.2],
      [0.56, -1.88],
    ];
    polygon(
      lakePoints.map(([x, z]) => [
        2.3 + (x - 2.3) * 1.055,
        -1.5 + (z + 1.5) * 1.1,
      ]),
      0.082,
      0.028,
      rockDark,
    );
    polygon(lakePoints, 0.111, 0.02, waterMat);
    for (let i = 0; i < 7; i += 1) {
      const line = box([0.24 + (i % 3) * 0.14, 0.006, 0.025], rippleMat, [
        1.45 + (i % 3) * 0.74,
        0.136,
        -2.25 + Math.floor(i / 3) * 0.5,
      ]);
      waterLines.push({ line, origin: line.position.x, phase: i * 1.4 });
    }
    lakePoints.forEach(([x, z], i) => {
      if (i % 2 === 0) {
        const stone = mesh(
          new THREE.DodecahedronGeometry(0.17 + (i % 3) * 0.045),
          rock,
          [x, 0.16, z],
        );
        stone.scale.set(1.5, 0.63, 1);
        stone.rotation.set(i, i * 0.4, 0.2);
      }
    });

    // Clapboard house with a metal roof, porch, window trim and a warm entry.
    const house = new THREE.Group();
    house.position.set(-1.95, 0.1, -0.93);
    island.add(house);
    box([2.3, 0.2, 1.8], rockDark, [0, 0.1, 0], house);
    box([2.18, 1.45, 1.65], white, [0, 0.9, 0], house);
    for (let i = 0; i < 10; i += 1) {
      box([2.2, 0.015, 1.67], trim, [0, 0.24 + i * 0.145, 0], house);
    }
    const roofGeometry = new THREE.BufferGeometry();
    const roofVertices = [
      -1.29, 1.64, -1.02, 1.29, 1.64, -1.02, 1.29, 2.4, 0, -1.29, 1.64, -1.02,
      1.29, 2.4, 0, -1.29, 2.4, 0, -1.29, 2.4, 0, 1.29, 2.4, 0, 1.29, 1.64,
      1.02, -1.29, 2.4, 0, 1.29, 1.64, 1.02, -1.29, 1.64, 1.02,
    ];
    roofGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(roofVertices, 3),
    );
    roofGeometry.computeVertexNormals();
    roofMat.side = THREE.DoubleSide;
    mesh(roofGeometry, roofMat, [0, 0, 0], house);
    for (const x of [-1.095, 1.095]) {
      const gable = new THREE.BufferGeometry();
      gable.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          [x, 1.62, -0.83, x, 2.25, 0, x, 1.62, 0.83],
          3,
        ),
      );
      gable.computeVertexNormals();
      const mat = material("#e5e0d3", { side: THREE.DoubleSide });
      mesh(gable, mat, [0, 0, 0], house);
      beam([x * 1.16, 1.65, -1.03], [x * 1.16, 2.42, 0], 0.035, trim, house);
      beam([x * 1.16, 2.42, 0], [x * 1.16, 1.65, 1.03], 0.035, trim, house);
    }
    for (let i = 0; i < 9; i += 1) {
      const x = -1.16 + i * 0.29;
      beam([x, 1.66, 1.025], [x, 2.412, 0], 0.012, roofEdge, house);
      beam([x, 2.412, 0], [x, 1.66, -1.025], 0.012, roofEdge, house);
    }
    beam([-1.32, 2.415, 0], [1.32, 2.415, 0], 0.038, roofMat, house);
    box([0.21, 0.72, 0.25], rockDark, [-0.65, 2.3, -0.4], house);
    box([0.29, 0.055, 0.32], dark, [-0.65, 2.68, -0.4], house);
    const frontWindow = (x) => {
      box([0.53, 0.72, 0.06], trim, [x, 1.0, 0.86], house);
      box([0.43, 0.61, 0.073], windowMat, [x, 1.0, 0.87], house);
      box([0.018, 0.61, 0.015], trim, [x, 1.0, 0.914], house);
      box([0.43, 0.018, 0.015], trim, [x, 1.0, 0.914], house);
      box([0.58, 0.04, 0.14], trim, [x, 0.63, 0.88], house);
    };
    frontWindow(-0.66);
    frontWindow(0.67);
    box([0.43, 1.11, 0.065], trim, [0, 0.75, 0.86], house);
    box([0.34, 1.035, 0.08], brandBlue, [0, 0.75, 0.88], house);
    box([0.22, 0.36, 0.012], windowGlow, [0, 1.02, 0.925], house);
    cylinder(
      0.022,
      0.022,
      0.045,
      metal,
      [0.105, 0.62, 0.942],
      8,
      house,
    ).rotation.x = Math.PI / 2;
    box([0.72, 0.14, 0.47], rock, [0, 0.16, 1.025], house);
    box([0.89, 0.08, 0.35], rock, [0, 0.1, 1.32], house);
    box([0.055, 0.61, 0.53], trim, [1.117, 1.02, -0.13], house);
    box([0.062, 0.51, 0.43], windowMat, [1.123, 1.02, -0.13], house);
    box([0.072, 0.51, 0.025], trim, [1.13, 1.02, -0.13], house);
    box([0.072, 0.025, 0.43], trim, [1.13, 1.02, -0.13], house);

    const pine = (x, z, scale, rotation = 0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.08, z);
      tree.scale.setScalar(scale);
      tree.rotation.y = rotation;
      island.add(tree);
      cylinder(0.055, 0.1, 1.2, bark, [0, 0.6, 0], 7, tree);
      [
        [0.64, 1.07, 0.95],
        [0.51, 1.17, 1.5],
        [0.35, 0.95, 2.04],
      ].forEach(([radius, height, y], i) => {
        mesh(
          new THREE.ConeGeometry(radius, height, 7),
          i % 2 ? evergreenLight : evergreen,
          [0, y, 0],
          tree,
        );
        const cap = mesh(
          new THREE.ConeGeometry(radius * 0.91, height * 0.72, 7),
          snowCaps,
          [0, y + height * 0.16, 0],
          tree,
        );
        cap.visible = false;
        snowyMeshes.push(cap);
      });
    };
    pine(-3.9, -1.6, 1.15, 0.4);
    pine(-3.2, -2.55, 0.91, 0.8);
    pine(-0.42, -2.57, 0.99, 0.1);
    pine(4.02, 0.32, 0.72, 0.2);

    // Birch and maple crowns reveal the seasons while the northern pines stay green.
    const birchBark = material("#d9d7c5");
    const deciduous = (x, z, scale, birch = false) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.08, z);
      tree.scale.setScalar(scale);
      island.add(tree);
      const trunk = birch ? birchBark : bark;
      cylinder(0.045, 0.085, 1.63, trunk, [0, 0.815, 0], 7, tree);
      beam([0, 0.9, 0], [-0.36, 1.59, 0.05], 0.028, trunk, tree);
      beam([0, 1.11, 0], [0.36, 1.82, -0.1], 0.027, trunk, tree);
      beam([0.13, 1.36, -0.04], [0.36, 1.5, 0.25], 0.017, trunk, tree);
      beam([-0.23, 1.35, 0.03], [-0.44, 1.49, -0.17], 0.016, trunk, tree);
      if (birch) {
        for (let i = 0; i < 5; i += 1) {
          box(
            [0.061, 0.018, 0.015],
            bark,
            [0.008, 0.23 + i * 0.24, 0.065],
            tree,
          );
        }
      }
      const crown = new THREE.Group();
      crown.position.y = 1.6;
      tree.add(crown);
      [
        [-0.29, -0.04, 0.08, 0.48],
        [0.27, 0.09, -0.02, 0.49],
        [-0.05, 0.39, -0.06, 0.49],
        [0.08, -0.09, 0.3, 0.38],
        [-0.16, 0.13, -0.29, 0.39],
      ].forEach(([cx, cy, cz, radius], i) => {
        const leaf = mesh(
          new THREE.IcosahedronGeometry(radius, 0),
          [foliage, foliageLight, foliageWarm][(i + (birch ? 0 : 1)) % 3],
          [cx, cy, cz],
          crown,
        );
        leaf.rotation.set(i * 0.4, i * 0.8, 0.15);
      });
      deciduousCrowns.push(crown);
    };
    deciduous(0.44, -2.62, 0.88, true);
    deciduous(3.94, 1.2, 0.88);
    deciduous(-4.02, 1.44, 0.61, true);

    // Small patches of new growth emerge in spring, with fewer flowers in summer.
    const flowerStem = material("#568c50");
    const flowerCream = material("#f2e8b5");
    const flowerLavender = material("#bab3d1");
    const petalGeometry = new THREE.IcosahedronGeometry(0.036, 0);
    for (let i = 0; i < 19; i += 1) {
      const plant = new THREE.Group();
      const patch = i < 10 ? [-0.62, 0.62] : [-3.6, 1.68];
      plant.position.set(
        patch[0] + ((i * 7) % 11) * 0.083,
        0.095,
        patch[1] + ((i * 5) % 9) * 0.092,
      );
      island.add(plant);
      const height = 0.11 + (i % 3) * 0.026;
      beam([0, 0, 0], [0, height, 0], 0.009, flowerStem, plant);
      const flower = mesh(
        petalGeometry,
        i % 3 ? flowerCream : flowerLavender,
        [0, height, 0],
        plant,
      );
      flower.scale.set(1.3, 0.6, 1.3);
      springPlants.push(plant);
    }

    // A few leaves drift from the deciduous trees and settle around their trunks.
    const fallenLeaves = new THREE.Group();
    island.add(fallenLeaves);
    const leafGeometry = new THREE.IcosahedronGeometry(0.048, 0);
    for (let i = 0; i < 33; i += 1) {
      const origin = i % 2 ? [-4.02, 1.44] : [3.94, 1.2];
      const angle = i * 2.399;
      const radius = 0.16 + (i % 6) * 0.075;
      const leaf = mesh(
        leafGeometry,
        i % 3 ? foliageLight : foliageWarm,
        [
          origin[0] + Math.cos(angle) * radius,
          0.105,
          origin[1] + Math.sin(angle) * radius,
        ],
        fallenLeaves,
      );
      leaf.scale.set(1.2, 0.13, 0.7);
      leaf.rotation.y = angle;
    }
    const driftingLeaves = new THREE.Group();
    island.add(driftingLeaves);
    for (let i = 0; i < 12; i += 1) {
      const origin = i % 2 ? [3.94, 1.2] : [0.44, -2.62];
      const leaf = mesh(
        leafGeometry,
        i % 3 ? foliageLight : foliageWarm,
        [origin[0], 0.3 + (i % 6) * 0.25, origin[1]],
        driftingLeaves,
      );
      leaf.scale.set(1.2, 0.2, 0.7);
      autumnLeaves.push({ leaf, origin, phase: i * 0.83 });
    }

    // Fence and stacked firewood give the little property a lived-in scale.
    for (let i = 0; i < 5; i += 1) {
      cylinder(0.044, 0.06, 0.63, bark, [-3.74, 0.36, -0.25 + i * 0.41], 6);
    }
    beam([-3.74, 0.52, -0.28], [-3.74, 0.52, 1.42], 0.035, bark);
    beam([-3.74, 0.27, -0.28], [-3.74, 0.27, 1.42], 0.035, bark);
    const logEnd = material("#bd9f6d");
    for (let i = 0; i < 6; i += 1) {
      const log = cylinder(
        0.11,
        0.115,
        0.62,
        bark,
        [-0.35 + (i % 3) * 0.19, 0.21 + Math.floor(i / 3) * 0.19, -0.8],
        8,
      );
      log.rotation.x = Math.PI / 2;
      const end = cylinder(
        0.085,
        0.085,
        0.015,
        logEnd,
        [log.position.x, log.position.y, -0.48],
        8,
      );
      end.rotation.x = Math.PI / 2;
    }

    // The white six-inch well casing continues into the visible aquifer below.
    const wellX = 0.02;
    const wellZ = 1.78;
    cylinder(0.26, 0.3, 0.06, rock, [wellX, 0.12, wellZ], 12);
    cylinder(0.105, 0.115, 0.67, trim, [wellX, 0.44, wellZ]);
    cylinder(0.15, 0.15, 0.085, pipeMat, [wellX, 0.8, wellZ]);
    cylinder(0.105, 0.11, 0.04, metal, [wellX, 0.857, wellZ]);
    // Exposed cutaway route: a slim pipe drops down the front section.
    beam([wellX, 0.19, wellZ], [wellX, 0.19, 2.96], 0.062, pipeMat);
    beam([wellX, 0.19, 2.96], [wellX, -1.37, 2.96], 0.062, pipeMat);
    beam([wellX, -1.37, 2.96], [-1.72, -1.37, 2.96], 0.062, pipeMat);
    cylinder(0.1, 0.09, 0.37, metal, [wellX, -1.42, 2.97]);
    for (let i = 0; i < 4; i += 1) {
      box([0.19, 0.024, 0.016], dark, [wellX, -1.29 - i * 0.075, 3.067]);
    }
    const flowDots = [];
    for (let i = 0; i < 5; i += 1) {
      flowDots.push(
        mesh(new THREE.SphereGeometry(0.029, 6, 6), snow, [
          wellX,
          -1.1 + i * 0.26,
          3.023,
        ]),
      );
    }

    // Compact excavator: rubber tracks, glazed cab, hydraulic arm and bucket.
    const excavator = new THREE.Group();
    excavator.position.set(1.65, 0.13, 0.61);
    excavator.rotation.y = -0.36;
    island.add(excavator);
    for (const z of [-0.37, 0.37]) {
      box([1.26, 0.25, 0.23], dark, [0, 0.16, z], excavator);
      for (let i = 0; i < 8; i += 1) {
        box(
          [0.065, 0.032, 0.247],
          rockDark,
          [-0.55 + i * 0.155, 0.295, z],
          excavator,
        );
        box(
          [0.065, 0.032, 0.247],
          rockDark,
          [-0.55 + i * 0.155, 0.021, z],
          excavator,
        );
      }
      for (const x of [-0.39, 0, 0.39]) {
        const wheel = cylinder(
          0.092,
          0.092,
          0.25,
          rockDark,
          [x, 0.16, z],
          10,
          excavator,
        );
        wheel.rotation.x = Math.PI / 2;
      }
    }
    cylinder(0.27, 0.27, 0.14, metal, [0, 0.36, 0], 12, excavator);
    const upper = new THREE.Group();
    upper.position.y = 0.43;
    excavator.add(upper);
    box([1.17, 0.27, 0.75], orange, [0.05, 0.13, 0], upper);
    box([0.43, 0.34, 0.72], orange, [-0.36, 0.37, 0], upper);
    box([0.45, 0.69, 0.55], windowMat, [0.015, 0.63, -0.11], upper);
    box([0.56, 0.08, 0.65], orange, [0.015, 1.015, -0.11], upper);
    for (const x of [-0.21, 0.235]) {
      for (const z of [-0.395, 0.175]) {
        box([0.038, 0.72, 0.035], dark, [x, 0.64, z], upper);
      }
    }
    box([0.44, 0.035, 0.034], dark, [0.015, 0.64, 0.18], upper);
    box([0.25, 0.04, 0.04], windowGlow, [0.25, 0.42, 0.21], upper);
    cylinder(0.033, 0.033, 0.25, dark, [-0.38, 0.63, -0.2], 7, upper);
    for (let i = 0; i < 4; i += 1) {
      box([0.023, 0.18, 0.012], dark, [-0.51 + i * 0.07, 0.39, 0.37], upper);
    }
    const arm = new THREE.Group();
    arm.position.set(0.38, 0.24, 0.27);
    upper.add(arm);
    const boomStart = [0, 0, 0];
    const boomElbow = [0.48, 1.12, 0];
    const boomEnd = [1.08, 0.64, 0];
    beam(boomStart, boomElbow, 0.115, orange, arm);
    beam(boomElbow, boomEnd, 0.085, orange, arm);
    beam([0.11, 0.07, 0.13], [0.44, 0.87, 0.13], 0.047, dark, arm);
    beam([0.3, 0.56, 0.13], [0.5, 1.1, 0.13], 0.025, metal, arm);
    beam([0.55, 1.12, 0.1], [1.03, 0.76, 0.1], 0.025, metal, arm);
    [boomStart, boomElbow, boomEnd].forEach((point) => {
      const pin = cylinder(0.07, 0.07, 0.27, metal, point, 8, arm);
      pin.rotation.x = Math.PI / 2;
    });
    const bucket = box([0.35, 0.28, 0.43], dark, [1.19, 0.46, 0], arm);
    bucket.rotation.z = -0.38;
    for (const z of [-0.15, 0, 0.15]) {
      box([0.15, 0.055, 0.055], metal, [1.35, 0.35, z], arm);
    }
    const dirt = material("#927556");
    for (let i = 0; i < 5; i += 1) {
      const stone = mesh(
        new THREE.DodecahedronGeometry(0.2 + (i % 2) * 0.05),
        dirt,
        [2.37 + (i % 3) * 0.18, 0.14, 1.47 + Math.floor(i / 3) * 0.19],
      );
      stone.scale.y = 0.5;
    }

    // Only winter allocates visible flakes; the same geometry lives both seasons.
    const snowCount = 95;
    const snowPositions = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i += 1) {
      snowPositions[i * 3] = (((i * 73) % 101) / 101 - 0.5) * 10;
      snowPositions[i * 3 + 1] = (((i * 41) % 97) / 97) * 5 + 0.3;
      snowPositions[i * 3 + 2] = (((i * 29) % 103) / 103 - 0.5) * 6;
    }
    const snowGeometry = new THREE.BufferGeometry();
    snowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(snowPositions, 3),
    );
    const snowMaterial = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.046,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const flakes = new THREE.Points(snowGeometry, snowMaterial);
    flakes.visible = false;
    island.add(flakes);

    const seasonState = { snow: 0, growth: 0.32, crown: 1, leafFall: 0 };
    let currentSeason = null;
    let seasonTransition = null;
    const applySeasonDetails = () => {
      snowCaps.opacity = seasonState.snow;
      snowyMeshes.forEach((object) => {
        object.visible = seasonState.snow > 0.002;
      });
      snowMaterial.opacity = seasonState.snow * 0.8;
      flakes.visible = seasonState.snow > 0.002;
      deciduousCrowns.forEach((crown) => {
        crown.visible = seasonState.crown > 0.002;
        crown.scale.setScalar(Math.max(0.001, seasonState.crown));
      });
      springPlants.forEach((plant) => {
        plant.visible = seasonState.growth > 0.002;
        plant.scale.setScalar(Math.max(0.001, seasonState.growth));
      });
      fallenLeaves.visible = seasonState.leafFall > 0.002;
      driftingLeaves.visible = seasonState.leafFall > 0.002;
      fallenLeaves.children.forEach((leaf) => {
        leaf.scale.set(1.2, 0.13, 0.7).multiplyScalar(seasonState.leafFall);
      });
      autumnLeaves.forEach(({ leaf }) => {
        leaf.scale.set(1.2, 0.2, 0.7).multiplyScalar(seasonState.leafFall);
      });
    };
    const updateSeasonTransition = (delta, finish = false) => {
      if (!seasonTransition) return;
      seasonTransition.elapsed += delta;
      const progress = finish ? 1 : Math.min(1, seasonTransition.elapsed / 1.4);
      const eased = progress * progress * (3 - 2 * progress);
      seasonTransition.colors.forEach(({ color, from, to }) =>
        color.lerpColors(from, to, eased),
      );
      Object.keys(seasonState).forEach((key) => {
        seasonState[key] = THREE.MathUtils.lerp(
          seasonTransition.from[key],
          seasonTransition.to[key],
          eased,
        );
      });
      applySeasonDetails();
      if (progress === 1) seasonTransition = null;
    };

    const render = () => {
      if (disposed || contextLost) return;
      try {
        renderer.render(scene, camera);
      } catch {
        contextLost = true;
        setRendererStatus("fallback");
      }
    };
    let previousTime = 0;
    let activeTime = 0;
    const tick = (time) => {
      frame = 0;
      if (disposed || contextLost || !visible || document.hidden) return;
      const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.05)
        : 0;
      previousTime = time;
      activeTime += delta;
      updateSeasonTransition(delta);
      currentPointer.lerp(pointer, 0.045);
      island.rotation.y = currentPointer.x * 0.105;
      island.rotation.x = currentPointer.y * 0.026;
      island.position.y = Math.sin(activeTime * 0.55) * 0.035;
      arm.rotation.z = Math.sin(activeTime * 0.52) * 0.045;
      waterLines.forEach(({ line, origin, phase }) => {
        line.position.x = origin + Math.sin(activeTime * 0.65 + phase) * 0.07;
        line.scale.x = 0.8 + Math.sin(activeTime * 0.8 + phase) * 0.2;
      });
      flowDots.forEach((dot, i) => {
        dot.position.y = -1.14 + ((activeTime * 0.2 + i * 0.245) % 1.25);
      });
      if (flakes.visible) {
        for (let i = 0; i < snowCount; i += 1) {
          snowPositions[i * 3 + 1] -= delta * (0.27 + (i % 4) * 0.07);
          if (snowPositions[i * 3 + 1] < 0.12) snowPositions[i * 3 + 1] = 5;
        }
        snowGeometry.attributes.position.needsUpdate = true;
      }
      if (driftingLeaves.visible) {
        autumnLeaves.forEach(({ leaf, origin, phase }) => {
          leaf.position.set(
            origin[0] + Math.sin(activeTime * 0.7 + phase) * 0.27,
            0.14 + (1.7 - ((activeTime * 0.23 + phase) % 1.7)),
            origin[1] + Math.cos(activeTime * 0.6 + phase) * 0.2,
          );
          leaf.rotation.set(activeTime * 0.9 + phase, activeTime * 0.7, phase);
        });
      }
      render();
      if (!reducedMotion.matches && !contextLost)
        frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (disposed || contextLost || !visible || document.hidden) return;
      if (reducedMotion.matches) {
        updateSeasonTransition(0, true);
        island.rotation.set(0, 0, 0);
        island.position.y = 0;
        arm.rotation.z = 0;
        render();
      } else if (!frame) {
        previousTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const halfHeight = Math.max(4.8, 5.6 / aspect);
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      render();
      schedule();
    };
    const setSeason = (next) => {
      const normalized = normalizeSeason(next);
      if (normalized === currentSeason) return;
      const palette = SEASONS[normalized];
      const immediate = currentSeason === null || reducedMotion.matches;
      currentSeason = normalized;
      // Retarget from the visible state, even if a previous transition is unfinished.
      seasonTransition = {
        elapsed: 0,
        colors: seasonalColors.map(({ color, key }) => ({
          color,
          from: color.clone(),
          to: new THREE.Color(palette[key]),
        })),
        from: { ...seasonState },
        to: palette,
      };
      updateSeasonTransition(0, immediate);
      render();
      schedule();
    };
    const move = (event) => {
      if (reducedMotion.matches) return;
      const rect = mount.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
      );
    };
    const leave = () => pointer.set(0, 0);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    const onMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      schedule();
    };
    const onContextLost = (event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      setRendererStatus("fallback");
    };
    const onContextRestored = () => {
      contextLost = false;
      render();
      if (!contextLost) setRendererStatus("webgl");
      schedule();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(mount);
    mount.addEventListener("pointermove", move, { passive: true });
    mount.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotion);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    sceneRef.current = { setSeason };
    setSeason(season);
    resize();
    if (!contextLost) setRendererStatus("webgl");
    schedule();

    return () => {
      disposed = true;
      sceneRef.current = null;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      mount.removeEventListener("pointermove", move);
      mount.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotion);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      const geometries = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((mat) => mat.dispose());
      snowMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
    // Scene setup is intentionally one-time; the next effect updates its season.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setSeason(season);
  }, [season]);

  return (
    <div
      className={className}
      data-renderer={rendererStatus}
      data-season={normalizeSeason(season)}
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 300,
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: rendererStatus === "webgl" ? 1 : 0,
          transition:
            rendererStatus === "webgl" ? "opacity 500ms ease" : "none",
        }}
      />
      {rendererStatus !== "webgl" && (
        <LandscapeFallback season={normalizeSeason(season)} />
      )}
    </div>
  );
}

function LandscapeFallback({ season }) {
  const winter = season === "winter";
  const palette = SEASONS[season];
  return (
    <svg
      viewBox="0 0 650 540"
      aria-hidden="true"
      focusable="false"
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <ellipse
        cx="330"
        cy="442"
        rx="235"
        ry="38"
        fill="#081b23"
        opacity=".35"
      />
      <path
        d="M66 278 317 160 580 290 580 366 328 486 66 357Z"
        fill="#866d54"
      />
      <path
        d="M66 321 328 449 580 329 580 349 328 469 66 341Z"
        fill="#448891"
      />
      <path
        d="M66 351 328 479 580 359 580 375 328 495 66 367Z"
        fill="#40595b"
      />
      <path d="m66 278 251-118 263 130-252 120Z" fill={palette.grass} />
      <path d="m326 243 82-43 119 61-28 36-61 10-61-30Z" fill={palette.water} />
      <path
        d="m385 237 53 25m-16-34 50 26m-16 19 24 12"
        stroke="#b2e6e4"
        strokeWidth="3"
        opacity=".65"
      />
      <path d="m137 284 64-30 115 104-74 41Z" fill={palette.gravel} />
      <path d="m172 242 89 42 88-44v-87l-89-44-88 45Z" fill="#f0ece0" />
      <path d="m261 284 88-44v-87l-88 44Z" fill="#c8d3cd" />
      <path
        d="m146 157 97-80 130 62-112 61Z"
        fill={winter ? "#f1f7f4" : WILLIAMS_BLUE}
      />
      <path
        d="m146 157 26 13 71-69 113 53 17-15L243 77Z"
        fill={winter ? "#d5e3df" : "#295777"}
      />
      <path
        d="m188 196 29 14v36l-29-14Zm86 22 27-14v34l-27 14Zm41-20 23-12v34l-23 12Z"
        fill="#355c65"
      />
      <path d="m229 226 21 10v43l-21-11Z" fill={WILLIAMS_BLUE} />
      {[
        [122, 236, 1],
        [376, 200, 0.83],
        [497, 341, 1.1],
        [526, 297, 0.82],
      ].map(([x, y, scale], index) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}>
          <path d="M-4 2h8v-38h-8Z" fill="#625846" />
          {index === 1 || index === 2 ? (
            <>
              <path
                d="M0-21v-74m0 35-22-20m22 8 19-20"
                stroke="#625846"
                strokeWidth="4"
                fill="none"
              />
              {!winter && (
                <>
                  <path
                    d="m-31-103 20-24 31 2 24 26-5 35-24 16-32-7-24-25Z"
                    fill={palette.foliage}
                  />
                  <path
                    d="m-31-103 20-24 31 2 9 26-32 10Z"
                    fill={palette.foliageLight}
                  />
                  <path
                    d="m-3-89 32-10 15 0-5 35-24 16Z"
                    fill={palette.foliageWarm}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <path
                d="M0-117-35-36H35Zm0 25-30 31h60Zm0 5-27 30h54Z"
                fill={winter ? "#dce9e5" : palette.evergreen}
              />
              <path
                d="M0-131-24-70h48Z"
                fill={winter ? "#f2f7f4" : palette.evergreenLight}
              />
            </>
          )}
        </g>
      ))}
      {season === "spring" && (
        <g fill="#f5e9b8">
          <circle cx="288" cy="319" r="2.7" />
          <circle cx="299" cy="313" r="2.2" />
          <circle cx="282" cy="309" r="2.1" />
          <circle cx="123" cy="257" r="2.2" />
        </g>
      )}
      {season === "fall" && (
        <g fill={palette.foliageWarm}>
          <ellipse cx="490" cy="344" rx="5" ry="2" />
          <ellipse cx="509" cy="336" rx="4" ry="2" />
          <ellipse cx="478" cy="336" rx="3" ry="2" />
          <ellipse cx="518" cy="344" rx="3" ry="2" />
        </g>
      )}
      <path
        d="M348 323v101l-55 26"
        stroke="#56bfd0"
        strokeWidth="8"
        fill="none"
      />
      <path d="M342 324v-43q6-7 12 0v43q-6 7-12 0Z" fill="#f3f5ea" />
      <ellipse cx="348" cy="280" rx="10" ry="5" fill="#62b5c4" />
      <path
        d="m390 325 37 19 44-21-37-19Z"
        fill="#193038"
        stroke="#193038"
        strokeWidth="15"
        strokeLinejoin="round"
      />
      <path d="m404 301 29 14 32-16v27l-32 16-29-14Z" fill="#ed682f" />
      <path d="m410 272 27 12v29l-27-12Z" fill="#32545e" />
      <path d="m410 272 20-10 25 13-18 9Z" fill="#ed682f" />
      <path
        d="m453 306 18-69 37 26 14 42"
        stroke="#f36a27"
        strokeWidth="12"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="m513 301 17-7 12 17-18 9-13-8Z" fill="#243c41" />
    </svg>
  );
}
