# ARCS A-Frame Movement Components

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

This repository adds A-Frame components for local and [ARCS](https://github.com/arcs-vr) enabled movement, suitable for
usage with the UI provided in the [`arcs-vr/arc-vue-remotes`](https://github.com/arcs-vr/arc-vue-remotes) package.

These components depend on the `movement-component` found at: [`donmccurdy/aframe-extras`](https://github.com/donmccurdy/aframe-extras)

## Installation

Use one of the following:

```bash
yarn add arcs-vr/arc-aframe-movement
npm install arcs-vr/arc-aframe-movement
```

## Usage

Import the component files. There are then available as A-Frame components.
The components will react to the `arcs-connect` event and automatically enable all remote events they require.

```js
import 'arc-aframe-movement'
```

or 

```js
import { ArcKeyboardControls } from 'arc-aframe-movement/src/ArcKeyboardControls.js'
import { ArcGamepadControls } from 'arc-aframe-movement/src/ArcGamepadControls.js'

AFRAME.registerComponent('arc-keyboard-controls', ArcKeyboardControls)
AFRAME.registerComponent('arc-gamepad-controls', ArcGamepadControls)
```

The ArcKeyboardControls component listens to `keydown` and `keyup` events, and the ArcGamepadControls component listens to `stickmove` events.

### Markup

```html
<a-entity arc-gamepad-controls
          arc-keyboard-controls
          id="camera-rig"
          movement-controls="
            controls: arc-keyboard, arc-gamepad;
            fly: false;
            speed: 15;
          "
/>
```

## More

Look at the [`arcs-vr/arc-aframe-vue-template`](https://github.com/arcs-vr/arc-aframe-vue-template) for easier setup and at the
[`arcs-vr/arc-demo`](https://github.com/arcs-vr/arc-demo) for example usage.

## Authors and contributors

- Barthélémy Bonhomme, [@barthy-koeln](https://github.com/barthy-koeln/): [post@barthy.koeln](mailto:post@barthy.koeln)
