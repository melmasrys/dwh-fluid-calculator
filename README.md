# DWH Sizing Calculator

This project is a Data Warehouse (DWH) Sizing Calculator that provides SKU recommendations and cost estimations for various cloud platforms based on user-defined workload parameters.

## Features

- **Interactive Configuration**: Adjust `Data Volume` and `Concurrent Users` to see real-time updates.
- **Multi-Cloud Recommendations**: Get sizing suggestions for:
  - Microsoft Fabric
  - Azure Synapse
  - Databricks
- **Cost Estimation**: View estimated monthly costs for each recommended SKU.
- **Exportable Reports**: Generate and export reports of the sizing recommendations.
- **Advanced Mode**: Access additional configuration options for more granular control.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, Radix UI
- **Backend**: Express.js
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd dwh_fluid_calculator
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Running Locally

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Build and Deployment

### Build

To build the project for production, run:

```bash
pnpm build
```

This command builds both the client-side assets and the server-side application. The output is generated in the `dist` directory.

### Deployment

The application can be deployed to any platform that supports Node.js applications. For a seamless experience with automatic CI/CD, deploying to **Vercel** is recommended.

## Project Structure

```
.dwh_fluid_calculator_temp/
├── client/         # Frontend source code (React, TypeScript)
├── server/         # Backend source code (Express.js)
├── shared/         # Shared types and utilities
├── dist/           # Production build output
├── public/         # Static assets
├── package.json    # Project dependencies and scripts
├── vite.config.ts  # Vite configuration
└── README.md       # This file
```
