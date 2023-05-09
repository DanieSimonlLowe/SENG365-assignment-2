import { CardMedia} from "@mui/material";
import {Film} from "../types/films";
import {Genre} from "../types/genres";
import React from "react";
import Image from "../classes/images";
import axios from "axios";
import {API_URL} from "../Constantes";
import CSS from "csstype";

interface  IDirProps {
    dirId: number
}
const DirectorImage = (props: IDirProps) => {
    const [image, setImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);

    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"users/"+props.dirId+"/image", {
                responseType: 'arraybuffer',
                headers: {'content-type': 'none'}
            })
                .then((response) => {
                    try {
                        const type: string = response.headers['content-type'] as string;
                        if (type === undefined || type === 'none') {
                            setHasImage(false);
                        } else {
                            setImage(new Image(response.data));
                            setHasImage(true);
                        }
                    } catch (e) {
                        setHasImage(false);
                    }
                }, (error) => {
                    setHasImage(false);
                })
        }
        getImage()
    },[props.dirId])

    const imageStyles: CSS.Properties = {
        width: "10%",
        height: "80px",
        float: "left"
    }
    return (
        <div>
            {hasImage && image != undefined?
                <CardMedia component="img"
                           height="20"
                           width="20"
                           sx={imageStyles}
                           image = {image?.getSource()}/>:
                <CardMedia component="img"
                           height="20"
                           width="20"
                           sx={imageStyles}
                           image = {require("../images/profile.jpg")}/>
            }
        </div>
    )
}

export default DirectorImage;