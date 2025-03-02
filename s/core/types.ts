
export type Input<Payload = any> = {authorId: number, payload: Payload}

export type Schema = {
	state: any
	delta: any
	input: Input
}

export type Batch<xSchema extends Schema> = {
	state?: xSchema["state"]
	deltas?: xSchema["delta"][]
	inputs?: xSchema["input"][]
}

