import {AppBar ,Container, Box, Button} from "@mui/material"
import useStore from "../store";
import { useNavigate } from "react-router-dom";

type LinkInfo = {
    name: string,
    link: string
}

const LoggedInLinks: Array<LinkInfo> = [
    {name:"films", link:"/films/1"}
]

const LoggedOutLinks: Array<LinkInfo> = [
    {name:"register", link:"/register"},
    {name:"login", link:"/login"},
    {name:"films", link:"/films/1"}
]

const NavBar = () => {
    const userId = useStore(state => state.userId);
    const navigate = useNavigate();

    const handleNavBarButton = (link: string) => {
        return () => {
            navigate(link);
        }
    }

    const get_buttons = () => {
        let infoAll: Array<LinkInfo>;
        if (userId === -1) {
            infoAll = LoggedOutLinks;
        } else {
            infoAll = LoggedInLinks;
        }
        return infoAll.map((info: LinkInfo) => (
            <Button
                key={"naveBar" + info.name+ info.link}
                onClick={handleNavBarButton(info.link)}
                sx={{ my: 2, height:'100%', color: 'white', display: 'block' }}
            >
                {info.name}
            </Button>
        ))
    }

    return (
        <AppBar position='static'>
            <Container sx={{height : '10%'}}>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {get_buttons()}
                </Box>
            </Container>
        </AppBar>
    )
}

export default NavBar;