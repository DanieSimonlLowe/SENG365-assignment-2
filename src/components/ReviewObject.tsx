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
            <div>
                <Typography variant="h5" component="h5">{props.review.reviewerFirstName + " " + props.review.reviewerLastName + " : " + props.review.rating + "/10"}</Typography>
                <Typography variant="body1">{props.review.review}</Typography>
            </div>
        </CardContent>
    </Card>)
}

export default reviewObject;