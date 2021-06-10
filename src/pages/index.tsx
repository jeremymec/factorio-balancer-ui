import Head from 'next/head'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { RenderedBlueprint } from 'factorio-blueprint-renderer'
import { Button, TextField, Container, Box, Grid } from '@material-ui/core'

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
      <body>
        <Container maxWidth="sm">
          <Grid container spacing={3}>
            <Grid container item>
              <Box>
                <form>
                  <TextField id="standard-basic" label="Inputs" />
                  <TextField id="standard-basic" label="Outputs" />
                </form>
              </Box>
            </Grid>
            <Grid container item>
              <Box>
                <Button variant="contained" color="primary" onClick={handleWork}>Generate</Button>
              </Box>
            </Grid>
            <Grid item style={{flex: 1}}>
              <RenderedBlueprint blueprintData={blueprintData} isLoading={blueprintLoading} />
            </Grid>
          </Grid>
        </Container>
      </body>
    </div>
  )
}