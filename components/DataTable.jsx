'use client';

import { useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { 
  Box, 
  TextField, 
  Paper, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography,
  Chip,
} from '@mui/material';
import { 
  ViewColumn, 
  FileUpload, 
  FileDownload, 
  Edit, 
  Delete, 
  Save,
  Cancel
} from '@mui/icons-material';
import { setSearchTerm, updateRow, deleteRow } from '../lib/features/table/tableSlice';
import { exportToCSV } from '../lib/utils/csvExport';

function CustomToolbar({ onOpenColumnManager, onOpenImport, editingRows, setEditingRows, exportRows }) {
  const dispatch = useDispatch();
  const { columns, searchTerm } = useSelector((state) => state.table);

  const handleExportCSV = () => {
    exportToCSV(exportRows, columns);
  };

  const hasUnsavedChanges = editingRows && editingRows.size > 0;

  return (
    <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <GridToolbarColumnsButton />
        <Tooltip title="Manage Columns">
          <IconButton onClick={onOpenColumnManager} size="small">
            <ViewColumn />
          </IconButton>
        </Tooltip>
        <Tooltip title="Import CSV">
          <IconButton onClick={onOpenImport} size="small">
            <FileUpload />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export CSV">
          <IconButton onClick={handleExportCSV} size="small">
            <FileDownload />
          </IconButton>
        </Tooltip>
        <GridToolbarExport />
        {hasUnsavedChanges && editingRows && setEditingRows && (
          <>
            <Chip 
              label={`${editingRows.size} rows editing`} 
              color="warning" 
              size="small" 
            />
            <Button
              startIcon={<Save />}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                setEditingRows(new Set());
              }}
            >
              Save All
            </Button>
            <Button
              startIcon={<Cancel />}
              size="small"
              variant="outlined"
              onClick={() => {
                setEditingRows(new Set());
                window.location.reload();
              }}
            >
              Cancel All
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search all fields..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          sx={{ width: 200 }}
        />
      </Box>
    </GridToolbarContainer>
  );
}

export default function DataTable({ onOpenColumnManager, onOpenImport }) {
  const dispatch = useDispatch();
  const { rows, columns, searchTerm } = useSelector((state) => state.table);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editingRows, setEditingRows] = useState(new Set());

  const handleDeleteClick = useCallback((id) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  }, [dispatch, rowToDelete]);

  const handleEditClick = useCallback((id) => {
    setEditingRows((prev) => new Set(prev).add(id));
  }, []);

  const handleCellEditStop = useCallback((params) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(params.id);
      return newSet;
    });
  }, []);

  const processRowUpdate = useCallback(
    (newRow) => {
      const validatedRow = {
        ...newRow,
        age: typeof newRow.age === 'string' ? parseInt(newRow.age) || 0 : newRow.age,
      };

      dispatch(updateRow(validatedRow));
      return validatedRow;
    },
    [dispatch]
  );

  const visibleColumns = useMemo(() => {
    const sortedColumns = [...columns].sort((a, b) => {
      const aIndex = columns.findIndex((col) => col.field === a.field);
      const bIndex = columns.findIndex((col) => col.field === b.field);
      return aIndex - bIndex;
    });

    const baseColumns = sortedColumns
      .filter((col) => col.visible)
      .map((col) => ({
        field: col.field,
        headerName: col.headerName,
        width: col.width || 150,
        type: col.type === 'number' ? 'number' : 'string',
        editable: true,
      }));

    const actionsColumn = {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params) => {
        const isInEditMode = editingRows.has(params.id);

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<Save />}
              label="Save"
              onClick={() => {
                setEditingRows((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(params.id);
                  return newSet;
                });
              }}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<Cancel />}
              label="Cancel"
              onClick={() => {
                setEditingRows((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(params.id);
                  return newSet;
                });
              }}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditClick(params.id)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<Delete style={{ color: '#d32f2f' }} />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row.id)}
          />,
        ];
      },
    };

    return [...baseColumns, actionsColumn];
  }, [columns, editingRows, handleEditClick, handleDeleteClick]);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  return (
    <>
      <Paper
        sx={{
          height: { xs: 500, sm: 600, md: 650 },
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={visibleColumns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
          onCellEditStop={handleCellEditStop}
          columnVisibilityModel={columns.reduce((acc, col) => {
            acc[col.field] = col.visible;
            return acc;
          }, {})}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onOpenColumnManager={onOpenColumnManager}
                onOpenImport={onOpenImport}
                editingRows={editingRows}
                setEditingRows={setEditingRows}
                exportRows={filteredRows}
              />
            ),
          }}
          sx={{
            '& .MuiDataGrid-main': {
              overflow: 'hidden',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
            '& .MuiDataGrid-cell--editable': {
              '&:hover': {
                backgroundColor: 'action.selected',
                cursor: 'pointer',
              },
            },
            '& .MuiDataGrid-cell[data-field="actions"]': {
              '&:focus-within': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 1, sm: 2 },
            },
            '& .MuiDataGrid-columnHeaders': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              padding: { xs: '4px 8px', sm: '8px 16px' },
            },
          }}
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this row? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
