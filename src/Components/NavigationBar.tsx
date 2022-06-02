import { AppBar, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NavigationBarProperties {
    isLoggedIn: boolean;
    isAdmin: boolean;
    logout: Function;
}

export default function NavigationBar({ isLoggedIn, isAdmin, logout }: NavigationBarProperties) {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                {
                    (isLoggedIn && isAdmin) && <Button color="inherit" onClick={() => navigate("/Admin")}>
                        Admin
                    </Button>
                }
                {
                    isLoggedIn && <Button color="inherit" onClick={() => navigate("/Projects")}>
                        Projects
                    </Button>
                }
                {
                    (!isLoggedIn) || <Button color="inherit" onClick={() => logout()}>Logout</Button>
                }
            </Toolbar>
        </AppBar>
    );
}