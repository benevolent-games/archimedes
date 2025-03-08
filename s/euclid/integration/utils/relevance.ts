
import {Map2} from "@benev/slate"
import {EntityId} from "../../parts/types.js"
import {AuthorId} from "../../../core/types.js"

export class Relevance {
	#authors = new Map2<AuthorId, Set<EntityId>>()

	author(id: AuthorId) {
		return this.#authors.guarantee(id, () => new Set())
	}
}

