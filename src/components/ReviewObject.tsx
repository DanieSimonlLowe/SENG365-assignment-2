import {Card, CardContent, Typography} from "@mui/material";
import {Review} from "../types/reviews";
import CSS from "csstype";


interface  IReviewProps {
    review: Review
}

const reviewObject = (props: IReviewProps) => {
    const reviewCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "100%",
        margin: "10px",
        padding: "0px"
    }

    return (<Card sx={reviewCardStyles}>
        <CardContent>

            <Typography variant="h3" component="h3">{props.review.review + "stuff"}</Typography>
        </CardContent>
    </Card>)
}

export default reviewObject;