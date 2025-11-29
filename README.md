# Real-Time Chat Application

A real-time chat application built with Next.js and Socket.io. Users can join with a username and chat with other online users instantly with live message updates and typing indicators.

## Features

- Real-time messaging using WebSockets
- Online users list with live status updates
- Typing indicators
- Message history persistence with MongoDB
- Responsive design

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Node.js, Express 5, Socket.io
- **Database**: MongoDB
- **Language**: TypeScript
- **Deployment**: AWS, Nginx

## Prerequisites

- Node.js 18 or higher
- MongoDB (local installation or MongoDB Atlas)

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/realtime-chat
PORT=3001
```

For MongoDB Atlas, use:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/realtime-chat?retryWrites=true&w=majority
PORT=3001
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/parasmahla1/realtime-chat.git
cd realtime-chat
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

4. Start the development servers:

```bash
npm run dev:all
```

This starts both the Next.js frontend (port 3000) and the Socket.io server (port 3001).

5. Open your browser and navigate to:

```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run server` - Start Socket.io server
- `npm run dev:all` - Start both servers concurrently
- `npm run build` - Build for production


## Project Structure

```
realtime-chat/
├── app/                  # Next.js app router pages
│   ├── api/              # API routes
│   ├── chat/             # Chat page
│   └── page.tsx          # Login page
├── components/           # React components
├── context/              # Socket context provider
├── hooks/                # Custom React hooks
├── lib/                  # Database connection
├── models/               # Mongoose models
├── types/                # TypeScript type definitions
└── server.ts             # Socket.io server
```

## License

MIT
