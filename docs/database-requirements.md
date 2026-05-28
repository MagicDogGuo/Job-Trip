# JobTrip Career Assistant Database Requirements Document

## 1. Technology selection
- Main database: MongoDB
- Cache: Redis (optional)
- Database Tool: MongoDB Compass
- Database version: MongoDB 6.0+

## 2. Data model design

### 2.1 User collection (users)
```javascript
{
  _id: ObjectId,
username: String, // username
email: String, // Email
password: String, // encrypted password
createdAt: Date, // Creation time
updatedAt: Date, // update time
  preferences: {
theme: String, // theme preference
notifications: Boolean, // notification settings
language: String // Language preference
  },
status: String //User status
}
```

### 2.2 User profile collection (user_profiles)
```javascript
{
  _id: ObjectId,
userId: ObjectId, // Associated user ID (associated to users collection)
  
//Basic information
firstName: String,        // First name
lastName: String,         // Last name
headline: String, // Personal title/career overview
biography: String, // personal introduction
  contactInfo: {
email: String, // Email
phone: String, // phone
website: String, // personal website
address: String, // address
socialMedia: { // Social media links
      linkedin: String,
      github: String,
      twitter: String,
      other: [{ name: String, url: String }]
    }
  },
  
// Education experience (can be multiple)
  educations: [{
_id: ObjectId, // New
institution: String, // school name
degree: String, // degree
field: String, // Professional field
startDate: Date, // start date
endDate: Date, // end date
description: String, // description/achievement
location: String // location
  }],
  
// Work experience (can be multiple)
  workExperiences: [{
_id: ObjectId, // New
company: String, // company name
position: String, // Position
startDate: Date, // start date
endDate: Date, // end date
current: Boolean, // Whether it is the current job
description: String, // job description
location: String, // location
achievements: [String] //Achievements list
  }],
  
// Skills (group skills)
  skills: [{
_id: ObjectId, // New
name: String, //Skill name
level: String, // Proficiency level (beginner/intermediate/advanced/expert)
endorsements: Number, // endorsement number
category: String // Skill classification (such as technology/soft skills/language, etc.)
  }],
  
// Certificate
  certifications: [{
_id: ObjectId, // New
name: String, // Certificate name
issuer: String, // Issuing authority
issueDate: Date, // Issue date
expirationDate: Date, // expiration date
credentialId: String, // Certificate ID
credentialUrl: String // Certificate link
  }],
  
// project experience
  projects: [{
_id: ObjectId, // New
name: String, // project name
description: String, // project description
startDate: Date, // start date
endDate: Date, // end date
url: String, // project link
technologies: [String] // Technologies used
  }],
  
// language skills
  languages: [{
_id: ObjectId, // New
language: String, // language name
proficiency: String // Proficiency level (beginner/intermediate/advanced/native language)
  }],
  
// Volunteer experience
  volunteerExperiences: [{
_id: ObjectId, // New
organization: String, // organization name
role: String, // role
startDate: Date, // start date
endDate: Date, // end date
description: String // description
  }],
  
// Honors and Awards
  honorsAwards: [{
_id: ObjectId, // New
title: String, // Award name
issuer: String, //Issuing authority
date: Date, // get date
description: String // description
  }],
  
// Letter of recommendation
  recommendations: [{
_id: ObjectId, // New
recommenderName: String, // Recommender name
recommenderTitle: String, // Recommender position
relationship: String, //Relationship with recommender
content: String, // Recommended content
date: Date // Recommended date
  }],
  
// metadata
profileCompleteness: Number, // File completeness percentage
lastUpdated: Date, // Last updated time
createdAt: Date, // Creation time
updatedAt: Date // Update time
}
```

### 2.3 Job collection (jobs)
```javascript
{
  _id: ObjectId,
platform: String, // Job search platform name
title: String, // Position title
company: String, // company name
location: String, // work location
description: String, // Position description
requirements: [String], // Position requirements
salary: String, // salary range
jobType: String, // job type
source: String, // data source
sourceId: String, // Original ID of platform position
sourceUrl: String, // original link
deadline: Date, // Deadline
notes: String, // notes
createdAt: Date, // Creation time
updatedAt: Date // Update time
}
```

