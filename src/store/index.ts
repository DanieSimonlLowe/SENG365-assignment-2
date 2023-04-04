import create from 'zustand';
import {User} from "../types/users";
import {Film} from "../types/films";

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
}

const getLocalStorage = (key: string): Array<any> => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: Array<any>) => window.localStorage.setItem(key,JSON.stringify(value));

const useStore = create<DateState>((set) => ({
    users: getLocalStorage('users') || [],
    setUsers: (users: Array<User>) => set(() => {
        setLocalStorage('users', users)
        return {
            users: users,
        };
    }),
    editUser: (newUser: User) => set( (state) => {
        const tempUsers = state.users.map(u => u.id === newUser.id ?
            newUser : u);
        setLocalStorage('users',tempUsers);

        const tempFilm = state.films.map(f => f.director.id === newUser.id ?
            {
                id:f.id,
                title:f.title,
                description: f.description,
                release_date: f.release_date,
                image: f.image,
                director: newUser,
                genre: f.genre,
                age_rating: f.age_rating
            } as Film : f );
        setLocalStorage('films',tempFilm);

        const tempReview = state.reviews.map(r => r.user === newUser.id ?
            {
                id: r.id,
                film: r.film,
                user: newUser,
                rating: r.rating,
                review: r.review,
                timeStamp: r.timeStamp
            } as Review : r);
        setLocalStorage('reviews',tempReview);

        return {
            users: tempUsers,
            films: tempFilm,
            reviews: tempReview
        }
    }),
    addUser: (user: User) => set((state) => {
        state.users.push(user)
        setLocalStorage('users', state.users);
        return {
            users: state.users
        }
    }),

    films: getLocalStorage('films') || [],
    setFilms: (films: Array<Film>) => set(() => {
        setLocalStorage('films', films)
        return {
            films: films,
        };
    }),
    editFilm: (newFilm: Film) => set( (state) => {
        const temp = state.films.map(u => u.id === newFilm.id ?
            newFilm : u);
        setLocalStorage('films',temp);

        const tempReviews = state.reviews.map( r => r.film.id === newFilm.id ?
            {
                id: r.id,
                film: newFilm,
                user: r.user,
                rating: r.rating,
                review: r.review,
                timeStamp: r.timeStamp
            } : r);
        setLocalStorage('reviews',tempReviews);

        return {
            films: temp,
            reviews: tempReviews
        }
    }),
    removeFilm: (film: Film) => set((state) => {
        const temp = state.films.filter( u => u.id !== film.id);
        setLocalStorage('films', temp);

        const tempReviews = state.reviews.filter(r => r.film.id !== film.id);
        setLocalStorage('reviews', tempReviews);

        return {
            films: temp,
            reviews: tempReviews
        }
    }),
    addFilm: (film: Film) => set((state) => {
        state.films.push(film)
        setLocalStorage('films', state.films);
        return {
            films: state.films
        }
    }),

    reviews: getLocalStorage('reviews') || [],
    setReviews: (reviews: Array<Review>) => set(() => {
        setLocalStorage('reviews', reviews)
        return {
            reviews: reviews,
        };
    }),
    addReview: (review: Review) => set((state) => {
        state.reviews.push(review)
        setLocalStorage('reviews', state.reviews);
        return {
            reviews: state.reviews
        }
    }),

    genres: getLocalStorage('genres') || [],
    setGenres: (genres: Array<Genre>) => set(() => {
        setLocalStorage('genres', genres);
        return {
            genres: genres,
        };
    }),
}))

export default useStore;