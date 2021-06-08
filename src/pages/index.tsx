import Head from 'next/head'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { RenderedBlueprint } from 'factorio-blueprint-renderer'

interface BalancerParameters {
  inputs: number,
  outputs: number,
  splitters: number
}

export default function Home() {
  const workerRef = useRef<Worker>()

  // const [blueprintPayload, setBlueprintPayload] = useState({
  //   blueprintData: undefined,
  //   isLoading: true
  // })

  const [blueprintData, setBlueprintData] = useState(undefined)
  const [blueprintLoading, setBlueprintLoading] = useState(true)

  useEffect(() => {
    // console.log("########### EFFECT USED")
    workerRef.current = new Worker(new URL("../worker.ts", import.meta.url))
    workerRef.current.onmessage = (evt) => {
      console.log("Sending blueprint")
      setBlueprintData(evt.data)
      setBlueprintLoading(false)
    }
    workerRef.current.onerror = function (event) {
      throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
    } 
  }
  )

  const handleWork = useCallback(async () => {
    //debugger
    workerRef.current.postMessage({ inputs: 1, outputs: 2, splitters: 1 })
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
      <RenderedBlueprint blueprintData = {blueprintData} isLoading = {blueprintLoading}/>
    </div>
  )
}