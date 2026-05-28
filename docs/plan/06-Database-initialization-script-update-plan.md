[Mode:Plan][Model:Claude 3.7 Sonnet]

# JobTrip database initialization script update plan

## 1. Modify target

Update the `backend/src/scripts/initdb.js` file to ensure that it correctly creates all required collections and indexes and populates the complete test data so that it is consistent with the `docs/database-requirements.md` documentation.

## 2. Current difference analysis

### 2.1 Missing Collection
- `user_profiles` (collection of user profiles)
- `resumes` (resume collection)

### 2.2 Missing index
- `user_profiles` collection index:
  - userId (unique index)
  - skills.name (index)
  - workExperiences.company (index)
  - educations.institution (index)
  - lastUpdated (index)
  - createdAt (index)

- `resumes` collection index:
  - userId (index)
  - createdAt (index)
  - name (index)

## 3. Modify plan

### 3.1 Update setupCollections function

Add code to create the following collections and set the corresponding indexes:

#### user_profiles collection
```javascript
// 6. User profile collection
await db.createCollection('user_profiles');
await db.collection('user_profiles').createIndexes([
  { key: { userId: 1 }, name: 'userId_index', unique: true },
  { key: { 'skills.name': 1 }, name: 'skills_name_index' },
  { key: { 'workExperiences.company': 1 }, name: 'workExperiences_company_index' },
  { key: { 'educations.institution': 1 }, name: 'educations_institution_index' },
  { key: { lastUpdated: 1 }, name: 'lastUpdated_index' },
  { key: { createdAt: 1 }, name: 'createdAt_index' }
]);
console.log('✅ User profile collection and index created successfully');
```
#### resumes collection
```javascript
// 7. Resume collection
await db.createCollection('resumes');
await db.collection('resumes').createIndexes([
  { key: { userId: 1 }, name: 'userId_index' },
  { key: { createdAt: 1 }, name: 'createdAt_index' },
  { key: { name: 1 }, name: 'name_index' }
]);
console.log('✅ Resume collection and index created successfully');
```
### 3.2 Update insertTestData function

Add code to create the following test data:

