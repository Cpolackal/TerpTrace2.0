# TerpTrace 2.0 - UMD Lost and Found Platform

A full-stack web application for University of Maryland students to report and find lost items using image recognition technology.

## Features

- Image upload for lost items
- Google Cloud Vision API integration for image matching
- Real-time database with Firebase
- User authentication
- Responsive React frontend
- Node.js backend

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: Firebase
- Image Recognition: Google Cloud Vision API
- Authentication: Firebase Auth

## Project Structure

```
terptrace2.0/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── README.md         # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase account
- Google Cloud Platform account with Vision API enabled

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Firebase configuration
4. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables
4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

### Frontend (.env)

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)

```
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_credentials.json
FIREBASE_ADMIN_CREDENTIALS=path_to_your_firebase_admin_credentials.json
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
