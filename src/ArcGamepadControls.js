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
     * Normalized movement force
     * @type {Number}
     */
    this.force = 0

    /**
     * Movement direction in radians
     * @type {Number}
     */
    this.radians = 0

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
    window.addEventListener('stickmove', this.onJoystickMove)
    window.addEventListener('devicebump', this.onDeviceBump)

    this.el.sceneEl.emit('arc-remote-add-listener', {
      events: ['stickmove']
    })

    this.enabled = true
  },

  /**
   * Remove joystick event listeners
   */
  arcsRemoteDisconnected () {
    window.removeEventListener('stickmove', this.onJoystickMove)
    window.removeEventListener('devicebump', this.onDeviceBump)

    this.enabled = false
  },

  /**
   * Extract movement data from incoming events
   * @param {CustomEvent} event
   */
  onJoystickMove (event) {
    this.radians = event.detail ? event.detail.radians : 0
    this.force = event.detail ? event.detail.force : 0

    this.sprintFactor = this.force === 1 ? this.data.sprintFactor : 1
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
    return this.enabled && this.force !== 0
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

    const scalarFactor = delta * 0.001 * this.force * this.sprintFactor * this.crouchFactor

    this.velocity.set(1, 0, 1)
    this.velocity.applyAxisAngle(this.rotationAxis, this.radians)
    this.velocity.normalize()

    this.velocity.multiplyScalar(scalarFactor)

    return this.velocity.clone()
  }
}
