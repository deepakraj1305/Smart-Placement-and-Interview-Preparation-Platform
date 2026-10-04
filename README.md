# AI-Powered Placement Interview Practice & Analysis Platform

A professional interview-practice platform designed for campus placements. It
allows students to practice technical, HR, behavioural, and system-design
interviews using voice or typed responses and receive structured performance
analysis.

## Live Demo

**Demo:** https://ky6esp-ecgsowz0k-arcadawebapps9.vercel.applive

## Technologies Used

### Frontend
- **React 18** — component-based user interface.
- **TypeScript** — type-safe application development.
- **Vite** — frontend development server and production build tool.
- **React Router** — client-side routing and page navigation.
- **Tailwind CSS** — responsive utility-first styling.
- **Lucide React** — interface icons.

### Backend & Cloud
- **Supabase** — authentication, database, and cloud backend services.
- **Supabase Auth** — email/password authentication and session management.
- **Google OAuth** — Google sign-in integration.
- **Supabase PostgreSQL** — persistent application data such as users,
  questions, interview sessions, and responses.

### Browser & AI-Style Analysis
- **Web Speech API** — browser-based microphone speech-to-text.
- **Web Audio API** — lightweight audio feedback sounds.
- **Custom transcript analysis** — filler-word detection, speaking pace/WPM,
  repeated-word detection, relevance/structure scoring, and STAR-framework
  analysis.

### Deployment
- **Vercel** — web application deployment.
- **GitHub** — source-code version control and project hosting.

## Main Features

- Student authentication and guest access
- Google sign-in
- Interview setup by domain and difficulty
- Technical interview practice
- HR interview practice
- Behavioural interview practice
- System Design interview practice
- Voice-based interview answering
- Typed-answer mode
- Live speech-to-text transcription
- Speaking pace and WPM analysis
- Filler-word detection
- Repeated-word analysis
- STAR framework analysis
- Relevance and structure scoring
- Interview performance reports
- Practice history
- Printable interview reports
- Admin dashboard
- Question management
- Interview analytics
- Audio feedback
- Responsive interface

## Project Structure

```text
placement-interview-workstation/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add the required Supabase and Google OAuth configuration to `.env`.

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment Variables

The GitHub version intentionally does **not** contain private credentials.

Configure these variables in your deployment environment:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_CLIENT_ID
VITE_GOOGLE_AUTH_PROXY
FULLSTACK_PROJECT_REF
FULLSTACK_RESTORE_API_URL
```

Never commit service-role keys, private API keys, passwords, or other secrets
to GitHub.

## Browser Compatibility

Voice interview functionality depends on browser support for the Web Speech
API and microphone permissions. A typed-answer mode is available when speech
recognition is unavailable.

## Deployment

The project is configured for a Vite-based deployment and can be deployed to
Vercel or another static/frontend hosting platform.

## Security Note

The supplied source contained cloud/authentication credentials inside a
deployment configuration file. Those credentials have been removed from this
GitHub-ready copy. If the exposed credentials are active, rotate/revoke them
before publishing the original source publicly.

## Project Purpose

This project demonstrates how cloud services, authentication, browser speech
technology, and structured interview analytics can be combined to create a
practical campus-placement preparation platform.
