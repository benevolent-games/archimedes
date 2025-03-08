
import {setupEuclid} from "./euclid.js"

export class MyContext {
	lol = "rofl"
}

// example
export type MyComponents = {
	health: number
	physical: {mass: number}
	spatial: {
		position: [number, number, number]
		rotation: [number, number, number, number]
	}
}

const euclid = setupEuclid<MyContext, MyComponents>()

const physicsSystem = euclid.system("physics")
	.select(["physical", "spatial"])
	.fn((entities, assembly) => {
		assembly.context // user-defined context
		for (const [id, entity] of entities) {
			entity.physical // the physical component
			entity.spatial // the spatial component
		}
	})

