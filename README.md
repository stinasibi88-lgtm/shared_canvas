# Shared Canvas — Collaborative Art Gallery

## 1. Project Overview

Shared Canvas is a collaborative art gallery web application. Users can create gallery rooms, select an art theme, join rooms using a room code, and view artwork together. Changes can synchronize between connected browser windows.

## 2. Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js and Express
- **Real-time communication:** Socket.IO
- **Database:** SQLite

## 3. Project Structure

```text
AOOP THE SHARED CANVAS/
├── BACKEND/
├── BACKEND_HANDOFF_CLEAN/
├── FRONTEND/
├── shared-canvas-backend-handoff.zip
└── README.md
```

## 4. Prerequisites

Install Node.js and npm on the computer before running the backend.

## 5. How to Run the Project

1. Open the `BACKEND` folder in File Explorer.
2. Open PowerShell in that folder.
3. Install the backend dependencies if needed:

   ```powershell
   npm install
   ```

4. Start the server on port 8081:

   ```powershell
   $env:PORT=8081
   npm start
   ```

5. Keep the PowerShell window open while using the application.
6. Open Google Chrome and visit:

   `http://localhost:8081`

## 6. Main Features

- Create a gallery room.
- Select a gallery theme.
- Join an existing room using a room code.
- Display artwork.
- Synchronize supported interactions between connected browser windows.
- Rejoin a room using its room code.

## 7. Testing

The application has been tested locally for room creation, artwork display, joining a shared room from a second browser window, synchronized updates, and rejoining a room.

## 8. Notes

The application currently runs locally. Access from other computers or over the internet requires additional network configuration or deployment.

## 9. Future Enhancements

- Deploy the application to a
