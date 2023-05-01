import React from "react";
import axios from "axios";
import {API_URL} from "../Constantes";
import useStore from "../store";
import Image from "../classes/images";
import CSS from "csstype";
const UserView = () => {
    const userId = useStore(state => state.userId);
    const token = useStore(state => state.authToken);

    const [email, setEmail] = React.useState("loading");
    const [firstName, setFirstName] = React.useState("loading");
    const [lastName, setLastName] = React.useState("");
    const [image, setImage] = React.useState<Image>();
    const [hasImage, setHasImage] = React.useState(false);

    const imageStyle: CSS.Properties = {
        maxHeight: "40vh"
    }

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

    React.useEffect(() => {
        const getImage = () => {
            axios.get(API_URL+"users/"+userId+"/image", {
                responseType: 'arraybuffer',
                headers: {'content-type': 'none'}
            })
                .then((response) => {
                    try {
                        const type: string = response.headers['content-type'] as string;
                        if (type === undefined || type === 'none') {
                            setHasImage(false);
                        } else {
                            setImage(new Image(response.data));
                            setHasImage(true);
                        }
                    } catch (e) {
                        setHasImage(false);
                    }
                }, (error) => {
                    setHasImage(false);
                })
        }
        getImage()
    },[userId])

    return (
        <div>
            <br/>
            {hasImage && image instanceof Image ?
                <img src={image?.getSource()} style={imageStyle} alt={firstName + " " + lastName + " profile image"}/> :
                <img src={require("../images/profile.jpg")} style={imageStyle} alt={firstName + " " + lastName + " profile image"}/>
            }
            <h2>{firstName} {lastName}</h2>
            <h2>{email}</h2>
        </div>
    )
}

export default UserView;