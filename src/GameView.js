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

  _handleWorldCreate = (world) => {
    let sphere = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 8,
        widthSegments: 32,
        heightSegments: 32,
      },

      mass: 10,
      physics: false,

      material: {
        color: 0xffaaaa,
        kind: 'lambert'
      },

      position: [0, 15, 0]
    });

    sphere.addTo(world);

    const sphere2 = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 3,
        widthSegments: 32,
        heightSegments: 32,
      },

      mass: 10,

      material: {
        color: 0xffffff,
        kind: 'lambert' // THREE.MeshBasicMaterial
      },

      physics: {
        friction: 0.8,
        restitution: 2,
      },

      position: [1, 25, 0]
    });

    sphere2.addTo(world);

    const sphere3 = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 6,
        widthSegments: 32,
        heightSegments: 32,
      },

      mass: 10,

      material: {
        color: 0x00ff00,
        kind: 'lambert' // THREE.MeshBasicMaterial
      },

      physics: {
        friction: 0.8,
        restitution: 3,
        damping: 0.1,
      },

      position: [4, 23, 0]
    });
    sphere3.addTo(world);

    const sphere4 = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 2,
        widthSegments: 32,
        heightSegments: 32,
      },

      mass: 10,

      material: {
        color: 0x0000ff,
        kind: 'lambert' // THREE.MeshBasicMaterial
      },

      physics: {
        friction: 0.8,
        restitution: 2,
      },

      position: [-5, 25, 0]
    });
    sphere4.addTo(world);

    new WHS.Box({
      geometry: {
        width: 50,
        height: 2,
        depth: 50,
      },
      mass: 0,
      material: {
        color: 0x447f8b,
        kind: 'lambert',
      },
      rotation: {
        // x: -Math.PI / 2,
        // z: Math.PI / 4,
      },
      position: [0, -40, 0],
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

    new WHS.DirectionalLight({
      light: {
        intensity: 0.2,
      },
      position: [0, 200, 200],
    }).addTo(world);

    // new WHS.SpotLight( {
    //   light: {
    //     color: 0xccffcc,
    //     intensity: 3,
    //     distance: 1000
    //   },
    //
    //   position: [10, 20, 10]
    // }).addTo(world);

    // world.camera.rotation.x = Math.PI / 4;
    let mouse = new MultitouchResponderMouse(world);
    mouse.track(sphere);
    mouse.track(sphere2);
    mouse.track(sphere3);
    mouse.track(sphere4);


    sphere.on('touchstart', () => {
      console.log('touched sphere');
    });
    sphere.on('touchmove', () => {
      console.log('moved sphere');
    });
    sphere.on('touchend', () => {
      console.log('end sphere');
    });
    sphere.on('touchcancel', () => {
      console.log('cancel sphere');
    });
    sphere.on('touchenter', () => {
      console.log('enter sphere');
    });
    sphere.on('touchleave', () => {
      console.log('leave sphere');
    });

    sphere3.on('touchstart', () => {
      console.log('touched sphere3');
    });
    sphere3.on('touchmove', () => {
      console.log('moved sphere3');
    });
    sphere3.on('touchend', () => {
      console.log('end sphere3');
    });
    sphere3.on('touchcancel', () => {
      console.log('cancel sphere3');
    });
    sphere3.on('touchenter', () => {
      console.log('enter sphere3');
    });
    sphere3.on('touchleave', () => {
      console.log('leave sphere3');
    });

    //addPlanet(world);

    world.start();
    this.setState({ world });
  };

  _handleTouchDown = (event) => {
    console.log('touch down');
  };

  _handleTouchUp = (event) => {
    console.log('touch up');
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

function addPlanet(world) {
  const radiusMin = 20, // Min radius of the asteroid belt.
  radiusMax = 32, // Max radius of the asteroid belt.
  particleCount = 200, // Amount of asteroids.
  particleMinRadius = 0.02, // Min of asteroid radius.
  particleMaxRadius = 0.7, // Max of asteroid radius.
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
    physics: false,

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
    physics: false,

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
    physics: false,

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
    physics: false,

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
