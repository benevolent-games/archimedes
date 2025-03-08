
import {setupEureka} from "./eureka.js"

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

const eureka = setupEureka<MyContext, MyComponents>()

const physicsSystem = eureka.system("physics")
	.select("physical", "spatial")
	.fn((entities, assembly) => {

		assembly.context // user-defined context
		assembly.create({health: 100}) // can create entities and stuff

		for (const [id, entity] of entities) {
			entity.physical // the physical component
			entity.spatial // the spatial component
		}
	})

const assembly = eureka.assembly(
	new MyContext(), // every system gets access to our context
	[physicsSystem], // here's an array of all the systems
)

// creating some entities
assembly.create({health: 100})
assembly.create({
	physical: {mass: 5},
	spatial: {
		position: [1, 2, 3],
		rotation: [0, 0, 0, 1],
	},
})

assembly.execute() // execute all systems

