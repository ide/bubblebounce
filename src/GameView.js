import Exponent from 'exponent';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

import Assets from './Assets';
import MultitouchResponderMouse from './engine/MultitouchResponderMouse';
import WhitestormView from './engine/WhitestormView';

const THREE = require('three');
const WHS = require('whs');

//// Game

// Render the game as a `View` component.
export default class GameView extends React.Component {
  state = {
    world: null,
  };

  render() {
    let whitestormProps = {};
    if (this.state.world) {
      Object.assign(
        whitestormProps,
        this.state.world.mouse.touchHandlers,
      );
    }

    return (
      <View {...this.props}>
        <WhitestormView
          {...whitestormProps}
          onWorldCreate={this._handleWorldCreate}
          style={styles.whitestorm}
        />
        <View
          pointerEvents="none"
          style={styles.loadingContainer}>
          <ActivityIndicator
            color="#ffffff"
            size="large"
            animating={!this.state.world}
            style={styles.loadingIndicator}
          />
        </View>
      </View>
    );
  }

  addBubble(world) {
    let bubble = new WHS.Sphere({
      geometry: {
        radius: 7,
        widthSegments: 32,
        heightSegments: 32,
      },
      mass: 10,
      material: {
        color: 0xffa500,
        kind: 'lambert',
      },
      position: [0, 0, 0],
    });
    bubble.addTo(world);

    world.mouse.track(bubble);
    let bounce = (event) => {

    };
    bubble.on('touchstart', bounce);
    bubble.on('touchenter', bounce);

    return bubble;
  }

  _handleWorldCreate = (world) => {
    // Set up the multitouch mouse before adding components
    let mouse = new MultitouchResponderMouse(world);

    let bubble1 = this.addBubble(world);
    bubble1.material.color = 0xffffff;
    bubble1.position.x = -8;
    bubble1.position.y = 29;

    let bubble2 = this.addBubble(world);
    bubble2.position.x = 8;
    bubble2.position.y = 25;

    new WHS.Box({
      geometry: {
        width: 5,
        height: 2,
        depth: 50,
      },
      mass: 0,
      material: {
        color: 0x795da3,
        kind: 'lambert',
      },
      position: [0, -35, 0],
    }).addTo(world);

    new WHS.Box({
      geometry: {
        width: 5,
        height: 2,
        depth: 30,
      },
      mass: 0,
      material: {
        color: 0x447f8b,
        kind: 'lambert',
      },
      position: [-25, -50, 3],
    }).addTo(world);

    new WHS.Box({
      geometry: {
        width: 5,
        height: 2,
        depth: 30,
      },
      mass: 0,
      material: {
        color: 0xb3865e,
        kind: 'lambert',
      },
      position: [25, -50, -3],
    }).addTo(world);

    new WHS.AmbientLight({
      light: {
        color: 0xffffff,
        intensity: 0.4,
      },
    }).addTo(world);

    new WHS.PointLight({
      light: {
        intensity: 0.8,
        distance: Infinity,
      },
      shadowmap: {
        fov: 90,
      },
      position: [0, 200, 200],
    }).addTo(world);

    let sunLight = new WHS.DirectionalLight({
      light: {
        intensity: 0.2,
      },
      position: [0, 200, 200],
    });
    sunLight.addTo(world);

    //addPlanet(world);
    addWater(world, sunLight);

    world.start();
    this.setState({ world });
  };
}

const styles = StyleSheet.create({
  whitestorm: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loadingIndicator: {

  },
});

function addWater(world, sunLight) {
  require('./WaterMaterial');
  let waterNormals = WhitestormView.textureFromAsset(Assets['water-normals']);
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  let water = new THREE.Water(world.renderer, world.camera, world.scene, {
			textureWidth: 256,
			textureHeight: 256,
			waterNormals: waterNormals,
			alpha: 0.5,
			sunDirection: sunLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x3aaefb,
			betaVersion: 0,
			side: THREE.DoubleSide
		});
	var meshMirror = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(2000, 2000, 10, 10),
		water.material
	);
	meshMirror.add(water);
	meshMirror.rotation.x = -Math.PI / 2;
  // meshMirror.rotation.z = -Math.PI / 4;
  meshMirror.position.y = -40;
	world.scene.add(meshMirror);


  let waterAnim = new WHS.Loop(() => {
    water.material.uniforms.time.value += 1 / 60;
  });

  world.addLoop(waterAnim);
  waterAnim.start();
}

