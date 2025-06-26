# ConnectHub 🌐

A modern social media application built with the MERN stack, featuring real-time interactions and seamless user experience.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://lynxhashib.github.io/SocialMedia/)
[![API Documentation](https://img.shields.io/badge/📚%20API%20Docs-View%20Endpoints-green?style=for-the-badge)](https://connecthub-eosin.vercel.app/docs/)
[![GitHub Repo](https://img.shields.io/badge/📂%20GitHub-Repository-black?style=for-the-badge)](https://github.com/LynXHashib/SocialMedia/)

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration
- 👤 **User Profiles** - Customizable user profiles
- 📝 **Post Creation** - Share thoughts and media
- 💬 **Social Interactions** - Like, comment, and share posts
- 📧 **Email Notifications** - Stay updated with important activities
- 🔄 **Real-time Updates** - Dynamic content loading
- 📱 **Responsive Design** - Works perfectly on all devices

## 🚀 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend

- **React** - UI library (AI-generated Vite React App)
- **Vite** - Build tool and development server

### Key Packages & Tools

- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for API calls
- **Nodemailer** - Email sending functionality
- **Connect-Mongo** - MongoDB session store
- **Express-Session** - Session management

## 🌍 Deployment

- **Backend**: Deployed on [Vercel](https://vercel.com/)
- **Frontend**: Deployed on [GitHub Pages](https://pages.github.com/)

## 🔗 Links

- **🌐 Live Application**: [ConnectHub App](https://connecthub-eosin.vercel.app/)
- **📋 API Documentation**: [API Endpoints](https://connecthub-eosin.vercel.app/docs/)
- **📂 GitHub Repository**: [Source Code](https://github.com/LynXHashib/SocialMedia/)

## 📋 Roadmap

### 🚧 Coming Soon

- [ ] **Live Chat with Socket.IO** - Real-time messaging between users
- [ ] **Push Notifications** - Browser notifications for important updates
- [ ] **Media Upload** - Image and video sharing capabilities
- [ ] **Dark Mode** - Theme customization options

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/LynXHashib/SocialMedia.git
cd SocialMedia

# Install dependencies
npm install

# Create .env file and add your environment variables
cp .env.example .env

# Start the development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory (if separate)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

> **Note**: Since this uses an AI-generated Vite React app, make sure to check the project structure and adjust paths accordingly.

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
SESSION_SECRET=your_session_secret
```

## 📖 API Documentation

All API endpoints are documented and available at: [https://connecthub-eosin.vercel.app/docs/](https://connecthub-eosin.vercel.app/docs/)

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**LynXHashib**

- GitHub: [@LynXHashib](https://github.com/LynXHashib)
- Repository: [SocialMedia App](https://github.com/LynXHashib/SocialMedia/)

## 🙏 Acknowledgments

- Thanks to all contributors who helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries

---

⭐ **Star this repository if you found it helpful!**
