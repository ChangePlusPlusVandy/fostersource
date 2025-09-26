# Copilot Instructions for fostersource

## Project Overview

- **Monorepo structure**: Contains `backend` (Node.js/Express, TypeScript) and `frontend` (React, Create React App, TypeScript).
- **Backend**: REST API with controllers, models, middlewares, and config. Integrates with services like Cloudinary, Firebase, and Resend.
- **Frontend**: Standard React app using Create React App conventions. Tailwind CSS is used for styling.

## Key Directories & Patterns

- `backend/controllers/`: Business logic for each resource (e.g., `courseController.ts`, `userController.ts`).
- `backend/models/`: Mongoose models for MongoDB collections.
- `backend/routes/`: Route definitions, each resource has its own file.
- `backend/middlewares/`: Auth, error handling, file upload, etc.
- `backend/config/`: Service configuration (Cloudinary, Firebase, Resend).
- `frontend/src/pages/`: Page-level React components, often matching backend resources.

## Developer Workflows

- **Backend**
  - Start server: `npm start` or `ts-node server.ts` in `backend/`
  - Run tests: `npm test` (Jest, see `jest.config.js`)
  - Type-check: `tsc --noEmit`
- **Frontend**
  - Start dev server: `npm start` in `frontend/`
  - Build: `npm run build`
  - Test: `npm test`

## Conventions & Patterns

- **Controllers**: Each controller handles a single resource, uses async functions, and returns JSON responses.
- **Models**: Mongoose schemas, one per resource, named as `<resource>Model.ts`.
- **Routes**: Route files import controllers and define RESTful endpoints.
- **Error Handling**: Centralized in `middlewares/errorMiddleware.ts`.
- **Auth**: JWT-based, see `middlewares/authMiddleware.ts`.
- **Uploads**: Handled via Cloudinary, see `middlewares/upload.ts` and `config/cloudinary*.ts`.
- **Email**: Uses Resend, see `config/resend.ts` and `controllers/emailController.ts`.

## Integration Points

- **Cloudinary**: For file uploads (images, handouts, etc.).
- **Firebase**: Admin SDK for notifications or user management.
- **Resend**: Transactional email sending.

## Examples

- To add a new resource:
  1. Create a model in `models/`
  2. Create a controller in `controllers/`
  3. Add routes in `routes/`
  4. Register the route in `app.ts`
- To add a new frontend page:
  1. Create a component in `frontend/src/pages/`
  2. Add navigation in the appropriate parent/layout component

## Testing

- Backend tests are in `backend/tests/`, use Jest.
- Frontend tests follow Create React App conventions.

## Tips for AI Agents

- Always check for existing patterns in controllers, models, and routes before adding new code.
- Use async/await and centralized error handling for backend logic.
- Keep RESTful conventions for API endpoints.
- Reference config files for service integrations.
- Use Tailwind CSS for frontend styling.

---

For more details, see the main `README.md` files in the root and `frontend/` directories.
