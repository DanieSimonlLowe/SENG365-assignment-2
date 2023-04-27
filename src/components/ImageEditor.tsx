import {
    CircularProgress,
    Button, Alert
} from "@mui/material"
import React from "react";
import Image from "../classes/images"
import CSS from "csstype";

const ImageEditor = (image: (Image|undefined), setImage: (i: Image) => void ) => {
    const [uploading, setUploading] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const imageStyle: CSS.Properties = {
        maxHeight: "40vh"
    }

    const get_image = () => {
        if (uploading) {
            return <CircularProgress style={imageStyle}/>
        }else if (image === undefined) {
            return <img src={require("../images/movie.png")} style={imageStyle} alt="current image (click to change image)"/>
        } else {
            return <img src={image?.getSource()} style={imageStyle} alt="current image (click to change image)"/>
        }
    }

    const getImage = (event: React.ChangeEvent) => {
        if (!uploading) {
            if (!((event.currentTarget as any) instanceof HTMLInputElement)) {
                setHasError(true);
                setErrorMessage("something happened with the loading processing of the event.");
                return;
            }
            const input: HTMLInputElement = event.currentTarget as any;
            if (!window.FileReader || input === null || !input.files) {
                setHasError(true);
                setErrorMessage("your browser dose not support uploading files.");
                return;
            } else {
                setUploading(true);
                const file:File = input.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    // @ts-ignore
                    const array = new Uint8Array(reader.result);
                    setImage(new Image(array));
                }
                reader.onloadend = (e) => {
                    setUploading(false);
                }
                reader.readAsArrayBuffer(file);
            }
        }
    }

    return (
        <div>
            <Button
                variant="contained"
                component="label"
            >
                {get_image()}
                Upload File
                <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/gif"
                    onChange={getImage}
                />
            </Button>
            {hasError?
                <Alert severity="error">{errorMessage}</Alert>:""
            }
        </div>
    )
}
