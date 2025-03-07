
import {AuthorId} from "./types.js"
import {Fiber} from "./parts/fiber.js"
import {Bucket} from "../tools/bucket.js"
import {Parcel} from "./parts/parcels/types.js"
import {ParcelInbox} from "./parts/parcels/inbox.js"
import {Parceller} from "./parts/parcels/parceller.js"
import {Ping, Pingponger, Pong} from "./parts/pingponger.js"

export type Datagram<Data> = ["data", Data]

export type Mail<Data> = (
	| Ping
	| Pong
	| ["data", Data]
)

export class Liaison<Data> {
	pingponger: Pingponger
	inbox = new ParcelInbox<Mail<Data>>()
	parceller = new Parceller<Mail<Data>>()
	outbox = new Bucket<Parcel<Mail<Data>>>()

	constructor(
			/** author id of the remote partner (it's their id, not ours) */
			public authorId: AuthorId,

			public fiber: Fiber<Parcel<Mail<Data>>[]>,
		) {
		this.pingponger = new Pingponger(p => {
			const parcel = this.parceller.wrap(p)
			fiber.unreliable.send([parcel])
		})
	}

	queue(data: Data) {
		const parcel = this.parceller.wrap(["data", data])
		this.outbox.give(parcel)
	}

	send(data?: Data) {
		const parcels = this.outbox.take()
		if (data) parcels.push(this.parceller.wrap(["data", data]))
		this.fiber.unreliable.send(parcels)
	}

	recv() {
		const datas: Data[] = []
		for (const message of this.inbox.take()) {
			switch (message[0]) {
				case "ping":
				case "pong":
					this.pingponger.receive(message)
					break
				default:
					datas.push(message[1])
			}
		}
		return datas
	}
}

