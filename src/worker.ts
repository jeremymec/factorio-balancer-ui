import { FactorioNode, Blueprint, generateBlueprint } from 'factorio-balancer'; 

const ctx: Worker = self as any;

export interface Payload {
  inputs: number,
  outputs: number,
  splitters: number
}

export interface Result {
  isError: boolean,
  nodes: FactorioNode[]
  blueprint: Blueprint | undefined
}

ctx.addEventListener('message', (event) => {

  const inputs = event.data.inputs
  const outputs = event.data.outputs
  const splitters = event.data.splitters

  console.log("Inputs: " + inputs)
  console.log("Outputs: " + outputs)
  console.log("Splitters: " + splitters)

  try {
    const result = generateBlueprint(inputs, outputs, splitters)
    ctx.postMessage({
      isError: false,
      nodes: result.nodes,
      blueprint: result.blueprint
    });
  } catch {
    ctx.postMessage({
      isError: true
    })
  }

})