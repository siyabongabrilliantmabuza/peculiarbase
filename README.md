# Peculiar - Where Every Voice Shapes Tomorrow

A modern social platform built with Next.js, featuring real-time debates, multimedia posts, inspirational quotes, and beautiful Rive animations.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure email/password registration and login with JWT tokens
- **User Search**: Find and connect with other users
- **Follow System**: Add users to increase your network and viewership
- **Swipeable Navigation**: Smooth transitions between Feed, Quotes, and Profile sections

### Content Creation
- **Multimedia Posts**: Share text, images, videos, and audio
- **Inspirational Quotes**: Create and share quotes with attribution
- **Profile Customization**: Upload profile pictures and customize your bio

### Interactions
- **Voting System**: Vote on posts you find interesting
- **Real-time Debates**: Engage in live debates with other users, mention them with @username
- **Resharing**: Share posts you love with your followers
- **Quote Reactions**: React to quotes with love, inspire, and agree

### Visual Experience
- **5 Animated Themes**: Choose from Cosmic, Ocean, Sunset, Forest, or Aurora backgrounds
- **Rive Animations**: Beautiful, smooth animations powered by Rive
- **21ST.DEV Inspired Design**: Modern, professional UI with glassmorphism effects
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Animations**: Framer Motion & Rive
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Navigation**: Swiper.js for smooth sliding
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/siyabingabrilliantmabuza/peculiarbase.git
cd peculiarbase
```

2. Install dependencies:
```bash
bun install
```

3. Set up PostgreSQL database:
```bash
createdb -h localhost peculiar_db
```

4. Initialize the database:
```bash
bun run scripts/init-db.ts
```

5. Start the development server:
```bash
bun run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

### Users
- Authentication and profile information
- Theme preferences
- Avatar URLs

### Posts
- Text content with multimedia support (image, video, audio)
- Vote and reshare counts
- Timestamps

### Quotes
- Inspirational quotes with author attribution
- Reaction counts (love, inspire, agree)

### Debates
- Real-time debate conversations
- Message threading with user mentions

### Followers
- User relationship tracking
- Follower/following counts

### Reactions
- Vote, debate, and reshare tracking
- Quote reactions (love, inspire, agree)

## 🎨 Themes

Choose from 5 beautiful animated backgrounds:
- **Cosmic**: Purple space with twinkling stars
- **Ocean**: Deep blue waves and bubbles
- **Sunset**: Warm orange and pink gradients
- **Forest**: Green nature-inspired animations
- **Aurora**: Northern lights effect

## 🔐 Environment Variables

Create a `.env.local` file:
```env
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_here
```

## 📱 Features in Detail

### Search & Discovery
- Real-time user search with autocomplete
- View user profiles and follow/unfollow
- See follower and following counts

### Posts
- Create posts with text and optional media
- Add images, videos, or audio files via URL
- Vote on posts to show support
- Reshare posts to your followers
- Start debates directly from posts

### Debates
- Real-time messaging system
- Mention users with @username
- Threaded conversations
- Auto-refresh every 3 seconds

### Quotes
- Share inspirational quotes
- Add author attribution
- React with love, inspire, or agree
- View all quotes or just your own

### Profile
- Customizable display name and bio
- Upload profile picture
- View your posts and quotes
- Track your activity

## 🛠️ Development

### Project Structure
```
peculiar/
├── app/
│   ├── api/          # API routes
│   ├── page.tsx      # Main application
│   └── layout.tsx    # Root layout
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── auth-context.tsx
│   ├── create-post.tsx
│   ├── post-card.tsx
│   ├── user-search.tsx
│   └── ...
├── lib/
│   ├── db.ts         # Database connection
│   └── utils.ts      # Utilities
└── scripts/
    └── init-db.ts    # Database initialization
```

### API Endpoints
- `/api/auth` - User registration and login
- `/api/posts` - CRUD operations for posts
- `/api/quotes` - Quote management
- `/api/debates` - Real-time debate messaging
- `/api/reactions` - Voting and reactions
- `/api/reshares` - Content resharing
- `/api/followers` - Follow/unfollow users
- `/api/users` - User search
- `/api/user` - Profile updates

## 🎯 Roadmap

- [ ] Image/video upload to cloud storage
- [ ] Notifications system
- [ ] Direct messaging
- [ ] Trending posts algorithm
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Post editing and deletion
- [ ] User blocking and reporting

## 👨‍💻 Author

**SIYABONGA B. MABUZA**
- Email: 4413006@myuwc.ac.za
- GitHub: [@siyabingabrilliantmabuza](https://github.com/siyabingabrilliantmabuza)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Rive for amazing animations
- 21ST.DEV for design inspiration
- Next.js team for the incredible framework

---

**Peculiar** - Where Every Voice Shapes Tomorrow 🌟
