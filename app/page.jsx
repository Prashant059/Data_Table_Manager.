'use client'

import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Typography, Box, Stack, Button, Snackbar, Alert } from '@mui/material'
import { FileUpload, FileDownload, ViewColumn } from '@mui/icons-material'
import AppHeader from '../components/AppHeader'
import DataTable from '../components/DataTable'
import ManageColumnsModal from '../components/ManageColumnsModal'
import ImportCSVModal from '../components/ImportCSVModal'
import { exportToCSV } from '../lib/utils/csvExport'

export default function Home() {
  const [columnManagerOpen, setColumnManagerOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(null)
  const [exportError, setExportError] = useState(null)

  const { rows, columns, searchTerm } = useSelector((state) => state.table)

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [rows, searchTerm])

  const handleExport = () => {
    try {
      const result = exportToCSV(filteredRows, columns)
      setExportSuccess(
        `Exported ${result.rowCount} rows and ${result.columnCount} columns to ${result.filename}`
      )
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed')
    }
  }

  return (
    <>
      <AppHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Data Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your data with sorting, filtering, column customization, and CSV import/export
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<FileUpload />}
            onClick={() => setImportModalOpen(true)}
            color="primary"
          >
            Import CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExport}
            color="primary"
          >
            Export CSV ({filteredRows.length} rows)
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewColumn />}
            onClick={() => setColumnManagerOpen(true)}
            color="secondary"
          >
            Manage Columns
          </Button>
        </Stack>

        <DataTable
          onOpenColumnManager={() => setColumnManagerOpen(true)}
          onOpenImport={() => setImportModalOpen(true)}
        />

        <ManageColumnsModal
          open={columnManagerOpen}
          onClose={() => setColumnManagerOpen(false)}
        />

        <ImportCSVModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)}
        />

        <Snackbar
          open={!!exportSuccess}
          autoHideDuration={4000}
          onClose={() => setExportSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setExportSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {exportSuccess}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!exportError}
          autoHideDuration={6000}
          onClose={() => setExportError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setExportError(null)} severity="error" sx={{ width: '100%' }}>
            {exportError}
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}
