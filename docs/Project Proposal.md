# Project Proposal

# JobTrip 职途助手 - Smart Job Tracking Extension and System

## Introduction

Our team is developing a browser extension and web application called "JobTrip 职途助手" for the New Zealand job market. This system will help job seekers manage their job search more easily. It has three main functions:

- Automatically collect job information from popular job websites like LinkedIn, Indeed, and Seek.
- Provide a central platform to manage job applications.
- Help users organize and track their job search process effectively.

### Motivation

Looking for a job can be hard. People usually need to use many job platforms at the same time. Tracking applications manually takes a lot of time and often leads to mistakes. There is no single tool that combines job opportunities and gives useful analysis. Job seekers need a better way to plan and improve their job search strategy. That’s why we want to build JobTrip—to make the process simpler and more efficient.

## Related Work

There are some existing tools that do similar things to JobTrip. We studied them to see what works well and what we can do better.

1. **LinkedIn Easy Apply Tracker**
    - **Good Points**: Works well with LinkedIn and tracks basic applications.
    - **Weak Points**: Only works for LinkedIn, and the features are too simple.
2. **Huntr.co**
    - **Good Points**: Has a nice design and full job management tools.
    - **Weak Points**: Users must enter data by hand, and many features cost money.
3. **Teal HQ**
    - **Good Points**: Offers job search analysis and helps manage documents.
    - **Weak Points**: Expensive and hard to learn for new users.

### Our Improvements

JobTrip will be different. It will:

- Collect data automatically from multiple platforms.
- Be free and open-source.
- Have a simple and clear user interface.
- Let users export their data locally.

## Requirements

We divided the features into four levels based on priority: Must-Haves, Should-Haves, Could-Haves, and Nice-to-Haves. This helps us focus on the most important parts first and finish them in about one week of full-time work per team member.

### Must-Haves (P0)

These are the basic features we must finish:

1. **Browser Extension**:
    - Collect job info from LinkedIn, Seek, and Indeed using open-source web scraping tools. Data will be stored in JSON format in MongoDB.
    - Automatically pull job details like title, company, and location.
    - Save job info to a central database (MongoDB).
2. **Web Application**:
    - Show a list of jobs.
    - Allow basic CRUD operations (Create, Read, Update, Delete).
    - Track job status (e.g., New, Applied, Interview).

### Should-Haves (P1)

These features are important and should be done if time allows:

1. **User Features**:
    - User registration and login.
    - Profile management.
    - Export data option.
2. **Extra Features**:
    - Search and filter jobs.
    - Simple data stats (e.g., number of applications).
    - Reminders for application deadlines.

### Could-Haves (P2)

These are optional but useful features:

1. **Advanced Features**:
    - Smart job recommendations.
    - Detailed data analysis with charts.
    - Resume management system.
2. **Integration**:
    - Sync with calendars.
    - Email notifications.
    - Resources for interview preparation.

### Nice-to-Haves (P3)

These are extra ideas we might add later:

1. **Community Features**:
    - User comments and discussions.
    - Share company reviews.
    - Share job search tips.
2. **AI Features**:
    - Suggestions to improve resumes.
    - Predict interview questions.
    - Personalized job search advice.

We think the Must-Haves and most Should-Haves can be done in one week per person. The Could-Haves and Nice-to-Haves can be added if we have extra time.

## Technologies

We will use different tools and technologies to build JobTrip. Some are from class, but we will also learn new ones on our own.

### Frontend

1. **Core Tools**:
    - React.js (for building the web app).
    - Material-UI (MUI) (for a nice design).
    - Axios (for connecting to the backend).
2. **Extension**:
    - Chrome Extension API (open-source tools available).
    - Web Scraping (custom parsers for job sites).

### Backend

1. **Server**:
    - Node.js and Express.js (for the server).
    - MongoDB (for storing data).
2. **API and Security**:
    - RESTful API (for communication).
    - JWT (for user authentication).

### Development Tools

- Git & GitHub (for version control).
- VS Code (for coding).
- Postman (for testing APIs).
- MongoDB Compass (for managing the database).

### New Technologies

1. **Data Analysis**:
    - D3.js (for charts and visuals).
    - TensorFlow.js (for job recommendations).
2. **Performance**:
    - Elasticsearch (for faster search, if time allows, hosted on AWS EC2).

We will research these new tools to show we can learn independently.

## Project Management

### Agile Method

We will use the Scrum framework, an agile method.

- Each sprint will last 2 weeks.
- We plan to have 4 sprints in total.

### Team Collaboration

1. **Communication**:
    - Discord (daily chats).
    - Zoom (remote meetings).
    - GitHub Projects (task tracking).
2. **Version Control**:
    - GitHub Flow (simple workflow).
    - Feature branches for each task.
    - Code reviews before merging.
    - CI/CD (automatic testing and deployment).

### Sprint Plan

1. **Sprint 1: Setup**
    - Set up the project.
    - Define basic APIs.
    - Design the database.
    - Build frontend and backend frameworks.
2. **Sprint 2: Core Features**
    - Develop the extension.
    - Create the frontend UI.
    - Connect data to the system.
3. **Sprint 3: Improvements**
    - Add user login.
    - Build data stats.
    - Fix bugs.
4. **Sprint 4: Final Steps**
    - Improve performance.
    - Test with users.
    - Finish documentation.

## Risks and Mitigation

### Technical Risks

1. **Website Changes**
    - **Risk**: Job websites might update and break our scraper.
    - **Solution**: Use a modular design and update quickly when needed.
2. **Performance Issues**
    - **Risk**: Too much data might slow the system.
    - **Solution**: Use caching and load data in pages.

### Team Risks

1. **Skill Differences**
    - **Risk**: Some team members may know less than others.
    - **Solution**: Pair programming and regular knowledge sharing.
2. **Time Management**
    - **Risk**: Team members might not spend equal time.
    - **Solution**: Assign clear tasks and check progress often.

### Project Scope Risks

1. **Scope Creep**
    - **Risk**: We might keep adding new features.
    - **Solution**: Stick to priorities and focus on the MVP (minimum viable product).
2. **Technical Debt**
    - **Risk**: Fast coding might create messy code.
    - **Solution**: Refactor code regularly and use continuous integration to keep the system working.

## Conclusion

JobTrip will help job seekers in New Zealand by making their job search easier and more organized. With automatic data collection, a simple interface, and useful features, it will save time and reduce stress. We have a clear plan to build it in four sprints using modern tools like React.js, Node.js, and MongoDB. By managing risks and working as a team, we are confident we can finish the Must-Haves and Should-Haves in the time given. We hope JobTrip will be a helpful tool for many people.