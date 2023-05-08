import {Image} from "../classes/images"

type User = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    image: Image,
    /**
     * no reason to store password or auth_token locally in user.
     * */
}