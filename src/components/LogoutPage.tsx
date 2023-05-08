import {Button, Box, Alert} from "@mui/material"
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";
import React from "react";
const LogoutPage = () => {
    const token = useStore(state => state.authToken);
    const setAuthToken = useStore(state => state.setAuthToken);
    const setUserId = useStore(state => state.setUserId);
    let callBacks = 0;

    const [hasError, setHasError] = React.useState<boolean>(false);

    const logOut = () => {
        axios.post(API_URL+'users/logout',{}, {
            headers: {
                'X-Authorization': token
        }}).then ( (response) => {
            setAuthToken("");
            setUserId(-1);
        }, (error) => {
            if (error.response.status === 401) {
                setAuthToken("");
                setUserId(-1);
            }
            else if (callBacks < 10) {
                setTimeout(logOut, 500);
                callBacks += 1;
            } else {
                setHasError(true);
            }
        })
    }

    const logOutButton = () => {
        callBacks = 0;
        logOut();
    }

    return (
        <Box textAlign='center' >
            <Box sx={{height:'40ex'}}/>
            {hasError? <Alert severity="error">failed to log out please try again.</Alert> : ""}
            <Button variant='contained' onClick={logOutButton}>
                Log Out
            </Button>
        </Box>
    )
}

export default LogoutPage;