import React from "react";
import {Card, CardContent, CardMedia, CardActionArea, Typography} from "@mui/material";
import CSS from 'csstype'
import {Film} from "../types/films";
import {API_URL} from "../Constantes";
import axios from "axios";
import Image from "../classes/images";
interface  IFilmProps {
    film: Film
}

const FilmListObject = (props: IFilmProps) => {
    const [film] = React.useState<Film>(props.film)

    const [filmDate, setFilmDate] = React.useState("failed to load date");

    const [filmImage, setFilmImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);

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
            setFilmDate(date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear());
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

    return (
        <Card sx={filmCardStyles}>
            <CardActionArea>
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
            </CardActionArea>
        </Card>
    )
}

export default FilmListObject