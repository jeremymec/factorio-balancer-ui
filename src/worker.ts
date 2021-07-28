import { generateNodes } from 'factorio-balancer'; 

const ctx: Worker = self as any;

export interface Payload {
  inputs: number,
  outputs: number,
}

ctx.addEventListener('message', (event) => {

  const inputs = event.data.inputs
  const outputs = event.data.outputs

  console.log("Inputs: " + inputs)
  console.log("Outputs: " + outputs)

  const result = generateNodes(2, 3, 6)
  console.log(result)
  if (!!result) {
    ctx.postMessage(result);
  }
})