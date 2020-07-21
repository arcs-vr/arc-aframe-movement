/**
 * Shared schema definition for the control components
 * @type {Object}
 *
 * @author Barthy Bonhomme <post@barthy.koeln>
 * @license MIT
 */
export const MovementSchema = {
  sprintFactor: {
    type: 'number',
    default: 1.75
  },
  crouchFactor: {
    type: 'number',
    default: 0.75
  }
}
