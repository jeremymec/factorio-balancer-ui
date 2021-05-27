import Head from 'next/head'
import React, { useEffect, useRef, useCallback } from 'react'
import { MyComponent } from 'factorio-blueprint-renderer'

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
      {/* <MyComponent blueprint={blueprintJSON} /> */}
    </div>
  )
}

let blueprintJSON = {
  "blueprint": {
      "icons": [
          {
              "signal": {
                  "type": "item",
                  "name": "splitter"
              },
              "index": 1
          }
      ],
      "entities": [
          {
              "entity_number": 1,
              "name": "splitter",
              "position": {
                  "x": 56.5,
                  "y": -32
              },
              "direction": 2
          },
          {
              "entity_number": 2,
              "name": "splitter",
              "position": {
                  "x": 56.5,
                  "y": -30
              },
              "direction": 6
          },
          {
              "entity_number": 3,
              "name": "splitter",
              "position": {
                  "x": 57,
                  "y": -27.5
              },
              "direction": 4
          },
          {
              "entity_number": 4,
              "name": "splitter",
              "position": {
                  "x": 57,
                  "y": -25.5
              }
          }
      ],
      "item": "blueprint",
      "version": 281479273840640
  }
}