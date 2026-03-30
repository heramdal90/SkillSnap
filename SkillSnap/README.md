# SkillSnap

AI-powered local service booking platform for Malaysia

---

## Table of Contents
- [Project Overview](#project-overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Demo Mode](#demo-mode)
- [Consumer Flow](#consumer-flow)
- [Provider Flow](#provider-flow)
- [Demo Credentials](#demo-credentials)
- [Seeding & Mock Data](#seeding--mock-data)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
SkillSnap is an AI-powered local service booking platform for Malaysia, supporting both consumers and providers. The project is a pnpm monorepo with a full-stack TypeScript/React/Node/Expo architecture, supporting both real and demo/mock modes for rapid development and testing.

## Monorepo Structure
| Folder | Description |
|--------|-------------|
| `artifacts/api-server` | Express 5 API backend (port 8080) |
| `artifacts/skillsnap` | Main mobile app (Expo 54, React Native, Metro port 22172) |
| `artifacts/mockup-sandbox` | UI prototyping sandbox (Vite, port 5173/8081) |
| `lib/` | Shared libraries (api-spec, api-client-react, api-zod, db) |
| `scripts/` | Seeding and tooling |
| `admin/` | (Optional) Admin console (Vite + React) |

## Tech Stack
- **API:** Express 5, pino, bcryptjs, jsonwebtoken, CORS
- **Database:** MongoDB (with DAO layer) or in-memory mock data
- **Frontend:** Expo 54, React Native, Expo Router, React Query, AsyncStorage
- **UI Prototyping:** Vite, Radix UI, Tailwind CSS
- **TypeScript:** Monorepo-wide strict type safety

## Features
- Consumer and provider mobile flows
- Booking, matching, payment, and review lifecycle
- Provider onboarding, verification, and earnings
- Demo mode with mock data for rapid testing
- End-to-end flows for both roles
- Modern, professional UI/UX

## Installation & Setup
1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd SkillSnap
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in each package as needed.
   - See [Environment Variables](#environment-variables) for details.

## Running the Project
- **API Server (Express):**
  ```sh
  pnpm --filter @workspace/api-server dev
  ```
- **Mobile App (Expo):**
  ```sh
  pnpm --filter @workspace/skillsnap dev
  ```
- **UI Sandbox:**
  ```sh
  pnpm --filter @workspace/mockup-sandbox dev
  ```

## Demo Mode
- Enable demo mode by setting `USE_MOCK_DATA=true` in the API server's environment.
- In demo mode, all flows work with in-memory data, no real DB/auth required.
- All important buttons and flows are functional in demo mode.

## Consumer Flow
- Sign up/login as a consumer
- Create a service request
- View matched providers
- Confirm booking
- Make payment (demo)
- Track booking progress
- Leave a review

## Provider Flow
- Sign up/login as a provider
- Complete profile and upload credentials
- Set services, pricing, and availability
- Await admin approval (demo logic)
- Accept/reject incoming requests
- Manage job lifecycle and earnings
- View reviews and performance

## Demo Credentials
- **Demo Consumer:**
  - Email: `consumer@demo.com`
  - Password: `password123`
- **Demo Provider:**
  - Email: `provider@demo.com`
  - Password: `password123`

## Seeding & Mock Data
- Run seeding scripts via:
  ```sh
  pnpm --filter @workspace/scripts run seed
  ```
- In demo mode, mock data is auto-seeded on server start.

## Environment Variables
- See `.env.example` in each package for required variables.
- Key variables:
  - `USE_MOCK_DATA` (true/false)
  - `MONGO_URI` (if using real DB)
  - `JWT_SECRET`, etc.

## Contributing
- Fork the repo and create a feature branch
- Follow monorepo and TypeScript best practices
- Run type checks: `pnpm run typecheck:stack`
- Submit a pull request with clear description

## License
MIT

---

For more details, see `PROJECT_ANALYSIS_REPORT.md`.
