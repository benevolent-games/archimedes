
import {Batch, Schema} from "../types.js"

export function aggregateBatches<xSchema extends Schema>(
		batches: Batch<xSchema>[]
	): Batch<xSchema> {

	let state: xSchema["state"] | undefined
	let inputs: xSchema["input"][] = []
	let deltas: xSchema["delta"][] = []

	for (const batch of batches) {
		if (batch.state !== undefined) state = batch.state
		if (batch.deltas !== undefined) deltas.push(...batch.deltas)
		if (batch.inputs !== undefined) inputs.push(...batch.inputs)
	}

	const finalDeltas = deltas.length === 0
		? undefined
		: deltas

	const finalInputs = inputs.length === 0
		? undefined
		: inputs

	return (state === undefined)
		? {deltas: finalDeltas, inputs: finalInputs}
		: {state}
}

