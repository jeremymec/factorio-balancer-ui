import Head from 'next/head'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { RenderedGraph } from 'factorio-graph-display'
import { Button, TextField, Container, Box, Grid, Input } from '@material-ui/core'
import { Payload, Result } from '../worker'


export default function Home() {
    const workerRef = useRef<Worker>()

    const [blueprintData, setBlueprintData] = useState<Result>(null);
    const [blueprintLoading, setBlueprintLoading] = useState(false);

    const [inputs, setInputs] = useState("");
    const [outputs, setOutputs] = useState("");
    const [splitters, setSplitters] = useState("");

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
            outputs: Number(outputs),
            splitters: Number(splitters)
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
                <Container>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        justify="center"
                    >
                        <form onSubmit={handleFormSubmit}>
                            <Grid
                                container
                                item
                            >
                                <Box m={3}>
                                    <TextField id="standard-basic" label="Inputs" value={inputs} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setInputs(e.target.value)} />
                                    <TextField id="standard-basic" label="Outputs" value={outputs} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setOutputs(e.target.value)} />
                                    <TextField id="standard-basic" label="Splitters" value={splitters} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSplitters(e.target.value)} />
                                </Box>
                            </Grid>
                            <Grid container item>
                                <Box>
                                    <Button variant="contained" color="primary" type="submit" value="Submit">Generate</Button>
                                </Box>
                            </Grid>
                            <Grid container item style={{ overflow: "scroll", maxWidth: 1000 }}>
                                {false &&
                                    blueprintLoading
                                    ? <h1>Loading</h1>
                                    : !blueprintData?.isError
                                        ? <RenderedGraph nodes={blueprintData.nodes}></RenderedGraph>
                                        : <h1>An error has occured</h1>
                                }
                            </Grid>
                        </form>
                    </Grid>
                </Container>
            </body>
        </div>
    );
}