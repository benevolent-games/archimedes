
import Sparrow from "sparrow-rtc"
import {Spoke} from "./spoke.js"
import {Netfibers} from "./netfibers.js"

export type SpokeListener = (spoke: Spoke) => () => void

export class Hub {
	static async sparrowHost(options: {
			closed: () => void
			connected: (netfibers: Netfibers) => () => void
		}) {

		const hub = new this()

		const sparrow = await Sparrow.host({
			closed: options.closed,
			welcome: _prospect => connection => {
				const fibers = Netfibers.forCable(connection.cable)
				const disconnect = () => connection.disconnect()
				const spoke = new Spoke(fibers, disconnect)
				const disconnected = hub.#invoke(spoke)
				return disconnected
			},
		})

		return {sparrow, hub}
	}

	#fns = new Set<SpokeListener>()

	#invoke(spoke: Spoke) {
		const disconnects: (() => void)[] = []
		for (const fn of this.#fns) {
			disconnects.push(fn(spoke))
		}
		return () => disconnects.forEach(d => d())
	}

	onSpoke(fn: SpokeListener) {
		this.#fns.add(fn)
		return () => this.#fns.delete(fn)
	}
}

