import { Button, Grid, Input } from "@mui/material";
import { useState } from "react";
import { Token } from "../Interfaces/Token";

interface LoginProperties {
    login: (token: Token) => void;
}

export default function LoginView({ login }: LoginProperties) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onLogin = () => {
        const onLoginAsync = async () => {
            const response = await fetch("User/Login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (response.ok) {
                const token: Token = await response.json();
                login(token);
            }
        };

        onLoginAsync();
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item>
                    <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                </Grid>
                <Grid item>
                    <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </Grid>
                <Grid item>
                    <Button onClick={() => onLogin()}>Login</Button>
                </Grid>
            </Grid>
        </div>
    );
}