import { generateNodes, FactorioNode } from 'factorio-balancer'; 

const ctx: Worker = self as any;

export interface Payload {
  inputs: number,
  outputs: number,
  splitters: number
}

export interface Result {
  isError: boolean,
  nodes: FactorioNode[]
}

ctx.addEventListener('message', (event) => {

  const inputs = event.data.inputs
  const outputs = event.data.outputs
  const splitters = event.data.splitters

  console.log("Inputs: " + inputs)
  console.log("Outputs: " + outputs)
  console.log("Splitters: " + splitters)

  try {
    const nodes = generateNodes(inputs, outputs, splitters)
    if (!!nodes) {
      ctx.postMessage({
        isError: false,
        nodes: nodes
      });
    }
  } catch {
    ctx.postMessage({
      isError: true,
      nodes: []
    })
  }

})