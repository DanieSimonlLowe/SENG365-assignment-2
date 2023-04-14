import React from "react";
import {Card, CardContent, CardMedia, CardActions, Typography, Button} from "@mui/material";
import CSS from 'csstype'
import {Film} from "../types/films";
import {API_URL} from "../Constantes";
import axios from "axios";
import Image from "../classes/images";
import { Link } from 'react-router-dom'
import useStore from "../store";
interface  IFilmProps {
    film: Film
}

const FilmListObjectLoggedIn = (props: IFilmProps) => {
    const [film] = React.useState<Film>(props.film)

    const [filmDate, setFilmDate] = React.useState("failed to load date");

    const [filmImage, setFilmImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);

    const token = useStore(state => state.authToken);

    const filmCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "328px",
        width: "100%",
        margin: "10px",
        padding: "0px"
    }

    const filmImageStyles: CSS.Properties = {
        width: "30%",
        height: "320px",
        float: "left"
    }

    React.useEffect(() => {
        const getFilmDate = () => {
            const date: Date = new Date(film.releaseDate);
            setFilmDate(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
        }
        try {
            getFilmDate();
        } catch {

        }
    },[film])


    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"films/"+film.filmId+"/image", {
                responseType: 'arraybuffer',
                headers: {'Content-Type': 'none'}
            })
            .then((response) => {
                try {
                    const type: string = response.headers['Content-Type'] as string;
                    if (type === 'none') {
                        setHasImage(false);
                    } else {
                        const image: Image = new Image(response.data,type);
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
    },[film])

    const deleteFilm = () => {
        axios.delete(API_URL+"films/"+film.filmId, {
            headers: {
                'X-Authorization': token
            }})
            .then((response) => {
                window.location.reload();
            });
    }

    return (
        <Card sx={filmCardStyles}>
            { hasImage && filmImage instanceof Image ?
                <CardMedia component="img"
                           height="100"
                           width="100"
                           sx={filmImageStyles}
                           image = {filmImage.getSource()}
                           alt={film.title+" hero image"}/>
                :
                <CardMedia component="img"
                           height="100"
                           width="100"
                           sx={filmImageStyles}
                           image = {require("../images/movie.png")}
                           alt={film.title+" hero image"}/>
            }
            <CardContent>
                <div>
                    <Typography variant="h3" component="h3">{film.title}</Typography>
                    <Typography variant="h4" component="h4">{"by "+film.directorFirstName+" "+film.directorLastName}</Typography>
                    <Typography variant="h5" component="h5">{"age rating "+film.ageRating+" genre: "+film.genreId+" released on: "+ filmDate +" rated: "+film.rating}</Typography>
                    <Typography variant="body1">{film.description}</Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={"/film/"+film.filmId}>View</Button>
                <Button size="small" component={Link} to={"/edit/"+film.filmId}>Edit</Button>
                <Button size="small" onClick={deleteFilm} >Delete</Button>
            </CardActions>
        </Card>
    )
}

export default FilmListObjectLoggedIn