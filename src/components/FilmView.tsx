import CSS from "csstype";
import {
    Paper,
} from "@mui/material";
import React from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {API_URL} from "../Constantes";
import {Genre} from "../types/genres";
import {Review} from "../types/reviews";
import ReviewObject from "./ReviewObject"
import FilmListObject from "./FilmListObject";
import f from "../types/films";

type Film = {
    filmId:number,
    title:string,
    genreId:number,
    ageRating:string,
    directorId:number,
    directorFirstName:string,
    directorLastName:string,
    rating:number,
    releaseDate:string,
    description:string,
    runtime:number,
    numRatings:number
}

const FilmView = () => {

    const cardStyle: CSS.Properties = {
        padding: "10px",
        margin: '20px',
        display: "block",
        width: "fit-content"
    }

    const {id} = useParams();
    const [film, setFilm] = React.useState<Film>({
        ageRating: "",
        description: "",
        directorFirstName: "",
        directorId: 0,
        directorLastName: "",
        filmId: 0,
        genreId: 0,
        numRatings: 0,
        rating: 0,
        releaseDate: "",
        runtime: 0,
        title: ""
    });
    const [filmLoaded, setFilmLoaded] = React.useState(false)
    const [reviews, setReviews] = React.useState<Array<Review>>([]);

    const [genre, setGenre] = React.useState("");
    const [similarFilms, setSimilarFilms] = React.useState<Array<f.Film>>([]);


    React.useEffect(() => {
        const getFilm = () => {
            axios.get(API_URL+"films/" + id)
                .then((response) => {
                    setFilm(response.data);
                    setFilmLoaded(true);
                }, (error) => {
                    setFilmLoaded(false);
                })
        }
        getFilm();
    },[id]);

    React.useEffect(() => {
        const getGenre = () => {
            axios.get(API_URL+"films/genres")
                .then((response) => {
                    response.data.map((genre: Genre) => {
                        if (genre.genreId === film?.genreId) {
                            setGenre(genre.name);
                        }
                    } )
                }, (error) => {
                    setGenre("invalid genre");
                })
        }
        if (filmLoaded) {
            getGenre()
        }
    }, [film]);

    React.useEffect( () => {
        const getReviews = () => {
            axios.get(API_URL+"films/" + id+"/reviews")
                .then((response) => {
                    setReviews(response.data.filter((review:Review) => {
                        try {
                            return review.review.length > 0;
                        } catch (e) {
                            return false;
                        }
                    }));
                })
        }
        getReviews();
    }, [id])

    React.useEffect(() => {
        const getFilms = () => {

            let films:Array<f.Film> = [];
            axios.get(API_URL+"films?genreIds="+film.genreId)
                .then((response) => {
                    films = response.data.films;
                    axios.get(API_URL+"films?directorId="+film.directorId)
                        .then((response) => {
                            (response.data.films).map((film: f.Film) => {
                                let notHasFilm = true;
                                films.map((film2 : f.Film) => {
                                    if (film.filmId === film2.filmId) {
                                        notHasFilm = false;
                                    }
                                })
                                if (notHasFilm) {
                                    films.push(film);
                                }
                            })
                            setSimilarFilms(films);
                        })
                })
        }
        if (filmLoaded) {
            getFilms()
        }
    }, [film,filmLoaded])

    const getDateString = () => {
        try {
            // @ts-ignore
            const date: Date = new Date(film.releaseDate);
            return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
        } catch (error) {
            return "can't load date";
        }
    }

    const reviews_rows = () => reviews.map((review:Review) =>
        <ReviewObject key={"review"+review.reviewerId+review.timeStamp} review={review}/>
    )

    const films_rows = () => similarFilms.map((film: f.Film) =>
        <FilmListObject film={film} key={"similarFilm"+film.filmId}/>
    )

    return (
        <div>
            {filmLoaded?
        <div>
            <h1>{film.title} ({film.ageRating}) ({genre})</h1>
            <h2>by {film.directorFirstName} {film.directorLastName}</h2>
            <h2>date of release {getDateString()}</h2>
            <h2>run time {film.runtime}</h2>
            <h2>average rating {film.rating}, number of ratings {film.numRatings}</h2>
            <p>{film.description}</p>
            {reviews.length > 0?
            <Paper elevation={3} style={cardStyle}>
                <div style={{display: "inline-block", maxWidth: "965", minWidth: "320"}}>
                    {reviews_rows()}
                </div>
            </Paper> : ""
            }
            {similarFilms.length > 0?
                <Paper elevation={3} style={cardStyle}>
                    <div style={{display: "inline-block", maxWidth: "965", minWidth: "320"}}>
                        {films_rows()}
                    </div>
                </Paper> : ""
            }
        </div>
        : <h1>failed to load film</h1>}
        </div>
    )
}

export default FilmView;