import React, { useState } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Box, 
    Chip, 
    IconButton, 
    Collapse, 
    Grid, 
    Card, 
    CardMedia, 
    CardContent,
    CardActions,
    Button,
    Link
} from '@mui/material';
import { ITask } from "../../interfaces/Task.ts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

interface TasksTableProps {
    tasks: ITask[];
}

export const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    const toggleRow = (taskId: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const getAttachmentTypeIcon = (type: string): JSX.Element => {
        switch (type) {
            case 'image':
                return <ImageIcon />;
            case 'video':
                return <VideoLibraryIcon />;
            case 'text':
                return <TextSnippetIcon />;
            case 'game':
                return <SportsEsportsIcon />;
            default:
                return <TextSnippetIcon />; // Default icon
        }
    };

    const renderAttachment = (attachment: any, index: number) => {
        switch (attachment.type) {
            case 'image':
                return (
                    <Card key={index} sx={{ maxWidth: 345, m: 1 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={attachment.url}
                            alt={attachment.title || `Зображення ${index + 1}`}
                        />
                        {attachment.title && (
                            <CardContent>
                                <Typography variant="body2">{attachment.title}</Typography>
                            </CardContent>
                        )}
                    </Card>
                );
            case 'video':
                return (
                    <Card key={index} sx={{ maxWidth: 345, m: 1 }}>
                        <CardContent>
                            <Typography variant="body2" gutterBottom>
                                {attachment.title || `Відео ${index + 1}`}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<VideoLibraryIcon />}
                                    component="a"
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Переглянути відео
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );
            case 'text':
                return (
                    <Card key={index} sx={{ maxWidth: 345, m: 1 }}>
                        <CardContent>
                            <Typography variant="body2" gutterBottom>
                                {attachment.title || `Текст ${index + 1}`}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<TextSnippetIcon />}
                                    component="a"
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Відкрити текст
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                );
            case 'game':
                return (
                    <Card key={index} sx={{ width: '100%', m: 1 }}>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                {attachment.title || `Міні-гра ${index + 1}`}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <iframe 
                                    src={attachment.url} 
                                    style={{ width: '100%', height: '400px', border: 'none' }}
                                    title={attachment.title || `Міні-гра ${index + 1}`}
                                    allowFullScreen
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button 
                                size="small" 
                                component="a"
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Відкрити в новому вікні
                            </Button>
                        </CardActions>
                    </Card>
                );
            default:
                return null;
        }
    };

    if (!tasks.length) {
        return (
            <Paper sx={{ marginTop: 6, p: 3 }}>
                <Typography variant="subtitle1" align="center">
                    Немає доступних завдань
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ marginTop: 6 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width="5%"></TableCell>
                        <TableCell width="30%">Назва завдання</TableCell>
                        <TableCell width="50%">Опис завдання</TableCell>
                        <TableCell width="15%">Вкладення</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <React.Fragment key={task._id}>
                            <TableRow>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleRow(task._id)}
                                    >
                                        {expandedRows[task._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{task.name}</TableCell>
                                <TableCell>{task.descriptions}</TableCell>
                                <TableCell>
                                    {task.attachments && task.attachments.length > 0 ? (
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {task.attachments.map((attachment, index) => {
                                                const icon = getAttachmentTypeIcon(attachment.type);
                                                return (
                                                    <Chip 
                                                        key={index}
                                                        icon={icon}
                                                        label={attachment.type === 'image' ? 'Фото' : 
                                                               attachment.type === 'video' ? 'Відео' : 
                                                               attachment.type === 'text' ? 'Текст' : 'Гра'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                );
                                            })}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Немає
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                            {task.attachments && task.attachments.length > 0 && (
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                        <Collapse in={expandedRows[task._id]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Вкладення
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {task.attachments.map((attachment, index) => (
                                                        <Grid item xs={12} md={attachment.type === 'game' ? 12 : 4} key={index}>
                                                            {renderAttachment(attachment, index)}
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};
