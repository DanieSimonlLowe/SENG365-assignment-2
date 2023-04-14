import axios from 'axios';
import React from "react";
import CSS from 'csstype'
import {
    Paper,
    AlertTitle,
    Alert,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import {Link} from "react-router-dom";
import FilmListObject from "./FilmListObject"
import {Film} from "../types/films";
import {Genre} from "../types/genres";
import {useParams} from "react-router-dom";
import {API_URL} from "../Constantes";
import { useNavigate } from "react-router-dom";
import {AGE_RATINGS} from "../Constantes";
import useStore from "../store";
import FilmListObjectLoggedIn from "./FilmListObjectLoggedIn";

type Filter = {
    name: string,
    id: number,
    active: boolean
}


type Sort = {
    name: string,
    display: string
}

const SORT_RATINGS: Array<Sort> = [
    {
        name: "RELEASED_ASC",
        display: "Released ascending"
    },
    {
        name: "RELEASED_DESC",
        display: "Released descending"
    },
    {
        name: "RATING_ASC",
        display: "Rating ascending"
    },
    {
        name: "RATING_DESC",
        display: "Rating descending"
    },
    {
        name: "ALPHABETICAL_ASC",
        display: "Alphabetical ascending"
    },
    {
        name: "ALPHABETICAL_DESC",
        display: "Alphabetical descending"
    }
]

const FilmList = () => {

    const PAGE_SIZE = 10;
    const MIN_Q_LEN = 2;
    const {p} = useParams();

    let page: number;
    try {
        if (typeof p === "string") {
            page = parseInt(p);
            if (page < 1) {
                page = 1;
            }
        } else {
            page = 1;
        }
    } catch (e) {
        page = 1;
    }
    const navigate = useNavigate();

    const [films, setFilms] = React.useState<Array<Film>>([]);

    const [genreDialogOpen, setGenreDialogOpen] = React.useState(false);

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [pageCount, setPageCount] = React.useState(-1);

    const [query, setQuery] = React.useState("");

    const [noFilms, setNoFilms] = React.useState(true);

    const [onlyAllowOwn, setOnlyAllowOwn] = React.useState(false);

    const [genreFilters, setGenreFilters] = React.useState<Array<Filter>>([]);
    const [ageFilters, setAgeFilters] = React.useState<Array<Filter>>(
        AGE_RATINGS.map((value:string, index:number) => {
            return {
                name: value,
                id:index,
                active:false
            } as Filter;
        })
    );
    const [ageDialogOpen, setAgeDialogOpen] = React.useState(false);

    const [sortId, setSortId] = React.useState<number>(0);

    const userId = useStore(state => state.userId);

    React.useEffect(() => {
        const getFilms = () => {
            const start: number = (page-1) * PAGE_SIZE;
            let url = API_URL+"films?count=" + PAGE_SIZE.toString();
            if (start !== 0) {
                url += "&startIndex=" + start.toString()
            }
            if (query.length >= MIN_Q_LEN) {
                url += "&q=" + query;
            }
            genreFilters.map((genreFilter: Filter) => {
                if (genreFilter.active) {
                    url += '&genreIds=' + genreFilter.id;
                }
            } )
            ageFilters.map((ageFilter: Filter) => {
                if (ageFilter.active) {
                    url += "&ageRatings=" + ageFilter.name;
                }
            })
            if (onlyAllowOwn) {
                url += "&directorId=" + userId;
            }
            url += "&sortBy=" + SORT_RATINGS[sortId].name;
            axios.get(url)
                .then((response) => {
                    setErrorFlag(false);
                    if (response.data.count === 0) {
                        setNoFilms(true);
                    } else {
                        setFilms(response.data.films);
                        setPageCount(Math.ceil(response.data.count / PAGE_SIZE));
                        setNoFilms(false);
                    }
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString + "\n may be on an invalid page number.")
                    setNoFilms(true);
                })

        }
        getFilms();
    }, [page,query,genreFilters,ageFilters,sortId,onlyAllowOwn])

    React.useEffect(() => {
        const getGenres = () => {
            axios.get(API_URL+"films/genres")
                .then((response) => {
                    const filters: Array<Filter> = response.data.map((genre: Genre) => {
                        return {
                            id:genre.genreId,
                            name:genre.name,
                            active:false
                        } as Filter
                    })
                    setGenreFilters(filters);
                })
        }
        getGenres();
    },[])

    const bindQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value !== query && (value.length >= MIN_Q_LEN || query.length >= MIN_Q_LEN)) {
            setQuery(value);
            navigate("/films/1")
        }
    }

    const films_rows = () => { return films.map((film:Film) => {
            if (film.directorId === userId) {
                return (<FilmListObjectLoggedIn key={"film" + film.filmId} film={film}/>)
            } else {
                return (<FilmListObject key={"film" + film.filmId} film={film}/>)
            }
    })};

    function bindGenreFilter(id: number) {
        return (e: React.SyntheticEvent, checked: boolean) => {
            const out: Array<Filter> = genreFilters.map((gf: Filter) => {
                if (gf.id === id) {
                    navigate("/films/1")
                    return {
                        id:gf.id,
                        name:gf.name,
                        active:checked
                    } as Filter
                } else {
                    return gf;
                }
            })
            setGenreFilters(out);
        }
    }

    function bindAgeFilter(id: number) {
        return (e: React.SyntheticEvent, checked: boolean) => {
            const out: Array<Filter> = ageFilters.map((af: Filter) => {
                if (af.id === id) {
                    navigate("/films/1")
                    return {
                        id:af.id,
                        name:af.name,
                        active:checked
                    } as Filter
                } else {
                    return af;
                }
            })
            setAgeFilters(out);
        }
    }

    const genre_filters = () => genreFilters.map((genre: Filter) =>
        <FormControlLabel id={"genreFilter"+genre.id} key={"genreFilter"+genre.id} control={<Checkbox/>} label={genre.name} onChange={bindGenreFilter(genre.id)} />
    );

    const age_filters = () => ageFilters.map((age: Filter) =>
        <FormControlLabel id={"ageFilter"+age.id} key={"ageFilter"+age.id} control={<Checkbox/>} label={age.name} onChange={bindAgeFilter(age.id)} />
    );

    const openGenreFilterDialog = () => {
        setGenreDialogOpen(true);
    }

    const handleGenreFilterDialog = () => {
        setGenreDialogOpen(false);
    }

    const openAgeFilterDialog = () => {
        setAgeDialogOpen(true);
    }

    const handleAgeFilterDialog = () => {
        setAgeDialogOpen(false);
    }

    const sort_dropdown = () => SORT_RATINGS.map((sort: Sort, index:number) =>
        <MenuItem value={index}>{sort.display}</MenuItem>
    );

    const sortOnChange = (event: SelectChangeEvent) => {
        setSortId(parseInt(event.target.value));
    }


    const cardStyle: CSS.Properties = {
        padding: "10px",
        margin: '20px',
        display: "block",
        width: "fit-content"
    }

    const inputStyle: CSS.Properties = {
        width: "fit-content"
    }

    const changeOnlyAllowOwn = () => {
        setOnlyAllowOwn(!onlyAllowOwn);
    }

    return (
        <div>
            <TextField label="Search" variant="outlined"
                       defaultValue={query}
                       id="films_query_input"
                       style={inputStyle}
                       onChange={bindQuery}
            />
            {userId === -1 ? "" :
                <FormControlLabel control={<Checkbox value={onlyAllowOwn} onChange={changeOnlyAllowOwn} />} label="view your films"/>
            }
            <Button onClick={openGenreFilterDialog}>Filter Genres</Button>
            <Button onClick={openAgeFilterDialog}>Filter Age Ratting</Button>
            <Select
                value={sortId.toString()}
                onChange={sortOnChange}
            >
                {sort_dropdown()}
            </Select>
            { genreDialogOpen ?
                <Dialog
                    open={genreDialogOpen}
                    onClose={handleGenreFilterDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Filter films by genre."}</DialogTitle>
                    <DialogActions>
                        <FormGroup>
                            {genre_filters()}
                        </FormGroup>
                    </DialogActions>
                </Dialog>
                :
                ""
            }
            { ageDialogOpen ?
                <Dialog
                    open={ageDialogOpen}
                    onClose={handleAgeFilterDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Filter films by age rating."}</DialogTitle>
                    <DialogActions>
                        <FormGroup>
                            {age_filters()}
                        </FormGroup>
                    </DialogActions>
                </Dialog>
                :
                ""
            }

            <Paper elevation={3} style={cardStyle}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                        :""
                    }
                { noFilms?
                    <h1>no films match that search</h1>:
                <div>
                    <h1>Films</h1>
                    <div style={{display: "inline-block", maxWidth: "965", minWidth: "320"}}>
                        {films_rows()}
                    </div>
                    <br/>
                    <Link to={"/films/"+1}>1</Link> <span> ... </span>
                    { (page-1) >= 1 ?
                        <Link to={"/films/"+(page-1)}>{page-1}</Link>
                        : ""
                    }
                    <span> {page} </span>
                    { (page+1) <= pageCount ?
                        <Link to={"/films/"+(page+1)}>{page+1}</Link>
                        : ""
                    }
                    <span> ... </span>
                    <Link to={"/films/"+pageCount}>{pageCount}</Link>
                </div>}
            </Paper>
        </div>
    );
}

export default FilmList;