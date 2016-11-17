// Fake parts of a web browser before importing WHS
import './FakeBrowser';

import Exponent from 'exponent';
import React from 'react';
import { Alert, PanResponder } from 'react-native';

import Assets from './Assets';
import GameView from './GameView';

export default class Everdown extends React.Component {
  state = {
    loaded: false,
  };

  componentDidMount() {
    // THREE warns about unavailable WebGL extensions.
    console.ignoredYellowBox = ['THREE.WebGLRenderer:'];
    this.loadAsync().done();
  }

  // Do stuff that needs to be done before first render of scene.
  async loadAsync() {
    try {
      // Load assets
      await Promise.all(
        Object.keys(Assets).map((name) => Assets[name].downloadAsync())
      );
      this.setState({ loaded: true });
    } catch (e) {
      Alert.alert('Error when loading', e.message);
    }
  }

  render() {
    return this.state.loaded ? (
      <GameView style={{ flex: 1 }} />
    ) : (
      <Exponent.Components.AppLoading />
    );
  }
}

Exponent.registerRootComponent(Everdown);
