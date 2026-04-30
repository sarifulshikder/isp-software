#!/bin/bash

echo "🚀 Starting Deployment..."

# ১. গিটহাবে পুশ করা
if [ -d .git ]; then
    git add .
    echo "Enter commit message:"
    read commit_msg
    git commit -m "$commit_msg"
    git push origin main
    echo "✅ Pushed to GitHub!"
else
    echo "❌ Git not initialized. Skipping push."
fi

# ২. ডকার আপডেট করা
echo "🔄 Updating Docker..."
docker-compose up -d --build

echo "✅ All Done!"
