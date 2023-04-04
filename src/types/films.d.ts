import {Image} from "./images";


type Film = {
    id: number,
    title: number,
    description: number,
    release_date: Date,
    image: Image,
    director: User,
    genre: Genre,
    age_rating: string
}