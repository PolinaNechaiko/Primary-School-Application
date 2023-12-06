import { MenuItem, Select } from "@mui/material";

export const EditSelectCell = (props) => {
    const { id, value, field, api } = props;

    const handleChange = (event) => {
        api.setEditCellValue({ id, field, value: event.target.value }, event);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            fullWidth
        >
            {/* Replace these MenuItem values with your options */}
            <MenuItem value="В">Bідмінний</MenuItem>
            <MenuItem value="Д">Достатній</MenuItem>
            <MenuItem value="С">Середній</MenuItem>
            <MenuItem value="П">Початковий</MenuItem>
        </Select>
    );
};
