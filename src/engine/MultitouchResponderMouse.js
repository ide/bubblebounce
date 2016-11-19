'use strict';

import difference from 'lodash/difference';

import TouchResponderMouse from './TouchResponderMouse';

export default class MultitouchResponderMouse {
  world = null;
  singleTouchMice = [];
  previousTouchIdentifiers = [];
  trackedComponents = [];

  constructor(world) {
    world.mouse = this;
    this.world = world;

    this.touchHandlers = {
      onStartShouldSetResponder: (event) => true,
      onResponderGrant: this._handleResponderGrant,
      onResponderMove: this._handleResponderMove,
      onResponderRelease: this._handleResponderRelease,
      onResponderTerminationRequest: (event) => true,
      onResponderTerminate: this._handleResponderTerminate,
    };
  }

  _handleResponderGrant = (event) => {
    this._update(event);
  };

  _handleResponderMove = (event) => {
    this._update(event);
  };

  _handleResponderRelease = (event) => {
    this.singleTouchMice.forEach(mouse => {
      mouse.handleResponderRelease(event);
    });
    this.singleTouchMice.length = 0;
    this.previousTouchIdentifiers.length = 0;
  };

  _handleResponderTerminate = (event) => {
    this.singleTouchMice.forEach(mouse => {
      mouse.handleResponderTerminate(event);
    });
    this.singleTouchMice.length = 0;
    this.previousTouchIdentifiers.length = 0;
  };

  _update(event) {
    let touchIdentifier = event.nativeEvent.identifier;
    if (!this.singleTouchMice[touchIdentifier]) {
      let mouse = new TouchResponderMouse(this.world);
      this.singleTouchMice[touchIdentifier] = mouse;
      this.trackedComponents.forEach(component => {
        mouse.track(component);
      })
      mouse.handleResponderGrant(event);
    } else {
      this.singleTouchMice[touchIdentifier].handleResponderMove(event);
    }

    // `changedTouches` doesn't tell us about touches that ended so we infer
    // the list of ended touches ourselves
    let touchIdentifiers = event.nativeEvent.touches.map(touch => touch.identifier);
    let endedTouchIdentifiers = difference(this.previousTouchIdentifiers, touchIdentifiers);
    endedTouchIdentifiers.forEach(touchIdentifier => {
      let mouse = this.singleTouchMice[touchIdentifier];
      if (mouse) {
        mouse.handleResponderRelease(event);
        delete this.singleTouchMice[touchIdentifier];
      }
    })
    this.previousTouchIdentifiers = touchIdentifiers;
  }

  track(component) {
    this.singleTouchMice.forEach(mouse => {
      mouse.track(component);
    })
    this.trackedComponents.push(component);
  }

  intersection(component) {
    let intersections = [];
    this.singleTouchMice.forEach(mouse => {
      intersections.push(...mouse.intersection(component));
    })
    intersections.sort((i1, i2) => i1.distance - i2.distance);
    return intersections;
  }

  project(plane) {
    throw new Error('MultitouchResponderMouse.project is unimplemented');
  }

  hovers(component) {
    const intersection = this.intersection(component)[0];
    return intersection ? intersection.object === component.native : false;
  }

  get ray() {
    throw new Error('MultitouchResponderMouse.ray is unimplemented');
  }

  get x() {
    throw new Error('MultitouchResponderMouse.x is unimplemented');
  }

  get y() {
    throw new Error('MultitouchResponderMouse.y is unimplemented');
  }
}
