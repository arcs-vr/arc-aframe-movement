import { MovementSchema } from './MovementSchema.js'

/**
 * A-Frame component, that creates wasd-controls for camera rigs
 * @type {object}
 *
 * @author Barthy Bonhomme <post@barthy.koeln>
 * @license MIT
 */
export const ArcKeyboardControls = {

  schema: MovementSchema,

  /**
   * Bind functions to the component and add event listeners
   */
  init () {
    /**
     * Movement Velocity
     * @type {Vector3}
     */
    this.velocity = new THREE.Vector3(0, 0, 0)

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

    this.keys = new Set()

    this.bindFunctions()
  },

  /**
   * Bind functions to this component instance
   */
  bindFunctions () {
    this.arcsRemoteConnected = this.arcsRemoteConnected.bind(this)
    this.keyListener = this.keyListener.bind(this)
  },

  /**
   * Add Event Listeners
   */
  play () {
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcsRemoteConnected)

    window.addEventListener('keydown', this.keyListener)
    window.addEventListener('keyup', this.keyListener)
  },

  /**
   * Remove Event Listeners
   */
  pause () {
    this.el.sceneEl.removeEventListener('arc-remote-connected', this.arcsRemoteConnected)

    window.removeEventListener('keydown', this.keyListener)
    window.removeEventListener('keyup', this.keyListener)
  },

  /**
   * Register 'keydown' listeners for 'arc-remotes'
   */
  arcsRemoteConnected () {
    console.debug('[ArcKeyboardControls] connected')
    this.el.sceneEl.emit('arc-remote-add-listener', {
      events: [
        'keydown',
        'keyup'
      ]
    })
  },

  /**
   * Whether this component is currently calculating the velocity
   * @return {boolean}
   * @public
   */
  isVelocityActive () {
    return this.keys.size !== 0
  },

  /**
   * Calculate the changes in the player's velocity
   * @param {Number} delta
   * @return {Vector3}
   * @public
   */
  getVelocityDelta (delta) {
    this.setAxisVelocity('x', 'keyd', 'keya')
    this.setAxisVelocity('z', 'keys', 'keyw')
    this.velocity.multiplyScalar(delta * 0.001 * this.sprintFactor * this.crouchFactor)
    return this.velocity.clone()
  },

  /**
   * Handle local and remote keyboard events
   * @param {KeyboardEvent} event
   */
  keyListener (event) {
    if (!event.code) {
      return
    }

    const lowercaseKey = event.code.toLowerCase()
    switch (event.type) {
      case 'keydown':
        this.keys.add(lowercaseKey)

        if (lowercaseKey === 'keyc') {
          this.el.emit('crouch', true)
        }

        if (lowercaseKey === 'space') {
          this.el.emit('jump', true)
        }
        break
      case 'keyup':
        this.keys.delete(lowercaseKey)

        if (lowercaseKey === 'keyc') {
          this.el.emit('crouch', false)
        }
        break
    }

    this.sprintFactor = this.keys.has('shiftleft') ? this.data.sprintFactor : 1
    this.crouchFactor = this.keys.has('keyc') ? this.data.crouchFactor : 1
  },

  /**
   * Calculate the velocity for one axis based on two keys
   * @param {String} axis
   * @param {String} pos
   * @param {String} neg
   */
  setAxisVelocity (axis, pos, neg) {
    if ((this.keys.has(neg) && this.keys.has(pos)) || (!this.keys.has(neg) && !this.keys.has(pos))) {
      this.velocity[axis] = 0
      return
    }

    if (this.keys.has(neg)) {
      this.velocity[axis] = -1
      return
    }

    if (this.keys.has(pos)) {
      this.velocity[axis] = 1
    }
  }
}