function addPlanet(world) {
  const radiusMin = 25, // Min radius of the asteroid belt.
  radiusMax = 80, // Max radius of the asteroid belt.
  particleCount = 20, // Amount of asteroids.
  particleMinRadius = 0.5, // Min of asteroid radius.
  particleMaxRadius = 1.5, // Max of asteroid radius.
  planetSize = 8; // Radius of planet.

  const colors = {
    green: 0x8fc999,
    blue: 0x5fc4d0,
    orange: 0xee5624,
    yellow: 0xfaff70
  };

  const space = new WHS.Group();
  space.addTo(world);
  space.rotation.z = Math.PI / 12;
  space.position.y = 80;
  space.position.z = -40;

  const planet = new WHS.Tetrahedron({
    geometry: {
      radius: planetSize,
      detail: 2
    },

    mass: 100,

    material: {
      color: 0xee5624,
      shading: THREE.FlatShading,
      roughness: 0.9,
      emissive: 0x270000,
      kind: 'standard'
    }
  });

  planet.addTo(space);

  const s1 = new WHS.Dodecahedron({
    geometry: {
      buffer: true,
      radius: 10
    },

    mass: 0,
    // physics: false,

    material: {
      shading: THREE.FlatShading,
      emissive: 0x270000,
      roughness: 0.9,
      kind: 'standard'
    }
  });

  const s2 = new WHS.Box({
    geometry: {
      buffer: true,
      width: 10,
      height: 10,
      depth: 10
    },

    mass: 0,
    // physics: false,

    material: {
      shading: THREE.FlatShading,
      roughness: 0.9,
      emissive: 0x270000,
      kind: 'standard'
    }
  });

  const s3 = new WHS.Cylinder({
    geometry: {
      buffer: true,
      radiusTop: 0,
      radiusBottom: 10,
      height: 10
    },

    mass: 0,
    // physics: false,

    material: {
      shading: THREE.FlatShading,
      roughness: 0.9,
      emissive: 0x270000,
      kind: 'standard'
    }
  });

  const s4 = new WHS.Sphere({
    geometry: {
      buffer: true,
      radius: 10
    },

    mass: 0,
    // physics: false,

    material: {
      shading: THREE.FlatShading,
      roughness: 0.9,
      emissive: 0x270000,
      kind: 'standard'
    }
  });

  const asteroids = new WHS.Group();
  asteroids.addTo(space);

  // Materials.
  const mat = [
    new THREE.MeshPhongMaterial({ color: colors.green, shading: THREE.FlatShading }),
    new THREE.MeshPhongMaterial({ color: colors.blue, shading: THREE.FlatShading }),
    new THREE.MeshPhongMaterial({ color: colors.orange, shading: THREE.FlatShading }),
    new THREE.MeshPhongMaterial({ color: colors.yellow, shading: THREE.FlatShading })
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = [s1, s2, s3, s4][Math.ceil(Math.random() * 3)].clone(),
      radius = particleMinRadius + Math.random() * (particleMaxRadius - particleMinRadius);

    particle.g_({
      radiusBottom: radius,
      radiusTop: 0,
      height: particle instanceof WHS.Cylinder ? radius * 2 : radius,
      width: radius,
      depth: radius,
      radius
    });

    particle.material = mat[Math.floor(4 * Math.random())]; // Set custom THREE.Material to mesh.

    // Particle data.
    particle.data = {
      distance: radiusMin + Math.random() * (radiusMax - radiusMin),
      angle: Math.random() * Math.PI * 2
    };

    // Set position & rotation.
    particle.position.x = Math.cos(particle.data.angle) * particle.data.distance;
    particle.position.z = Math.sin(particle.data.angle) * particle.data.distance;
    particle.position.y = -10 * Math.random() + 4;

    particle.rotation.set(Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random());

    particle.addTo(asteroids);
  }

  // Animating rotating shapes around planet.
  const particles = asteroids.children;
  const animation = new WHS.Loop(() => {
    for (let i = 0, max = particles.length; i < max; i++) {
      const particle = particles[i];

      particle.data.angle += 0.02 * particle.data.distance / radiusMax;

      particle.position.x = Math.cos(particle.data.angle) * particle.data.distance;
      particle.position.z = Math.sin(particle.data.angle) * particle.data.distance;

      particle.rotation.x += Math.PI / 60;
      particle.rotation.y += Math.PI / 60;
    }

    planet.rotation.y += 0.005;
  });

  world.addLoop(animation);
  animation.start();
}
