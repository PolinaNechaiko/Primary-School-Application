import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridToolbarContainer
} from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {randomArrayItem, randomId,} from '@mui/x-data-grid-generator';
import {Box, Button, Typography} from "@mui/material";
import React from "react";
import {EditSelectCell} from "../../components/EditSelectCell/EditSelectCell.tsx";

const roles = ['Market', 'Finance', 'Development'];

const randomRole = () => {
    return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
    {
        id: randomId(),
        name: "Ангеліна Антошевська",
        absenteeism: "",

        task1: "",
        task2: "",
        task3: "",
        task4: "",
        task5: "",
    },
    {
        id: randomId(),
        name: "Роман Бартошик",
        absenteeism:"",

        task1: "",
        task2: "",
        task3: "",
        task4: "",
        task5: "",
    },
    {
        id: randomId(),
        name: "Вікторія Білецька",
        absenteeism: "",

        task1: "",
        task2: "",
        task3: "",
        task4: "",
        task5: "",

        role: randomRole(),
    },
    {
        id: randomId(),
        name: "Подолюх Роман",
        absenteeism: "",

        task1: "",
        task2: "",
        task3: "",
        task4: "",
        task5: "",
    },
    {
        id: randomId(),
        name: "Ярема Андрій",
        absenteeism:"" ,

        task1: "",
        task2: "",
        task3: "",
        task4: "",
        task5: "",
    },
];

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const {setRows, setRowModesModel} = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, {id, name: '', age: '', isNew: true}]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: {mode: GridRowModes.Edit, fieldToFocus: 'name'},
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
                Добавити учня
            </Button>
        </GridToolbarContainer>
    );
}


const Journal = () => {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = {...newRow, isNew: false};
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {field: 'name', headerName: "Ім'я", width: 180, editable: true},
        {
            field: 'absenteeism',
            headerName: 'Задача 1',
            type: 'string',
            width: 150,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            renderEditCell: (params) => <EditSelectCell {...params} />,

        },
        {
            field: 'task1',
            headerName: 'Задача 2',
            type: 'string',
            width: 150,
            editable: true,
            renderEditCell: (params) => <EditSelectCell {...params} />,
        },
        {
            field: 'task2',
            headerName: 'Задача 3',
            type: 'string',
            width: 150,
            editable: true,
            renderEditCell: (params) => <EditSelectCell {...params} />,
        },
        {
            field: 'task3',
            headerName: 'Задача 4',
            type: 'string',
            width: 150,
            editable: true,
            renderEditCell: (params) => <EditSelectCell {...params} />,
        },
        {
            field: 'task4',
            headerName: 'Задача 5',
            type: 'string',
            width: 150,
            editable: true,
            renderEditCell: (params) => <EditSelectCell {...params} />,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Взаємодія ',
            width: 100,
            cellClassName: 'actions',
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <Typography fontWeight={500} sx={{margin: '32px 0', width: 'fit-content', backgroundColor: "white",padding:"0 16px"}} variant='h1'>Мій
                клас</Typography>
            <DataGrid
                sx={{backgroundColor:'white'}}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: {setRows, setRowModesModel},
                }}
            />
        </Box>
    );
};


export default Journal;
