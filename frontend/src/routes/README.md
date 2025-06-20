# Routes Structure

This directory contains organized route definitions for the application, separated by user roles and access levels.

## Structure

```
routes/
├── index.ts              # Main export file
├── types.ts              # TypeScript interfaces for routes
├── publicRoutes.tsx      # Public routes (accessible without login)
├── guestRoutes.tsx       # Guest routes (login, signup, etc.)
├── customerRoutes.tsx    # Customer-specific routes
├── staffRoutes.tsx       # Staff-specific routes
├── doctorRoutes.tsx      # Doctor-specific routes
└── adminRoutes.tsx       # Admin-specific routes
```

## Route Configuration

Each route object supports the following properties:

- `path`: URL path
- `element`: React element to render
- `label`: Display name for navigation
- `icon`: React icon component
- `showInNavbar`: Boolean to show in public navigation
- `showInSidebar`: Boolean to show in authenticated user sidebar

## Usage

### Import Routes
```tsx
import { publicPaths, customerPaths, adminPaths } from './routes';
```

### Dynamic Route Generation
```tsx
// Generate routes dynamically
{customerPaths.map((route, index) => (
  <Route key={index} path={route.path} element={route.element} />
))}

// Filter sidebar routes
const sidebarRoutes = customerPaths.filter(route => route.showInSidebar);
```

### Role-Based Access
The routes are separated by role to enable:
- Easy role-based access control
- Clean separation of concerns
- Simplified navigation management
- Better code organization

## Adding New Routes

1. **Public Routes**: Add to `publicRoutes.tsx` for pages accessible without authentication
2. **Guest Routes**: Add to `guestRoutes.tsx` for authentication-related pages
3. **Role Routes**: Add to appropriate role file (`customerRoutes.tsx`, `staffRoutes.tsx`, etc.)

### Example:
```tsx
// In customerRoutes.tsx
{
  path: '/new-feature',
  element: <NewFeatureComponent />,
  label: 'New Feature',
  icon: <FaFeature />,
  showInSidebar: true
}
```

## Benefits

1. **Centralized Configuration**: All routes in one place per role
2. **Type Safety**: TypeScript interfaces for route objects
3. **Dynamic Navigation**: Automatic sidebar and navbar generation
4. **Role Separation**: Clear boundaries between user types
5. **Easy Maintenance**: Simple to add, remove, or modify routes
6. **Reusable**: Route configurations can be used across components

## Components Integration

### AppLayout
Uses route configurations to dynamically generate Routes and determine sidebar visibility.

### Sidebar
Automatically generates navigation items from routes with `showInSidebar: true`.

### Navigation
Can use routes with `showInNavbar: true` for public navigation generation.
