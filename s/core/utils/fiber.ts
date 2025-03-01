
import {StdCable} from "sparrow-rtc"
import {encode, decode} from "@msgpack/msgpack"

import {pub} from "../../tools/pub.js"
import {disposers} from "../../tools/disposers.js"
import {onChannelMessage} from "./on-channel-message.js"

/** an arbitrary data channel */
export class Bicomm<M> {
	send = pub<[M]>()
	recv = pub<[M]>()
}

export type FiberData<F extends Fiber<any>> = (
	F extends Fiber<infer M>
		? M
		: never
)

/** a virtualized cable */
export class Fiber<M> {
	reliable = new Bicomm<M>()
	unreliable = new Bicomm<M>()

	/** this fiber becomes a proxy of the cable */
	proxyCable(cable: StdCable) {
		this.reliable.send.on(m => cable.reliable.send(encode(m)))
		this.unreliable.send.on(m => cable.unreliable.send(encode(m)))
		return disposers(
			onChannelMessage(cable.reliable, b => this.reliable.recv(decode(b) as M)),
			onChannelMessage(cable.unreliable, b => this.unreliable.recv(decode(b) as M)),
		)
	}

	/** produce a partner fiber which will receive messages sent from this fiber, and vice-versa */
	makeEntangledPartner() {
		const partner = new Fiber<M>()
		this.reliable.send.on(m => partner.reliable.recv(m))
		this.unreliable.send.on(m => partner.unreliable.recv(m))
		partner.reliable.send.on(m => this.reliable.recv(m))
		partner.unreliable.send.on(m => this.unreliable.recv(m))
		return partner
	}

	/** create a fiber as a proxy to the given cable */
	static fromCable<M>(cable: StdCable) {
		const fiber = new Fiber<M>()
		fiber.proxyCable(cable)
		return fiber
	}

	/** create two fibers that are welded together: sending to one is recieved by the other */
	static entangledPair<M>() {
		const alice = new Fiber<M>()
		const bob = new Fiber<M>()
		alice.reliable.send.on(m => bob.reliable.recv(m))
		alice.unreliable.send.on(m => bob.unreliable.recv(m))
		bob.reliable.send.on(m => alice.reliable.recv(m))
		bob.unreliable.send.on(m => alice.unreliable.recv(m))
		return [alice, bob] as [Fiber<M>, Fiber<M>]
	}

	/** split a main fiber into several virtual sub fibers */
	static multiplex<C extends {[key: string]: Fiber<any>}>(fibers: C) {
		const megafiber = new Fiber<{[K in keyof C]: [K, FiberData<C[K]>]}[keyof C]>()

		for (const [key, subfiber] of Object.entries(fibers)) {
			subfiber.reliable.send.on(x => megafiber.reliable.send([key, x]))
			subfiber.unreliable.send.on(x => megafiber.unreliable.send([key, x as any]))
		}

		megafiber.reliable.recv.on(([key, data]) => {
			const subfiber = fibers[key as any]
			if (!subfiber) throw new Error(`unknown subfiber "${key as any}"`)
			subfiber.reliable.recv(data as any)
		})

		megafiber.unreliable.recv.on(([key, data]) => {
			const subfiber = fibers[key as any]
			if (!subfiber) throw new Error(`unknown subfiber "${key as any}"`)
			subfiber.unreliable.recv(data as any)
		})

		return megafiber
	}
}

