import { createSlice } from '@reduxjs/toolkit';

const defaultColumns = [
  { field: 'name', headerName: 'Name', type: 'string', visible: true, width: 150 },
  { field: 'email', headerName: 'Email', type: 'string', visible: true, width: 200 },
  { field: 'age', headerName: 'Age', type: 'number', visible: true, width: 100 },
  { field: 'role', headerName: 'Role', type: 'string', visible: true, width: 150 },
];

const defaultRows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, role: 'Designer' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, role: 'Manager' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, role: 'Developer' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, role: 'Analyst' },
  { id: 6, name: 'Diana Davis', email: 'diana@example.com', age: 29, role: 'Designer' },
  { id: 7, name: 'Edward Miller', email: 'edward@example.com', age: 31, role: 'Developer' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', age: 27, role: 'Manager' },
  { id: 9, name: 'George Martinez', email: 'george@example.com', age: 33, role: 'Analyst' },
  { id: 10, name: 'Helen Rodriguez', email: 'helen@example.com', age: 26, role: 'Designer' },
];

const initialState = {
  rows: defaultRows,
  columns: defaultColumns,
  searchTerm: '',
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows: (state, action) => {
      state.rows = action.payload;
    },
    addRow: (state, action) => {
      const newId = Math.max(...state.rows.map((row) => row.id), 0) + 1;
      const newRow = { ...action.payload, id: newId };
      state.rows.push(newRow);
    },
    updateRow: (state, action) => {
      const index = state.rows.findIndex((row) => row.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = action.payload;
      }
    },
    deleteRow: (state, action) => {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
    },
    addColumn: (state, action) => {
      const newColumn = { ...action.payload, visible: true };
      state.columns.push(newColumn);

      state.rows.forEach((row) => {
        if (!(action.payload.field in row)) {
          row[action.payload.field] = action.payload.type === 'number' ? 0 : '';
        }
      });
    },
    toggleColumnVisibility: (state, action) => {
      const column = state.columns.find((col) => col.field === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    setColumnVisibility: (state, action) => {
      const column = state.columns.find((col) => col.field === action.payload.field);
      if (column) {
        column.visible = action.payload.visible;
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    reorderColumns: (state, action) => {
      const order = action.payload;
      state.columns.sort((a, b) => order.indexOf(a.field) - order.indexOf(b.field));
    },
  },
});

export const {
  setRows,
  addRow,
  updateRow,
  deleteRow,
  addColumn,
  toggleColumnVisibility,
  setColumnVisibility,
  setSearchTerm,
  reorderColumns,
} = tableSlice.actions;

export default tableSlice.reducer;
