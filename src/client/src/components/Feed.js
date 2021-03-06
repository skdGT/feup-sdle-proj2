import {CircularProgress, Grid} from "@mui/material";
import Post from "./Post";
import axios from "axios";
import React from "react";

export default function Feed({newPost}) {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        axios.get('/p2p/feed')
            .then((res) => setData(res.data.message));
    }, [newPost])

    return (
        <Grid container justifyContent="stretch" spacing={3}>
            {!data ?
                <CircularProgress/> :
                data.map(x => {
                    return (
                        <Grid key={x.id} item xs={12}>
                            <Post timestamp={x.timestamp} author={x.author} content={x.data}/>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}