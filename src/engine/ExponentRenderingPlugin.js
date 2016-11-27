'use strict';

import { RenderingPlugin } from 'whs/lib/components/rendering/RenderingPlugin';

const THREE = require('three');

type Params = {
  gl: Object,
  renderer: Object,
  background: {
    color: number,
    opacity: number,
  },
  shadowmap: {
    enabled: boolean,
    type: any,
  },
};

export default class ExponentRenderingPlugin extends RenderingPlugin {
  constructor(params: Params) {
    super(params);
    return (world) => {
      this.world = world;
      return this;
    }
  }

  build(params) {
    const renderParams = params.rendering;

    // Renderer.
    this.$renderer = new THREE.WebGLRenderer(renderParams.renderer);

    const renderer = this.$renderer;
    renderer.setClearColor(
      renderParams.background.color,
      renderParams.background.opacity,
    );

    // Shadowmap.
    renderer.shadowMap.enabled = renderParams.shadowmap.enabled;
    renderer.shadowMap.type = renderParams.shadowmap.type;
    renderer.shadowMap.cascade = true;

    this.setSize(this.params.width, this.params.height);
  }

  renderPlugin(scene, camera, delta) {
    this.$renderer.render(scene, camera);
    this.params.gl.flush();
    this.params.gl.endFrameEXP();
  }

  setSize(width, height) {
    if (this.$renderer) {
      this.$renderer.setSize(width, height);
    }
  }

  start(onStartRendering, onFinishRendering) {
    this.clock = new THREE.Clock();
    this.onStartRendering = onStartRendering;
    this.onFinishRendering = onFinishRendering;
    this.render(this.world.$scene, this.world.$camera.native);
  }

  stop() {
    if (this.frameHandler) {
      cancelAnimationFrame(this.frameHandler);
    }
  }

  // render = () => {
  //   const delta = this.clock.getDelta();

  //   if (this.stats) {
  //     this.stats.begin();
  //   }

  //   if (this.onStartRendering){
  //     this.onStartRendering(delta);
  //   }

  //   this.renderPlugin(delta);

  //   if (this.onFinishRendering) {
  //     this.onFinishRendering(delta);
  //   }

  //   if (this.stats) {
  //     this.stats.end();
  //   }

  //   requestAnimationFrame(this.render);
  // };

  render(cachedScene, cachedCamera) {
    const scene = cachedScene;
    const camera = cachedCamera;
    const clock = this.clock;
    const stats = this.$stats;

    const onStartRendering = this.onStartRendering;
    const onFinishRendering = this.onFinishRendering;

    function render() {
      requestAnimationFrame(render.bind(this));

      const delta = clock.getDelta();

      // Init stats.
      if (stats) stats.begin();
      if (onStartRendering) onStartRendering(delta);

      this.renderPlugin(scene, camera, delta);

      if (onFinishRendering) onFinishRendering(delta);

      // End helper.
      if (stats) stats.end();
    }

    this.frameHandler = requestAnimationFrame(render.bind(this));
  }
}
