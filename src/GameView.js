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
import TouchResponderMouse from './engine/TouchResponderMouse';
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
    const sphere = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 8,
        widthSegments: 32,
        heightSegments: 32,
      },

      mass: 10,

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
        radius: 4,
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
    let mouse = new TouchResponderMouse(world);
    mouse.track(sphere);
    mouse.track(sphere2);
    mouse.track(sphere3);
    mouse.track(sphere4);

    sphere.on('touchstart', () => {
      console.log('touched sphere');
    });
    sphere.on('touchmove', () => {
      // console.log('moved sphere');
    });
    sphere.on('touchend', () => {
      console.log('end sphere');
    });
    sphere.on('touchcancel', () => {
      console.log('cancel sphere');
    });

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
