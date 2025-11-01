# bl1nk Note Frontend

AI-Powered Workspace Frontend built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **AI-Powered Workspace**: Interactive command center for AI-driven automation
- **Real-time System Monitoring**: Live system stats and health monitoring
- **Plan Management**: Create, approve, and execute AI-generated plans
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## Architecture

### Frontend Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful icon library

### Key Components

#### Workspace Layout
- **WorkspaceHeader**: Navigation and user management
- **WorkspaceSidebar**: Project explorer and plan management
- **WorkspaceCanvas**: Main content area with plan visualization
- **WorkspaceInspector**: System monitoring and tools
- **ChatPane**: AI command center

#### Agent Cards
- **PlanningCard**: Interactive plan approval interface
- **ExecutionCard**: Real-time execution monitoring with progress tracking

#### Authentication
- **Login/Register**: Secure authentication flow
- **Protected Routes**: Route guards for authenticated users

## API Integration

The frontend connects to the bl1nk backend through a comprehensive API service layer:

### Core Services
- **API Service**: Centralized HTTP client with interceptors
- **Event Bus**: Type-safe event system for component communication
- **Auth Store**: Authentication state management
- **Workspace Store**: Workspace and plan management

### API Endpoints
- `/health` - System health check
- `/admin/dashboard/*` - System monitoring and stats
- `/auth/*` - Authentication endpoints
- `/workspaces/*` - Workspace management
- `/plans/*` - Plan CRUD operations
- `/chat/command` - AI command processing
- `/mcp/*` - Model Context Protocol integration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- bl1nk backend running on port 8000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=bl1nk Note
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_OAUTH_GITHUB_PATH=/auth/oauth/github
   NEXT_PUBLIC_OAUTH_GOOGLE_PATH=/auth/oauth/google
   NEXT_PUBLIC_OAUTH_CALLBACK_PATH=/auth/oauth-callback
   ```

   Adjust each OAuth path to match your backend endpoints and configure the provider to redirect back to `NEXT_PUBLIC_OAUTH_CALLBACK_PATH` with the token payload.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Usage

### Authentication
1. Navigate to `/auth/login`
2. Use demo credentials: `admin@bl1nk.com` / `password`
3. Or register a new account
4. Pick **Continue with GitHub/Google** to start the OAuth flow (requires backend support and the environment variables above).

### Workspace Features

#### Command Center
- Type natural language commands in the chat pane
- Examples:
  - "Create a landing page for my startup"
  - "Analyze user data and create insights"
  - "Design a mobile app wireframe"

#### Plan Management
1. **Create Plans**: Use the command center to generate AI plans
2. **Review Plans**: Examine steps and approve execution
3. **Monitor Execution**: Watch real-time progress in execution cards
4. **View Results**: Access completed plans and outputs

#### System Monitoring
- Real-time CPU, memory, and disk usage
- Application metrics and error rates
- Playwright testing integration
- Health status indicators

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── workspace/         # Main workspace page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── agent_cards/       # AI agent interaction cards
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── ui/                # Reusable UI components
│   └── workspace/         # Workspace-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # API and external services
├── stores/                # Zustand state stores
└── types/                 # TypeScript type definitions
```

## State Management

### Auth Store
- User authentication state
- Login/logout functionality
- Token management
- Route protection

### Workspace Store
- Current workspace context
- Plan management (CRUD operations)
- Command processing
- Real-time updates

### Event Bus
- Type-safe event communication
- Component decoupling
- Real-time notifications
- System-wide state synchronization

## Styling

### Design System
- **Colors**: HSL-based color system with CSS variables
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components with variants

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive navigation

## Development

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Consistent code formatting
- Component-based architecture

### Performance
- Next.js optimizations
- Code splitting
- Image optimization
- Bundle analysis

## Integration with Backend

The frontend is designed to work seamlessly with the bl1nk unified backend:

### API Communication
- RESTful API integration
- Real-time updates via polling
- Error handling and retry logic
- Request/response interceptors

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh
- Secure route protection
- Session management

### Data Flow
1. User inputs command in chat pane
2. Frontend sends request to `/chat/command`
3. Backend processes with AI and returns plan
4. Frontend displays plan in workspace
5. User approves plan
6. Frontend triggers execution via `/plans/{id}/execute`
7. Real-time progress updates in execution cards

## Deployment

### Build Configuration
```bash
npm run build
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Version number

### Static Export (Optional)
```bash
npm run build && npm run export
```

## Contributing

1. Follow TypeScript best practices
2. Use consistent component patterns
3. Implement proper error handling
4. Add type definitions for new features
5. Test API integrations thoroughly

## License

This project is part of the bl1nk ecosystem and follows the same licensing terms.
