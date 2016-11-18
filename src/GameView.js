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
import WhitestormView from './WhitestormView';

const WHS = require('whs');

//// Game

// Render the game as a `View` component.
export default class GameView extends React.Component {
  state = {
    world: null,
  };

  constructor(props, context) {
    super(props, context);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this._handleTouchDown,
      onPanResponderRelease: this._handleTouchUp,
      onPanResponderTerminate: this._handleTouchUp,
      onShouldBlockNativeResponder: () => false,
    });
  }

  render() {
    return (
      <View {...this.props}>
        <WhitestormView
          {...this._panResponder.panHandlers}
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
        radius: 3,
        widthSegments: 32,
        heightSegments: 32,
      },

      mass: 10,

      material: {
        color: 0xffaaaa,
        kind: 'phong' // THREE.MeshBasicMaterial
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
        kind: 'basic' // THREE.MeshBasicMaterial
      },

      physics: {
        friction: 0.8,
        restitution: 2,
      },

      position: [1, 25, 0]
    });

    sphere2.addTo(world);

    new WHS.Box({
      geometry: {
        width: 50,
        height: 50,
        depth: 2,
      },
      mass: 0,
      material: {
        color: 0x447f8b,
        kind: 'basic',
      },
      rotation: {
        x: -Math.PI / 2,
        z: Math.PI / 4,
      },
      position: [0, -20, 0],
    }).addTo(world);

    new WHS.AmbientLight({
      light: {
        color: 0xffffff,
        intensity: 0.8,
      },
    }).addTo(world);

    // new WHS.PointLight({
    //   light: {
    //     intensity: 0.8,
    //     distance: 100,
    //   },
    //   shadowmap: {
    //     fov: 90,
    //   },
    //   position: [0, 10, 10],
    // }).addTo(world);

    // new WHS.SpotLight( {
    //   light: {
    //     color: 0xccffcc,
    //     intensity: 3,
    //     distance: 1000
    //   },
    //
    //   position: [10, 20, 10]
    // }).addTo(world);

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
