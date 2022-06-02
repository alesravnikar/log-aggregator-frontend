import { Button, Grid, Input } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Token } from "../Interfaces/Token";

interface ProjectOverviewProperties {
    token: Token;
}

interface Project {
    id: string;
    name: string;
}

export default function ProjectOverview({ token }: ProjectOverviewProperties) {
    const [projectName, setProjectName] = useState<string>("");
    const [projects, setProjects] = useState<Project[]>([]);

    const navigate = useNavigate();

    const fetchProjectsAsync = async () => {
        const response = await fetch("Project/GetProjects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token}`
            }
        });

        if (response.ok) {
            const projects: Project[] = await response.json();
            setProjects(projects);
        }
    }

    const createProject = () => {
        const createProjectAsync = async () => {
            const response = await fetch("Project/AddProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.token}`
                },
                body: JSON.stringify({
                    name: projectName,
                })
            });

            await fetchProjectsAsync();
        };

        createProjectAsync();
    };

    useEffect(() => {
        fetchProjectsAsync();
    }, []);

    return <div>
        <Input value={projectName} onChange={e => setProjectName(e.target.value)} />
        <Button onClick={() => createProject()}>Create Project</Button>
        <Grid>
            {projects.map(p => {
                return <Button color="inherit" onClick={() => navigate(`/Logs/${p.id}`)}>{p.name}</Button>;
            })}
        </Grid>
    </div>;
}