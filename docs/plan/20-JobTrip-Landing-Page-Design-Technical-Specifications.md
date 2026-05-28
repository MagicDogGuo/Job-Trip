[Mode:Plan][Model:Claude 3.7 Sonnet]

# JobTrip Landing Page Design Technical Specifications

## 1. Overview

This document plans in detail the design and implementation of the landing page of the JobTrip website, integrates existing design styles, and supports multi-language and dark mode.

### 1.1 Design Goals

- Demonstrate the core values and functions of JobTrip
- Maintain the same design language as the login interface
- Supports three languages: English, Simplified Chinese, Traditional Chinese
- Fully adaptable to both light/dark modes
- Responsive design ensures a great experience on desktop and mobile devices

## 2. Page structure design

### 2.1 Component Hierarchy
```
LandingPage/
├── Navbar/
├── HeroBanner/
├── ClientLogos/
├── FeatureSections/
│   ├── ChromeExtension/
│   ├── JobListSection/
│   ├── ApplicationTracking/
│   ├── ProfileSection/
│   ├── ResumeBuilder/
│   ├── CoverLetterAI/
├── Testimonial/
├── CTASection/
├── Footer/
```
### 2.2 Page layout and component details

#### 2.2.1 Navbar component

- Logo on the left
- Central navigation link
- Language switching and login/register buttons on the right
- Support background changing effect when scrolling

#### 2.2.2 HeroBanner component

- Left side: title, subtitle, primary button, secondary button
- Right: Job-Trip interface preview
- Background: Gradient colored square decoration

#### 2.2.3 ClientLogos component

- 5-8 partners/famous company logos
- Grayscale processing to maintain a unified vision

#### 2.2.4 Core function display components (alternating left and right layout in each section)

1. **ChromeExtension**
   - Title: One-click installation, easy to grab
   - Feature introduction: Automatically grab job information from LinkedIn, Seek, and Indeed
   - Picture: Screenshot of Chrome extension usage interface
   - Button: Install now

2. **JobListSection**
   - Title: Unified management, clear at a glance
   - Feature introduction: Browse all job information in one place
   - Picture: Job list interface
   - Button: View jobs

3. **ApplicationTracking**
   - Title: Kanban tracking, clear progress
   - Feature introduction: Drag and drop to manage application status
   - Picture: Kanban Kanban interface
   - Button: Start tracking

4. **ProfileSection**
   - Title: Personal profile, one-time maintenance
   - Feature introduction: Centralized management of personal information
   - Picture: Personal profile form interface
   - Button: complete information

5. **ResumeBuilder**
   - Title: Smart resume, one-click generation
   - Feature introduction: Automatically generated based on position and personal information
   - Picture: Resume generation interface
   - Button: Create resume

6. **CoverLetterAI**
   - Title: AI cover letter, multi-language support
   - Feature introduction: Intelligent generation of Chinese and English cover letters based on the position
   - Picture: Cover letter editing interface
   - Button: Generate cover letter

#### 2.2.5 Testimonial component

- User avatar, name, position
- User reviews in citation format
- Card style design

#### 2.2.6 CTASection component

- Main title: Start your job search journey
- Subtitle: Short motivational copy
- Main button: Register now
- Secondary button: Learn more

#### 2.2.7 Footer component

- Logo and copyright information
- Navigation links
- Social media icons
- Link to privacy policy and terms

## 3. Technical implementation details

