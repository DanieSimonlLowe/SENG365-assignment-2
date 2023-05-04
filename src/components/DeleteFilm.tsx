import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button} from "@mui/material";
import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";


const DeleteFilm = () => {
    const {id} = useParams();
    const token = useStore(state => state.authToken);
    const [hasError, setHasError] = React.useState(false);
    const navigate = useNavigate();

    const deleteFilm = () => {
        let error = false;
        axios.delete(API_URL+"films/"+id+"/image", {
            headers: {
                'X-Authorization': token
            }})
            .then((response) => {

            }, (error) => {
                setHasError(true);
                error = true;
            }).then((r) => {
                if (error) {
                    return;
                }
                axios.delete(API_URL+"films/"+id, {
                    headers: {
                        'X-Authorization': token
                    }})
                    .then((response) => {
                        navigate(-1);
                    }, (error) => {
                        setHasError(true);
                    });
        })

    }


    return (
        <Box textAlign='center' >
            <Box sx={{height:'40ex'}}/>
            {hasError? <Alert severity="error">failed to delete film.</Alert> : ""}
            <Button variant='contained' onClick={deleteFilm}>
                Delete Film
            </Button>
        </Box>
    )
}

export default DeleteFilm