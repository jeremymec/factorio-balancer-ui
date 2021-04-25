import generate from 'factorio-balancer'; 

const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
  const result = generate(1,2,1)
  debugger
  console.log("Hello")
  ctx.postMessage('Better!')
})