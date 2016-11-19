# Bubble Bounce!

This is a game I made during the first Exponent game jam. Play it here: https://exp.host/@ide/bubblebounce

<img src="http://i.imgur.com/9n098ML.png" alt="Bubble Bounce" width="187.5" height="333.5" />

## How it's made

Bubble Bounce is an Exponent experience that's written in pure JavaScript.

I used [WhitestormJS](https://whsjs.io), a 3D engine that's built on top of [three.js](https://threejs.org), [Physijs](https://chandlerprall.github.io/Physijs/), and [AmmoNext](https://github.com/WhitestormJS/AmmoNext). AmmoNext is the C++ Bullet physics engine compiled to JavaScript using emscripten.

Parts of Whitestorm are written for the DOM, but fortunately it is rather customizable so I got Whitestorm working on Exponent by writing a custom rendering plugin and virtual mouse. The rendering plugin creates its three.js renderer with an Exponent EXGL context. It also calls `gl.endFrameEXP()` each time it renders. Basically, the rendering plugin is responsible for using EXGL to render what Whitestorm tells it to.

The virtual mouse listens to React Native touch responder events and uses raycasters to determine which objects have been touched. The virtual mouse also supports multitouch, allowing the user to simultanously touch several objects on the screen at once.

There is also a small fake browser library to implement parts of the DOM that Whitestorm always tries to access.

## Configuration

I had to configure React Native and XDE to be able to load the game and publish it. In particular, AmmoNext has a large JS file from emscripten that causes the transformer and minifier to run out of memory. I use the `rn-cli.config.js` file to specify a custom transformer that skips over AmmoNext. For publishing, I patched XDE so that it wouldn't minify the JS bundle. This caused the JS bundle to exceed the file limit for uploads to the Exponent publishing server so I published through a patched version of the server.