#### User profile test data
```javascript
// 6. Add user profile test data
const userProfiles = [
  {
    userId: users[0]._id,
headline: "Senior front-end development engineer",
    photo: "https://example.com/photos/user1.jpg",
biography: "Has 5 years of experience in front-end development, focusing on building user-friendly web applications.",
    contactInfo: {
      email: "test1@example.com",
      phone: "+64 21 123 4567",
      website: "https://johndoe.example.com",
address: "Auckland, New Zealand",
      socialMedia: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe"
      }
    },
    educations: [
      {
institution: "University of Auckland",
degree: "Master",
field: "Computer Science",
        startDate: new Date("2015-09-01"),
        endDate: new Date("2017-06-30"),
description: "Focus on web development and user interface design",
location: "Auckland, New Zealand"
      },
      {
institution: "Peking University",
degree: "Bachelor",
field: "Software Engineering",
        startDate: new Date("2011-09-01"),
        endDate: new Date("2015-06-30"),
description: "Software Engineering major, GPA 3.8/4.0",
location: "Beijing, China"
      }
    ],
    workExperiences: [
      {
company: "Technology Cloud Innovation Co., Ltd.",
position: "Senior Front-End Development Engineer",
        startDate: new Date("2020-03-01"),
        endDate: null,
        current: true,
description: "Responsible for the front-end architecture design and development of the company's main products, optimizing user experience and performance.",
location: "Auckland, New Zealand",
        achievements: [
"Reduce website loading time by 50%",
"Responsive design implemented to support all device types",
"Introduced component library and automated testing process"
        ]
      },
      {
company: "Digital Technology Co., Ltd.",
position: "Front-end development engineer",
        startDate: new Date("2017-07-01"),
        endDate: new Date("2020-02-28"),
        current: false,
description: "Responsible for the front-end development of the company's e-commerce platform, using React and Redux.",
location: "Auckland, New Zealand",
        achievements: [
"Developed 5 main functional modules",
"Participated in refactoring the front-end code architecture and improved code quality",
"Implemented A/B testing system and increased conversion rate by 15%"
        ]
      }
    ],
    skills: [
      {
        name: "React",
level: "expert",
        endorsements: 12,
category: "Front-end framework"
      },
      {
        name: "Vue.js",
level: "Advanced",
        endorsements: 8,
category: "Front-end framework"
      },
      {
        name: "JavaScript",
level: "expert",
        endorsements: 15,
category: "Programming Languages"
      },
      {
        name: "TypeScript",
level: "Advanced",
        endorsements: 10,
category: "Programming Languages"
      }
    ],
    certifications: [
      {
name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        issueDate: new Date("2019-05-15"),
        expirationDate: new Date("2022-05-15"),
        credentialId: "AWS-DEV-123456",
        credentialUrl: "https://aws.amazon.com/verification"
      }
    ],
    projects: [
      {
name: "E-commerce platform reconstruction",
description: "Using React and Node.js to restructure the company's e-commerce platform to improve user experience and performance.",
        startDate: new Date("2019-03-01"),
        endDate: new Date("2019-09-30"),
        url: "https://example-ecommerce.com",
        technologies: ["React", "Node.js", "MongoDB", "Redis"]
      }
    ],
    languages: [
      {
language: "Chinese",
proficiency: "native language"
      },
      {
language: "English",
proficiency: "Advanced"
      }
    ],
    volunteerExperiences: [
      {
organization: "Code Education Association",
role: "Volunteer Lecturer",
        startDate: new Date("2018-01-01"),
        endDate: new Date("2019-12-31"),
description: "Teaching basic programming knowledge to teenagers and organizing 10 workshops."
      }
    ],
    honorsAwards: [
      {
title: "Outstanding Employee Award",
issuer: "Digital Technology Co., Ltd.",
        date: new Date("2019-12-15"),
description: "Received for outstanding work performance and team contribution"
      }
    ],
    recommendations: [
      {
recommenderName: "Manager Wang",
recommenderTitle: "Technical Director",
relationship: "direct superior",
content: "Zhang San is an excellent developer with excellent technical skills and problem-solving ideas. He plays an important role in our team and I highly recommend him.",
        date: new Date("2020-02-20")
      }
    ],
    profileCompleteness: 85,
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: users[1]._id,
headline: "UI/UX Designer",
    photo: "https://example.com/photos/user2.jpg",
biography: "Creative UI/UX designer with a passion for creating beautiful and user-friendly interfaces.",
    contactInfo: {
      email: "test2@example.com",
      phone: "+64 21 987 6543",
      website: "https://janesmith.example.com",
address: "Wellington, New Zealand"
    },
    educations: [
      {
institution: "Victoria University of Wellington",
degree: "Bachelor",
field: "Design",
        startDate: new Date("2014-09-01"),
        endDate: new Date("2018-06-30"),
description: "Focus on user interface design and user experience research",
location: "Wellington, New Zealand"
      }
    ],
    workExperiences: [
      {
company: "New Digital Technology",
position: "UI/UX designer",
        startDate: new Date("2018-07-01"),
        endDate: null,
        current: true,
description: "Responsible for the user interface design and user experience optimization of the company's products.",
location: "Wellington, New Zealand",
        achievements: [
"Redesigned the company's main product interfaces and improved user satisfaction by 25%",
"Established a company design system and improved development efficiency",
"Led the design process of 3 major products"
        ]
      }
    ],
    skills: [
      {
        name: "Figma",
level: "expert",
        endorsements: 10,
category: "Design Tools"
      },
      {
        name: "Adobe Photoshop",
level: "Advanced",
        endorsements: 8,
category: "Design Tools"
      },
      {
name: "User Research",
level: "Intermediate",
        endorsements: 5,
category: "Soft skills"
      }
    ],
    profileCompleteness: 65,
    lastUpdated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const profileResult = await db.collection('user_profiles').insertMany(userProfiles);
console.log(`✅ ${profileResult.insertedCount} test user profiles inserted`);
```
#### Resume test data
```javascript
// 7. Add resume test data
const resumes = [
  {
name: "Front-end development engineer resume",
    userId: users[0]._id,
targetPosition: "Senior Front-End Development Engineer",
targetJob: "front-end development",
    content: JSON.stringify({
      personalInfo: {
fullName: "Zhang San",
        email: "test1@example.com",
        phone: "+64 21 123 4567",
location: "Auckland, New Zealand"
      },
      educations: [
        {
education: "Master",
school: "University of Auckland",
major: "Computer Science",
          startDate: "2015-09",
          endDate: "2017-06"
        },
        {
education: "Bachelor",
school: "Peking University",
major: "Software Engineering",
          startDate: "2011-09",
          endDate: "2015-06"
        }
      ],
      workExperiences: [
        {
company: "Technology Cloud Innovation Co., Ltd.",
position: "Senior Front-End Development Engineer",
          startDate: "2020-03",
endDate: "to date",
responsibilities: "Responsible for the front-end architecture design and development of the company's main products, optimizing user experience and performance."
        },
        {
company: "Digital Technology Co., Ltd.",
position: "Front-end development engineer",
          startDate: "2017-07",
          endDate: "2020-02",
responsibilities: "Responsible for the front-end development of the company's e-commerce platform, using React and Redux."
        }
      ],
      skills: "React, Vue.js, JavaScript, TypeScript, HTML5, CSS3, Webpack, Git, Jest"
    }),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
name: "UI/UX Designer Resume",
    userId: users[1]._id,
targetPosition: "Senior UI/UX Designer",
targetJob: "UI/UX Design",
    content: JSON.stringify({
      personalInfo: {
fullName: "Li Si",
        email: "test2@example.com",
        phone: "+64 21 987 6543",
location: "Wellington, New Zealand"
      },
      educations: [
        {
education: "Bachelor",
school: "Victoria University of Wellington",
major: "Design",
          startDate: "2014-09",
          endDate: "2018-06"
        }
      ],
      workExperiences: [
        {
company: "New Digital Technology",
position: "UI/UX designer",
          startDate: "2018-07",
endDate: "to date",
responsibilities: "Responsible for the user interface design and user experience optimization of the company's products."
        }
      ],
skills: "Figma, Sketch, Adobe Photoshop, Adobe Illustrator, prototyping, user research, usability testing"
    }),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const resumeResult = await db.collection('resumes').insertMany(resumes);
console.log(`✅ ${resumeResult.insertedCount} test resumes have been inserted`);
```
## 4. Modify file location

File path: `backend/src/scripts/initdb.js`

## 5. Detailed description of implementation steps

1. Add `user_profiles` and `resumes` collection creation code at the end of `setupCollections` function
2. Add the corresponding index creation code
3. Add the corresponding test data creation code at the end of the `insertTestData` function

## Implementation Checklist:

1. [Modify] Update the `setupCollections` function and add `user_profiles` collection creation and index settings
2. [Modify] Update the `setupCollections` function and add `resumes` collection creation and index settings
3. [Modify] Update the `insertTestData` function and add user profile test data creation
4. [Modify] Update the `insertTestData` function and add resume test data creation
5. [Test] Run the modified script to verify that all collections and indexes are created correctly
6. [Test] Verify whether the test data is correctly inserted into each collection
7. [Test] Verify whether the correlation between test data is correct
