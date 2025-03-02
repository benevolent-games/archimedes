
import {AuthorId, Schema, Telegram} from "../types.js"

export function handleTelegrams<xSchema extends Schema>(telegrams: Telegram<xSchema>[], callbacks: {
		state: (state: xSchema["state"], authorId: AuthorId) => void
		delta: (delta: xSchema["delta"], authorId: AuthorId) => void
		input: (input: xSchema["input"], authorId: AuthorId) => void
	}) {

	for (const [authorId, dispatches] of telegrams) {
		for (const [key, content] of dispatches) {
			switch (key) {

				case "state":
					callbacks.state(content, authorId)
					break

				case "delta":
					callbacks.delta(content, authorId)
					break

				case "input":
					callbacks.input(content, authorId)
					break
			}
		}
	}
}

