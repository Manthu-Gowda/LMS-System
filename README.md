# Learning Management System (LMS)

A complete full-stack Learning Management System built with React and Node.js.

## Features

### For Students
- User registration and authentication
- Course catalog with search and filtering
- Video, PDF, and YouTube content consumption
- Interactive MCQ quizzes (15-20 questions per course)
- Assignment submission (links and file uploads)
- Automatic certificate generation upon completion
- Progress tracking and dashboard
- Email notifications for certificates

### For Administrators
- Admin dashboard with analytics
- Complete course management (CRUD operations)
- User progress monitoring
- Content upload (videos, PDFs)
- MCQ quiz management
- Assignment review system

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Ant Design
- **Routing**: React Router v6
- **HTTP Client**: Axios with React Query
- **Animations**: Framer Motion
- **State Management**: React Query + Local State

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Uploads**: Multer
- **PDF Generation**: Puppeteer
- **Email**: Nodemailer
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Joi
- **Logging**: Winston

## Project Structure

```
/
├── README.md
├── package.json                 # Root workspace with concurrent scripts
├── client/                      # React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/              # Route components
│       ├── services/           # API services
│       ├── hooks/              # Custom React hooks
│       ├── utils/              # Utility functions
│       └── styles/             # Global styles
└── server/                     # Node.js backend
    ├── package.json
    ├── .env.example
    └── src/
        ├── controllers/        # Route handlers
        ├── services/          # Business logic
        ├── models/            # Database schemas
        ├── middleware/        # Express middleware
        ├── routes/            # API routes
        ├── utils/             # Helper functions
        ├── validators/        # Request validation
        └── config/            # Configuration files
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit the files with your configuration
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development servers:
```bash
npm run dev
```

This will start:
- Client development server on `http://localhost:5173`
- Server API on `http://localhost:5000`
- Swagger documentation on `http://localhost:5000/api/docs`

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=1d
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=your-email-user
MAIL_PASS=your-email-pass
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Default Admin Credentials

**Email**: lmsadmin@yopmail.com  
**Password**: Password@123

## API Documentation

Interactive API documentation is available at:
- Development: `http://localhost:5000/api/docs`
- Production: `{your-domain}/api/docs`

## Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run seed` - Seed the database with initial data
- `npm run test` - Run all tests

### Client
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

### Server
- `npm run dev` - Start with nodemon (development)
- `npm run start` - Start in production mode
- `npm run seed` - Seed database
- `npm run test` - Run Jest tests
- `npm run swagger` - Generate Swagger documentation

## Key Features Implementation

### Authentication
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Password reset via email OTP
- Protected routes on both client and server

### Course Management
- Rich course content (videos, PDFs, YouTube)
- Progress tracking per user
- Content completion status
- Estimated duration and difficulty levels

### Assessment System
- MCQ quizzes with immediate feedback
- Configurable passing scores
- Progress persistence
- Automatic scoring and completion tracking

### Certification
- Automatic PDF certificate generation
- Unique certificate IDs
- Email delivery with attachments
- Certificate verification system

### File Handling
- Secure file uploads with validation
- Multiple file format support
- Storage path management
- File access control

## Testing

Run the test suite:
```bash
npm run test
```

Tests include:
- Authentication flow tests
- Course CRUD operations
- MCQ submission and scoring
- Certificate generation
- API endpoint validation

## Deployment

### Using Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Build the client:
```bash
cd client && npm run build
```

2. Set up production environment variables

3. Start the server:
```bash
cd server && npm start
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network access to MongoDB

2. **File Upload Issues**
   - Check upload directory permissions
   - Verify UPLOAD_DIR path in environment
   - Ensure sufficient disk space

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check spam folder
   - Test with Ethereal Email for development

4. **Certificate Generation Fails**
   - Ensure Puppeteer dependencies are installed
   - Check file system permissions
   - Verify template paths

5. **JWT Token Issues**
   - Check JWT_SECRET is set
   - Verify token expiration settings
   - Clear browser storage and re-login

### Development Tips

- Use the Swagger UI for API testing
- Check browser network tab for API errors
- Monitor server logs for debugging
- Use MongoDB Compass for database inspection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check existing GitHub issues
4. Create a new issue with detailed information

---

**Happy Learning! 🎓**