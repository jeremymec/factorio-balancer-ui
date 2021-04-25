import Head from 'next/head'
import React, { useEffect, useRef, useCallback } from 'react'

interface BalancerParameters {
  inputs: number,
  outputs: number,
  splitters: number
}


export default function Home() {
  const workerRef = useRef<Worker>()

  useEffect(() => {
    workerRef.current = new Worker(new URL("../worker.ts", import.meta.url))
    workerRef.current.onmessage = (evt) =>
    alert(`WebWorker Response => ${evt.data}`)
  })

  const handleWork = useCallback(async () => {
    workerRef.current.postMessage({inputs: 1, outputs: 1, splitters: 1})
  }, [])

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={handleWork}>Hello</button>
      </div>
    </div>
  )
}
