'use strict';

import Exponent from 'exponent';
import React, { PropTypes } from 'react';
import { View } from 'react-native';

import ExponentRenderingPlugin from './ExponentRenderingPlugin';

const THREE = require('three');
const WHS = require('whs');

export default class WhitestormView extends React.Component {
  static propTypes = {
    // Called every animation frame with one parameter `dt` which is the
    // time in seconds since the last animation frame
    // tick: PropTypes.func,
    onWorldCreate: PropTypes.func,
    ...View.propTypes,
  };

  // Get a three.js texture from an Exponent Asset
  static textureFromAsset(asset) {
    if (!asset.localUri) {
      throw new Error(`Asset '${asset.name}' needs to be downloaded before ` +
                      `being used as an OpenGL texture.`);
    }
    const texture = new THREE.Texture();
    texture.image = {
      data: asset,
      width: asset.width,
      height: asset.height,
    };
    texture.needsUpdate = true;
    texture.isDataTexture = true; // send to gl.texImage2D() verbatim
    return texture;
  }

  _onContextCreate = (gl) => {
    gl.createFramebuffer = () => {
      return null;
    };
    gl.createRenderbuffer = () => {
      return null;
    };
    gl.bindRenderbuffer = (target, renderbuffer) => {};
    gl.renderbufferStorage = (target, internalFormat, width, height) => {};
    gl.framebufferTexture2D = (target, attachment, textarget, texture, level) => {};
    gl.framebufferRenderbuffer = (target, attachmebt, renderbuffertarget, renderbuffer) => {};

    let threeRendererOptions = {
      canvas: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: gl.drawingBufferHeight,
      },
      context: gl,
      antialias: true,
    };

    let world = new WHS.World({
      stats: false,
      init: {
        rendering: false,
      },
      gravity: {
        x: 0,
        y: -50,
        z: 0
      },
      camera: {
        position: {
          z: 100,
        },
        rotation: {
          x: Math.PI / 4,
        },
      },
      shadowmap: {
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      },
    });
    world.renderingPlugin = new ExponentRenderingPlugin({
      gl,
      renderer: threeRendererOptions,
      background: {
        color: 0x444444,
        opacity: 1,
      },
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      shadowmap: {
        enabled: false, // Enable when EXGL supports renderbuffers and framebuffers
        type: THREE.PCFSoftShadowMap,
      },
    });

    this._world = world;
    this.props.onWorldCreate(this._world);
  };

  componentWillUnmount() {
    if (this._world) {
      // ExponentRenderingPlugin specially defines stop()
      this._world.renderingPlugin.stop();
      this._world = null;
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onWorldCreate, ...viewProps } = this.props;
    return (
      <Exponent.GLView
        {...viewProps}
        onContextCreate={this._onContextCreate}
      />
    );
  }
};
