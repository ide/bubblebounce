// Fake parts of a web browser before importing WHS
import './FakeBrowser';

import Exponent from 'exponent';
import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import Button from 'react-native-button';

import Assets from './Assets';
import GameView from './GameView';

export default class Everdown extends React.Component {
  state = {
    loaded: false,
    gameKey: 0,
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
      Alert.alert('Error when loading:', e.message);
    }
  }

  render() {
    return this.state.loaded ?
      this._renderGame() :
      <Exponent.Components.AppLoading />;
  }

  _renderGame() {
    return (
      <View style={styles.container}>
        <GameView key={`game-${this.state.gameKey}`} style={styles.game} />
        <View style={styles.controls}>
          <Button
            onPress={this._resetGame}
            style={styles.resetButton}>
            Reset
          </Button>
        </View>
      </View>
    )
  }

  _resetGame = () => {
    this.setState((state) => ({
      gameKey: state.gameKey + 1,
    }));
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#99c1d8',
    flex: 1,
  },
  game: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    right: 6,
    top: 26,
  },
  resetButton: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
})

Exponent.registerRootComponent(Everdown);
