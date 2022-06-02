import { Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Token } from "../Interfaces/Token";

interface LogViewerProperties {
    token: Token;
}

interface LogEntry {
    level: number;
    timeStamp: Date;
    content: string;
}

interface LogEntryResponse {
    level: number;
    timeStamp: string;
    content: string;
}

interface Statistics {
    logsInLastHour: number;
    logsInLast24Hours: number;
    logCountBySeverity: { [logSeverityLevel: string]: number }
}

export default function LogViewer({ token }: LogViewerProperties) {
    const { id } = useParams();

    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>();
    const [excelFile, setExcelFile] = useState<string | null>();

    const getLogsAsync = async () => {
        const response = await fetch(`/Project/GetProjectLogs?projectId=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token}`
            }
        });

        if (response.ok) {
            const projects: LogEntry[] = (await response.json()).map((l: LogEntryResponse) => {
                return {
                    level: l.level,
                    timeStamp: new Date(l.timeStamp),
                    content: l.content
                }
            });
            setLogs(projects);
        }
    }

    const getStatisticsAsync = async () => {
        const response = await fetch(`/Project/GetProjectStatistics?projectId=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token}`
            }
        });

        if (response.ok) {
            const statistics: Statistics = await response.json();
            setStatistics(statistics);
        }
    }

    const exportLogsToExcelAsync = async () => {
        const response = await fetch(`/Project/ExportLogsToExcel?projectId=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.token}`
            }
        });

        if (response.ok) {
            const excel: string = await response.text();
            setExcelFile(excel);
        }
    }

    useEffect(() => {
        getLogsAsync();
        getStatisticsAsync();
        exportLogsToExcelAsync();
    }, [])

    const columns: GridColDef<LogEntry>[] = [
        { field: 'level', headerName: 'Level', width: 100 },
        {
            field: 'timeStamp',
            headerName: 'Time',
            type: "Date",
            width: 200,
            valueGetter: params => params.row.timeStamp.toLocaleString()
        },
        { field: 'content', headerName: 'Content', width: 500 },
    ];

    return (
        <div style={{ height: "80%" }}>
            {
                statistics && <div>
                    <div>{`Logs in last hour: ${statistics.logsInLastHour}`}</div>
                    <div>{`Logs in last 24 hours: ${statistics.logsInLast24Hours}`}</div>
                    {Object.keys(statistics.logCountBySeverity).map(s => {
                        return <div>{`${s}: ${statistics.logCountBySeverity[s]}`}</div>
                    })}
                </div>
            }

            {
                excelFile &&
                <a
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(excelFile)}`}
                    download="logs.csv"
                >
                    Export to excel
                </a>
            }
            <DataGrid
                getRowId={() => Math.random()}
                rows={logs}
                columns={columns}
            />
        </div>
    );
}