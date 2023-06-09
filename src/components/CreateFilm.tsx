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
import ImageEditor from "./ImageEditor";
import Image from "../classes/images";
import dayjs ,{Dayjs} from "dayjs";
import {useNavigate} from "react-router-dom";

const CreateFilm = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [date, setDate] = React.useState<Dayjs|null>(null);
    const [runtime, setRuntime] = React.useState("");
    const [ageRating, setAgeRating] = React.useState('TBC');

    const [genres, setGenres] = React.useState<Array<Genre>>([]);
    const [genre, setGenre] = React.useState<number>(-1);

    const [hasError, setHasError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("has some error");
    const [image, setImage] = React.useState<Image>();
    const [fileType, setFileType] = React.useState<string>("")

    const token = useStore(state => state.authToken);

    React.useEffect(() => {
        const getGenres = () => {
            axios.get(API_URL+"films/genres")
                .then((response) => {
                    setGenres(response.data);
                    response.data.forEach((value: Genre) => {
                        if (genre === -1) {
                            setGenre(value.genreId);
                        }
                    })
                })
        }
        getGenres();
    },[])

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
        <MenuItem value={val}>{val}</MenuItem>
    )

    const get_genres = () => genres.map((genre:Genre) =>
        <MenuItem value={genre.genreId.toString()}>{genre.name}</MenuItem>
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
        if (date === null) {
            tempDate = new Date();
        } else {
            tempDate = date.toDate();
        }
        return tempDate.getFullYear() + '-' + toTwoDigit(tempDate.getMonth()+1) + '-' + toTwoDigit(tempDate.getDate()) + ' ' + toTwoDigit(tempDate.getHours()) + ':' + toTwoDigit(tempDate.getMinutes()) + ':' + toTwoDigit(tempDate.getSeconds());
    }

    const navigate = useNavigate();
    const submit = () => {
        if (title === "" || description === "" || fileType === "" || image === undefined) {
            setHasError(true);
            setErrorMessage("you must provide an title, image and description.");
            return;
        }
        setHasError(false);
        let data: { [id:string] : (string|number); };
        data = {
            "title": title,
            "description": description,
            "genreId": genre,
            "ageRating": ageRating
        }
        if (runtime !== '') {
            data.runtime = parseInt(runtime);
        }
        if (date !== null) {
            data.releaseDate = getDateString();
        }

        let id = -1;
        axios.post(API_URL+"films", data, {
            headers: {
                'X-Authorization': token
        }}).then((response) => {
            id = response.data.filmId;
        }, (error) => {
            const status: number = error.response.status;
            setHasError(true);
            if (status === 400) {
                setErrorMessage("invalid input.");
            } else if (status === 401) {
                setErrorMessage("you are not logged in.");
            } else if (status === 403) {
                setErrorMessage("title is not unique or release date is in the past.")
            } else {
                setErrorMessage("Server Error.")
            }
        }).then((r) => {
            if (hasError || id === -1) {
                return;
            }
            axios.put(API_URL+"films/"+id+"/image",image.data, {
                headers: {
                    'X-Authorization': token,
                    'content-type': fileType
                }}).then((response) => {
                    navigate("/film/"+id);
                },
                (error) => {
                    setErrorMessage("failed to upload image, but rest of the film went though");
                    setHasError(true);
                })
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

                <TextField id="titleInput" label="Title" variant="outlined" onChange={(e) => {setTitle(e.target.value)} }/>
                <TextField id="descriptionInput" label="Description" variant="outlined" onChange={(e) => {setDescription(e.target.value)} }
                multiline/>


                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker label="Release Date" onChange={changeDate} />
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

export default CreateFilm;