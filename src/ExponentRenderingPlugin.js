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
      this.parentWorld = world;
      return this;
    }
  }

  build(params) {
    // Renderer.
    this.renderer = new THREE.WebGLRenderer(this.params.renderer);

    const _renderer = this.renderer;
    _renderer.setClearColor(this.params.background.color, this.params.background.opacity);

    // Shadowmap.
    _renderer.shadowMap.enabled = this.params.shadowmap.enabled;
    _renderer.shadowMap.type = this.params.shadowmap.type;
    _renderer.shadowMap.cascade = true;

    this.setSize(this.params.width, this.params.height);
  }

  renderPlugin(delta) {
    const _scene = this.parentWorld.scene;
    const _cameraNative = this.parentWorld.camera.native;

    this.renderer.render(_scene, _cameraNative);
    this.params.gl.flush();
    this.params.gl.endFrameEXP();
  }

  setSize(width, height) {
    if (this.renderer) {
      console.log(width, height);
      this.renderer.setSize(width, height);
    }
  }

  start(onStartRendering, onFinishRendering) {
    this.clock = new THREE.Clock();
    this.onStartRendering = onStartRendering;
    this.onFinishRendering = onFinishRendering;
    this.render();
  }

  stop() {
    if (this._requestAnimationFrameID) {
      cancelAnimationFrame(this._requestAnimationFrameID);
    }
  }

  render = () => {
    const delta = this.clock.getDelta();

    if (this.stats) {
      this.stats.begin();
    }

    if (this.onStartRendering){
      this.onStartRendering(delta);
    }

    this.renderPlugin(delta);

    if (this.onFinishRendering) {
      this.onFinishRendering(delta);
    }

    if (this.stats) {
      this.stats.end();
    }

    requestAnimationFrame(this.render);
  };
}
