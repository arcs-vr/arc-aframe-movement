import { MovementSchema } from './MovementSchema.js'

/**
 * A-Frame component, that simulates gamepad movement input for camera rigs
 * @type {object}
 *
 * @author Barthy Bonhomme <post@barthy.koeln>
 * @license MIT
 */
export const ArcGamepadControls = {

  schema: MovementSchema,

  /**
   * Initialise component
   */
  init () {
    /**
     * Axis around which the movement rotates
     * @type {Vector3}
     */
    this.rotationAxis = new THREE.Vector3(0, 1, 0)

    /**
     * Movement direction
     * @type {Vector3}
     * @public
     */
    this.velocity = new THREE.Vector3(0, 0, 0)

    /**
     * Normalized movement y
     * @type {Number}
     */
    this.y = 0

    /**
     * Normalized rotation y
     * @type {Number}
     */
    this.ry = 0

    /**
     * Movement direction in x
     * @type {Number}
     */
    this.x = 0

    /**
     * Movement rotation in x
     * @type {Number}
     */
    this.rx = 0

    /**
     * Sprint multiplication factor
     * @type {Number}
     */
    this.sprintFactor = 1

    /**
     * Crouch multiplication factor
     * @type {Number}
     */
    this.crouchFactor = 1

    /**
     * Is a remote control connected
     * @type {Boolean}
     */
    this.enabled = false

    this.bindFunctions()
  },

  /**
   * Bind functions to this component instance
   */
  bindFunctions () {
    this.arcsRemoteConnected = this.arcsRemoteConnected.bind(this)
    this.arcsRemoteDisconnected = this.arcsRemoteDisconnected.bind(this)
    this.onJoystickMove = this.onJoystickMove.bind(this)
    this.onDeviceBump = this.onDeviceBump.bind(this)
  },

  /**
   * Add Event Listeners
   */
  play () {
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcsRemoteConnected)
    this.el.sceneEl.addEventListener('arc-remote-disconnected', this.arcsRemoteDisconnected)

    if (this.enabled) {
      window.addEventListener('stickmove', this.onJoystickMove)
      window.addEventListener('devicebump', this.onDeviceBump)
    }
  },

  /**
   * Remove Event Listeners
   */
  pause () {
    this.el.sceneEl.removeEventListener('arc-remote-connected', this.arcsRemoteConnected)
    this.el.sceneEl.removeEventListener('arc-remote-disconnected', this.arcsRemoteDisconnected)

    if (this.enabled) {
      window.removeEventListener('stickmove', this.onJoystickMove)
      window.removeEventListener('devicebump', this.onDeviceBump)
    }
  },

  /**
   * Activate remote event listeners and add joystick event listeners
   */
  arcsRemoteConnected () {
    console.debug('[ArcGamepadControls] connected')
    window.addEventListener('stickmove', this.onJoystickMove)
    window.addEventListener('devicebump', this.onDeviceBump)

    this.el.sceneEl.emit('arc-remote-add-listener', {
      events: [
        'stickmove',
        'devicebump'
      ]
    })

    this.enabled = true
  },

  /**
   * Remove joystick event listeners
   */
  arcsRemoteDisconnected () {
    console.debug('[ArcGamepadControls] disconnected')
    window.removeEventListener('stickmove', this.onJoystickMove)
    window.removeEventListener('devicebump', this.onDeviceBump)

    this.enabled = false
  },

  /**
   * Extract movement data from incoming events
   * @param {CustomEvent} event
   */
  onJoystickMove (event) {
    const { side, x, y } = event.detail

    if (side === 1) {
      this.rx = x
      this.ry = y

      return
    }

    this.x = x
    this.y = y
    this.sprintFactor = Math.abs(this.y) === 1 ? this.data.sprintFactor : 1
  },

  /**
   * Handle devicebump events (up = jump, down = crouch)
   * @param {CustomEvent} event
   */
  onDeviceBump (event) {
    let crouching

    switch (event.detail.direction) {
      case 'up':
        this.el.emit('jump', true)
        break
      case 'down':
        crouching = this.crouchFactor !== 1
        this.crouchFactor = crouching ? 1 : this.crouchFactor
        this.el.emit('crouch', crouching)
        break
    }
  },

  /**
   * Whether this component is currently calculating the velocity
   * @return {boolean}
   * @public
   */
  isVelocityActive () {
    return this.enabled && (this.y !== 0 || this.x !== 0 || this.rx !== 0 || this.ry || 0)
  },

  /**
   * Calculate the changes in the player's velocity
   * @param {Number} delta
   * @return {Vector3}
   * @public
   */
  getVelocityDelta (delta) {
    if (!this.enabled) {
      this.velocity.set(0, 0, 0)
      return this.velocity
    }

    const scalarFactor = delta * 0.001 * this.sprintFactor * this.crouchFactor

    return this.velocity
      .set(this.x, 0, this.y)
      .multiplyScalar(scalarFactor)
      .clone()
  }
}
