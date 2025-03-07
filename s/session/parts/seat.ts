
import {Spoke} from "./spoke.js"
import {endpoint, Fns} from "renraku"
import {FiberRpc} from "./fiber-rpc.js"
import {Liaison} from "../../core/liaison.js"

export class Seat {
	constructor(
			private spoke: Spoke,
			private liaison: Liaison<any>,
		) {
	}

	get authorId() {
		return this.liaison.authorId
	}

	get rtt() {
		return this.liaison.pingponger.averageRtt
	}

	get userland() {
		return this.spoke.fibers.sub.userland
	}

	disconnect() {
		this.spoke.disconnect()
	}

	userlandApi<RemoteFns extends Fns>(seat: Seat, hostFns: RemoteFns) {
		return new FiberRpc<RemoteFns>(seat.userland, endpoint(hostFns)).remote
	}
}

