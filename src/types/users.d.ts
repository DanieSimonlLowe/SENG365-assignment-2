import {Image} from "./images"

type User = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    image: Image,
    /**
     * no reson to store password or auth_token localy in user.
     * */
}