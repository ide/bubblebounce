'use strict';

import Events from 'minivents';
import {
  Vector2,
  Raycaster,
  Plane,
  Vector3
} from 'three';

export default class TouchResponderMouse extends Events {
  world = null;
  mouse = new Vector2();
  raycaster = new Raycaster();
  projectionPlane = new Plane(new Vector3(0, 0, 1), 0);

  constructor(world) {
    super();
    this.world = world;
  }

  handleResponderGrant = (event) => {
    this.update(event);
    this.emit('grant', event);
  };

  handleResponderMove = (event) => {
    this.update(event);
    this.emit('move', event);
  };

  handleResponderRelease = (event) => {
    this.emit('release', event);
  };

  handleResponderTerminate = (event) => {
    this.emit('terminate', event);
  };

  update(event) {
    let { locationX, locationY } = event.nativeEvent;
    this.mouse.x = (locationX / this.world.params.width) * 2 - 1;
    this.mouse.y = -(locationY / this.world.params.height) * 2 + 1;
    this.projectionPlane.normal.copy(this.world.camera.native.getWorldDirection());
    this.raycaster.setFromCamera(this.mouse, this.world.camera.native);
  }

  track(component) {
    let isTouched = false;

    this.on('grant', (event) => {
      if (this.hovers(component)) {
        isTouched = true;
        component.emit('touchstart', event);
      }
    });

    this.on('move', (event) => {
      if (this.hovers(component)) {
        if (isTouched) {
          component.emit('touchmove', event);
        } else {
          isTouched = true;
          component.emit('touchenter', event);
        }
      } else if (isTouched) {
        isTouched = false;
        component.emit('touchleave', event);
      }
    });

    this.on('release', (event) => {
      if (isTouched) {
        component.emit('touchend', event);
      }
    });

    this.on('terminate', (event) => {
      if (isTouched) {
        component.emit('touchcancel', event);
      }
    });
  }

  intersection(component) {
    return this.raycaster.intersectObject(component.native);
  }

  project(plane = this.projectionPlane) {
    return this.raycaster.ray.intersectPlane(plane);
  }

  hovers(component) {
    const intersection = this.intersection(component)[0];
    return intersection ? intersection.object === component.native : false;
  }

  get ray() {
    return this.raycaster.ray;
  }

  get x() {
    return this.mouse.x;
  }

  get y() {
    return this.mouse.y;
  }
}
