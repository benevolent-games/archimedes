
import Sparrow from "sparrow-rtc"
import {Netfibers} from "./netfibers.js"

export type HubConnectionFn = (fibers: Netfibers) => () => void

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
				return hub.#invoke(fibers)
			},
		})

		return {sparrow, hub}
	}

	#fns = new Set<HubConnectionFn>()

	#invoke(fibers: Netfibers) {
		const disconnects: (() => void)[] = []
		for (const fn of this.#fns) {
			disconnects.push(fn(fibers))
		}
		return () => disconnects.forEach(d => d())
	}

	onConnected(fn: HubConnectionFn) {
		this.#fns.add(fn)
		return () => this.#fns.delete(fn)
	}
}

