# StockSphere Frontend

## Overview

StockSphere Frontend is a React-based web application for inventory management. It provides an intuitive interface for managing products, handling stock requests, and processing bills, with separate interfaces for admin and staff users.

**Backend Repository**: [StockSphere Backend](https://github.com/jhapriyansh/stocksphereims-be)

## Technology Stack

- **Framework**: React
- **Build Tool**: Vite
- **State Management**: React Context
- **Routing**: React Router
- **Styling**: CSS Modules
- **HTTP Client**: Axios

## Project Structure

```
stocksphere-showcase/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable components
│   │   ├── AdminLayout.jsx
│   │   ├── InvoiceModal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StaffLayout.jsx
│   ├── context/       # React context definitions
│   │   └── AuthContext.jsx
│   ├── hooks/        # Custom React hooks
│   │   └── useApi.js
│   ├── pages/        # Page components
│   │   ├── admin/    # Admin-specific pages
│   │   ├── staff/    # Staff-specific pages
│   │   ├── ChangePassword.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MobileScanner.jsx
│   │   └── NotFound.jsx
│   ├── services/     # API and service functions
│   │   └── api.js
│   ├── utils/        # Utility functions
│   │   └── helpers.js
│   ├── App.jsx       # Root component
│   ├── main.jsx      # Application entry point
│   └── index.css     # Global styles
├── index.html
└── vite.config.js    # Vite configuration
```

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jhapriyansh/stocksphere-showcase
   cd stocksphere-showcase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Features

### Authentication

- Login system with role-based access
- Protected routes for admin and staff
- Password change functionality
- Session management

### Admin Features

- Dashboard with analytics
- Inventory management
- Staff management
- Stock request processing
- Bill viewing and analysis
- Product updates and management

### Staff Features

- Billing counter interface
- Stock request creation
- Product inventory view
- Bill generation

## Components

### Layouts

- `AdminLayout`: Layout wrapper for admin pages
- `StaffLayout`: Layout wrapper for staff pages
- `ProtectedRoute`: Route guard component

### Modals and UI Components

- `InvoiceModal`: Bill generation and preview
- Form components
- Table components
- Chart components

## Pages

### Admin Pages

- `AdminDashboard`: Main admin interface
- `Analytics`: Business analytics and reports
- `InventoryStatus`: Stock management
- `ManageRequests`: Handle stock requests
- `ManageStaff`: Staff management
- `UpdateProduct`: Product management
- `ViewBills`: Billing history

### Staff Pages

- `BillingCounter`: Point of sale interface
- `RequestStock`: Stock request creation

### Common Pages

- `LoginPage`: Authentication
- `ChangePassword`: Password management
- `MobileScanner`: Barcode/QR scanning
- `NotFound`: 404 error page

## State Management

- Authentication state using Context API
- Form state management
- API state management

## API Integration

- RESTful API consumption through backend server
- Axios interceptors for authentication
- Error handling
- Loading states
- No mock data - all data is served from the backend API

Note: This application requires the backend server to be running. Please refer to the backend repository for setup instructions and default login credentials.

## Hooks

- `useApi`: Custom hook for API calls
- `useAuth`: Authentication hook
- Other custom hooks for specific features

## Styling

- CSS Modules for component-specific styles
- Global styles in index.css
- Responsive design
- Theme variables

## Development

### Code Style

- ESLint configuration
- Prettier formatting
- Component organization
- File naming conventions

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```
