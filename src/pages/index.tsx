import Head from 'next/head'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { RenderedBlueprint } from 'factorio-blueprint-renderer'
import { Button, TextField, Container, Box, Grid, Input } from '@material-ui/core'
import { Payload } from '../worker'


export default function Home() {
    const workerRef = useRef<Worker>()

    const [blueprintData, setBlueprintData] = useState(undefined);
    const [blueprintLoading, setBlueprintLoading] = useState(true);
    
    const [inputs, setInputs] = useState("");
    const [outputs, setOutputs] = useState("");

    useEffect(() => {
        workerRef.current = new Worker(new URL("../worker.ts", import.meta.url))
        workerRef.current.onmessage = (evt) => {
          console.log("Sending blueprint")
          setBlueprintData(evt.data)
          setBlueprintLoading(false)
        }
        workerRef.current.onerror = function (event) {
          throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
        }
      }, [blueprintLoading]
    )

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const workerMessage: Payload = {
            inputs: Number(inputs),
            outputs: Number(outputs)
        }
        workerRef.current.postMessage(workerMessage)
    }

    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                <Container maxWidth="sm">
                    <Grid container spacing={3}>
                        <form onSubmit={handleFormSubmit}>
                            <Grid container item>
                                <Box>
                                    <TextField id="standard-basic" label="Inputs" value={inputs} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setInputs(e.target.value)} />
                                    <TextField id="standard-basic" label="Outputs" value={outputs} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setOutputs(e.target.value)} />
                                </Box>
                            </Grid>
                            <Grid container item>
                                <Box>
                                    <Button variant="contained" color="primary" type="submit" value="Submit">Generate</Button>
                                </Box>
                            </Grid>
                            <Grid item style={{ flex: 1 }}>
                                <RenderedBlueprint blueprintData={blueprintData} isLoading={blueprintLoading} />
                            </Grid>
                        </form>
                    </Grid>
                </Container>
            </body>
        </div>
    );
}