<<<<<<< HEAD
# Data_Table_Manager.
=======
# Dynamic Data Table Manager

A powerful and dynamic data table manager built with Next.js 14, Redux Toolkit, and Material UI. This application provides advanced data management capabilities including sorting, filtering, column customization, and CSV import/export functionality.

## Features

### Core Features ✅
- **Dynamic Table View**: Interactive data table with Name, Email, Age, and Role columns
- **Sorting**: Click column headers to toggle ASC/DESC sorting
- **Global Search**: Search across all fields with real-time filtering
- **Pagination**: Client-side pagination (10 rows per page, configurable)
- **Dynamic Columns**: Add new columns and manage column visibility
- **Persistent Settings**: Column preferences saved with Redux Persist
- **CSV Import**: Upload and parse CSV files with error handling
- **CSV Export**: Export filtered data to CSV (visible columns only)

### Bonus Features ✅
- **Inline Row Editing**: Double-click cells to edit inline with validation
- **Row Actions**: Edit and Delete buttons with confirmation dialogs
- **Theme Toggle**: Light/Dark mode with Material UI theming
- **Column Reordering**: Drag-and-drop column reordering in manage modal
- **Responsive Design**: Fully responsive layout with mobile optimization
- **Real-time State Management**: Redux Toolkit for complex state
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: React Hook Form with validation
- **Save/Cancel All**: Bulk editing operations for multiple rows

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Redux Persist** for persistent settings
- **Material UI v5** for UI components
- **MUI DataGrid** for table functionality
- **PapaParse** for CSV parsing
- **FileSaver.js** for file downloads
- **React Hook Form** for form handling

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Basic Operations
- **Search**: Use the search field in the toolbar to filter data across all columns
- **Sort**: Click any column header to sort (click again to reverse)
- **Theme**: Toggle between light and dark mode using the theme button

### Column Management
- Click the "Manage Columns" button to open the column manager
- Toggle column visibility using checkboxes
- Add new columns with custom field names and data types
- Changes are automatically saved and persist across sessions

### CSV Operations
- **Import**: Click "Import CSV" to upload a CSV file
  - Supports files with name, email, age, role columns
  - Additional columns are automatically detected and added
  - Provides error feedback for invalid files
- **Export**: Click "Export CSV" to download current data
  - Only exports visible columns
  - Includes current search filters

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.
>>>>>>> dfb6c1b (Initial commit - JavaScript version of project)
