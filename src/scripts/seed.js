require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing demo data
  await User.deleteMany({ email: { $in: ['admin@demo.com', 'employer@demo.com', 'seeker@demo.com'] } });

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    isActive: true,
  });

  // Create employer
  const employer = await User.create({
    name: 'Jane Smith',
    email: 'employer@demo.com',
    password: 'demo123',
    role: 'employer',
    companyName: 'TechCorp Inc.',
    companyDescription: 'A leading technology company building the future of software.',
    industry: 'Technology',
    companySize: '51-200',
    location: 'San Francisco, CA',
    companyWebsite: 'https://techcorp.example.com',
    isActive: true,
  });

  // Create job seeker
  await User.create({
    name: 'John Doe',
    email: 'seeker@demo.com',
    password: 'demo123',
    role: 'jobseeker',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    experience: '3 years as a Full Stack Developer',
    education: "B.S. Computer Science, Stanford University",
    location: 'New York, NY',
    bio: 'Passionate full-stack developer looking for exciting opportunities.',
    isActive: true,
  });

  // Create sample jobs
  const jobs = [
    {
      title: 'Senior React Developer',
      description: 'We are looking for an experienced React developer to join our growing team. You will work on cutting-edge web applications and collaborate with a talented team of engineers.',
      requirements: '5+ years of React experience\nStrong TypeScript skills\nExperience with REST APIs\nGit proficiency',
      responsibilities: 'Build and maintain React applications\nCode reviews and mentoring\nCollaborate with design team\nOptimize application performance',
      location: 'San Francisco, CA',
      jobType: 'full-time',
      category: 'Technology',
      salaryMin: 120000,
      salaryMax: 160000,
      salaryPeriod: 'yearly',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      experienceLevel: 'senior',
      employer: employer._id,
      companyName: employer.companyName,
      status: 'active',
      isFeatured: true,
    },
    {
      title: 'Product Designer',
      description: 'Join our design team to create beautiful and intuitive user experiences for millions of users worldwide.',
      requirements: '3+ years of UX/UI design\nProficiency in Figma\nPortfolio required',
      location: 'Remote',
      jobType: 'remote',
      category: 'Design',
      salaryMin: 90000,
      salaryMax: 120000,
      salaryPeriod: 'yearly',
      skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
      experienceLevel: 'mid',
      employer: employer._id,
      companyName: employer.companyName,
      status: 'active',
      isFeatured: true,
    },
    {
      title: 'Backend Engineer (Node.js)',
      description: 'Build scalable backend services and APIs that power our platform.',
      requirements: '3+ years Node.js\nExperience with MongoDB or PostgreSQL\nKnowledge of microservices',
      location: 'New York, NY',
      jobType: 'hybrid',
      category: 'Technology',
      salaryMin: 100000,
      salaryMax: 140000,
      salaryPeriod: 'yearly',
      skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
      experienceLevel: 'mid',
      employer: employer._id,
      companyName: employer.companyName,
      status: 'active',
    },
    {
      title: 'Marketing Manager',
      description: 'Lead our marketing efforts and drive growth through creative campaigns.',
      requirements: '5+ years marketing experience\nData-driven mindset\nExperience with digital marketing tools',
      location: 'Chicago, IL',
      jobType: 'full-time',
      category: 'Marketing',
      salaryMin: 80000,
      salaryMax: 110000,
      salaryPeriod: 'yearly',
      skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
      experienceLevel: 'senior',
      employer: employer._id,
      companyName: employer.companyName,
      status: 'active',
    },
    {
      title: 'Data Analyst Intern',
      description: 'Great opportunity for students to gain hands-on experience in data analysis.',
      requirements: 'Currently enrolled in a relevant degree\nBasic Python or R knowledge\nStrong analytical skills',
      location: 'Austin, TX',
      jobType: 'internship',
      category: 'Technology',
      salaryMin: 20,
      salaryMax: 30,
      salaryPeriod: 'hourly',
      skills: ['Python', 'SQL', 'Excel', 'Tableau'],
      experienceLevel: 'entry',
      employer: employer._id,
      companyName: employer.companyName,
      status: 'active',
    },
  ];

  await Job.insertMany(jobs);

  console.log('✅ Seed complete!');
  console.log('Demo accounts:');
  console.log('  Admin:    admin@demo.com / demo123');
  console.log('  Employer: employer@demo.com / demo123');
  console.log('  Seeker:   seeker@demo.com / demo123');

  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
