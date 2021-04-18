import Head from 'next/head'
import React from 'react'
import generate from 'factorio-balancer-generator'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={OnGenerateClick}>Hello</button>
      </div>
    </div>
  )
}

function OnGenerateClick() {
  console.log("Hello")
  console.log(generate(3, 3, 4))
}
