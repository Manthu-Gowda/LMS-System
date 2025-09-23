const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User')
const Course = require('../models/Course')
const logger = require('../utils/logger')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    logger.info('MongoDB Connected for seeding')
  } catch (error) {
    logger.error('Database connection error:', error)
    process.exit(1)
  }
}

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'lmsadmin@yopmail.com' })
    if (existingAdmin) {
      logger.info('Admin user already exists')
      return existingAdmin
    }

    // Create admin user
    const adminUser = new User({
      name: 'LMS Administrator',
      email: 'lmsadmin@yopmail.com',
      password: 'Password@123',
      role: 'admin'
    })

    await adminUser.save()
    logger.info('Admin user created successfully')
    logger.info('Email: lmsadmin@yopmail.com')
    logger.info('Password: Password@123')
    return adminUser
  } catch (error) {
    logger.error('Error creating admin user:', error)
    throw error
  }
}

const seedTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'student@example.com' })
    if (existingUser) {
      logger.info('Test user already exists')
      return existingUser
    }

    // Create test user
    const testUser = new User({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'user'
    })

    await testUser.save()
    logger.info('Test user created successfully')
    logger.info('Email: student@example.com')
    logger.info('Password: password123')
    return testUser
  } catch (error) {
    logger.error('Error creating test user:', error)
    throw error
  }
}

