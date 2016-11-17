import Exponent from 'exponent';
import React from 'react';
import { Alert, Dimensions, PanResponder } from 'react-native';

import Assets from './Assets';
import WhitestormView from './WhitestormView';

const WHS = require('whs');

//// Game

// Render the game as a `View` component.
export default class GameView extends React.Component {
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
      <WhitestormView
        {...this.props}
        {...this._panResponder.panHandlers}
        onWorldCreate={this._handleWorldCreate}
      />
    );
  }

  _handleWorldCreate = (world) => {
    const sphere = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 3
      },

      mass: 10, // Mass of physics object.

      material: {
        color: 0xffffff, // White color.
        kind: 'basic' // THREE.MeshBasicMaterial
      },

      position: [0, 100, 0]
    });

    sphere.addTo(world);
    world.start();
  };

  _handleTouchDown = (event) => {

  };

  _handleTouchUp = (event) => {

  };
}
