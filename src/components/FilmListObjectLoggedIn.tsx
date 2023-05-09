import React from "react";
import {Card, CardContent, CardMedia, CardActions, Typography, Button, Box} from "@mui/material";
import CSS from 'csstype'
import {Film} from "../types/films";
import {API_URL} from "../Constantes";
import axios from "axios";
import Image from "../classes/images";
import {Link, useNavigate} from 'react-router-dom'
import {Genre} from "../types/genres";
import DirectorImage from "./DirectorImage";
interface  IFilmProps {
    film: Film,
    genres: Array<Genre>
}

const FilmListObjectLoggedIn = (props: IFilmProps) => {
    const [film] = React.useState<Film>(props.film)

    const [filmDate, setFilmDate] = React.useState("failed to load date");

    const [filmImage, setFilmImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);
    const navigate = useNavigate();

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
                    const type: string = response.headers['content-type'] as string;
                    if (type === 'none') {
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
    },[film])

    const deleteFilm = () => {
        navigate("/delete/" + film.filmId);

    }

    const getGenre = (id: number) => {
        const temp = props.genres.find((gen) => {
            return gen.genreId === id;
        });
        if (temp === undefined) {
            return "invalid genre";
        } else {
            return temp.name;
        }
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <div>
                        <Typography variant="h3" component="h3">{film.title}</Typography>
                        <DirectorImage dirId={film.directorId}/>
                        <Typography variant="h4" component="h4">{"by "+film.directorFirstName+" "+film.directorLastName}</Typography>
                        <br/><br/>
                        <Typography variant="h5" component="h5">{"age rating "+film.ageRating+" genre: "+getGenre(film.genreId)+" released on: "+ filmDate +" rated: "+film.rating}</Typography>
                        <Typography variant="body1">{film.description}</Typography>
                    </div>
                </CardContent>
                <CardActions>
                    <Button size="small" component={Link} to={"/film/"+film.filmId}>View</Button>
                    <Button size="small" component={Link} to={"/edit/"+film.filmId}>Edit</Button>
                    <Button size="small" onClick={deleteFilm} >Delete</Button>
                </CardActions>
            </Box>
        </Card>
    )
}

export default FilmListObjectLoggedIn