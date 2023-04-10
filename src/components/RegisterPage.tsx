import {TextField,Button,Alert,Stack, Box} from "@mui/material"
import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";

const RegisterPage = () => {
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [success, setSuccess] = React.useState(false);

    const setAuthToken = useStore(state => state.setAuthToken);
    const setUserId = useStore(state => state.setUserId);
    const register = () => {
        axios.post(API_URL + "users/register", {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }).then((response) => {
            try {
                const userId: number = response.data.userId;
                axios.post(API_URL + "users/login", {
                    email: email,
                    password: password
                }).then((response) => {
                    try {
                        setAuthToken(response.data.token);
                        setUserId(userId);
                        setSuccess(true);
                        setHasError(false);
                    } catch (error) {
                        setHasError(true);
                        setErrorMessage("failed to login")
                    }
                }, (error) => {
                    setHasError(true);
                    setErrorMessage("failed to login")
                })
            } catch {
                setHasError(true);
                setErrorMessage("Internal Server Error")
            }
        }, (error) => {
            setHasError(true);
            if (error.status === 400) {
                setErrorMessage("invalid registration input")
            } else if (error.status === 403) {
                setErrorMessage("email already in use.")
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
                <Box sx={{height:30}}/>
                <TextField id="firstNameInput" label="First Name" variant="outlined" onChange={(e) => {setFirstName(e.target.value)} }/>
                <TextField id="lastNameInput" label="Last Name" variant="outlined" onChange={(e) => {setLastName(e.target.value)}}/>
                <TextField id="emailInput" label="Email" variant="outlined" onChange={(e) => {setEmail(e.target.value)}}/>
                <TextField id="passwordInput" label="Password" type="password" variant="outlined" onChange={(e) => {setPassword(e.target.value)}}/>
                <Button variant="contained" onClick={register}>Register</Button>
                {success? <Alert severity="success">successfully registered and logged in</Alert>: ""}
                {hasError? <Alert severity="error">{errorMessage}</Alert> : ""}
            </Stack>
        </Box>
    )
}

export default RegisterPage;