import create from 'zustand';
import {User} from "../types/users";
import {Film} from "../types/films";
import {Genre} from "../types/genres";

interface DateState {
    users: User[];
    setUsers: (users: Array<User>) => void;
    editUser: (newUser: User) => void;
    addUser: (user: User) => void;

    films: Film[];
    setFilms: (films: Array<Film>) => void;
    editFilm: (newFilm: Film) => void;
    removeFilm: (film: Film) => void;
    addFilm: (film: Film) => void;

    reviews: Review[];
    setReviews: (reviews: Array<Review>) => void;
    addReview: (review: Review) => void;

    genres: Genre[];
    setGenres: (genres: Array<Genre>) => void;

    authToken: string;
    setAuthToken: (token: string) => void;

}

const getLocalStorage = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key,JSON.stringify(value));

const useStore = create<DateState>((set) => ({
    users: [],
    setUsers: (users: Array<User>) => set(() => {
        return {
            users: users,
        };
    }),
    editUser: (newUser: User) => set( (state) => {
        const tempUsers = state.users.map(u => u.id === newUser.id ?
            newUser : u);

        return {
            users: tempUsers,
        }
    }),
    addUser: (user: User) => set((state) => {
        state.users.push(user)
        return {
            users: state.users
        }
    }),

    films:  [],
    setFilms: (films: Array<Film>) => set(() => {
        return {
            films: films,
        };
    }),
    editFilm: (newFilm: Film) => set( (state) => {
        const temp = state.films.map(u => u.filmId === newFilm.filmId ?
            newFilm : u);
        return {
            films: temp,
        }
    }),
    removeFilm: (film: Film) => set((state) => {
        const temp = state.films.filter( u => u.filmId !== film.filmId);

        return {
            films: temp
        }
    }),
    addFilm: (film: Film) => set((state) => {
        state.films.push(film)
        return {
            films: state.films
        }
    }),

    reviews: [],
    setReviews: (reviews: Array<Review>) => set(() => {
        return {
            reviews: reviews,
        };
    }),
    addReview: (review: Review) => set((state) => {
        state.reviews.push(review)
        return {
            reviews: state.reviews
        }
    }),

    genres: [],
    setGenres: (genres: Array<Genre>) => set(() => {
        return {
            genres: genres,
        };
    }),

    authToken: getLocalStorage("auth_token") || '',
    setAuthToken: (token: string) => set(() => {
        setLocalStorage("auth_token",token);
        return {
            authToken : token
        }
    }),


}))

export default useStore;