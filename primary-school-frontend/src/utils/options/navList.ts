import studentIcon from '../../assets/student.png'
import journalIcon from '../../assets/journal.png'
import inboxIcon from '../../assets/inbox.png'
import searchIcon from '../../assets/search.png'
import schedule from '../../assets/calendar.png'
import gameIcon from '../../assets/game.png'
import tasksIcon from '../../assets/tasks.png'
import gradesIcon from '../../assets/grades.png'

import {AppRoutes} from "../AppRoutes.ts";

// Navigation for teachers
export const navListFirst = [
    {label: 'Вхідні', icon: inboxIcon, route:AppRoutes.INBOX},
    {label: 'Журнал', icon: journalIcon, route:AppRoutes.JOURNAL},
    {label: 'Предмети', icon: searchIcon, route:AppRoutes.SUBJECTS},
]

export const navListSecond = [
    {label: 'Список учнів', icon: studentIcon, route:AppRoutes.STUDENTS},
    {label: 'Розклад занять', icon: schedule, route:AppRoutes.SCHEDULE},
    {label: 'Гра тижня', icon: gameIcon, route:AppRoutes.WEEKLY_GAME}
]

// Navigation for students
export const studentNavListFirst = [
    {label: 'Мої предмети', icon: searchIcon, route:AppRoutes.SUBJECTS},
    {label: 'Мої завдання', icon: tasksIcon, route:AppRoutes.STUDENT_TASKS},
    {label: 'Мої оцінки', icon: gradesIcon, route:AppRoutes.STUDENT_GRADES},
]

export const studentNavListSecond = [
    {label: 'Розклад занять', icon: schedule, route:AppRoutes.SCHEDULE},
    {label: 'Гра тижня', icon: gameIcon, route:AppRoutes.WEEKLY_GAME}
]