### 2.4 User-job association collection (user_jobs)
```javascript
{
  _id: ObjectId,
userId: ObjectId, //Associated user ID
jobId: ObjectId, // Associated job ID
status: String, //The user’s application status for this position
isFavorite: Boolean, // Whether to favorite
customTags: [String], // User-defined tags
notes: String, // User notes
reminderDate: Date, // reminder date
createdAt: Date, // Creation time
updatedAt: Date // Update time
}
```

### 2.5 Application history collection (application_history)
```javascript
{
  _id: ObjectId,
userJobId: ObjectId, //Associated user-job ID
previousStatus: String, // previous status
newStatus: String, // new status
notes: String, // notes
createdAt: Date, // Creation time
updatedBy: ObjectId // Updater ID
}
```

### 2.6 Companies
```javascript
{
  _id: ObjectId,
name: String, // company name
website: String, // company website
industry: String, // industry
size: String, // company size
location: String, // company location
description: String, // Company description
createdAt: Date, // Creation time
updatedAt: Date // Update time
}
```

## 2.7 Resumes

```javascript
{
  _id: ObjectId,
name: String, // Resume name
user: ObjectId, //Associated user ID
content: String, // Resume content (JSON format string)
targetPosition: String, // Target position
targetJob: String, // target job
createdAt: Date, // Creation time
updatedAt: Date // Update time
}
```

### 2.8 Resume content structure

The resume content is stored in the content field in the form of a JSON string. The parsed structure is as follows:

```javascript
{
  personalInfo: {
fullName: String, // name
email: String, // Email
phone: String, // phone
location: String // Location
  },
  educations: [
    {
education: String, // Educational background
school: String, // school
major: String, // major
startDate: String, // start date
endDate: String // End date
    }
  ],
  workExperiences: [
    {
company: String, // company
position: String, // Position
startDate: String, // start date
endDate: String, // end date
responsibilities: String // Responsibility description
    }
  ],
skills: String // Skill description
}
```

## 3. Index design

### 3.1 User collection index
- email (unique index)
- username (unique index)

### 3.2 User profile collection index
- userId (unique index)
- skills.name (index)
- workExperiences.company (index)
- educations.institution (index)
- lastUpdated (index)
- createdAt (index)

### 3.3 Position collection index
- sourceId + platform (composite unique index)
- company (index)
- title (index)
- createdAt (index)
- platform (index)

### 3.4 User-position association collection index
- userId + jobId (composite unique index)
- userId + status (composite index)
- userId + isFavorite (composite index)
- jobId (index)
- createdAt (index)

### 3.5 Application history collection index
- userJobId (index)
- createdAt (index)

### 3.6 Company collection index
- name (unique index)
- industry (index)

### 3.7 Resume collection index
- userId (index)
- createdAt (index)
- name (index)

## 4. Data security

### 4.1 Access control
- User data isolation
- Role permission control
- Data encrypted storage

### 4.2 Data backup
- Regular backup strategy
- Backup verification
- Recovery test

### 4.3 Data integrity
- foreign key constraints
- Data validation
- Transaction support

## 5. Performance optimization

### 5.1 Query optimization
- Index optimization
- Query plan analysis
- Slow query monitoring

### 5.2 Storage optimization
- Data compression
- Sharding strategy
- Storage engine selection

### 5.3 Caching strategy
- Hotspot data cache
- Query result cache
- Cache update strategy

## 6. Monitoring and Maintenance

### 6.1 Monitoring indicators
- Number of connections
- Query performance
- storage space
- replication delay

### 6.2 Maintenance plan
- Regular optimization
- Index maintenance
- Data cleaning
- Version upgrade

## 7. Scalability considerations (not considered yet)

### 7.1 Sharding strategy
- Sharding by user ID
- Shard by time range
- Sharded by location

### 7.2 Separation of reading and writing
- master-slave replication
- Read operation load balancing
- Write operation routing

## 8. Data migration

### 8.1 Migration strategy
- Data backup
- Incremental migration
- Data validation
- rollback plan

### 8.2 Version control
- Database version management
- Model change record
- Migration script management