### 3.1 File structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── ClientLogos.tsx
│   │   │   ├── FeatureSection.tsx
│   │   │   ├── Testimonial.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Footer.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   ├── public/
│   │   ├── locales/
│   │   │   ├── en-US/
│   │   │   │   ├── landing.json
│   │   │   ├── zh-CN/
│   │   │   │   ├── landing.json
│   │   │   ├── zh-TW/
│   │   │   │   ├── landing.json
```
### 3.2 Core component implementation

#### 3.2.1 LandingPage.tsx main frame
```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import ClientLogos from '@/components/landing/ClientLogos';
import FeatureSection from '@/components/landing/FeatureSection';
import Testimonial from '@/components/landing/Testimonial';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  const { t } = useTranslation('landing');
  
  const features = [
    {
      id: 'chrome-extension',
      title: t('features.extension.title'),
      description: t('features.extension.description'),
      imageUrl: '/assets/images/landing/chrome-extension.png',
      buttonText: t('features.extension.button'),
      buttonLink: '/download',
      imagePosition: 'right'
    },
// ...Configuration of other 5 functional blocks
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <HeroBanner />
      <ClientLogos />
      
      <div className="py-12 md:py-20">
        {features.map((feature, index) => (
          <FeatureSection 
            key={feature.id}
            {...feature}
            imagePosition={index % 2 === 0 ? 'right' : 'left'}
          />
        ))}
      </div>
      
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
```
#### 3.2.2 HeroBanner.tsx implementation
```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
{/* Decorative square background */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-lg opacity-80 ${getRandomColorClass()} ${getRandomSize()} ${getRandomPosition()}`}
          />
        ))}
      </div>
      
      <div className="container-lg relative z-10 pt-20 pb-16 md:py-28">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 mb-12 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
              >
                {t('hero.primaryButton')}
              </Link>
              <Link 
                to="/download" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {t('hero.secondaryButton')}
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-1">
              <img 
                src="/assets/images/landing/dashboard-preview.png" 
                alt="JobTrip Dashboard" 
                className="w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate random styles
const getRandomColorClass = () => {
  const colors = [
    'bg-blue-200 dark:bg-blue-900/40',
    'bg-indigo-200 dark:bg-indigo-900/40',
    'bg-purple-200 dark:bg-purple-900/40',
    'bg-pink-200 dark:bg-pink-900/40',
    'bg-green-200 dark:bg-green-900/40',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomSize = () => {
  const sizes = ['w-20 h-20', 'w-24 h-24', 'w-16 h-16', 'w-32 h-32'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const getRandomPosition = () => {
  return `top-${Math.floor(Math.random() * 40)} left-${Math.floor(Math.random() * 80)}`;
};

export default HeroBanner;
```
#### 3.2.3 FeatureSection.tsx implementation
```typescript
import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  imagePosition: 'left' | 'right';
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  imagePosition
}) => {
  return (
    <div className="py-16 container-lg">
      <div className={`flex flex-col ${imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center gap-12`}>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>
          <Link
            to={buttonLink}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
        <div className="flex-1">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-1">
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
```
## 4. Multi-language and dark mode support

### 4.1 Multi-language support implementation

Create a translation file:

1. `frontend/public/locales/en-US/landing.json`
2. `frontend/public/locales/zh-CN/landing.json`
3. `frontend/public/locales/zh-TW/landing.json`

Example of English translation file content:
```json
{
  "meta": {
    "title": "JobTrip - Your AI-Powered Job Application Assistant",
    "description": "Simplify your job hunt with Chrome automation, intelligent resume builder, and one-click tracking"
  },
  "nav": {
    "features": "Features",
    "about": "About",
    "pricing": "Pricing",
    "login": "Log in",
    "signup": "Sign up"
  },
  "hero": {
    "title": "Your One-Stop AI-Powered Job Application Assistant",
    "subtitle": "Simplify your job hunt with Chrome automation, intelligent resume builder, and one-click tracking.",
    "primaryButton": "Try JobTrip Now",
    "secondaryButton": "Install Chrome Extension"
  },
  "features": {
    "extension": {
      "title": "Install Chrome Extension",
      "description": "Automatically capture job information from LinkedIn, Seek, and Indeed to boost efficiency.",
      "button": "Download Extension"
    },
    "jobList": {
      "title": "Browse Job Listings",
      "description": "View jobs captured automatically or added manually in one centralized location.",
      "button": "View Job List"
    },
    "tracking": {
      "title": "Track Application Status",
      "description": "Drag-and-drop kanban board to manage your application progress from applied to hired.",
      "button": "Track Jobs"
    },
    "profile": {
      "title": "Complete Your Profile",
      "description": "Maintain education, work experience, and skills in one place to power other features.",
      "button": "Edit Profile"
    },
    "resume": {
      "title": "Generate Targeted Resumes",
      "description": "One-click resume templates tailored to specific positions to increase interview chances.",
      "button": "Create Resume"
    },
    "coverLetter": {
      "title": "AI Personalized Cover Letters",
      "description": "Paste job details, and AI generates high-quality cover letters in English and Chinese.",
      "button": "Generate Cover Letter"
    }
  },
  "testimonial": {
    "text": "I was amazed at how quickly and efficiently this tool organized my job search. It's saved me countless hours tracking applications and following up with companies. I can't imagine my job search without it!",
    "author": "Sarah Johnson",
    "position": "Software Engineer"
  },
  "cta": {
    "title": "Start Your Job Search Journey Today",
    "subtitle": "Join thousands of job seekers who have simplified their application process",
    "button": "Get Started For Free"
  },
  "footer": {
    "copyright": "© 2025 JobTrip. All rights reserved.",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "contact": "Contact Us"
  }
}
```
### 4.2 Dark mode adaptation

Global dark mode toggle component (`frontend/src/components/common/ThemeToggle.tsx`):
```typescript
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
```
## 5. Routing configuration

Update routing configuration (`frontend/src/routes/index.tsx`):
```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
// ... other imports

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
{/* ... other routes */}
    </Routes>
  );
};

export default AppRoutes;
```
## 6. Image resource requirements

1. Create the following directory structure:
   ```
   frontend/public/assets/images/landing/
   ```
2. Prepare the following image resources:
   - `dashboard-preview.png` (Hero area display picture)
   - `chrome-extension.png` (screenshot of extension function)
   - `job-list.png` (screenshot of job list)
   - `kanban-board.png` (kanban tracking screenshot)
   - `profile-form.png` (profile screenshot)
   - `resume-builder.png` (resume generation screenshot)
   - `cover-letter.png` (screenshot of cover letter)
   - `company-logos/` (each company logo)
   - `testimonial-avatar.jpg` (user avatar)

## Implementation Checklist:
1. Install the required NPM packages: heroicons/react, react-spring and other animation libraries
2. Create landing directory and component file structure
3. Add LandingPage route in routes/index.tsx
4. Create the Landing Page main frame file LandingPage.tsx
5. Implement the Navbar component, including language switching and theme switching functions
6. Implement the HeroBanner component and add dynamic decorative square background
7. Implement the ClientLogos component to display partner/company logos
8. Implement the FeatureSection component for display of each functional module
9. Implement the Testimonial component to display user reviews
10. Implement the CTASection component and add the main call to action
11. Implement the Footer component, including copyright and link information
12. Prepare and place all necessary image assets
13. Create English (en-US) translation file landing.json
14. Create Simplified Chinese (zh-CN) translation file landing.json
15. Create Traditional Chinese (zh-TW) translation file landing.json
16. Test the display effect of the page in light/dark mode
17. Test the display effect of the page in three languages
18. Test the responsive layout of the page on desktop and mobile devices
19. Optimize the first screen loading performance and ensure that image resources are properly compressed
20. Conduct accessibility (a11y) checks and optimizations
