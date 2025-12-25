# CreationQ - Medical Education Platform

## Project Overview

CreationQ is a full-stack medical education platform designed for radiology training. It provides tools for creating, managing, and sharing questionnaires, clinical cases, protocols, and medical sheets with integrated image viewing capabilities.

**Tech Stack:**
- Frontend: React 18.2 with React Router, styled-components, TailwindCSS
- Backend: Node.js/Express.js
- Database: MongoDB with Mongoose
- Storage: AWS S3 (via DigitalOcean Spaces)
- Authentication: JWT
- File Upload: Multer
- Rich Text: TinyMCE, React Quill, Slate

**Deployment:**
- Production: DigitalOcean (https://rifim-radiologie.com)
- Backend Port: 5002
- Frontend: Served from /build in production

## Project Structure

```
/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── Auth.js             # Authentication
│   │   ├── Header.js           # Main header
│   │   ├── QuestionnaireCreator.js
│   │   ├── SheetEditor.js
│   │   ├── RadiologyViewer.js
│   │   └── shared/             # Shared components
│   ├── pages/                   # Page components
│   │   ├── Home.js
│   │   ├── QuestionnairePage.js
│   │   ├── CasesPage.js
│   │   ├── ProtocolsPersonalPage.js
│   │   ├── ProtocolsPublicPage.js
│   │   └── StatisticsDashboardPage.js
│   ├── utils/                   # Utilities
│   │   ├── axiosConfig.js      # API configuration
│   │   ├── db.js               # MongoDB connection
│   │   ├── spacesConfig.js     # AWS S3/Spaces
│   │   └── storageUtils.js
│   ├── theme.js                 # Light/dark theme definitions
│   ├── GlobalStyle.js          # Global styles
│   └── App.js                   # Main app component
├── routes/                      # Backend API routes
│   ├── authRoutes.js           # /api/auth
│   ├── questionnaireRoutes.js  # /api/questionnaires
│   ├── caseRoutes.js           # /api/cases
│   ├── protocolRoutes.js       # /api/protocols
│   ├── sheetRoutes.js          # /api/cases/sheet
│   └── imageRoutes.js          # /api/images
├── models/                      # Mongoose models
│   ├── User.js
│   ├── Questionnaire.js
│   ├── Case.js
│   ├── Protocol.js
│   ├── QuestionnaireRating.js
│   ├── CaseRating.js
│   └── ProtocolRating.js
├── middleware/                  # Express middleware
├── uploads/                     # Local file uploads
├── build/                       # Production build
├── server.js                    # Express server entry
└── package.json
```

## Core Features

### 1. Questionnaires
- Create/edit/delete questionnaires with rich text questions
- Public and private questionnaires
- Rating system (1-5 stars)
- Tags for organization
- Preview and use modes
- Export to various formats

### 2. Clinical Cases
- Upload and manage medical cases
- Radiology image viewer integration
- Associated medical sheets
- Public/private visibility
- Rating and tagging system
- Image upload to S3/Spaces

### 3. Protocols
- Personal and public protocol libraries
- Create/edit/view protocols
- Rich text editing
- Rating system
- Tag-based organization

### 4. Medical Sheets
- Dedicated sheet editor with rich formatting
- Associated with clinical cases
- Template-based creation
- Export capabilities

### 5. Statistics Dashboard
- Usage analytics
- Performance tracking
- Data visualization with Recharts

## Key Components

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Auth guard with PrivateRoute component
- Session management
- User login/logout flow in App.js

### Navigation & Header
- Apple-style mega menu navigation system
- Desktop: Hover-activated dropdown menus with delays
- Mobile: Slide-out menu with organized sections
- Three main sections: Compte-rendu (Questionnaires), Cas (Cases), Protocoles (Protocols)
- User menu with statistics and logout
- Icons from lucide-react library
- Fixed header with backdrop blur effect
- Header height: 60px desktop, 64px mobile
- Safe area insets for mobile devices

### Theme System
- Light and dark mode support with theme toggle in header
- Persistent theme preference in localStorage
- CSS variables for dynamic theming
- Styled-components ThemeProvider
- Light mode: Gradient background on header
- Dark mode: Solid color background on header (no gradient)

### Image Handling
- AWS S3/DigitalOcean Spaces integration
- Multer for file uploads
- Sharp for image processing
- Support for various medical image formats
- RadiologyViewer component for image display

### Routing Structure
**Protected Routes** (require authentication):
- `/` - Home
- `/questionnaires` - Manage questionnaires
- `/questionnaires-list` - User's personal questionnaires
- `/create`, `/edit/:id` - Questionnaire creator
- `/cases` - Manage cases
- `/cases-list` - User's personal cases
- `/radiology-viewer/:caseId` - Image viewer
- `/sheet/:caseId`, `/sheet-editor/:caseId` - Medical sheets
- `/protocols/personal` - User's personal protocols
- `/protocols/create` - Create new protocol
- `/protocols/edit/:id` - Edit protocol
- `/statistics` - Analytics dashboard

**Public Routes**:
- `/public-questionnaires` - Community questionnaires
- `/public-cases` - Community cases
- `/protocols/public` - Community protocols

## Development

### Environment Variables

**Backend Development** (`.env.development.backend`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5002)
- `SPACES_ENDPOINT` - S3/Spaces endpoint
- `SPACES_KEY`, `SPACES_SECRET` - S3 credentials
- `SPACES_BUCKET` - Bucket name

**Backend Production** (`.env.production.backend`):
- Same as development with production values

**Frontend** (`.env.development.frontend`, `.env.production.frontend`):
- `REACT_APP_API_URL` - Backend API URL

### Scripts

```bash
npm run dev         # Run backend + frontend concurrently
npm run server      # Backend only (nodemon)
npm run client      # Frontend only (CRA dev server)
npm run build       # Production build
npm start           # Production server
```

### Development Workflow

1. Start development: `npm run dev`
2. Backend runs on port 5002
3. Frontend runs on port 3000
4. Hot reload enabled for both

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login

### Questionnaires (`/api/questionnaires`)
- `GET /` - List all questionnaires
- `GET /public` - Public questionnaires
- `GET /:id` - Get single questionnaire
- `POST /` - Create questionnaire
- `PUT /:id` - Update questionnaire
- `DELETE /:id` - Delete questionnaire
- `POST /:id/rate` - Rate questionnaire

### Cases (`/api/cases`)
- `GET /` - List all cases
- `GET /public` - Public cases
- `GET /:id` - Get single case
- `POST /` - Create case
- `PUT /:id` - Update case
- `DELETE /:id` - Delete case
- `POST /:id/rate` - Rate case
- Sheet routes under `/api/cases/:caseId/sheet`

### Protocols (`/api/protocols`)
- `GET /` - List all protocols
- `GET /public` - Public protocols
- `GET /:id` - Get single protocol
- `POST /` - Create protocol
- `PUT /:id` - Update protocol
- `DELETE /:id` - Delete protocol
- `POST /:id/rate` - Rate protocol

### Images (`/api`)
- Image upload and processing endpoints
- S3/Spaces integration

## Database Schema

### User
- username (unique)
- email
- password (bcrypt hashed)
- createdAt

### Questionnaire
- title
- description
- questions (array)
- tags (array)
- isPublic (boolean)
- creator (ref: User)
- ratings (array)
- createdAt, updatedAt

### Case
- title
- description
- images (array)
- tags (array)
- isPublic (boolean)
- creator (ref: User)
- ratings (array)
- sheet (ref)
- createdAt, updatedAt

### Protocol
- title
- content (rich text)
- tags (array)
- isPublic (boolean)
- creator (ref: User)
- ratings (array)
- createdAt, updatedAt

## Styling

### Theme Configuration
- Defined in `src/theme.js`
- Light and dark variants
- Medical color palette in `src/medicalColors.js`
- Global styles in `src/GlobalStyle.js`

### CSS Framework
- TailwindCSS for utility classes
- styled-components for component-level styling
- Custom medical-themed button components
- Responsive design throughout
- Mobile-first approach with breakpoint at 768px

### Dark Mode
- Toggle in header (desktop: icon button, mobile: menu option)
- Persisted in localStorage
- CSS class-based (`dark` class on root)
- Theme provider integration
- Different header styling between modes

## Special Features

### Drag and Drop
- React Beautiful DnD integration
- DragDropContext in App.js
- Used for questionnaire organization

### Rich Text Editing
- Multiple editor options:
  - TinyMCE for full-featured editing
  - React Quill for lightweight editing
  - Slate for custom implementations

### Loading States
- Lazy loading for route components
- LoadingSpinner component
- Suspense boundaries

### Session Management
- SessionManager component
- Token validation
- Automatic logout on expiration

### Error Handling
- React Error Boundary
- Express error middleware
- User-friendly error messages

## Important Conventions

### Code Style
- French comments in many files
- Camel case for variables/functions
- Pascal case for components
- ES6+ syntax throughout

### State Management
- React hooks (useState, useEffect)
- No external state management library
- Props drilling for shared state
- Context API available but not heavily used

### File Organization
- Components in `/src/components`
- Pages in `/src/pages`
- Shared components in `/src/components/shared`
- Utils in `/src/utils`

### Naming
- Page components end with "Page"
- Route files end with "Routes.js"
- Model files match their schema name

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/YourPage.js`
2. Add lazy import in `src/App.js`
3. Add route in Routes section
4. Create backend route if needed in `routes/`
5. Add model if needed in `models/`

### Adding a New Feature
1. Plan the data model (MongoDB schema)
2. Create model in `models/`
3. Create API routes in `routes/`
4. Create frontend components
5. Add routing in App.js
6. Update navigation/header if needed

### Debugging
- Backend logs: Check console output from Express
- Frontend logs: Check browser console
- Network: Check browser DevTools network tab
- Database: Use MongoDB Compass or mongo shell

## Security Considerations

- JWT tokens for authentication
- Passwords hashed with bcryptjs
- CORS configured for specific origins
- File upload size limits (10mb)
- Input validation on backend
- Protected routes with middleware

## Performance

- Lazy loading routes
- Image optimization with Sharp
- Build optimization (GENERATE_SOURCEMAP=false)
- Static file serving in production
- MongoDB indexing on key fields

## Recent Updates

### UI/UX Improvements (Dec 2025)
- Redesigned header with Apple-style mega menus
- Increased header thickness (60px desktop, 64px mobile)
- Added hover delays for better UX on mega menus
- Removed gradient in dark mode for cleaner look
- Improved mobile navigation with slide-out menu
- Added lucide-react icons throughout navigation
- Homepage redesigned with clean, professional UI
- Fixed dark mode icon visibility

## Known Issues & TODOs

- Check comments in code for TODOs
- Some French/English mixed documentation
- Migration scripts in root (migrate-questionnaires.js)

## Support & Documentation

- GitHub: Repository tracking
- Issues: Report bugs and feature requests
- Production URL: https://rifim-radiologie.com
- Dev environment: localhost:3000 (frontend), localhost:5002 (backend)
