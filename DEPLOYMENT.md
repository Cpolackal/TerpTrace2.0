# TerpTrace 2.0 Deployment Guide

## Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created and linked
- GitHub repository with proper secrets configured

## Environment Variables Setup

### 1. Local Development
Create a `.env` file in the `frontend` directory:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
```

### 2. Firebase Functions Environment Variables
Set these in Firebase Console → Functions → Configuration:
```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
PINECONE_CONTROLLER_URL=your_pinecone_controller_url
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
TITAN_ACCESS_KEY_ID=your_titan_access_key
TITAN_SECRET_ACCESS_KEY=your_titan_secret_key
```

### 3. GitHub Secrets (for CI/CD)
In your GitHub repository settings, add these secrets:
- `REACT_APP_FIREBASE_API_KEY`: Your Firebase API key
- `FIREBASE_SERVICE_ACCOUNT_TERPTRACE2`: Firebase service account JSON (already configured)

## Migration to Firebase Functions ✅

Your Express backend has been successfully migrated to Firebase Functions:

### What Was Migrated:
- ✅ All API endpoints (`/generate-url`, `/saveLostSomething`, `/saveFoundSomething`, etc.)
- ✅ S3 integration for image uploads
- ✅ Titan AI embeddings for image and text processing
- ✅ Pinecone vector search functionality
- ✅ Firebase Firestore integration
- ✅ Image resizing with Sharp

### Frontend Updates:
- ✅ API configuration for development vs production
- ✅ All API calls now use Firebase Functions URLs
- ✅ Automatic switching between local and production endpoints

## Deployment Steps

### Option 1: Deploy Everything (Recommended)
```bash
# Deploy both hosting and functions
npm run deploy:all
```

### Option 2: Deploy Functions Only
```bash
# Deploy only the backend functions
firebase deploy --only functions
```

### Option 3: Deploy Hosting Only
```bash
# Deploy only the frontend
npm run deploy
```

### Option 4: Manual Deployment
1. **Build the React app:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

### Option 5: Automatic Deployment (CI/CD)
- Push to `main` branch
- GitHub Actions will automatically build and deploy

## Configuration Files Updated

### ✅ firebase.json
- Hosting public directory: `frontend/build`
- Proper rewrites for React Router
- Firestore and Functions configuration

### ✅ functions/index.js
- All API endpoints migrated from Express
- CORS handling for cross-origin requests
- Proper error handling and logging

### ✅ functions/package.json
- All necessary dependencies included
- ES modules configuration
- Node.js 22 runtime

### ✅ .github/workflows/firebase-hosting-merge.yml
- Proper Node.js setup
- Frontend directory build process
- Environment variables injection
- Firebase deployment

### ✅ frontend/src/config/api.js
- Environment-aware API configuration
- Automatic switching between local and production URLs

### ✅ package.json (root)
- Build and deploy scripts
- Development scripts

## API Endpoints

Your Firebase Functions are available at:
- **Base URL**: `https://us-central1-terptrace2.cloudfunctions.net`
- **Test**: `/test`
- **Generate S3 URL**: `/generateUrl`
- **Save Lost Item**: `/saveLostSomething`
- **Save Found Item**: `/saveFoundSomething`
- **Set Match**: `/setFoundItemMatch`
- **Register User**: `/register`
- **Get User Items**: `/getUserItems`

## Verification Checklist

- [ ] Firebase project is linked: `firebase use terptrace2`
- [ ] Environment variables are set (Firebase Console and GitHub)
- [ ] React app builds successfully: `npm run build` in frontend
- [ ] Firebase Functions deploy successfully: `firebase deploy --only functions`
- [ ] Firebase Hosting deploys successfully: `firebase deploy --only hosting`
- [ ] GitHub Actions workflow passes
- [ ] App is accessible at your Firebase hosting URL
- [ ] API endpoints are working in production

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install` in frontend
- Check for environment variables
- Verify React version compatibility

### Functions Deployment Issues
- Check Firebase CLI is logged in: `firebase login`
- Verify project is selected: `firebase use terptrace2`
- Check environment variables in Firebase Console
- Review function logs: `firebase functions:log`

### Hosting Issues
- Check hosting configuration in firebase.json
- Verify build output exists in frontend/build

### CI/CD Issues
- Verify GitHub secrets are properly configured
- Check workflow logs for specific errors
- Ensure repository has proper permissions

## URLs
- **Local Development**: http://localhost:3000
- **Firebase Hosting**: https://terptrace2.web.app
- **Firebase Functions**: https://us-central1-terptrace2.cloudfunctions.net
- **Firebase Console**: https://console.firebase.google.com/project/terptrace2

## Benefits of Firebase Functions Migration

✅ **Fully Serverless**: No server management required  
✅ **Automatic Scaling**: Handles traffic spikes automatically  
✅ **Integrated Deployment**: Everything deploys together  
✅ **Cost Effective**: Pay only for what you use  
✅ **Better Security**: Built-in authentication and authorization  
✅ **Easier Maintenance**: Single platform for all services
