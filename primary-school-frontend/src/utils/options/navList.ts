import studentIcon from '../../assets/student.png'
import journalIcon from '../../assets/journal.png'
import inboxIcon from '../../assets/inbox.png'
import searchIcon from '../../assets/search.png'
import schedule from '../../assets/calendar.png'

import {AppRoutes} from "../AppRoutes.ts";
export const navListFirst = [
    {label: 'Вхідні', icon: inboxIcon, route:AppRoutes.INBOX},
    {label: 'Журнал', icon: journalIcon, route:AppRoutes.JOURNAL},
    {label: 'Предмети', icon: searchIcon, route:AppRoutes.SUBJECTS},
]

export const navListSecond = [
    {label: 'Список учнів', icon: studentIcon, route:AppRoutes.STUDENTS},
    {label: 'Розклад занять', icon: schedule, route:AppRoutes.SCHEDULE}
]