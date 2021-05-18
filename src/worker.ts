import generate from 'factorio-balancer'; 

const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
  console.log("Generating")

  const result = generate(3,3,4)
  console.log("Done")
  ctx.postMessage(result)
})