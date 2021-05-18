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
    workerRef.current.postMessage({ inputs: 1, outputs: 1, splitters: 1 })
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
      <MyComponent blueprint={blueprintJSON} />
    </div>
  )
}

let blueprintJSON = {
  "blueprint": {
      "icons": [
          {
              "signal": {
                  "type": "item",
                  "name": "transport-belt"
              },
              "index": 1
          }
      ],
      "entities": [
          {
              "entity_number": 1,
              "name": "transport-belt",
              "position": {
                  "x": 19.5,
                  "y": 9.5
              },
              "direction": 2
              RIGHT BELT
          },
          {
              "entity_number": 2,
              "name": "transport-belt",
              "position": {
                  "x": 19.5,
                  "y": 10.5
              },
              "direction": 4
              DOWN BELT
          },
          {
              "entity_number": 3,
              "name": "transport-belt",
              "position": {
                  "x": 18.5,
                  "y": 10.5
              }
              UP BELT
          },
          {
              "entity_number": 4,
              "name": "transport-belt",
              "position": {
                  "x": 20.5,
                  "y": 10.5
              },
              "direction": 2
              RIGHT BELT
          }
      ],
      "item": "blueprint",
      "version": 281479273840640
  }
}