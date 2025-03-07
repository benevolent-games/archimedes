
import {Fns} from "renraku"
import type {makeMetaHostApi} from "./meta-host.js"
import type {makeMetaClientApi} from "./meta-client.js"

export type CustomApi = {
	host: Fns
	client: Fns
}

export type MetaApi = {
	host: ReturnType<typeof makeMetaHostApi>
	client: ReturnType<typeof makeMetaClientApi>
}

