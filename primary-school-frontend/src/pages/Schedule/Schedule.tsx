import {Container, Typography} from "@mui/material";
import {subjectsList} from "../../utils/options/subjectsList.ts";
import {TimeSlotTable} from "../../components/TimeSlotTable/TimeSlotTable.tsx";

const Schedule = () => {
    return (
        <Container>
            <Typography mb={2} variant='h2' fontWeight={700}>Тижневий розклад</Typography>
            <TimeSlotTable subjects={subjectsList} /*schedule={schedule}*/ />
        </Container>
    );
};

export default Schedule;
