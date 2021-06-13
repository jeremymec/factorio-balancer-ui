import generate from 'factorio-balancer'; 

const ctx: Worker = self as any;

interface Payload {
  inputs: number,
  outputs: number,
  splitters: number
}

ctx.addEventListener('message', (event) => {
  console.log("alive")
  const { inputs, outputs, splitters } = event.data.payload as Payload;

  console.log("Inputs: " + inputs)
  console.log("Outputs: " + outputs)
  console.log("Splitters: " + splitters)

  const result = generate(inputs, outputs, splitters, [1, 1], { iterationLimit: 1000})
  if (!!result) {
    ctx.postMessage(result);
  }
})