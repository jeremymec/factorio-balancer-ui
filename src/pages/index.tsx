import Head from 'next/head'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { RenderedBlueprint } from 'factorio-blueprint-renderer'
import { Button, TextField, Container, Box, Grid, Input } from '@material-ui/core'


export default function Home() {
    // const workerRef = useRef<Worker[]>([]);

    const [workers, setWorkers] = useState([])

    const [blueprintData, setBlueprintData] = useState(undefined);
    const [blueprintLoading, setBlueprintLoading] = useState(true);
    
    const [inputs, setInputs] = useState("");
    const [outputs, setOutputs] = useState("");
    const [splitters, setSplitters] = useState("");

    const workerCount = 10;

    const workerKeepAlive = useRef(false);

    useEffect(() => {
        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(new URL("../worker.ts", import.meta.url));
            setWorkers([worker])

            worker.onmessage = (evt) => {
                setBlueprintData(evt.data);
                setBlueprintLoading(false);
                workerKeepAlive.current = false;
            }

            worker.onerror = (evt) => {
                throw new Error(evt.message + " (" + evt.filename + ":" + evt.lineno + ")");
            }
        }
        console.log("Workers" + workers)
    }, [])

    useEffect(() => {

        const keepalive = () => {
            if (workerKeepAlive.current) {
                for (let i = 0; i < workerCount; i++) {
                    console.log("Workers in keep alive" + workers)
                    const worker = workers[i];
                    worker.postMessage({
                        payload: {
                            inputs: Number(inputs),
                            outputs: Number(outputs),
                            splitters: Number(1 + i)
                        }
                    });
                }
            }

            setTimeout(keepalive, 500);
        };

        setTimeout(keepalive, 500);
    }, [workerKeepAlive.current]);

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        workerKeepAlive.current = true
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
                                    <TextField id="standard-basic" label="Splitters" value={splitters} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSplitters(e.target.value)} />
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