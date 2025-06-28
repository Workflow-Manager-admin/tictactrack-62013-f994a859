# Tic Tac Track – Modern React Frontend

A minimal, modern, light-themed React web app for playing, tracking, and exploring the game history of Tic Tac Toe.

## Features

- **Authentication:** Login and signup with username/password.
- **Interactive Board:** Play Tic Tac Toe with real-time board updates.
- **Game History:** View all your past games and results.
- **Move List:** See full move-by-move game history as you play.
- **Real-time:** Updates via WebSockets (or polling fallback) for multi-user games.
- **User Profile:** Simple user profile section.
- **Minimal & Responsive:** Clean, mobile-friendly UI with a focus on simplicity.
- **Dockerized:** Ready for container deployment.

## Project Structure

- `/src/components/` – Main app React components (Auth, GameBoard, History, etc)
- `/src/App.js` – App entry point, theme and route handling
- `/src/App.css` – Custom styles and minimal theming

## Setup & Development

```bash
npm install
npm start
```
Visit [http://localhost:3000](http://localhost:3000).

### Environment & API

- This frontend expects the backend API to be served under `/api/` (proxy or CORS recommended), and supports endpoints like:
  - `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/games/new`, `POST /api/games/:id/move`, `GET /api/games/current`, `GET /api/games/history`
  - WebSocket: `/api/games/ws/:game_id?token=...`

### Testing

```bash
npm test
```

## Build & Docker

```bash
npm run build
```
To build and run container:
```bash
docker build -t tic_tac_toe_frontend .
docker run -p 3000:80 tic_tac_toe_frontend
```

## Theming & UI

- Colors, buttons, form styles etc. are in `src/App.css`.
- All UI components use only vanilla React and CSS.

## License

MIT (or as specified by repository)

