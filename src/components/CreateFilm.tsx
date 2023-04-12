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

const CreateFilm = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const now = new Date();
    const [date, setDate] = React.useState<Date>(now);
    const [runtime, setRuntime] = React.useState("");
    const [ageRating, setAgeRating] = React.useState('TBC');

    const [genres, setGenres] = React.useState<Array<Genre>>([]);
    const [genre, setGenre] = React.useState<number>(-1);

    const [hasError, setHasError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("has some error");

    const token = useStore(state => state.authToken);

    React.useEffect(() => {
        const getGenres = () => {
            axios.get(API_URL+"films/genres")
                .then((response) => {
                    setGenres(response.data);
                    response.data.map((value: Genre) => {
                        if (genre === -1) {
                            setGenre(value.genreId);
                            return;
                        }
                    })
                })
        }
        getGenres();
    },[])

    const changeDate = (date:(Date|null)) => {
        if (date === null) {
            return;
        } else if(date instanceof Date && !isNaN(date.valueOf()) && date.getUTCMilliseconds() > now.getUTCMilliseconds()) {
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
        return date.getFullYear() + '-' + toTwoDigit(date.getDate()) + '-' + toTwoDigit(date.getMonth()) + ' ' + toTwoDigit(date.getHours()) + ':' + toTwoDigit(date.getMinutes()) + ':' + toTwoDigit(date.getSeconds());
    }

    const submit = () => {
        let data;
        if (runtime === '') {
            data = {
                "title": title,
                "description": description,
                "releaseDate": getDateString(),
                "genreId": genre,
                "ageRating": ageRating
            }
        } else {
            data = {
                "title": title,
                "description": description,
                "releaseDate": getDateString(),
                "genreId": genre,
                "runtime": parseInt(runtime),
                "ageRating": ageRating
            }
        }
        axios.post(API_URL+"films", data, {
            headers: {
                'X-Authorization': token
        }}).then((response) => {
            setHasError(false);
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