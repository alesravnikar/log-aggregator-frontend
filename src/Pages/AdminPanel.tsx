import { Button, Grid, Input } from "@mui/material";
import { useState } from "react";
import { Token } from "../Interfaces/Token";

interface AdminPanelProperties {
    token: Token;
}

export default function AdminPanel({ token }: AdminPanelProperties) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const registerUser = () => {
        const registerUserAsync = async () => {
            const response = await fetch("User/Register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.token}`
                },
                body: JSON.stringify({
                    username,
                    password,
                    email
                })
            });
        };

        registerUserAsync();
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
                    <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </Grid>
                <Grid item>
                    <Button onClick={() => registerUser()}>Create user</Button>
                </Grid>
            </Grid>
        </div>
    );
}