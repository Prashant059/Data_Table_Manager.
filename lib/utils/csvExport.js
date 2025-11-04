import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export function exportToCSV(rows, columns, filename) {
  // Filter only visible columns
  const visibleColumns = columns.filter(col => col.visible);

  if (visibleColumns.length === 0) {
    throw new Error('No visible columns to export');
  }

  if (rows.length === 0) {
    throw new Error('No data to export');
  }

  // Extract headers
  const headers = visibleColumns.map(col => col.headerName);

  // Map row data for export
  const data = rows.map(row => {
    const exportRow = {};
    visibleColumns.forEach(col => {
      const value = row[col.field];
      exportRow[col.headerName] = value != null ? value : '';
    });
    return exportRow;
  });

  // Convert data to CSV using PapaParse
  const csv = Papa.unparse({
    fields: headers,
    data: data
  });

  // Generate filename (use timestamp if not provided)
  const defaultFilename = `table-data-${new Date().toISOString().split('T')[0]}.csv`;
  const finalFilename = filename || defaultFilename;

  // Create CSV file and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, finalFilename);

  return {
    filename: finalFilename,
    rowCount: rows.length,
    columnCount: visibleColumns.length
  };
}
