# TrialTwin - Digital Twin Clinical Trials Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **AI-powered platform for pharmaceutical clinical trials that optimizes patient recruitment, improves trial matching, and provides explainable AI insights.**

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/trial-twin.git
cd trial-twin

# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
# Frontend: http://localhost:5000
# Default admin: admin / (password from ADMIN_PASSWORD env var)
```

## Screenshots

<details>
<summary>Click to view application screenshots</summary>

### Login Page
![Login Page](screenshots/Login%20Page.png)

### Clinical Operations Dashboard
![Clinical Operations 1](screenshots/Clinical%20Operations%201.png)
![Clinical Operations 2](screenshots/Clinical%20Operations%202.png)

### Patient Management
![Patient List](screenshots/Patient%20List%201.png)
![Patient Recruiter](screenshots/Patient%20Recruiter%201.png)

### Patient Portal & Profiles
![Patient Portal](screenshots/Patient%20Portal.png)
![Patient Profile Overview](screenshots/Patient%20Profile%20Overview.png)
![Patient Profile Medical History](screenshots/Patient%20Profile%20Medical%20History.png)
![Patient Profile Digital Twin](screenshots/Patient%20Profile%20Digital%20Twin.png)
![Patient Profile Trial Matches](screenshots/Patient%20ProfileTrial%20Matches.png)

### Site Coordinator & Trial Management
![Site Coordinator](screenshots/Site%20Coordinator%201.png)
![Trial Management](screenshots/Trial%20Management.png)

</details>

## Live Demo

- Live Application: [TrialTwin Demo](https://6004af51-6278-4f01-bade-0ec3b6e9fecb-00-3fqvrx4x0q4k3.spock.replit.dev/)
- API Documentation: [API Documentation](API_DOCUMENTATION.md)

## Overview

TrialTwin is a comprehensive digital twin platform that transforms how pharmaceutical companies conduct clinical trials. By leveraging AI-driven patient profiling and intelligent matching algorithms, it accelerates trial recruitment, reduces dropout rates, and provides transparent decision-making for all stakeholders.

### Key Features

- Digital Twin Generation: AI-powered patient profiling based on clinical and lifestyle data
- Intelligent Trial Matching: Multi-factor scoring algorithm (biomarkers, location, burden, eligibility)
- Explainable AI: Transparent decision explanations with SHAP-like analysis
- Role-based Dashboards: Clinical operations, patient recruiters, site coordinators
- Real-time Analytics: Live enrollment tracking and performance metrics
- Secure Authentication: Role-based access control with session management
- Bulk Data Management: CSV import/export for patient and trial data
- Responsive Design: Mobile-friendly interface for all user types

## Architecture

### Frontend
- Framework: React 18 with TypeScript
- Build Tool: Vite for fast development and optimized builds
- UI Framework: Shadcn/ui components built on Radix UI primitives
- Styling: Tailwind CSS with custom medical-themed design system
- Routing: Wouter for lightweight client-side routing
- State Management: React Query (TanStack Query) for server state
- Forms: React Hook Form with Zod validation

### Backend
- Runtime: Node.js with Express.js
- Language: TypeScript with ESM modules
- Database: PostgreSQL with Drizzle ORM (or in-memory for development)
- Authentication: Passport.js with local strategy and session management
- AI/ML: Custom JavaScript-based matching algorithms
- Session Management: Memory-based or PostgreSQL session storage

### Database Schema
- Patients: Core patient information with medical history
- Digital Twins: AI-generated patient profiles with clinical and lifestyle factors
- Clinical Trials: Trial information and requirements
- Trial Matches: AI-powered patient-trial matching results

## Use Cases

### For Clinical Operations Managers
- Simulate trial recruitment scenarios
- Forecast enrollment and optimize site activation plans
- Audit all patient interactions for compliance
- Monitor real-time enrollment metrics

### For Patient Recruiters
- Receive AI-powered ranked lists of eligible patients
- Understand reasons for patient ineligibility
- Automated engagement triggers and follow-up
- Bulk patient data import and management

### For Site Coordinators
- View projected patient flow and readiness
- Allocate resources effectively
- Provide feedback on digital twin predictions
- Monitor site-specific performance metrics

### For Patients
- Clear, simple trial eligibility information
- Transparent burden and commitment details
- Supportive notifications and educational content
- Secure platform protecting health data

## Tech Stack

### Core Technologies
- Frontend: React 18, TypeScript, Vite
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL, Drizzle ORM
- Authentication: Passport.js, Express Sessions
- UI: Shadcn/ui, Radix UI, Tailwind CSS
- State Management: React Query, React Hook Form
- Validation: Zod schema validation

### AI/ML Components
- Matching Algorithms: Custom JavaScript-based scoring
- Biomarker Analysis: Compatibility scoring for genetic markers
- Location Matching: Geographic proximity and travel willingness
- Burden Assessment: Trial complexity evaluation
- Explainability: SHAP-like feature importance analysis

### Development Tools
- Build: Vite, ESBuild
- Type Checking: TypeScript
- Linting: ESLint (configurable)
- Testing: Jest (configurable)
- Deployment: Docker-ready, cloud-native

## AI Scoring System

The platform uses a sophisticated multi-factor scoring algorithm:

### Biomarker Score (40% weight)
- Compares patient biomarkers against trial requirements
- Exact matches get full points, partial matches get weighted scores
- Missing critical biomarkers result in score penalties

### Location Score (25% weight)
- Evaluates geographic accessibility and patient travel willingness
- Distance-based scoring with travel willingness multipliers
- Transportation resources and support system consideration

### Burden Score (20% weight)
- Assesses patient's ability to handle trial demands
- Considers trial complexity, patient age, and performance status
- Previous treatment history and tolerance factors

### Eligibility Score (15% weight)
- Binary and weighted eligibility criteria matching
- Hard inclusion/exclusion criteria (age, diagnosis, etc.)
- Soft criteria with weighted importance

## API Documentation

For comprehensive API documentation including all endpoints, request/response formats, authentication, and code examples, see [API Documentation](API_DOCUMENTATION.md).

### Quick Reference
- **Authentication**: `/api/login`, `/api/logout`
- **Patient Management**: `/api/patients`, `/api/patients/upload`
- **Digital Twins**: `/api/digital-twins`
- **Clinical Trials**: `/api/clinical-trials`, `/api/clinical-trials/upload`
- **Trial Matching**: `/api/trial-matches`
- **Explainability**: `/api/explainability`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional, in-memory storage available)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/trial-twin.git
   cd trial-twin
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Required environment variables
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_secure_session_secret
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. Start development server
   ```bash
   npm run dev
   ```

5. Access the application
   - Frontend: http://localhost:5000
   - Default admin credentials: admin / (password from ADMIN_PASSWORD env var)

### Production Deployment

1. Build the application
   ```bash
   npm run build
   ```

2. Start production server
   ```bash
   npm start
   ```

## Docker Deployment

### Quick Start with Docker
```bash
# Build the Docker image
docker build -t trial-twin .

