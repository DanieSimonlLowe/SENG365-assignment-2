import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Review} from "../types/reviews";
import CSS from "csstype";
import Image from "../classes/images";
import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";


interface  IReviewProps {
    review: Review
}

const ReviewObject = (props: IReviewProps) => {
    const reviewCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "100%",
        margin: "10px",
        padding: "0px"
    }
    const imageStyles: CSS.Properties = {
        width: "30%",
        height: "320px",
        float: "left"
    }

    const [image, setImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);

    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"users/"+props.review.reviewerId+"/image", {
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
    },[props.review.reviewerId])

    return (
        <Card sx={reviewCardStyles}>
        { hasImage && image instanceof Image ?
            <CardMedia component="img"
                       height="100"
                       width="100"
                       sx={imageStyles}
                       image = {image.getSource()}
                       alt={props.review.reviewerFirstName + " " + props.review.reviewerLastName+" profile"}/>
            :
            <CardMedia component="img"
                       height="100"
                       width="100"
                       sx={imageStyles}
                       image = {require("../images/profile.jpg")}
                       alt={props.review.reviewerFirstName + " " + props.review.reviewerLastName+" profile"}/>
        }
        <CardContent>
            <div>
                <Typography variant="h5" component="h5">{props.review.reviewerFirstName + " " + props.review.reviewerLastName + " : " + props.review.rating + "/10"}</Typography>
                <Typography variant="body1">{props.review.review}</Typography>
            </div>
        </CardContent>
    </Card>)
}

export default ReviewObject;