#!/bin/bash

echo "🚀 Peculiar - GitHub Push Script"
echo "================================"
echo ""
echo "This script will help you push your code to GitHub."
echo ""
echo "Repository: https://github.com/siyabingabrilliantmabuza/peculiarbase"
echo ""
echo "Choose your authentication method:"
echo "1) HTTPS (requires GitHub username and Personal Access Token)"
echo "2) SSH (requires SSH key setup)"
echo "3) GitHub CLI (requires 'gh' installed)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📝 Using HTTPS authentication..."
    echo "You'll need your GitHub Personal Access Token"
    echo "Get one at: https://github.com/settings/tokens"
    echo ""
    git push -u origin main --force
    ;;
  2)
    echo ""
    echo "🔑 Using SSH authentication..."
    git remote set-url origin git@github.com:siyabingabrilliantmabuza/peculiarbase.git
    git push -u origin main --force
    ;;
  3)
    echo ""
    echo "🌐 Using GitHub CLI..."
    if ! command -v gh &> /dev/null; then
      echo "❌ GitHub CLI not found. Install it first:"
      echo "   Ubuntu/Debian: sudo apt install gh"
      echo "   macOS: brew install gh"
      exit 1
    fi
    gh auth login
    git push -u origin main --force
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo "🌐 View your repository at:"
  echo "   https://github.com/siyabingabrilliantmabuza/peculiarbase"
else
  echo ""
  echo "❌ Push failed. Please check the error message above."
  echo "📖 See DEPLOYMENT.md for more help."
fi
