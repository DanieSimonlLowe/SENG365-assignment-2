import {Rating, Typography, TextField, Button, Alert, AlertColor} from "@mui/material";
import axios from "axios";
import {API_URL} from "../Constantes";
import React from "react";
import useStore from "../store";
import {Review} from "../types/reviews";

interface  IReviewProps {
    dirId: number,
    filmId: number,
    relDate: string,
    reviews: Array<Review>
}

const ReviewFrom = (props: IReviewProps) => {
    const userId = useStore(state => state.userId);
    const token = useStore(state => state.authToken);
    const [rating, setRating] = React.useState(5);
    const [review, setReview] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [errorType, setErrorType] = React.useState<AlertColor>("info");

    const changeRating = (event: React.SyntheticEvent, num: (number|null)) => {
        if (num !== null) {
            setRating(num);
        }
    }
    const submit = () => {
        if (userId === props.dirId) {
            setErrorFlag(true);
            setErrorMessage("you can't review your own film.");
            setErrorType("info");
            return;
        } else if (userId === -1) {
            setErrorFlag(true);
            setErrorMessage("you must be logged in to review a film.");
            setErrorType("info");
            return;
        } else if (new Date(props.relDate).getUTCMilliseconds() <= Date.now()) {
            setErrorFlag(true);
            setErrorMessage("can't review a film until it has been released.");
            setErrorType("info");
            return;
        } else {
            if (props.reviews.some((review: Review) => {
                return review.reviewerId === userId;
            })) {
                setErrorFlag(true);
                setErrorMessage("you can't edit or double post a review on the same film.");
                setErrorType("info");
                return;
            }
        }

        let data: { [id:string] : (string|number); } = {};
        data.rating = rating;
        if (review !== "") {
            data.review = review;
        }
        console.log(data);
        axios.post(API_URL+"films/" + props.filmId + "/review", data, {
            headers: {
                'X-Authorization': token
            }})
            .then((response) => {
                setErrorFlag(false);
            }, (error) => {
                setErrorFlag(true);
                setErrorType("error");
                const status: number = error.status;
                if (status === 400) {
                    setErrorMessage("invalid information failed to submit.");
                } else if (status === 401) {
                    setErrorMessage("you need to be logged to review.");
                } else if (status === 403) {
                    setErrorMessage("you can't review your own films.");
                } else if (status === 404) {
                    setErrorMessage("can't find the film you are reviewing.");
                } else {
                    setErrorMessage("some server error has occurred.");
                }
            })

    }
    return (
        <div>
            <Typography component="legend">film rating</Typography>
            <Rating name="rating" value={rating} max={10} onChange={changeRating} />
            <TextField
                label="Review" multiline
                maxRows={10} variant="filled"
                value = {review} onChange={(e) => {setReview(e.target.value)}}
            />
            <Button variant="contained" onClick={submit}>Submit </Button>
            {errorFlag ?
                <Alert severity={errorType}>
                    {errorMessage}
                </Alert>
                :""
            }
        </div>
    )
}

export default ReviewFrom;