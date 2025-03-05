# Primary School Application

This application is designed for primary schools to manage classes, students, tasks, and grades. It provides separate interfaces for teachers and students.

## Features

### Teacher Features
- Manage subjects and classes
- Create and assign tasks to students
- Grade student work
- View student progress in the journal
- Create weekly educational games
- Manage student roster

### Student Features
- Join subjects using a code
- View assigned tasks with audio assistance
- Submit responses to tasks
- View grades for completed work
- Access weekly educational games
- View class schedule

## Student Interface

The student interface is designed to be accessible and engaging for primary school students:

1. **Login Page**: Features a speaker icon that provides audio guidance for students.
2. **My Subjects**: Shows all subjects the student has joined, with audio prompts for each subject.
3. **My Tasks**: Displays tasks for each subject with expandable details, audio prompts, and the ability to submit responses.
4. **My Grades**: Shows grades for completed tasks organized by subject.
5. **Weekly Game**: Provides access to educational games that change weekly.

## Audio Assistance

The application includes audio prompts to assist young students:
- Navigation items have audio explanations
- Subject names are read aloud when clicked
- Task instructions can be played as audio
- Success animations and sounds play when tasks are completed

## Setup

### Audio Files
For the audio functionality to work, place audio files in the `public/audio` directory:
- `/audio/my-tasks.mp3` - For the "My Tasks" page title
- `/audio/tasks.mp3` - For the "Tasks" tab
- `/audio/task-completed.mp3` - Played when a task is successfully submitted
- `/audio/subject-[subject-name].mp3` - For each subject (replace spaces with hyphens and use lowercase)
- `/audio/task-[task-name].mp3` - For each task (replace spaces with hyphens and use lowercase)

## Development

### Frontend
The frontend is built with React, TypeScript, and Material-UI.

```bash
cd primary-school-frontend
npm install
npm start
```

### Backend
The backend is built with Node.js, Express, and MongoDB.

```bash
cd primary-school-backend
npm install
npm start
``` 