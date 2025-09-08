# Product Management System

A modern React frontend for managing products, built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Product Grid View**: Browse products in a responsive grid layout
- **Add Product**: Create new products with form validation
- **Edit Product**: Update existing product information
- **View Product Details**: See complete product information
- **Delete Product**: Remove products with confirmation dialog
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **unstated-next** - Simple state management
- **ESLint** - Code linting and formatting

## Project Structure

```
src/
├── components/           # React components
│   ├── AddProductDialog.tsx
│   ├── DeleteProductDialog.tsx
│   ├── EditProductDialog.tsx
│   ├── Modal.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetailsDialog.tsx
│   └── ProductGrid.tsx
├── services/            # API services
│   └── api.ts
├── store/              # State management
│   └── products.ts
├── types/              # TypeScript type definitions
│   └── product.ts
├── App.tsx             # Main application component
├── index.css           # Global styles (Tailwind)
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup

This frontend is designed to work with a FastAPI backend. Make sure your backend server is running on `http://localhost:8000` with the following endpoints:

- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /products/{id}` - Get a specific product
- `PUT /products/{id}` - Update a product
- `DELETE /products/{id}` - Delete a product

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Design

The UI is based on the Figma designs for the Product Management Mockup and includes:

- Clean, modern interface
- Intuitive navigation
- Responsive grid layout
- Modal dialogs for actions
- Form validation
- Loading states
- Error handling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint with TypeScript rules. Run `npm run lint` to check for issues.
