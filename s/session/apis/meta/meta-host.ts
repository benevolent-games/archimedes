
import {fns} from "renraku/x/index.js"
import {Liaison} from "../../../core/liaison.js"
import {Authority} from "../../../core/authority.js"

export const makeMetaHostApi = (options: {
		authority: Authority<any>,
		liaison: Liaison<any>
	}) => fns({

	async hello() {
		return {
			hostAuthorId: options.authority.authorId,
			clientAuthorId: options.liaison.authorId,
		}
	},
})

