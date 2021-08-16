import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { RenderedGraph } from 'factorio-graph-display'
import { RenderedBlueprint } from 'factorio-blueprint-renderer'
import { Button, TextField, Container, Box, Grid, Switch, FormControlLabel } from '@material-ui/core'
import { Payload, Result } from '../worker'


export default function Home() {
    const workerRef = useRef<Worker>()

    const [generationResult, setGenerationResult] = useState<Result>(null);
    const [blueprintLoading, setBlueprintLoading] = useState(false);

    const [inputs, setInputs] = useState("");
    const [outputs, setOutputs] = useState("");
    const [splitters, setSplitters] = useState("");

    const [realisticRender, setRealisticRender] = useState(false);

    useEffect(() => {
        workerRef.current = new Worker(new URL("../worker.ts", import.meta.url))
        workerRef.current.onmessage = (evt) => {
            console.log("WORKER FINISHED, RESULT: ", evt)
            setGenerationResult(evt.data)
            setBlueprintLoading(false)
        }
        workerRef.current.onerror = function (event) {
            throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
        }
    }, [blueprintLoading]
    )

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setGenerationResult(null)
        setBlueprintLoading(true)
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
                        justifyContent="center"
                    >
                        <form onSubmit={handleFormSubmit}>
                            <Grid style={{ display: "flex", justifyContent: "center" }}
                                container
                                item
                            >
                                <Box m={4}>
                                    <TextField id="standard-basic" label="Inputs" value={inputs} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setInputs(e.target.value)} />
                                    <TextField id="standard-basic" label="Outputs" value={outputs} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setOutputs(e.target.value)} />
                                    <TextField id="standard-basic" label="Splitters" value={splitters} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSplitters(e.target.value)} />
                                </Box>
                            </Grid>
                            <Grid container item style={{ display: "flex", justifyContent: "center" }}>
                                <Box mt={4} mb={4}>
                                    <Box mr={4}>
                                        <Button variant="contained" color="primary" type="submit" value="Submit">Generate</Button>
                                    </Box>
                                    <FormControlLabel
                                        control={<Switch size="small" checked={realisticRender} onChange={(e) => setRealisticRender(e.target.checked)} />}
                                        label="Realistic Render" />
                                </Box>
                            </Grid>
                            <Grid container item style={{ overflow: "auto", maxWidth: 1000, backgroundColor: '#f0f0f0' }}>
                                    {blueprintLoading
                                        ? <h1>Loading</h1>
                                        : generationResult && (
                                        !generationResult?.isError
                                            ? realisticRender
                                                ? generationResult.blueprint
                                                    ? <RenderedBlueprint blueprintData={generationResult.blueprint} isLoading={blueprintLoading}></RenderedBlueprint>
                                                    : <h1>No realistic render found.</h1>
                                            : <RenderedGraph nodes={generationResult.nodes}></RenderedGraph>
                                        : <h1>An error has occured</h1>)
                                }
                            </Grid>
                        </form>
                    </Grid>
                </Container>
            </body>
        </div>
    );
}