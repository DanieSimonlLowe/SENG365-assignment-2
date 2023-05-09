import CSS from "csstype";
import {
    Box,
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
import ReviewFrom from "./ReviewFrom";
import Image from "../classes/images";

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

    const imageStyle: CSS.Properties = {
        maxHeight: "40vh"
    }

    const smallImageStyle: CSS.Properties = {
        maxHeight: "12vh"
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
    const [genres, setGenres] = React.useState<Array<Genre>>([]);
    const [similarFilms, setSimilarFilms] = React.useState<Array<f.Film>>([]);
    const [filmImage, setFilmImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);
    const [dirImage, setDirImage] = React.useState<Image>();
    const [hasDirImage, setHasDirImage] = React.useState(false);

    const [reviewsHasUpdated, setReviewsHasUpdated] = React.useState(true);
    const [numberOfRatings, setNumberOfRatings] = React.useState(-1);

    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"users/"+film.directorId+"/image", {
                responseType: 'arraybuffer',
                headers: {'content-type': 'none'}
            })
                .then((response) => {
                    try {
                        const type: string = response.headers['content-type'] as string;
                        if (type === undefined || type === 'none') {
                            setHasDirImage(false);
                        } else {
                            setDirImage(new Image(response.data));
                            setHasDirImage(true);
                        }
                    } catch (e) {
                        setHasDirImage(false);
                    }
                }, (error) => {
                    setHasDirImage(false);
                })
        }
        if (film.title !== "") {
            getImage();
        }

    },[film])

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
                    setGenres(response.data);
                    response.data.forEach((genre: Genre) => {
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
    }, [film, filmLoaded]);

    React.useEffect( () => {
        const getReviews = () => {
            axios.get(API_URL+"films/" + id+"/reviews")
                .then((response) => {
                    setNumberOfRatings(response.data.length);
                    setReviews(response.data);
                })
        }
        if (reviewsHasUpdated || numberOfRatings === -1) {
            getReviews();
            setReviewsHasUpdated(false);
        }
    }, [id, reviewsHasUpdated])

    React.useEffect(() => {
        const getFilms = () => {

            let films:Array<f.Film> = [];
            axios.get(API_URL+"films?genreIds="+film.genreId)
                .then((response) => {
                    films = response.data.films;
                    axios.get(API_URL+"films?directorId="+film.directorId)
                        .then((response) => {
                            (response.data.films).forEach((film: f.Film) => {
                                let notHasFilm = true;
                                films.forEach((film2 : f.Film) => {
                                    if (film.filmId === film2.filmId) {
                                        notHasFilm = false;
                                    }
                                })
                                if (notHasFilm) {
                                    films.push(film);
                                }
                            })

                            setSimilarFilms(films.filter((film: f.Film) => {
                                // @ts-ignore
                                if (film.filmId !== parseInt(id)) {
                                    return film;
                                }
                            }));
                        })
                })
        }
        if (filmLoaded) {
            getFilms()
        }
    }, [film,filmLoaded,id])

    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"films/"+id+"/image", {
                responseType: 'arraybuffer',
                headers: {'content-type': 'none'}
            })
                .then((response) => {
                    try {
                        const type: string = response.headers['content-type'] as string;
                        if (type === undefined || type === 'none') {
                            setHasImage(false);
                        } else {
                            const image: Image = new Image(response.data);
                            setFilmImage(image);
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
    },[id])

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
        <FilmListObject film={film} key={"similarFilm"+film.filmId} genres={genres} />
    )

    return (
        <div>
            <Box sx={{height:15}}/>
            {filmLoaded?
        <div>
            { hasImage && filmImage instanceof Image ?
                <img src={filmImage?.getSource()} style={imageStyle} alt={film.title + " hero image"}/>:
                <img src={require("../images/movie.png")} style={imageStyle} alt={film.title + " hero image"}/>
            }
            <h1>{film.title} ({film.ageRating}) ({genre})</h1>
            <h2>by {film.directorFirstName} {film.directorLastName}</h2>
            { hasDirImage && dirImage instanceof Image ?
                <img src={dirImage?.getSource()} style={smallImageStyle} alt={film.title + " hero image"}/>:
                <img src={require("../images/profile.jpg")} style={smallImageStyle} alt={film.title + " hero image"}/>
            }
            <h2>date of release {getDateString()}</h2>
            <h2>run time {film.runtime}</h2>
            <h2>average rating {film.rating}, number of ratings {numberOfRatings}</h2>
            <p>{film.description}</p>
            <ReviewFrom dirId={film.directorId} filmId={film.filmId} relDate={film.releaseDate} reviews={reviews} update={() => {setReviewsHasUpdated(true)}} />
            {reviews.length > 0?
            <Paper elevation={3} style={cardStyle}>
                <div style={{display: "inline-block", maxWidth: "965", minWidth: "320"}}>
                    {reviews_rows()}
                </div>
            </Paper> : ""
            }
            <br/><br/><br/>
            <h1>similar films.</h1>
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