## HR Attendance SaaS – Frontend

This is a React single-page application for a multi-tenant HR Attendance SaaS system. It is designed to work against an existing Spring Boot backend without changing any backend APIs.

### Tech stack

- React (Vite)
- React Router (role-based routing)
- Axios (HTTP client)
- Custom responsive CSS (no UI framework required, but you can layer Tailwind/MUI/Bootstrap on top if desired)

### Features

- **Single login portal**
  - POST `/auth/login` with `{ tenantId, username, password }`.
  - Stores `accessToken` (JWT) in sessionStorage and configures a shared Axios client with `Authorization: Bearer <token>`.
  - Decodes JWT to derive:
    - Role (`SUPER_ADMIN`, `HR`, or `EMPLOYEE`) from common Spring JWT claims (`roles`, `authorities`, etc.).
    - `employeeId` from `employeeId` / `empId` / `sub` claim.
  - Redirects to `/super-admin`, `/hr`, or `/employee` based on role.

- **Role-based layouts and navigation**
  - `SUPER_ADMIN` (`/super-admin/*`):
    - Manage companies/tenants via `/api/v1/admin/companies` CRUD.
  - `HR` (`/hr/*`):
    - Dashboard, Employees, Shifts, Work Policy, Holidays, Leave Types & Balances, Leave Admin, Biometric test page, Notifications, Bulk Upload.
  - `EMPLOYEE` (`/employee/*`):
    - My Dashboard, My Attendance, My Leaves, Notifications.
    - Uses `/api/v1/attendance/*`, `/leave/*`, `/notifications/*`.
  - `Manager` (`/manager/*`):
    - Team Leave Requests, Notifications, calling `/leave/pending`, `/leave/{id}/approve|reject`, `/notifications/*`.

- **Shared Axios client**
  - Located in `src/lib/apiClient.js`.
  - Base URL: `http://localhost:8080`.
  - Adds `Authorization: Bearer <token>` to all requests after login.
  - Tags 401/403 responses so you can easily centralize session-expiry handling if desired.

### Project structure (frontend)

- `src/main.jsx` – Vite/React entry.
- `src/App.jsx` – Router configuration and `ProtectedRoute`.
- `src/auth/AuthContext.jsx` – JWT handling, role/employeeId derivation, login/logout.
- `src/lib/apiClient.js` – Axios instance with JWT header.
- `src/layouts/` – Base layout + role-specific shells (SuperAdmin, HR, Employee, Manager).
- `src/pages/` – Route-level pages for each role and capability (auth, superadmin, hr, employee, manager).
- `src/index.css` – Modern, responsive layout and component styling (sidebar, cards, tables, forms, buttons).

### Running the app

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Ensure your Spring Boot backend is running at:

- `http://localhost:8080`
- With the APIs and context-path exactly as described in your backend (e.g. `/auth/login`, `/api/v1/admin/...`, `/leave/...`, `/notifications/...`).

4. Open the URL printed by Vite (usually `http://localhost:5173`) in your browser.

### Notes and customization

- If your JWT uses different claim names for roles or employeeId, update `deriveRoleAndEmployeeId` in `src/auth/AuthContext.jsx`.
- To switch to Tailwind/MUI/Bootstrap, you can keep the current components and gradually replace the CSS and elements with the UI library equivalents; routing and API wiring will remain the same.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
