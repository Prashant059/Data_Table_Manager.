'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Papa from 'papaparse';
import {
  Modal,
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Stack,
  Paper,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { setRows, addColumn } from '../lib/features/table/tableSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function ImportCSVModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { columns } = useSelector((state) => state.table);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [detectedColumns, setDetectedColumns] = useState([]);

  const validateCSVFormat = (data) => {
    const headers = Object.keys(data[0] || {});
    if (headers.length === 0) {
      throw new Error('CSV file appears to be empty or malformed');
    }

    const commonColumns = ['name', 'email', 'age', 'role'];
    const foundColumns = headers.filter((header) =>
      commonColumns.some((common) =>
        header.toLowerCase().includes(common.toLowerCase())
      )
    );

    if (foundColumns.length === 0) {
      console.warn('No standard columns detected. CSV will be imported as-is.');
    }

    return true;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreviewData([]);
    setDetectedColumns([]);
    setError(null);
    setSuccess(false);

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please select a valid CSV file (.csv extension required)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please select a file smaller than 10MB.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            const criticalErrors = results.errors.filter(
              (err) => err.type === 'Delimiter'
            );
            if (criticalErrors.length > 0) {
              throw new Error(`CSV parsing error: ${criticalErrors[0].message}`);
            }
            console.warn('CSV parsing warnings:', results.errors);
          }

          const data = results.data;
          if (data.length === 0) {
            throw new Error('CSV file contains no data rows');
          }

          validateCSVFormat(data);

          const csvColumns = Object.keys(data[0] || {});
          const existingFields = columns.map((col) => col.field);
          const newColumns = csvColumns.filter(
            (col) =>
              !existingFields.includes(col.toLowerCase().replace(/\s+/g, '_'))
          );

          setDetectedColumns(newColumns);
          setPreviewData(data.slice(0, 5));

          newColumns.forEach((columnName) => {
            const fieldName = columnName.toLowerCase().replace(/\s+/g, '_');
            const isNumericColumn = data.every((row) => {
              const value = row[columnName];
              return !value || !isNaN(Number(value));
            });

            dispatch(
              addColumn({
                field: fieldName,
                headerName: columnName,
                type: isNumericColumn ? 'number' : 'string',
                width: 150,
              })
            );
          });

          const tableRows = data.map((row, index) => {
            const tableRow = {
              id: index + 1,
              name: row.name || row.Name || '',
              email: row.email || row.Email || '',
              age: parseInt(row.age || row.Age || '0') || 0,
              role: row.role || row.Role || '',
            };

            Object.keys(row).forEach((key) => {
              const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
              if (!['name', 'email', 'age', 'role'].includes(normalizedKey)) {
                const value = row[key];
                tableRow[normalizedKey] =
                  !isNaN(Number(value)) && value !== '' ? Number(value) : value;
              }
            });

            return tableRow;
          });

          dispatch(setRows(tableRows));
          setSuccess(true);
          setTimeout(() => {
            onClose();
            setSuccess(false);
            setPreviewData([]);
            setDetectedColumns([]);
          }, 1500);
        } catch (err) {
          setError(err.message || 'Failed to parse CSV file');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setError(`File reading error: ${error.message}`);
        setLoading(false);
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setPreviewData([]);
    setDetectedColumns([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Import CSV Data
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Upload a CSV file to import data. The CSV should have columns for:
          name, email, age, role. Additional columns will be automatically
          detected and added to the table.
        </Typography>

        <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
          <a
            href="/sample-data.csv"
            download="sample-data.csv"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            📥 Download Sample CSV File
          </a>
        </Typography>

        <Stack spacing={2}>
          <Paper
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              Click to select CSV file
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports .csv files only
            </Typography>
          </Paper>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {loading && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Parsing CSV file...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              CSV data imported successfully!
              {detectedColumns.length > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Detected {detectedColumns.length} new column(s):{' '}
                  {detectedColumns.join(', ')}
                </Typography>
              )}
            </Alert>
          )}

          {previewData.length > 0 && !success && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Preview (first 5 rows):
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(previewData, null, 2)}
                </pre>
              </Box>
            </Box>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose}>
              {success ? 'Done' : 'Cancel'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