# Run the container
docker run -p 5000:5000 \
  -e DATABASE_URL=your_db_url \
  -e SESSION_SECRET=your_secret \
  -e ADMIN_PASSWORD=your_password \
  trial-twin
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/trial_twin
      - SESSION_SECRET=your_secret
      - ADMIN_PASSWORD=your_password
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=trial_twin
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Project Structure

```
TrialTwin/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   └── index.html
├── server/                 # Node.js backend
│   ├── ai/                # AI/ML processing scripts
│   ├── routes.ts          # API route definitions
│   ├── auth.ts            # Authentication setup
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema definitions
├── uploads/                # File upload directory
└── docs/                   # Documentation
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | No* | In-memory storage |
| `SESSION_SECRET` | Session encryption secret | Yes | Placeholder |
| `ADMIN_PASSWORD` | Admin user password | Yes | Placeholder |
| `NODE_ENV` | Environment mode | No | development |

*Required for PostgreSQL deployment, optional for in-memory storage

### Database Options

1. PostgreSQL (Production)
   - Set `DATABASE_URL` environment variable
   - Uses Drizzle ORM for type-safe database operations
   - Supports full data persistence and session storage

2. In-Memory (Development)
   - No database setup required
   - Pre-populated with mock data
   - Perfect for development and testing

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- Unit Tests: Component and utility function testing
- Integration Tests: API endpoint testing
- E2E Tests: Full user workflow testing

## Performance

### Optimization Features
- Code Splitting: Automatic route-based code splitting
- Lazy Loading: Component and page lazy loading
- Caching: React Query for efficient data caching
- Bundle Optimization: Vite for optimized builds
- Database Indexing: Optimized queries with Drizzle ORM

### Monitoring
- Real-time Metrics: Live enrollment and performance tracking
- Error Tracking: Comprehensive error logging
- Performance Monitoring: Response time and throughput metrics

## Security

### Authentication & Authorization
- Session Management: Secure session storage
- Role-based Access: Different dashboards for different user types
- Password Hashing: Secure password storage with scrypt
- CSRF Protection: Built-in CSRF protection

### Data Protection
- Input Validation: Zod schema validation
- SQL Injection Prevention: Parameterized queries with Drizzle ORM
- XSS Protection: React's built-in XSS protection
- Data Encryption: Sensitive data encryption at rest

### Data Protection
- Advanced Encryption: Secure data transmission and storage
- Audit Trails: Comprehensive logging for transparency
- Data Privacy: Patient data anonymization capabilities

## Deployment Guides

### Vercel + Railway
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Configure environment variables
4. Set up custom domain

### Heroku
1. Create Heroku app
2. Add PostgreSQL addon
3. Configure environment variables
4. Deploy with Git

### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy automatically

### AWS/GCP/Azure
1. Build Docker image
2. Push to container registry
3. Deploy to container service
4. Configure load balancer

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code of Conduct
This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Aventura Sandbox - Development and AI/ML implementation
- Shadcn/ui - Beautiful and accessible UI components
- Drizzle ORM - Type-safe database operations
- React Query - Efficient server state management

## Support

If you need help or want to report a bug:
- Bug Reports: [GitHub Issues](https://github.com/yourusername/trial-twin/issues)
- Email: ask@synovatehealth.com

## Roadmap

### Upcoming Features
- [ ] Real-time Notifications: WebSocket-based live updates
- [ ] Advanced Analytics: Machine learning insights dashboard
- [ ] Mobile App: React Native companion app
- [ ] Integration APIs: Clinical trial system connectors
- [ ] Multi-language Support: Internationalization
- [ ] Advanced AI Models: Deep learning integration

### Version History
- v1.0.0 - Initial release with core features
- v1.1.0 - Enhanced AI matching algorithms
- v1.2.0 - Improved explainability features
- v1.3.0 - Performance optimizations

---

Built by Aventura Sandbox

TrialTwin - Transforming Clinical Trials Through AI

---

<div align="center">

Star this repository if you found it helpful!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/trial-twin?style=social)](https://github.com/yourusername/trial-twin)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/trial-twin?style=social)](https://github.com/yourusername/trial-twin)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/trial-twin)](https://github.com/yourusername/trial-twin/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/trial-twin)](https://github.com/yourusername/trial-twin/blob/main/LICENSE)

</div> 