const seedSampleCourses = async () => {
  try {
    const admin = await User.findOne({ role: 'admin' })
    if (!admin) {
      logger.error('Admin user not found. Cannot create sample courses.')
      return
    }

    // Check if courses already exist
    const existingCourses = await Course.countDocuments()
    if (existingCourses > 0) {
      logger.info('Sample courses already exist')
      return
    }

    const sampleCourses = [
      {
        title: 'Introduction to Web Development',
        slug: 'introduction-to-web-development',
        shortDescription: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
        description: 'This comprehensive course covers the essential building blocks of web development. You\'ll learn HTML for structure, CSS for styling, and JavaScript for interactivity. Perfect for beginners who want to start their journey in web development.',
        difficulty: 'beginner',
        estimatedDuration: '6-8 hours',
        tags: ['html', 'css', 'javascript', 'web development', 'frontend'],
        isPublished: true,
        createdBy: admin._id,
        content: [
          {
            title: 'Introduction to HTML',
            type: 'text',
            content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements and tags.',
            description: 'Learn the basics of HTML structure and syntax'
          },
          {
            title: 'HTML Elements and Tags',
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            description: 'Watch this video to understand HTML elements and tags'
          },
          {
            title: 'CSS Fundamentals',
            type: 'text',
            content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls the presentation of HTML elements including colors, fonts, spacing, and positioning.',
            description: 'Introduction to CSS styling'
          },
          {
            title: 'JavaScript Basics',
            type: 'text',
            content: 'JavaScript is a programming language that enables interactive web pages. It\'s an essential part of web applications alongside HTML and CSS.',
            description: 'Learn JavaScript fundamentals'
          }
        ],
        mcq: [
          {
            question: 'What does HTML stand for?',
            options: [
              'HyperText Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlink and Text Markup Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.'
          },
          {
            question: 'Which HTML tag is used for the largest heading?',
            options: ['<h6>', '<h1>', '<heading>', '<header>'],
            correctAnswer: 1,
            explanation: 'The <h1> tag is used for the largest heading in HTML.'
          },
          {
            question: 'What does CSS stand for?',
            options: [
              'Computer Style Sheets',
              'Creative Style Sheets',
              'Cascading Style Sheets',
              'Colorful Style Sheets'
            ],
            correctAnswer: 2,
            explanation: 'CSS stands for Cascading Style Sheets.'
          },
          {
            question: 'Which programming language is known as the language of the web?',
            options: ['Python', 'Java', 'JavaScript', 'C++'],
            correctAnswer: 2,
            explanation: 'JavaScript is often called the language of the web because it runs in web browsers.'
          },
          {
            question: 'What is the correct HTML element for inserting a line break?',
            options: ['<break>', '<br>', '<lb>', '<newline>'],
            correctAnswer: 1,
            explanation: 'The <br> tag is used to insert a line break in HTML.'
          }
        ]
      },
      {
        title: 'React.js Fundamentals',
        slug: 'reactjs-fundamentals',
        shortDescription: 'Master the basics of React.js and build dynamic user interfaces',
        description: 'Dive deep into React.js, the popular JavaScript library for building user interfaces. Learn about components, state management, props, and hooks. Build real-world projects and understand modern React development patterns.',
        difficulty: 'intermediate',
        estimatedDuration: '8-10 hours',
        tags: ['react', 'javascript', 'frontend', 'components', 'hooks'],
        isPublished: true,
        createdBy: admin._id,
        content: [
          {
            title: 'What is React?',
            type: 'text',
            content: 'React is a JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and is now maintained by Facebook and the community.',
            description: 'Introduction to React and its core concepts'
          },
          {
            title: 'React Components',
            type: 'text',
            content: 'Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces that can be thought about in isolation.',
            description: 'Understanding React components'
          },
          {
            title: 'State and Props',
            type: 'text',
            content: 'State is a built-in React object that is used to contain data or information about the component. Props are arguments passed into React components.',
            description: 'Learn about state management and props'
          },
          {
            title: 'React Hooks Introduction',
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
            description: 'Introduction to React Hooks'
          }
        ],
        mcq: [
          {
            question: 'What is React?',
            options: [
              'A JavaScript framework',
              'A JavaScript library',
              'A programming language',
              'A database'
            ],
            correctAnswer: 1,
            explanation: 'React is a JavaScript library for building user interfaces.'
          },
          {
            question: 'What are React components?',
            options: [
              'Functions that return HTML',
              'Classes that extend React.Component',
              'Reusable pieces of UI',
              'All of the above'
            ],
            correctAnswer: 3,
            explanation: 'React components can be functions or classes and are reusable pieces of UI.'
          },
          {
            question: 'What is JSX?',
            options: [
              'A JavaScript extension',
              'A syntax extension for JavaScript',
              'A template language',
              'A CSS framework'
            ],
            correctAnswer: 1,
            explanation: 'JSX is a syntax extension for JavaScript that looks similar to XML or HTML.'
          },
          {
            question: 'Which hook is used for state management in functional components?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
            explanation: 'useState is the hook used for state management in functional components.'
          },
          {
            question: 'What is the virtual DOM?',
            options: [
              'A copy of the real DOM',
              'A JavaScript representation of the DOM',
              'A faster version of the DOM',
              'All of the above'
            ],
            correctAnswer: 3,
            explanation: 'The virtual DOM is a JavaScript representation of the real DOM that React uses for efficient updates.'
          }
        ]
      },
      {
        title: 'Node.js Backend Development',
        slug: 'nodejs-backend-development',
        shortDescription: 'Build scalable backend applications with Node.js and Express',
        description: 'Learn server-side development with Node.js and Express.js. Understand how to build RESTful APIs, work with databases, implement authentication, and deploy your applications. Perfect for developers looking to become full-stack.',
        difficulty: 'intermediate',
        estimatedDuration: '10-12 hours',
        tags: ['nodejs', 'express', 'backend', 'api', 'mongodb'],
        isPublished: true,
        createdBy: admin._id,
        content: [
          {
            title: 'Introduction to Node.js',
            type: 'text',
            content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows you to run JavaScript on the server side, enabling full-stack JavaScript development.',
            description: 'Understanding Node.js and its ecosystem'
          },
          {
            title: 'Express.js Framework',
            type: 'text',
            content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
            description: 'Learn about Express.js framework'
          },
          {
            title: 'Building REST APIs',
            type: 'text',
            content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. Learn how to build RESTful APIs with Express.js.',
            description: 'Creating RESTful web services'
          },
          {
            title: 'Database Integration',
            type: 'text',
            content: 'Learn how to integrate databases like MongoDB with your Node.js applications using ODM libraries like Mongoose.',
            description: 'Working with databases in Node.js'
          }
        ],
        mcq: [
          {
            question: 'What is Node.js?',
            options: [
              'A JavaScript framework',
              'A JavaScript runtime',
              'A database',
              'A web browser'
            ],
            correctAnswer: 1,
            explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.'
          },
          {
            question: 'Which of the following is a Node.js framework?',
            options: ['React', 'Angular', 'Express', 'Vue'],
            correctAnswer: 2,
            explanation: 'Express is a popular Node.js web application framework.'
          },
          {
            question: 'What does npm stand for?',
            options: [
              'Node Package Manager',
              'New Project Manager',
              'Network Protocol Manager',
              'Node Program Manager'
            ],
            correctAnswer: 0,
            explanation: 'npm stands for Node Package Manager.'
          },
          {
            question: 'Which HTTP method is typically used to create a new resource?',
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            correctAnswer: 1,
            explanation: 'POST is typically used to create new resources in RESTful APIs.'
          },
          {
            question: 'What is middleware in Express.js?',
            options: [
              'Functions that execute during the request-response cycle',
              'Database connections',
              'HTML templates',
              'CSS stylesheets'
            ],
            correctAnswer: 0,
            explanation: 'Middleware functions are functions that have access to the request and response objects and can execute code during the request-response cycle.'
          }
        ]
      }
    ]

    await Course.insertMany(sampleCourses)
    logger.info('Sample courses created successfully')
  } catch (error) {
    logger.error('Error creating sample courses:', error)
  }
}

const seedDatabase = async () => {
  try {
    await connectDB()
    
    logger.info('Starting database seeding...')
    
    await seedAdmin()
    await seedTestUser()
    await seedSampleCourses()
    
    logger.info('Database seeding completed successfully!')
    logger.info('='.repeat(50))
    logger.info('LOGIN CREDENTIALS:')
    logger.info('Admin - Email: lmsadmin@yopmail.com | Password: Password@123')
    logger.info('Student - Email: student@example.com | Password: password123')
    logger.info('='.repeat(50))
    
    process.exit(0)
  } catch (error) {
    logger.error('Seeding error:', error)
    process.exit(1)
  }
}

// Run seeding
seedDatabase()