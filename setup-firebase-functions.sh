#!/bin/bash

echo "🚀 TerpTrace 2.0 Firebase Functions Setup"
echo "=========================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI is installed"
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
else
    echo "✅ Already logged in to Firebase"
fi

# Set the project
echo "📁 Setting Firebase project to terptrace2..."
firebase use terptrace2

# Install dependencies
echo "📦 Installing dependencies..."
cd functions && npm install && cd ..

# Deploy functions
echo "🚀 Deploying Firebase Functions..."
firebase deploy --only functions

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Firebase Console"
echo "2. Deploy the frontend: npm run deploy"
echo "3. Test your application" 