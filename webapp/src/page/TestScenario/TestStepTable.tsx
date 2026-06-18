import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridSlotProps,
  GridValidRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { styled } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { TestScenarioEntity, TestStep } from "../../api";

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    rowModesModel: GridRowModesModel;
  }
}

type GridValidTestStep = Partial<TestStep> &
  GridValidRowModel & {
    mode?: GridRowModes;
  };
type TestStepRowsModel = GridRowsProp<GridValidTestStep>;
type TestStepRowModel = GridRowModel<GridValidTestStep>;
type TestStepTableProps = {
  testSteps: TestStepRowsModel;
  onChange?: (steps: TestStep[]) => void;
  setError?: UseFormSetError<TestScenarioEntity>;
  clearErrors?: UseFormClearErrors<TestScenarioEntity>;
};

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .no-rows-primary": {
    fill: "#3D4751",
    ...theme.applyStyles("light", {
      fill: "#AEB8C2",
    }),
  },
  "& .no-rows-secondary": {
    fill: "#1D2126",
    ...theme.applyStyles("light", {
      fill: "#E8EAED",
    }),
  },
}));

function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { setRows, setRowModesModel, rowModesModel } = props;

  // Determine if there are any rows in edit mode
  const hasRowsInEditMode = Object.values(rowModesModel || {}).some(
    (model) => model.mode === GridRowModes.Edit,
  );

  const handleClick = () => {
    const id = crypto.randomUUID();
    setRows((oldRows) => {
      const nextStepNumber =
        oldRows.length > 0
          ? Math.max(...oldRows.map((row) => row.stepNumber || 0)) + 1
          : 1;

      return [
        ...oldRows,
        {
          id,
          stepNumber: nextStepNumber,
          description: "",
          testData: "",
        },
      ];
    });
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "description" },
    }));
  };

  const handleSaveAllClick = () => {
    // Create a new model where all rows in edit mode are changed to view mode
    const newModel = { ...rowModesModel };
    Object.keys(newModel).forEach((id) => {
      if (newModel[id].mode === GridRowModes.Edit) {
        newModel[id] = { ...newModel[id], mode: GridRowModes.View };
      }
    });
    setRowModesModel(() => newModel);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add step
      </Button>
      {hasRowsInEditMode && (
        <Button
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveAllClick}
          sx={{ ml: 1 }}
        >
          Save all
        </Button>
      )}
    </GridToolbarContainer>
  );
}
export default function TestStepTable({
  testSteps,
  onChange,
  setError,
  clearErrors,
}: TestStepTableProps) {
  const [rows, setRows] = useState<TestStepRowsModel>(testSteps);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
      if (params.field === "description") {
        const hasError = !params.row.description;
        if (hasError && setError) {
          setError("testSteps", {
            message: "Step description is required",
          });
        }
      }
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = useCallback(
    (newRow: TestStepRowModel) => {
      const updatedRow = { ...newRow };
      const updatedRows = rows.map((row) =>
        row.id === newRow.id ? updatedRow : row,
      );
      setRows(updatedRows);
      return updatedRow;
    },
    [rows],
  );

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "stepNumber",
      headerName: "No.",
      width: 80,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 350,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError =
          typeof params.props.value === "undefined" ||
          params.props.value === "";
        if (hasError && setError) {
          setError("testSteps", {
            message: "Step description is required",
          });
        }
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "testData",
      headerName: "Test Data",
      width: 350,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      editable: false,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    const editingRows = rows.filter(
      (row) => rowModesModel[row.id]?.mode === GridRowModes.Edit,
    );
    if (editingRows.length > 0) {
      setError?.("testSteps", {
        message: "Please save or cancel the editing row",
      });
    } else {
      clearErrors?.("testSteps");
    }
  }, [rows, rowModesModel, setError, clearErrors]);

  useEffect(() => {
    if (onChange) {
      const mappedTestSteps: TestStep[] = rows.map((row, index) => {
        return {
          stepId: index + 1,
          description: row.description || "",
          testData: row.testData || "",
          sensitiveData: row.sensitiveData || false,
        };
      });
      onChange(mappedTestSteps ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  return (
    <DataGrid
      sx={{
        "&.MuiDataGrid-root": {
          fontSize: "16px",
        },
      }}
      rows={rows}
      columns={columns}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      slots={{
        toolbar: EditToolbar,
        noRowsOverlay: () => (
          <StyledGridOverlay>No test steps were added</StyledGridOverlay>
        ),
      }}
      slotProps={{
        toolbar: { setRows, setRowModesModel, rowModesModel },
      }}
    />
  );
}
