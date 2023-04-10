import {TextField,Button,Alert,Stack, Box} from "@mui/material"
import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";

const LoginPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const setAuthToken = useStore(state => state.setAuthToken);
    const setUserId = useStore(state => state.setUserId);

    const login = () => {
        axios.post(API_URL + "users/login", {
            email: email,
            password: password
        }).then((response) => {
            try {
                setAuthToken(response.data.token);
                setUserId(response.data.userId);
                setHasError(false);
            } catch (error) {
                setHasError(true);
                setErrorMessage("error on client side")
            }
        }, (error) => {
            setHasError(true);
            if (error.status === 400) {
                setErrorMessage("invalid login input")
            } else if (error.status === 401) {
                setErrorMessage("the password or the email are wrong.")
            } else {
                setErrorMessage("Internal Server Error")
            }
        })
    }

    return (
        <Box display="flex"
             flexDirection="column"
             alignItems="center">
            <Stack
                component="form"
                spacing={2}
                noValidate
                autoComplete="off"
            >
                <Box sx={{height:60}}/>
                <TextField id="emailInput" label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value)}}/>
                <TextField id="passwordInput" label="Password" type="password" variant="outlined" onChange={(e) => {setPassword(e.target.value)}}/>
                <Button variant="contained" onClick={login}>Login</Button>
                {hasError? <Alert severity="error">{errorMessage}</Alert> : ""}
            </Stack>
        </Box>
    )
}

export default LoginPage;