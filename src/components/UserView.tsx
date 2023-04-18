import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";
const UserView = () => {
    const userId = useStore(state => state.userId);
    const token = useStore(state => state.authToken);

    const [email, setEmail] = React.useState("loading");
    const [firstName, setFirstName] = React.useState("loading");
    const [lastName, setLastName] = React.useState("");

    React.useEffect(() => {
        const getUser = () => {
            axios.get(API_URL + "users/" + userId,{
                headers: {
                    'X-Authorization': token
                }})
                .then((response) => {
                    setEmail(response.data.email);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                })
        }
        getUser();
    }, [userId])

    return (
        <div>
            <h2>{firstName} {lastName}</h2>
            <h2>{email}</h2>
        </div>
    )
}

export default UserView;