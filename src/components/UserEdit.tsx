import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";
import {Alert, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Box} from "@mui/material";
import ImageEditor from "./ImageEditor";
import Image from "../classes/images"

const UserEdit = () => {
    const userId = useStore(state => state.userId);
    const token = useStore(state => state.authToken);

    const [oldEmail, setOldEmail] = React.useState("");
    const [email, setEmail] = React.useState("loading");
    const [oldFirstName, setOldFirstName] = React.useState("");
    const [firstName, setFirstName] = React.useState("loading");
    const [oldLastName, setOldLastName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordRetype, setPasswordRetype] = React.useState("");

    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [open, setOpen] = React.useState(false);
    const [dialogPassword, setDialogPassword] = React.useState("");
    const openRef = React.useRef(false);
    React.useEffect(() => {
        openRef.current = open;
    }, [open]);
    let [image, setImage] = React.useState<Image>();
    const [fileType, setFileType] = React.useState("");
    const [oldImage, setOldImage] = React.useState<Image>();

    React.useEffect(() => {
        const getUser = () => {
            axios.get(API_URL + "users/" + userId,{
                headers: {
                    'X-Authorization': token
                }})
                .then((response) => {
                    setEmail(response.data.email);
                    setOldEmail(response.data.email);
                    setFirstName(response.data.firstName);
                    setOldFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setOldLastName(response.data.lastName);
                })
        }
        getUser();
    }, [userId])

    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"users/"+userId+"/image", {
                responseType: 'arraybuffer',
                headers: {'content-type': 'none'}
            })
                .then((response) => {
                    try {
                        const type: string = response.headers['content-type'] as string;
                        if (type !== undefined && type !== 'none') {
                            let temp: Image = new Image(response.data);
                            setImage(temp);
                            setOldImage(temp);
                        }
                    } catch (e) {

                    }
                }, (error) => {

                })
        }
        getImage()
    },[userId])


    const submit = () => {
        if (fileType !== "" && image !== undefined && image !== null && image !== oldImage) {
            axios.put(API_URL+"users/"+userId+"/image",image.data, {
                headers: {
                    'X-Authorization': token,
                    'content-type': fileType
                }}).then((response) => {
                    setHasError(false);
                },
                (error) => {
                    if (!hasError) {
                        setErrorMessage("failed to upload image, but rest of the film went though");
                    }
                    setHasError(true);
                });
        }


        let data: { [id:string] : (string|number); } = {};
        if (oldEmail !== email) {
            data.email = email;
        }
        if (oldFirstName !== firstName) {
            data.fisrtName = firstName;
        }
        if (oldLastName !== lastName) {
            data.lastName = lastName;
        }

        let hasPassword = false;

        const waitForOpen = async () => {
            if (openRef.current) {
                setTimeout(runPatch,250);
            } else {
                setTimeout(waitForOpen,100);
            }
        }
        const runPatch = async () => {
            if (openRef.current) {
                setTimeout(runPatch,250);
            } else {
                if (hasPassword) {
                    data.currentPassword = dialogPassword;
                }
                axios.patch(API_URL+"users/"+userId, data, {headers: {
                        'X-Authorization': token
                    }}).then((response) => {
                    setHasError(false);
                }, (error) => {
                    setHasError(true);
                    const status: number = error.response.status;
                    if (status === 400) {
                        setErrorMessage("invalid input.")
                    } else if (status === 401) {
                        if (hasPassword) {
                            setErrorMessage("wrong password.")
                        } else {
                            setErrorMessage("issue with user validation.")
                        }
                    } else if (status === 404) {
                        setErrorMessage("can't find you in the database.")
                    } else {
                        setErrorMessage("a server error.")
                    }
                })
            }
        }
        if (password !== "") {
            if (password.length < 6) {
                setHasError(true);
                setErrorMessage("password to short.");
                return;
            } else if (password !== passwordRetype) {
                setHasError(true);
                setErrorMessage("password and password retype are not the same.");
                return;
            } else {
                data.password = password;
                setOpen(true);
                hasPassword = true;
            }
        }

        if (hasPassword) {
            setTimeout(waitForOpen,10);
        } else {
            setTimeout(runPatch,0);
        }

    }

    return (
        <Stack component="div" spacing={2}>
            <Box sx={{height:30}}/>
            <ImageEditor image={image} setImage={setImage} setFileType={setFileType} defaultImage={"profile.jpg"}/>
            <TextField id="outlined-basic" type="email" label="Email" variant="outlined" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            <TextField id="outlined-basic" label="First Name" variant="outlined" value={firstName} onChange={(e) => {setFirstName(e.target.value)}}/>
            <TextField id="outlined-basic" label="Last Name" variant="outlined" value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>
            <TextField id="outlined-basic" type="password" label="Password" variant="outlined" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            <TextField id="outlined-basic" type="password" label="Retype Password" variant="outlined" value={passwordRetype} onChange={(e) => {setPasswordRetype(e.target.value)}}/>
            <Button variant="contained" onClick={submit}>submit</Button>
            {hasError? <Alert severity="error">{errorMessage}</Alert> : ""}
            <Dialog open={open} onClose={() => {setOpen(false)}}>
                <DialogTitle>input your password.</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="password" type="password" fullWidth variant="standard"
                               onChange={(e) => {setDialogPassword(e.target.value)}} value={dialogPassword}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setOpen(false);}} >Submit</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

export default UserEdit;