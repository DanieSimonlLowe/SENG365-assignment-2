import {
    TextField,
    Button,
    Alert,
    Stack,
    Box,
    InputAdornment,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from "@mui/material"
import {DateTimePicker,LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {AGE_RATINGS, API_URL} from "../Constantes";
import React from "react";
import {Genre} from "../types/genres";
import axios from "axios";
import useStore from "../store";
import {useNavigate, useParams} from "react-router-dom";
import dayjs ,{Dayjs} from "dayjs";
import Image from "../classes/images";
import ImageEditor from "./ImageEditor";

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

const EditFilm = () => {
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

    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const now = dayjs(new Date());
    const [date, setDate] = React.useState<Dayjs | null | undefined>(now);
    const [runtime, setRuntime] = React.useState("");
    const [ageRating, setAgeRating] = React.useState("");
    const [genres, setGenres] = React.useState<Array<Genre>>([]);
    const [genre, setGenre] = React.useState<number>(-1);

    const [hasError, setHasError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [hasImage, setHasImage] = React.useState<boolean>(false);
    const [image, setImage] = React.useState<Image>();
    const [oldImage, setOldImage] = React.useState<Image>();
    const [fileType, setFileType] = React.useState("");

    const token = useStore(state => state.authToken);
    const userId = useStore(state => state.userId);

    React.useEffect(() => {
        const getGenres = () => {
            axios.get(API_URL+"films/genres")
                .then((response) => {
                    setGenres(response.data);
                })
        }
        getGenres();
    },[])

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
                            setImage(image);
                            setOldImage(image);
                            setHasImage(true);
                            setFileType(type);
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

    React.useEffect(() => {
        const getFilm = () => {
            axios.get(API_URL+"films/"+id)
                .then((response) => {
                    const data: Film = response.data;
                    if (userId !== response.data.directorId) {
                        setHasError(true);
                        setErrorMessage("you can only edit films you are the director.");
                    } else {
                        setFilm(data);
                        setTitle(data.title);
                        setDescription(data.description);
                        setDate(dayjs(data.releaseDate));
                        if (data.runtime === null) {
                            setRuntime('');
                        } else {
                            setRuntime(data.runtime.toString());
                        }
                        setAgeRating(data.ageRating);
                        setGenre(data.genreId);
                        setHasError(false);
                    }
                }, (error) => {
                    setHasError(true);
                    setErrorMessage("failed to load film.");
                })
        }
        getFilm();
    }, [id,userId])


    const changeDate = (date:(Dayjs|null)) => {
        if (date === null) {
            return;
        } else if(!isNaN(date.valueOf())) {
            setDate(date);
        }
    }

    const changeRuntime = (value: string) => {
        if (/^\d+$/.test(value) || value === '') {
            setRuntime(value);
        }
    }

    const get_ages = () => AGE_RATINGS.map((val:string) =>
        <MenuItem value={val} key={"ageRating_"+val}>{val}</MenuItem>
    )

    const get_genres = () => genres.map((genre:Genre) =>
        <MenuItem value={genre.genreId.toString()} key={"genre_"+genre.genreId}>{genre.name}</MenuItem>
    )

    const toTwoDigit = (num: number): string => {
        if (num < 10) {
            return '0' + num;
        } else {
            return num.toString();
        }
    }

    const getDateString = ():string => {
        let tempDate: Date;
        if (date === null || date === undefined) {
            tempDate = new Date();
        } else {
            tempDate = date.toDate();
        }
        return tempDate.getFullYear() + '-' + toTwoDigit(tempDate.getMonth()+1) + '-' + toTwoDigit(tempDate.getDate()) + ' ' + toTwoDigit(tempDate.getHours()) + ':' + toTwoDigit(tempDate.getMinutes()) + ':' + toTwoDigit(tempDate.getSeconds());
    }

    const getRunTime = () => {
        if (film.runtime === null) {
            return "";
        } else {
            return film.runtime.toString();
        }
    }

    const navigate = useNavigate();
    const submit = () => {
        if (film === undefined) {
            setHasError(true);
            setErrorMessage("the film is not loaded.")
            return;
        }
        if (title === "" || description === "" || fileType === "" || image === undefined) {
            setHasError(true);
            setErrorMessage("you must provide an title, image and description.");
            return;
        }
        let data: { [id:string] : (string|number); } = {};
        // @ts-ignore
        if (title !== film.title) {
            data.title = title;
        }
        // @ts-ignore
        if (description !== film.description) {
            data.description = description;
        }
        const dateStr = getDateString();
        // @ts-ignore
        if (dateStr !== film.releaseDate) {
            data.releaseDate = getDateString();
        }
        // @ts-ignore
        if (genre !== film.genreId) {
            data.genreId = genre;
        }
        // @ts-ignore
        if (runtime !== getRunTime() && runtime !== '') {
            data.runtime = parseInt(runtime);
        }
        // @ts-ignore
        if (ageRating !== film.ageRating) {
            data.ageRating = ageRating;
        }
        let errorFlag = false;

        let reqests: Array<Promise<any>> = [];
        if (Object.keys(data).length !== 0) {
            reqests.push(
            axios.patch(API_URL + "films/" + id, data, {
                headers: {
                    'X-Authorization': token
                }
            }).then((response) => {
                setHasError(false);
            }, (error) => {
                errorFlag = true;
                const status: number = error.response.status;
                setHasError(true);
                if (status === 400) {
                    setErrorMessage("invalid input.");
                } else if (status === 401) {
                    setErrorMessage("you are not logged in.")
                } else if (status === 403) {
                    setErrorMessage("only the director can change an film, and it can't be changed after it has been reviewed.");
                } else if (status === 404) {
                    setErrorMessage("can't find the film you are editing in the database.")
                } else {
                    setErrorMessage("an internal server error has occurred.")
                }
            }))
        }
        if (fileType !== "" && image !== undefined && image !== null && image !== oldImage) {
            reqests.push(
            axios.put(API_URL+"films/"+id+"/image",image.data, {
                headers: {
                    'X-Authorization': token,
                    'content-type': fileType
                }}).then((response) => {
                    setHasError(false);
                },
                (error) => {
                    errorFlag = true
                    setErrorMessage("failed to upload image, but rest of the film went though");
                    setHasError(true);
                }))
        }
        Promise.all(reqests).then(() => {
            if (!errorFlag) {

                navigate("/film/"+id);
            }
        })

    }

    return (
        <Box display="flex"
             flexDirection="column"
             alignItems="center">
            <Stack
                component="form"
                spacing={2}
                noValidate
                autoComplete="off">
                <Box sx={{height:10}}/>

                <ImageEditor image={image} setImage={setImage} setFileType={setFileType} defaultImage={"movie.png"}/>

                <TextField id="titleInput" label="Title" variant="outlined" onChange={(e) => {setTitle(e.target.value)} } value={title}/>
                <TextField id="descriptionInput" label="Description" variant="outlined" onChange={(e) => {setDescription(e.target.value)}} value={description}
                           multiline/>


                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker label="Release Date" onChange={changeDate} value={date}/>
                </LocalizationProvider>

                <TextField id="runtimeInput" label="Runtime" variant="outlined" onChange={(e) => {changeRuntime(e.target.value)} }
                           InputProps={{
                               endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                           }} value={runtime} />

                <InputLabel id="ageRatingLabel">Age Rating</InputLabel>
                <Select
                    labelId="ageRatingLabel" label="Age Rating" value={ageRating} onChange={(event: SelectChangeEvent) => {setAgeRating(event.target.value as string)}}>
                    {get_ages()}
                </Select>
                <InputLabel id="genresLabel">Genre</InputLabel>
                <Select
                    labelId="genresLabel" label="Genres Rating" value={genre.toString()} onChange={(event: SelectChangeEvent) => {setGenre(parseInt(event.target.value))}}>
                    {get_genres()}
                </Select>

                <Button onClick={submit}>Submit</Button>
                {hasError? <Alert severity="error">{errorMessage}</Alert> : ""}
            </Stack>
        </Box>
    )
}

export default EditFilm;