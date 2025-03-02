
import {Fiber} from "./utils/fiber.js"
import {Bucket} from "./utils/bucket.js"
import {Schema, Batch} from "./types.js"
import {Parcel} from "./utils/parcels/types.js"
import {ParcelInbox} from "./utils/parcels/inbox.js"
import {Parceller} from "./utils/parcels/parceller.js"
import {Ping, Pingponger, Pong} from "./utils/pingponger.js"
import {aggregateBatches} from "./utils/aggregate-batches.js"

export type LiaisonMessage<xSchema extends Schema> = (
	| Ping
	| Pong
	| ["batch", Batch<xSchema>]
)

export class Liaison<xSchema extends Schema> {
	pingponger: Pingponger
	outbox = new Bucket<Batch<xSchema>>()
	inbox = new ParcelInbox<LiaisonMessage<xSchema>>()
	parceller = new Parceller<LiaisonMessage<xSchema>>()

	constructor(

			/** author id of the remote partner (it's their id, not ours) */
			public authorId: number,

			public fiber: Fiber<Parcel<LiaisonMessage<xSchema>>>,
		) {

		this.pingponger = new Pingponger(p => {
			const parcel = this.parceller.wrap(p)
			fiber.unreliable.send(parcel)
		})
	}

	queue(batch: Batch<xSchema>) {
		this.outbox.give(batch)
	}

	send(batch?: Batch<xSchema>) {
		const batches = this.outbox.take()
		if (batch) batches.push(batch)
		const aggregate = aggregateBatches(batches)
		const parcel = this.parceller.wrap(["batch", aggregate])
		this.fiber.unreliable.send(parcel)
	}

	recv() {
		const batches: Batch<xSchema>[] = []

		for (const message of this.inbox.take()) {
			const [kind, x] = message
			switch (kind) {
				case "ping":
				case "pong":
					this.pingponger.receive(message)
					break

				case "batch":
					batches.push(x)
					break

				default:
					console.warn(`unknown message kind "${kind}"`)
			}
		}

		const aggregate = aggregateBatches(batches)

		// overwriting the authorId on incoming inputs,
		// to prevent spoofing
		for (const input of aggregate.inputs ?? [])
			input.authorId = this.authorId

		return aggregate
	}
}

