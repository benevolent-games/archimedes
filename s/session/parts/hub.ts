
import {Spoke} from "./spoke.js"
export type SpokeListener = (spoke: Spoke) => () => void

export class Hub {
	#listeners = new Set<SpokeListener>()

	/** an incoming spoke has appeared, dispatch all onSpoke listeners */
	invoke(spoke: Spoke) {
		const disconnectedFns: (() => void)[] = []
		for (const fn of this.#listeners) {

			// call every spoke listener
			const spokeDisconnected = fn(spoke)

			// accumulate each listener's disconnected callback
			disconnectedFns.push(spokeDisconnected)
		}

		// when this spoke is disconnected, call every listener's disconnected callback
		return () => disconnectedFns.forEach(d => d())
	}

	/** add a spoke listener to respond to incoming spokes */
	onSpoke(fn: SpokeListener) {
		this.#listeners.add(fn)

		// callback to remove this listener
		return () => void this.#listeners.delete(fn)
	}
}

