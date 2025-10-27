# Deployment Instructions

## Pushing to GitHub

Since automated push requires authentication, please follow these steps to push the code to GitHub:

### Option 1: Using HTTPS (Recommended)

1. Open your terminal in the project directory:
```bash
cd /home/code/peculiar
```

2. Push to GitHub (you'll be prompted for credentials):
```bash
git push -u origin main --force
```

3. When prompted, enter your GitHub credentials or use a Personal Access Token

### Option 2: Using GitHub CLI

1. Install GitHub CLI if not already installed:
```bash
# On Ubuntu/Debian
sudo apt install gh

# On macOS
brew install gh
```

2. Authenticate:
```bash
gh auth login
```

3. Push the code:
```bash
git push -u origin main --force
```

### Option 3: Using SSH

1. Generate SSH key if you don't have one:
```bash
ssh-keygen -t ed25519 -C "4413006@myuwc.ac.za"
```

2. Add SSH key to GitHub:
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub Settings > SSH and GPG keys > New SSH key
   - Paste the key and save

3. Change remote URL to SSH:
```bash
git remote set-url origin git@github.com:siyabingabrilliantmabuza/peculiarbase.git
```

4. Push the code:
```bash
git push -u origin main --force
```

## What's Already Done

✅ All code is committed to local Git repository
✅ Remote repository is configured
✅ Comprehensive README is created
✅ All features are implemented and working

## Next Steps After Pushing

1. Go to your GitHub repository: https://github.com/siyabingabrilliantmabuza/peculiarbase
2. Verify all files are uploaded
3. Update repository description: "Peculiar - Where Every Voice Shapes Tomorrow"
4. Add topics: `nextjs`, `social-platform`, `rive`, `postgresql`, `real-time`
5. Enable GitHub Pages if you want to deploy (though this requires a hosting service for the backend)

## Production Deployment

For production deployment, consider:

1. **Vercel** (Recommended for Next.js):
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically on push

2. **Railway** or **Render** (For PostgreSQL):
   - Create a PostgreSQL database
   - Update connection strings
   - Deploy the application

3. **Environment Variables to Set**:
   ```
   PGUSER=your_postgres_user
   PGPASSWORD=your_postgres_password
   PGHOST=your_postgres_host
   PGDATABASE=peculiar_db
   PGPORT=5432
   JWT_SECRET=your_secure_secret_key
   ```

## Current Status

🎉 **All features are complete and working!**

- ✅ User authentication with JWT
- ✅ User search and discovery
- ✅ Follow/unfollow system
- ✅ Swipeable navigation (Feed, Quotes, Profile)
- ✅ Multimedia posts (text, images, videos, audio)
- ✅ Profile picture upload
- ✅ Voting system
- ✅ Real-time debates with mentions
- ✅ Resharing functionality
- ✅ Quote sharing with reactions
- ✅ 5 animated Rive themes
- ✅ Professional 21ST.DEV inspired design
- ✅ Responsive design
- ✅ Real-time functionality (no demos)

## Live Demo

The application is currently running at:
**https://peculiar-2.lindy.site**

Test it out and see all the features in action!
