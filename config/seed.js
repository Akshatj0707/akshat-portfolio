// config/seed.js  –  Seeds MongoDB with Akshat's projects and admin account
// Run: node config/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin   = require('../models/Admin');
const Project = require('../models/Project');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/akshat_portfolio';

const PROJECTS = [
  {
    title       : 'E-Nagarpalika — Government Municipal Portal',
    slug        : 'e-nagarpalika-municipal-portal',
    category    : 'Web Development',
    featured    : true,
    order       : 1,
    year        : 2025,
    client      : 'Indore Municipal Corporation',
    role        : 'Junior Full-Stack Developer – IT Intern',
    duration    : '2 months',
    description : 'A production-grade full-stack municipal portal actively serving Indore Municipal Corporation. Built with Next.js SSR frontend, Node.js/Express.js backend, JWT-secured RBAC, and multi-role permission management for citizens and administrators across multiple workflow stages.',
    shortDescription: 'Live government citizen services portal for Indore Municipal Corporation.',
    coverImage  : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80',
    tags        : ['React.js','Next.js','Node.js','Express.js','MongoDB','JWT','RBAC','RESTful API'],
    techStack   : ['React.js','Next.js','Node.js','Express.js','MongoDB','JWT','RBAC','GraphQL'],
    metrics     : [
      { label:'Status',       value:'Live',  unit:'Production'  },
      { label:'Auth Roles',   value:'3+',    unit:'levels'      },
      { label:'API Endpoints',value:'40+',   unit:'routes'      }
    ],
    caseStudy: {
      problem : 'Indore Municipal Corporation needed a secure, scalable citizen services portal with differentiated access across multiple workflow stages for both citizens and municipal staff.',
      approach: 'Designed a multi-role system (Citizen, Admin, Super Admin) with JWT authentication and RBAC middleware. Used Next.js SSR for SEO, performance, and fast initial loads.',
      solution: 'Deployed a production full-stack portal with RESTful APIs, GraphQL integration, and MongoDB schema indexing to handle concurrent user load reliably.',
      results : 'Portal is live and actively serving Indore city government. Enrollment: IWM/25/06-213.'
    },
    liveUrl  : 'https://github.com/Akshatj0707',
    githubUrl: 'https://github.com/Akshatj0707',
    published: true
  },
  {
    title       : 'Uber Clone — Full-Stack Ride-Hailing',
    slug        : 'uber-clone-ride-hailing',
    category    : 'Web Development',
    featured    : true,
    order       : 2,
    year        : 2025,
    client      : 'Personal Project',
    role        : 'Full-Stack Developer',
    duration    : '6 weeks',
    description : 'A fully functional Uber-inspired ride-hailing website with real-time location tracking, ride booking, and rider-driver matching via Socket.io. Features Google Maps API for live route rendering and fare estimation, with JWT-secured authentication and role-based access for riders and drivers.',
    shortDescription: 'Real-time ride-hailing platform with Google Maps and Socket.io.',
    coverImage  : 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
    tags        : ['React.js','Node.js','Socket.io','Google Maps API','MongoDB','JWT'],
    techStack   : ['React.js','Node.js','Express.js','MongoDB','Socket.io','Google Maps API','JWT'],
    metrics     : [
      { label:'Tracking',  value:'Real-time', unit:'WebSocket'   },
      { label:'User Roles',value:'2',         unit:'Rider/Driver'},
      { label:'Maps',      value:'Live',      unit:'Route Render'}
    ],
    caseStudy: {
      problem : 'Building a production-level ride-hailing system handling real-time geolocation, bidirectional WebSocket communication, and complex role-based user flows.',
      approach: 'Architected Socket.io namespaces for ride events, integrated Google Maps Distance Matrix API for fare calculation, and built separate dashboards for riders and drivers.',
      solution: 'Complete platform with JWT auth, live map rendering, ride booking workflow, and a driver-rider matching algorithm.',
      results : 'Fully functional clone demonstrating real-time web communication and REST + WebSocket hybrid architecture.'
    },
    githubUrl: 'https://github.com/Akshatj0707',
    published: true
  },
  {
    title       : 'Productivity Analytics Dashboard',
    slug        : 'productivity-analytics-dashboard',
    category    : 'Web Development',
    featured    : true,
    order       : 3,
    year        : 2025,
    client      : 'Personal Project',
    role        : 'Full-Stack Developer',
    duration    : '3 weeks',
    description : 'A full-stack analytics platform with real-time Chart.js visualizations, Node.js/Express.js RESTful API backend, Redux state management, and persistent MongoDB storage for cross-module data tracking and productivity insights.',
    shortDescription: 'Real-time analytics dashboard with Chart.js and Redux.',
    coverImage  : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    tags        : ['React.js','Next.js','Chart.js','Redux','Node.js','MongoDB'],
    techStack   : ['React.js','Next.js','Node.js','Express.js','MongoDB','Chart.js','Redux'],
    metrics     : [
      { label:'Charts',    value:'8+',       unit:'visualizations'},
      { label:'State Mgmt',value:'Redux',    unit:'global store'  },
      { label:'Updates',   value:'Real-time',unit:'live data'     }
    ],
    githubUrl: 'https://github.com/Akshatj0707',
    published: true
  },
  {
    title       : 'E-Nagarpalika: User ID & Authorization Portal',
    slug        : 'e-nagarpalika-auth-portal',
    category    : 'Web Development',
    featured    : false,
    order       : 4,
    year        : 2025,
    client      : 'Nagar Nigam IT Department',
    role        : 'Full-Stack Developer',
    duration    : '3 weeks',
    description : 'A full-stack government web application for the Nagar Nigam IT Department managing user ID creation, authorization change requests, and multi-level approval workflows (IT Assistant → IT Officer → IT Head). Integrated Nodemailer for automated email notifications with public ticket-based status tracking — no login required for citizens.',
    shortDescription: 'Multi-level government approval workflow system with automated emails.',
    coverImage  : 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&q=80',
    tags        : ['React 19','Vite','Tailwind CSS','Node.js','MongoDB','JWT','Nodemailer'],
    techStack   : ['React 19','Vite','Tailwind CSS','Node.js','Express.js','MongoDB','Mongoose','Nodemailer','Helmet'],
    githubUrl: 'https://github.com/Akshatj0707',
    published: true
  },
  {
    title       : 'Face Recognition Attendance System',
    slug        : 'face-recognition-attendance',
    category    : 'Machine Learning',
    featured    : false,
    order       : 5,
    year        : 2024,
    client      : 'Institutional Project',
    role        : 'ML Developer',
    duration    : '2 weeks',
    description : 'An automated attendance management system using Python and OpenCV with real-time facial detection and recognition, eliminating manual tracking. Demonstrates applied computer vision in an institutional setting using the face_recognition ML library with high accuracy under varied lighting conditions.',
    shortDescription: 'AI-powered attendance system using OpenCV and ML face recognition.',
    coverImage  : 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80',
    tags        : ['Python','OpenCV','Machine Learning','Computer Vision','face_recognition'],
    techStack   : ['Python','OpenCV','face_recognition','NumPy','Pandas','Machine Learning'],
    githubUrl   : 'https://github.com/Akshatj0707',
    published   : true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅  Connected to MongoDB:', MONGO_URI);

    // ── Admin ──────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'akshatjain9804@gmail.com';
    const adminPass  = process.env.ADMIN_PASSWORD || 'Admin@Akshat2024!';
    const exists = await Admin.findOne({ email: adminEmail });
    if (!exists) {
      await Admin.create({ email: adminEmail, password: adminPass, name: 'Akshat Jain' });
      console.log('✅  Admin created:', adminEmail);
    } else {
      console.log('ℹ️   Admin already exists:', adminEmail);
    }

    // ── Projects ───────────────────────────────────────────────
    for (const p of PROJECTS) {
      await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
      console.log(`  ✓ ${p.title}`);
    }
    console.log(`\n✅  ${PROJECTS.length} projects seeded successfully`);
    console.log('\n🎉  Database ready! Your portfolio is live.\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();
