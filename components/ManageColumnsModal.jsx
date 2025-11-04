'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Modal,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Stack,
  List,
  ListItem,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { addColumn, setColumnVisibility, reorderColumns } from '../lib/features/table/tableSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflow: 'auto',
};

function SortableColumnItem({ column, onVisibilityChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.field,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: isDragging ? 'action.selected' : 'background.paper',
        boxShadow: isDragging ? 2 : 0,
        '&:hover': {
          bgcolor: isDragging ? 'action.selected' : 'action.hover',
          borderColor: 'primary.main',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <IconButton
        size="small"
        {...attributes}
        {...listeners}
        sx={{
          cursor: isDragging ? 'grabbing' : 'grab',
          mr: 1,
          color: isDragging ? 'primary.main' : 'text.secondary',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          },
        }}
      >
        <DragIndicator />
      </IconButton>
      <FormControlLabel
        control={
          <Checkbox
            checked={column.visible}
            onChange={(e) => onVisibilityChange(column.field, e.target.checked)}
          />
        }
        label={column.headerName}
        sx={{ flexGrow: 1 }}
      />
    </ListItem>
  );
}

export default function ManageColumnsModal({ open, onClose }) {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.table.columns);
  const [showAddForm, setShowAddForm] = useState(false);
  const [columnOrder, setColumnOrder] = useState(() => columns.map((col) => col.field));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleVisibilityChange = (field, visible) => {
    dispatch(setColumnVisibility({ field, visible }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = columnOrder.indexOf(active.id);
      const newIndex = columnOrder.indexOf(over?.id);
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex);

      setColumnOrder(newOrder);
      dispatch(reorderColumns(newOrder));
    }
  };

  const handleAddColumn = (data) => {
    const newField = data.field.toLowerCase().replace(/\s+/g, '_');
    dispatch(
      addColumn({
        field: newField,
        headerName: data.headerName,
        type: data.type,
        width: 150,
      })
    );
    setColumnOrder((prev) => [...prev, newField]);
    reset();
    setShowAddForm(false);
  };

  useEffect(() => {
    setColumnOrder(columns.map((col) => col.field));
  }, [columns]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Manage Columns
        </Typography>

        <Card
          variant="outlined"
          sx={{ mb: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🔄 Drag the handle to reorder columns • ☑️ Toggle checkboxes to show/hide
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="subtitle1" gutterBottom>
          Column Order & Visibility
        </Typography>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {columnOrder.map((fieldId) => {
                const column = columns.find((col) => col.field === fieldId);
                if (!column) return null;

                return (
                  <SortableColumnItem
                    key={column.field}
                    column={column}
                    onVisibilityChange={handleVisibilityChange}
                  />
                );
              })}
            </List>
          </SortableContext>
        </DndContext>

        <Divider sx={{ my: 2 }} />

        {!showAddForm ? (
          <Button variant="outlined" onClick={() => setShowAddForm(true)} fullWidth>
            Add New Column
          </Button>
        ) : (
          <Box component="form" onSubmit={handleSubmit(handleAddColumn)}>
            <Typography variant="subtitle1" gutterBottom>
              Add New Column
            </Typography>
            <Stack spacing={2}>
              <TextField
                {...register('headerName', { required: 'Header name is required' })}
                label="Column Header Name"
                size="small"
                fullWidth
                error={!!errors.headerName}
                helperText={errors.headerName?.message}
              />
              <TextField
                {...register('field', {
                  required: 'Field name is required',
                  pattern: {
                    value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                    message:
                      'Field name must start with letter or underscore and contain only letters, numbers, and underscores',
                  },
                })}
                label="Field Name (for data)"
                size="small"
                fullWidth
                error={!!errors.field}
                helperText={
                  errors.field?.message ||
                  'Use lowercase with underscores (e.g., department, location)'
                }
              />
              <FormControl size="small" fullWidth>
                <InputLabel>Data Type</InputLabel>
                <Select {...register('type', { required: true })} defaultValue="string" label="Data Type">
                  <MenuItem value="string">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" size="small">
                  Add Column
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    reset();
                  }}
                  size="small"
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="contained">
            Done
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
