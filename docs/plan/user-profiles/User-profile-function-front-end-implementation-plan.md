[Mode:Plan][Model:Claude 3.7 Sonnet]

# User profile function front-end implementation technical specifications

## 1. Overview

This plan is aimed at the front-end implementation of the user profile function of the JobTrip career assistant project. It is based on the user_profiles collection design in the MongoDB database, uses Tailwind CSS for style design, and supports responsive layout and light and dark modes.

## 2. Directory structure
```
frontend/src/
├── components/
│   └── profile/
│ ├── ProfilePage.tsx # Main page component
│ ├── ProfileHeader.tsx # Personal information header component
│ ├── ProfileCompleteness.tsx # Data integrity component
│ ├── ProfileSection.tsx # Common block component (reusable)
│ ├── EducationSection.tsx # Education experience section
│ ├── WorkExperienceSection.tsx # Work experience section
│ ├── SkillsSection.tsx # Skills section
│ ├── CertificationsSection.tsx # Certificate block
│ ├── ProjectsSection.tsx # Project experience block
│ ├── LanguagesSection.tsx # Language ability section
│ ├── VolunteerSection.tsx # Volunteer experience section
│ ├── AwardsSection.tsx # Honors and Awards Section
│ ├── RecommendationsSection.tsx # Recommendation letter block
│ ├── ProfileSidebar.tsx # Side navigation bar
│       └── forms/
│ ├── BasicInfoForm.tsx # Basic information editing form
│ ├── EducationForm.tsx # Education experience editing form
│ ├── WorkExperienceForm.tsx # Work experience editing form
│ ├── SkillForm.tsx # Skill editing form
│ ├── CertificationForm.tsx # Certificate editing form
│ ├── ProjectForm.tsx # Project experience editing form
│ ├── LanguageForm.tsx # Language ability editing form
│ ├── VolunteerForm.tsx # Volunteer experience editing form
│ ├── AwardForm.tsx # Honors and awards editing form
│ └── RecommendationForm.tsx # Recommendation letter editing form
├── pages/
│   └── profile/
│ └── index.tsx # User profile page routing entry
├── services/
│ └── profileService.ts # User profile API service
├── redux/
│   └── slices/
│ └── profileSlice.ts # User profile status management
└── types/
└── profile.ts # User profile related type definitions
```
## 3. Type definition (frontend/src/types/profile.ts)

Define TypeScript types related to user profiles according to the database model:
```typescript
//Basic type definition
export interface BasicInfo {
  headline: string;
  photo: string;
  biography: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: string;
    socialMedia: {
      linkedin: string;
      github: string;
      twitter: string;
      other: Array<{ name: string; url: string }>;
    };
  };
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string | Date;
  endDate: string | Date | null;
  description: string;
  location: string;
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position: string;
  startDate: string | Date;
  endDate: string | Date | null;
  current: boolean;
  description: string;
  location: string;
  achievements: string[];
}

export interface Skill {
  _id?: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  category: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string | Date;
  expirationDate: string | Date | null;
  credentialId: string;
  credentialUrl: string;
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date | null;
  url: string;
  technologies: string[];
}

export interface Language {
  _id?: string;
  language: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

export interface VolunteerExperience {
  _id?: string;
  organization: string;
  role: string;
  startDate: string | Date;
  endDate: string | Date | null;
  description: string;
}

export interface HonorAward {
  _id?: string;
  title: string;
  issuer: string;
  date: string | Date;
  description: string;
}

export interface Recommendation {
  _id?: string;
  recommenderName: string;
  recommenderTitle: string;
  relationship: string;
  content: string;
  date: string | Date;
}

// Complete user profile type
export interface UserProfile {
  _id?: string;
  userId: string;
  headline: string;
  photo: string;
  biography: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    address: string;
    socialMedia: {
      linkedin: string;
      github: string;
      twitter: string;
      other: Array<{ name: string; url: string }>;
    };
  };
  educations: Education[];
  workExperiences: WorkExperience[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  volunteerExperiences: VolunteerExperience[];
  honorsAwards: HonorAward[];
  recommendations: Recommendation[];
  profileCompleteness: number;
  lastUpdated: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Some types are used for state management
export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  activeSection: string;
  editMode: boolean;
  currentEditItem: any | null;
}
```
## 4. State management (frontend/src/redux/slices/profileSlice.ts)

Use the Redux Toolkit to manage user profile status:
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, UserProfile } from '../../types/profile';
import profileService from '../../services/profileService';

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  activeSection: 'basic',
  editMode: false,
  currentEditItem: null
};

// Asynchronous thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      return response;
    } catch (error) {
return rejectWithValue('Failed to obtain user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await profileService.updateUserProfile(profileData);
      return response;
    } catch (error) {
return rejectWithValue('Failed to update user profile');
    }
  }
);

// Create dedicated update functions for each part
export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (educationData, { getState, rejectWithValue }) => {
    try {
      const { profile } = getState() as { profile: ProfileState };
      const userId = profile.profile?.userId;
      const response = await profileService.addEducation(userId, educationData);
      return response;
    } catch (error) {
return rejectWithValue('Failed to add educational experience');
    }
  }
);

//Similarly add other CRUD operations...

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
    toggleEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
    setCurrentEditItem: (state, action: PayloadAction<any>) => {
      state.currentEditItem = action.payload;
    },
    clearCurrentEditItem: (state) => {
      state.currentEditItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
// Add processing for other asynchronous operations...
  }
});

export const { setActiveSection, toggleEditMode, setCurrentEditItem, clearCurrentEditItem } = profileSlice.actions;
export default profileSlice.reducer;
```
## 5. API Service (frontend/src/services/profileService.ts)
```typescript
import axios from 'axios';
import { UserProfile, Education, WorkExperience, Skill, Certification, Project, Language, VolunteerExperience, HonorAward, Recommendation } from '../types/profile';

const API_URL = '/api/profile';

const getUserProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

const updateUserProfile = async (profileData: Partial<UserProfile>) => {
  const response = await axios.put(`${API_URL}/${profileData.userId}`, profileData);
  return response.data;
};

//Create dedicated API methods for each part
const addEducation = async (userId: string, education: Education) => {
  const response = await axios.post(`${API_URL}/${userId}/education`, education);
  return response.data;
};

const updateEducation = async (userId: string, educationId: string, education: Education) => {
  const response = await axios.put(`${API_URL}/${userId}/education/${educationId}`, education);
  return response.data;
};

const deleteEducation = async (userId: string, educationId: string) => {
  const response = await axios.delete(`${API_URL}/${userId}/education/${educationId}`);
  return response.data;
};

//Similarly add CRUD methods for other parts...

const calculateProfileCompleteness = (profile: UserProfile): number => {
// Calculation logic...
return 0; // Return percentage
};

export default {
  getUserProfile,
  updateUserProfile,
  addEducation,
  updateEducation,
  deleteEducation,
// Other methods...
  calculateProfileCompleteness
};
```
## 6. Page entry (frontend/src/pages/profile/index.tsx)
```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/slices/profileSlice';
import ProfilePage from '../../components/profile/ProfilePage';
import { RootState } from '../../redux/store';

const ProfilePageContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-lg mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return <ProfilePage profile={profile} />;
};

export default ProfilePageContainer;
```
## 7. Main page component (frontend/src/components/profile/ProfilePage.tsx)
```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSection } from '../../redux/slices/profileSlice';
import { UserProfile } from '../../types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileCompleteness from './ProfileCompleteness';
import ProfileSidebar from './ProfileSidebar';
import EducationSection from './EducationSection';
import WorkExperienceSection from './WorkExperienceSection';
import SkillsSection from './SkillsSection';
import CertificationsSection from './CertificationsSection';
import ProjectsSection from './ProjectsSection';
import LanguagesSection from './LanguagesSection';
import VolunteerSection from './VolunteerSection';
import AwardsSection from './AwardsSection';
import RecommendationsSection from './RecommendationsSection';
import { RootState } from '../../redux/store';

interface ProfilePageProps {
  profile: UserProfile | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  const dispatch = useDispatch();
  const { activeSection } = useSelector((state: RootState) => state.profile);

  if (!profile) {
    return null;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return <ProfileHeader profile={profile} />;
      case 'education':
        return <EducationSection educations={profile.educations} />;
      case 'work':
        return <WorkExperienceSection workExperiences={profile.workExperiences} />;
      case 'skills':
        return <SkillsSection skills={profile.skills} />;
      case 'certifications':
        return <CertificationsSection certifications={profile.certifications} />;
      case 'projects':
        return <ProjectsSection projects={profile.projects} />;
      case 'languages':
        return <LanguagesSection languages={profile.languages} />;
      case 'volunteer':
        return <VolunteerSection volunteerExperiences={profile.volunteerExperiences} />;
      case 'awards':
        return <AwardsSection honorsAwards={profile.honorsAwards} />;
      case 'recommendations':
        return <RecommendationsSection recommendations={profile.recommendations} />;
      default:
        return <ProfileHeader profile={profile} />;
    }
  };

  return (
    <div className="container-lg mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
{/* Sidebar */}
        <div className="md:w-1/4">
          <ProfileCompleteness completeness={profile.profileCompleteness} />
          <ProfileSidebar activeSection={activeSection} onSectionChange={(section) => dispatch(setActiveSection(section))} />
        </div>
        
{/* Main content */}
        <div className="md:w-3/4">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
```
## 8. Common block component (frontend/src/components/profile/ProfileSection.tsx)
```typescript
import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { toggleEditMode } from '../../redux/slices/profileSlice';

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  emptyMessage?: string;
  onAddNew?: () => void;
  isEmpty?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
emptyMessage = 'No data yet',
  onAddNew,
  isEmpty = false
}) => {
  const dispatch = useDispatch();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <div className="flex gap-2">
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
Add to
            </button>
          )}
        </div>
      </div>
      
      {isEmpty ? (
        <div className="bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
Add {title}
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ProfileSection;
```
## 9. Personal information header component (frontend/src/components/profile/ProfileHeader.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../redux/slices/profileSlice';
import { UserProfile } from '../../types/profile';
import BasicInfoForm from './forms/BasicInfoForm';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (data) => {
    dispatch(updateUserProfile({
      userId: profile.userId,
      ...data
    }));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <BasicInfoForm
        initialData={{
          headline: profile.headline,
          biography: profile.biography,
          contactInfo: profile.contactInfo
        }}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
{/* avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={profile.photo || '/assets/default-avatar.png'}
              alt={`${profile.headline}`}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
            />
            <button 
              className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full shadow-lg"
onClick={() => {/* Handle avatar update */}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </button>
          </div>
        </div>
        
{/* personal information */}
        <div className="flex-grow space-y-3">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{profile.headline}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
edit
            </button>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400">{profile.biography}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {profile.contactInfo.email && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contactInfo.email}</span>
              </div>
            )}
            
            {profile.contactInfo.phone && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contactInfo.phone}</span>
              </div>
            )}
            
            {profile.contactInfo.website && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <a href={profile.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {profile.contactInfo.website}
                </a>
              </div>
            )}
            
            {profile.contactInfo.address && (
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{profile.contactInfo.address}</span>
              </div>
            )}
          </div>
          
{/* Social media links */}
          <div className="flex flex-wrap gap-3 pt-4">
            {profile.contactInfo.socialMedia.linkedin && (
              <a href={profile.contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
            
            {profile.contactInfo.socialMedia.github && (
              <a href={profile.contactInfo.socialMedia.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-white hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            
            {profile.contactInfo.socialMedia.twitter && (
              <a href={profile.contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            )}
            
            {profile.contactInfo.socialMedia.other && profile.contactInfo.socialMedia.other.map((item, index) => (
              <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-800">
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
```
[Mode:Plan][Model:Claude 3.7 Sonnet]

## 10. Data integrity component (frontend/src/components/profile/ProfileCompleteness.tsx)
```typescript
import React from 'react';

interface ProfileCompletenessProps {
  completeness: number;
}

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ completeness }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6 mb-6">
<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">File integrity</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completeness}% complete</span>
<span className="text-xs text-indigo-600 dark:text-indigo-400">{completeness < 100 ? 'Continue to improve' : 'Completed'}</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-500 h-2.5 rounded-full" 
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
        
        {completeness < 100 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
Improving your profile can improve your match to career opportunities
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCompleteness;
```
## 11. Side navigation bar component (frontend/src/components/profile/ProfileSidebar.tsx)
```typescript
import React from 'react';

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeSection, onSectionChange }) => {
  const sections = [
{ id: 'basic', name: 'Basic information', icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' },
{ id: 'education', name: 'Education Experience', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
{ id: 'work', name: 'Work experience', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z' },
{ id: 'skills', name: 'Skills', icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z' },
{ id: 'certifications', name: 'Certifications', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
{ id: 'projects', name: 'Project experience', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
{ id: 'languages', name: 'Language ability', icon: 'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802' },
{ id: 'volunteer', name: 'Volunteer experience', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
{ id: 'awards', name: 'Honors and Awards', icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0' },
{ id: 'recommendations', name: 'letter of recommendation', icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' }
  ];

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 overflow-hidden">
      <nav className="flex flex-col">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              activeSection === section.id
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => onSectionChange(section.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
            </svg>
            <span>{section.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
```
## 12. Education experience block component (frontend/src/components/profile/EducationSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEducation, updateEducation, deleteEducation } from '../../redux/slices/profileSlice';
import { Education } from '../../types/profile';
import ProfileSection from './ProfileSection';
import EducationForm from './forms/EducationForm';

interface EducationSectionProps {
  educations: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ educations }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Education) => {
    dispatch(addEducation(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: Education) => {
    dispatch(updateEducation({ educationId: id, education: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this educational experience?')) {
      dispatch(deleteEducation(id));
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
  };

  return (
    <ProfileSection 
title="Education Experience"
      isEmpty={educations.length === 0 && !isAdding}
emptyMessage="Add your educational experience to show your academic background"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <EducationForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="space-y-6">
          {educations.map((education) => (
            <div 
              key={education._id} 
              className={`bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-5 ring-2 ring-gray-900/5 dark:ring-gray-100/5 ${
                editingId === education._id ? 'ring-indigo-500' : ''
              }`}
            >
              {editingId === education._id ? (
                <EducationForm 
                  initialData={education} 
                  onSave={(data) => handleUpdate(education._id!, data)} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{education.institution}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{education.degree}, {education.field}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(education._id!)}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(education._id!)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
{formatDate(education.startDate)} - {education.endDate ? formatDate(education.endDate) : 'Present'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 mt-1 md:mt-0">{education.location}</span>
                  </div>
                  
                  {education.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{education.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default EducationSection;
```
## 13. Education experience form component (frontend/src/components/profile/forms/EducationForm.tsx)
```typescript
import React, { useState } from 'react';
import { Education } from '../../../types/profile';

interface EducationFormProps {
  initialData?: Education;
  onSave: (data: Education) => void;
  onCancel: () => void;
}

const defaultEducation: Education = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: '',
  location: ''
};

const EducationForm: React.FC<EducationFormProps> = ({ initialData = defaultEducation, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Education>({
    ...initialData,
    startDate: initialData.startDate 
      ? typeof initialData.startDate === 'string' 
        ? initialData.startDate.substring(0, 10) 
        : new Date(initialData.startDate).toISOString().substring(0, 10)
      : '',
    endDate: initialData.endDate 
      ? typeof initialData.endDate === 'string' 
        ? initialData.endDate.substring(0, 10) 
        : new Date(initialData.endDate).toISOString().substring(0, 10)
      : ''
  });
  const [isCurrentSchool, setIsCurrentSchool] = useState(!initialData.endDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
// If you select currently in school, clear the end date
    const dataToSave = {
      ...formData,
      endDate: isCurrentSchool ? null : formData.endDate
    };
    
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
School name *
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Bachelor of Science *
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Areas of expertise *
          </label>
          <input
            type="text"
            id="field"
            name="field"
            value={formData.field}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Place
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
start date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate as string}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
end date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate as string}
            onChange={handleChange}
            disabled={isCurrentSchool}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isCurrentSchool"
          checked={isCurrentSchool}
          onChange={(e) => setIsCurrentSchool(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isCurrentSchool" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
I am currently studying in this school
        </label>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Description/Achievements
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default EducationForm;
```
## 14. Work experience section component (frontend/src/components/profile/WorkExperienceSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from '../../redux/slices/profileSlice';
import { WorkExperience } from '../../types/profile';
import ProfileSection from './ProfileSection';
import WorkExperienceForm from './forms/WorkExperienceForm';

interface WorkExperienceSectionProps {
  workExperiences: WorkExperience[];
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ workExperiences }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: WorkExperience) => {
    dispatch(addWorkExperience(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: WorkExperience) => {
    dispatch(updateWorkExperience({ workExperienceId: id, workExperience: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this work experience?')) {
      dispatch(deleteWorkExperience(id));
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
  };

// Sort by time, with the most recent work first
  const sortedExperiences = [...workExperiences].sort((a, b) => {
    const dateA = a.current ? new Date() : new Date(a.endDate as string);
    const dateB = b.current ? new Date() : new Date(b.endDate as string);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <ProfileSection 
title="Work experience"
      isEmpty={workExperiences.length === 0 && !isAdding}
emptyMessage="Add your work experience to show your career development"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <WorkExperienceForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="space-y-6">
          {sortedExperiences.map((experience) => (
            <div 
              key={experience._id} 
              className={`bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-5 ring-2 ring-gray-900/5 dark:ring-gray-100/5 ${
                editingId === experience._id ? 'ring-indigo-500' : ''
              }`}
            >
              {editingId === experience._id ? (
                <WorkExperienceForm 
                  initialData={experience} 
                  onSave={(data) => handleUpdate(experience._id!, data)} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{experience.position}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{experience.company}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(experience._id!)}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(experience._id!)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
{formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate as string)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 mt-1 md:mt-0">{experience.location}</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{experience.description}</p>
                  
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="space-y-2">
<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Main achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {experience.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default WorkExperienceSection;
```
## 15. Work experience form component (frontend/src/components/profile/forms/WorkExperienceForm.tsx)
```typescript
import React, { useState } from 'react';
import { WorkExperience } from '../../../types/profile';

interface WorkExperienceFormProps {
  initialData?: WorkExperience;
  onSave: (data: WorkExperience) => void;
  onCancel: () => void;
}

const defaultWorkExperience: WorkExperience = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  location: '',
  achievements: []
};

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ initialData = defaultWorkExperience, onSave, onCancel }) => {
  const [formData, setFormData] = useState<WorkExperience>({
    ...initialData,
    startDate: initialData.startDate 
      ? typeof initialData.startDate === 'string' 
        ? initialData.startDate.substring(0, 10) 
        : new Date(initialData.startDate).toISOString().substring(0, 10)
      : '',
    endDate: initialData.endDate 
      ? typeof initialData.endDate === 'string' 
        ? initialData.endDate.substring(0, 10) 
        : new Date(initialData.endDate).toISOString().substring(0, 10)
      : ''
  });
  const [newAchievement, setNewAchievement] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const current = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      current,
      endDate: current ? '' : prev.endDate
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Company Name *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Position *
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Place
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
start date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate as string}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
end date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate as string}
            onChange={handleChange}
            disabled={formData.current}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="current"
          checked={formData.current}
          onChange={handleCurrentChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="current" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
I currently work here
        </label>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Job Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Main achievements
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
placeholder="Add achievement or highlight"
              className="flex-grow h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <button
              type="button"
              onClick={handleAddAchievement}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
Add to
            </button>
          </div>
          
          {formData.achievements.length > 0 && (
            <ul className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(index)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default WorkExperienceForm;
```
## 16. SkillsSection component (frontend/src/components/profile/SkillsSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSkill, updateSkill, deleteSkill } from '../../redux/slices/profileSlice';
import { Skill } from '../../types/profile';
import ProfileSection from './ProfileSection';
import SkillForm from './forms/SkillForm';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Skill) => {
    dispatch(addSkill(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: Skill) => {
    dispatch(updateSkill({ skillId: id, skill: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this skill?')) {
      dispatch(deleteSkill(id));
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
case 'beginner': return 'junior';
case 'intermediate': return 'intermediate';
case 'advanced': return 'advanced';
case 'expert': return 'expert';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'intermediate':
        return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
      case 'advanced':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'expert':
        return 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

//Group skills by category
  const groupedSkills = skills.reduce((groups, skill) => {
const category = skill.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {} as Record<string, Skill[]>);

  return (
    <ProfileSection 
title="Skills"
      isEmpty={skills.length === 0 && !isAdding}
emptyMessage="Add your skills and show your professional capabilities"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <SkillForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{category}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div 
                    key={skill._id} 
                    className="bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:ring-indigo-500/20 transition-all duration-200"
                  >
                    {editingId === skill._id ? (
                      <SkillForm 
                        initialData={skill} 
                        onSave={(data) => handleUpdate(skill._id!, data)} 
                        onCancel={() => setEditingId(null)} 
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{skill.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium mt-1 ${getLevelColor(skill.level)}`}>
                              {getLevelText(skill.level)}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingId(skill._id!)}
                              className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id!)}
                              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {skill.endorsements > 0 && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                            </svg>
{skill.endorsements} endorsements
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
Add more skills
            </button>
          </div>
        </div>
      )}
    </ProfileSection>
  );
};

export default SkillsSection;
```
## 17. Skill form component (frontend/src/components/profile/forms/SkillForm.tsx)
```typescript
import React, { useState } from 'react';
import { Skill } from '../../../types/profile';

interface SkillFormProps {
  initialData?: Skill;
  onSave: (data: Skill) => void;
  onCancel: () => void;
}

const defaultSkill: Skill = {
  name: '',
  level: 'intermediate',
  endorsements: 0,
category: 'Technical skills'
};

//Predefined skill categories
const SKILL_CATEGORIES = [
'technical skills',
'soft skills',
'Language skills',
'Design skills',
'Management skills',
'Sales skills',
'Marketing',
'other'
];

const SkillForm: React.FC<SkillFormProps> = ({ initialData = defaultSkill, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Skill>(initialData);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(!SKILL_CATEGORIES.includes(initialData.category));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomCategory(true);
setFormData((prev) => ({ ...prev, category: customCategory || 'Other' }));
    } else {
      setIsCustomCategory(false);
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCategory(value);
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Skill name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Proficiency *
        </label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        >
<option value="beginner">Junior</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>
<option value="expert">Expert</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Skill classification *
        </label>
        <select
          id="category"
          name="category"
          value={isCustomCategory ? 'custom' : formData.category}
          onChange={handleCategoryChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        >
          {SKILL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
<option value="custom">Custom...</option>
        </select>
      </div>
      
      {isCustomCategory && (
        <div>
          <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Custom classification *
          </label>
          <input
            type="text"
            id="customCategory"
            value={customCategory}
            onChange={handleCustomCategoryChange}
            required
placeholder="Enter custom skill category"
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      )}
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default SkillForm;
```
## 18. Certificate block component (frontend/src/components/profile/CertificationsSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCertification, updateCertification, deleteCertification } from '../../redux/slices/profileSlice';
import { Certification } from '../../types/profile';
import ProfileSection from './ProfileSection';
import CertificationForm from './forms/CertificationForm';

interface CertificationsSectionProps {
  certifications: Certification[];
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Certification) => {
    dispatch(addCertification(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: Certification) => {
    dispatch(updateCertification({ certificationId: id, certification: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this certificate?')) {
      dispatch(deleteCertification(id));
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
  };
  
// Sort by date of issue, with the most recent first.
  const sortedCertifications = [...certifications].sort((a, b) => {
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  return (
    <ProfileSection 
title="Certificate"
      isEmpty={certifications.length === 0 && !isAdding}
emptyMessage="Add your professional certificates to enhance your professional credibility"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <CertificationForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCertifications.map((certification) => (
            <div 
              key={certification._id} 
              className={`bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-5 ring-2 ring-gray-900/5 dark:ring-gray-100/5 ${
                editingId === certification._id ? 'ring-indigo-500' : ''
              }`}
            >
              {editingId === certification._id ? (
                <CertificationForm 
                  initialData={certification} 
                  onSave={(data) => handleUpdate(certification._id!, data)} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{certification.name}</h3>
<p className="text-gray-700 dark:text-gray-300">Issuing authority: {certification.issuer}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(certification._id!)}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(certification._id!)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
Certification date: {formatDate(certification.issueDate)}
                    </span>
                    {certification.expirationDate && (
                      <span className="text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
Expiration date: {formatDate(certification.expirationDate)}
                      </span>
                    )}
                  </div>
                  
                  {certification.credentialId && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
Certificate ID: {certification.credentialId}
                    </p>
                  )}
                  
                  {certification.credentialUrl && (
                    <div className="pt-2">
                      <a 
                        href={certification.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
View certificate
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default CertificationsSection;
```
## 19. Certificate form component (frontend/src/components/profile/forms/CertificationForm.tsx)
```typescript
import React, { useState } from 'react';
import { Certification } from '../../../types/profile';

interface CertificationFormProps {
  initialData?: Certification;
  onSave: (data: Certification) => void;
  onCancel: () => void;
}

const defaultCertification: Certification = {
  name: '',
  issuer: '',
  issueDate: '',
  expirationDate: '',
  credentialId: '',
  credentialUrl: ''
};

const CertificationForm: React.FC<CertificationFormProps> = ({ initialData = defaultCertification, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Certification>({
    ...initialData,
    issueDate: initialData.issueDate 
      ? typeof initialData.issueDate === 'string' 
        ? initialData.issueDate.substring(0, 10) 
        : new Date(initialData.issueDate).toISOString().substring(0, 10)
      : '',
    expirationDate: initialData.expirationDate 
      ? typeof initialData.expirationDate === 'string' 
        ? initialData.expirationDate.substring(0, 10) 
        : new Date(initialData.expirationDate).toISOString().substring(0, 10)
      : ''
  });
  const [noExpiration, setNoExpiration] = useState(!initialData.expirationDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
// If no expiration date is selected, clear the expiration date
    const dataToSave = {
      ...formData,
      expirationDate: noExpiration ? null : formData.expirationDate
    };
    
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Certificate name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Issuing authority *
        </label>
        <input
          type="text"
          id="issuer"
          name="issuer"
          value={formData.issuer}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Date of issue *
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate as string}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Date of Expiry
          </label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate as string}
            onChange={handleChange}
            disabled={noExpiration}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="noExpiration"
          checked={noExpiration}
          onChange={(e) => setNoExpiration(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="noExpiration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
This certificate has no expiration date
        </label>
      </div>
      
      <div>
        <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Certificate ID
        </label>
        <input
          type="text"
          id="credentialId"
          name="credentialId"
          value={formData.credentialId}
          onChange={handleChange}
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Certificate link
        </label>
        <input
          type="url"
          id="credentialUrl"
          name="credentialUrl"
          value={formData.credentialUrl}
          onChange={handleChange}
          placeholder="https://"
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default CertificationForm;
```
## 20. Project experience block component (frontend/src/components/profile/ProjectsSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProject, updateProject, deleteProject } from '../../redux/slices/profileSlice';
import { Project } from '../../types/profile';
import ProfileSection from './ProfileSection';
import ProjectForm from './forms/ProjectForm';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Project) => {
    dispatch(addProject(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: Project) => {
    dispatch(updateProject({ projectId: id, project: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteProject(id));
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
  };
  
// Sort by start date, most recent projects first
  const sortedProjects = [...projects].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <ProfileSection 
title="Project Experience"
      isEmpty={projects.length === 0 && !isAdding}
emptyMessage="Add your project experience and show your actual work results"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <ProjectForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="space-y-6">
          {sortedProjects.map((project) => (
            <div 
              key={project._id} 
              className={`bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-5 ring-2 ring-gray-900/5 dark:ring-gray-100/5 ${
                editingId === project._id ? 'ring-indigo-500' : ''
              }`}
            >
              {editingId === project._id ? (
                <ProjectForm 
                  initialData={project} 
                  onSave={(data) => handleUpdate(project._id!, data)} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-sm mt-1">
                        <span className="text-gray-500 dark:text-gray-400">
{formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(project._id!)}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(project._id!)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {project.url && (
                    <div className="pt-2">
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
View items
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default ProjectsSection;
```
## 21. Project form component (frontend/src/components/profile/forms/ProjectForm.tsx)
```typescript
import React, { useState } from 'react';
import { Project } from '../../../types/profile';

interface ProjectFormProps {
  initialData?: Project;
  onSave: (data: Project) => void;
  onCancel: () => void;
}

const defaultProject: Project = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  url: '',
  technologies: []
};

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData = defaultProject, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Project>({
    ...initialData,
    startDate: initialData.startDate 
      ? typeof initialData.startDate === 'string' 
        ? initialData.startDate.substring(0, 10) 
        : new Date(initialData.startDate).toISOString().substring(0, 10)
      : '',
    endDate: initialData.endDate 
      ? typeof initialData.endDate === 'string' 
        ? initialData.endDate.substring(0, 10) 
        : new Date(initialData.endDate).toISOString().substring(0, 10)
      : ''
  });
  const [currentProject, setCurrentProject] = useState(!initialData.endDate);
  const [newTech, setNewTech] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTech = () => {
    if (newTech.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
// If the current project is selected, clear the end date
    const dataToSave = {
      ...formData,
      endDate: currentProject ? null : formData.endDate
    };
    
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Project name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
start date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate as string}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
end date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate as string}
            onChange={handleChange}
            disabled={currentProject}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="currentProject"
          checked={currentProject}
          onChange={(e) => setCurrentProject(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="currentProject" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
I'm currently working on this project
        </label>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Project link
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://"
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Technology used
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
placeholder="Add technology stack"
              className="flex-grow h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
Add to
            </button>
          </div>
          
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(index)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
```
## 22. Language capability section component (frontend/src/components/profile/LanguagesSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLanguage, updateLanguage, deleteLanguage } from '../../redux/slices/profileSlice';
import { Language } from '../../types/profile';
import ProfileSection from './ProfileSection';
import LanguageForm from './forms/LanguageForm';

interface LanguagesSectionProps {
  languages: Language[];
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Language) => {
    dispatch(addLanguage(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: Language) => {
    dispatch(updateLanguage({ languageId: id, language: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this language capability?')) {
      dispatch(deleteLanguage(id));
    }
  };

  const getProficiencyText = (proficiency: string) => {
    switch (proficiency) {
case 'beginner': return 'junior';
case 'intermediate': return 'intermediate';
case 'advanced': return 'advanced';
case 'native': return 'native';
      default: return proficiency;
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'beginner':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'intermediate':
        return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
      case 'advanced':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'native':
        return 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

// Sort by proficiency, native language/advanced first
  const sortedLanguages = [...languages].sort((a, b) => {
    const order = { native: 4, advanced: 3, intermediate: 2, beginner: 1 };
    return (order[b.proficiency as keyof typeof order] || 0) - (order[a.proficiency as keyof typeof order] || 0);
  });

  return (
    <ProfileSection 
title="Language ability"
      isEmpty={languages.length === 0 && !isAdding}
emptyMessage="Add your language skills and show your communication advantages"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <LanguageForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedLanguages.map((language) => (
            <div 
              key={language._id} 
              className={`bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-4 ring-2 ring-gray-900/5 dark:ring-gray-100/5 ${
                editingId === language._id ? 'ring-indigo-500' : ''
              }`}
            >
              {editingId === language._id ? (
                <LanguageForm 
                  initialData={language} 
                  onSave={(data) => handleUpdate(language._id!, data)} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{language.language}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium mt-1 ${getProficiencyColor(language.proficiency)}`}>
                      {getProficiencyText(language.proficiency)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(language._id!)}
                      className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(language._id!)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default LanguagesSection;
```
## 23. Language capability form component (frontend/src/components/profile/forms/LanguageForm.tsx)
```typescript
import React, { useState } from 'react';
import { Language } from '../../../types/profile';

interface LanguageFormProps {
  initialData?: Language;
  onSave: (data: Language) => void;
  onCancel: () => void;
}

const defaultLanguage: Language = {
  language: '',
  proficiency: 'intermediate'
};

//Predefined common languages
const COMMON_LANGUAGES = [
'Chinese',
'English',
'Japanese',
'Korean',
'French',
'German',
'Spanish',
'Russian',
'Arabic',
'Portuguese',
'Italian',
'other'
];

const LanguageForm: React.FC<LanguageFormProps> = ({ initialData = defaultLanguage, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Language>(initialData);
  const [customLanguage, setCustomLanguage] = useState('');
  const [isCustomLanguage, setIsCustomLanguage] = useState(!COMMON_LANGUAGES.includes(initialData.language));

  const handleProficiencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, proficiency: e.target.value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustomLanguage(true);
      setFormData((prev) => ({ ...prev, language: customLanguage }));
    } else {
      setIsCustomLanguage(false);
      setFormData((prev) => ({ ...prev, language: value }));
    }
  };

  const handleCustomLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomLanguage(value);
    setFormData((prev) => ({ ...prev, language: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
language *
        </label>
        <select
          id="language"
          value={isCustomLanguage ? 'custom' : formData.language}
          onChange={handleLanguageChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        >
<option value="">Select language</option>
          {COMMON_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
<option value="custom">Other languages...</option>
        </select>
      </div>
      
      {isCustomLanguage && (
        <div>
          <label htmlFor="customLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Other languages ​​*
          </label>
          <input
            type="text"
            id="customLanguage"
            value={customLanguage}
            onChange={handleCustomLanguageChange}
            required
placeholder="Enter language name"
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
      )}
      
      <div>
        <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Proficiency *
        </label>
        <select
          id="proficiency"
          value={formData.proficiency}
          onChange={handleProficiencyChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        >
<option value="beginner">Junior</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>
<option value="native">Native language</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default LanguageForm;
```
## 24. Volunteer experience block component (frontend/src/components/profile/VolunteerSection.tsx)
```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addVolunteerExperience, updateVolunteerExperience, deleteVolunteerExperience } from '../../redux/slices/profileSlice';
import { VolunteerExperience } from '../../types/profile';
import ProfileSection from './ProfileSection';
import VolunteerForm from './forms/VolunteerForm';

interface VolunteerSectionProps {
  volunteerExperiences: VolunteerExperience[];
}

const VolunteerSection: React.FC<VolunteerSectionProps> = ({ volunteerExperiences }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: VolunteerExperience) => {
    dispatch(addVolunteerExperience(data));
    setIsAdding(false);
  };

  const handleUpdate = (id: string, data: VolunteerExperience) => {
    dispatch(updateVolunteerExperience({ experienceId: id, experience: data }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
if (window.confirm('Are you sure you want to delete this volunteer experience?')) {
      dispatch(deleteVolunteerExperience(id));
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
  };

// Sort by start date, most recent first
  const sortedExperiences = [...volunteerExperiences].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <ProfileSection 
title="Volunteer Experience"
      isEmpty={volunteerExperiences.length === 0 && !isAdding}
emptyMessage="Add your volunteer service experience to show your sense of social responsibility"
      onAddNew={() => setIsAdding(true)}
    >
      {isAdding ? (
        <VolunteerForm 
          onSave={handleAdd} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="space-y-6">
          {sortedExperiences.map((experience) => (
            <div 
              key={experience._id} 
              className={`bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-5 ring-2 ring-gray-900/5 dark:ring-gray-100/5 ${
                editingId === experience._id ? 'ring-indigo-500' : ''
              }`}
            >
              {editingId === experience._id ? (
                <VolunteerForm 
                  initialData={experience} 
                  onSave={(data) => handleUpdate(experience._id!, data)} 
                  onCancel={() => setEditingId(null)} 
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{experience.role}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{experience.organization}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(experience._id!)}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(experience._id!)}
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
{formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{experience.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
};

export default VolunteerSection;
```
## 25. Volunteer experience form component (frontend/src/components/profile/forms/VolunteerForm.tsx)
```typescript
import React, { useState } from 'react';
import { VolunteerExperience } from '../../../types/profile';

interface VolunteerFormProps {
  initialData?: VolunteerExperience;
  onSave: (data: VolunteerExperience) => void;
  onCancel: () => void;
}

const defaultVolunteerExperience: VolunteerExperience = {
  organization: '',
  role: '',
  startDate: '',
  endDate: '',
  description: ''
};

const VolunteerForm: React.FC<VolunteerFormProps> = ({ initialData = defaultVolunteerExperience, onSave, onCancel }) => {
  const [formData, setFormData] = useState<VolunteerExperience>({
    ...initialData,
    startDate: initialData.startDate 
      ? typeof initialData.startDate === 'string' 
        ? initialData.startDate.substring(0, 10) 
        : new Date(initialData.startDate).toISOString().substring(0, 10)
      : '',
    endDate: initialData.endDate 
      ? typeof initialData.endDate === 'string' 
        ? initialData.endDate.substring(0, 10) 
        : new Date(initialData.endDate).toISOString().substring(0, 10)
      : ''
  });
  const [currentVolunteer, setCurrentVolunteer] = useState(!initialData.endDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
// If you select the current volunteer job, clear the end date
    const dataToSave = {
      ...formData,
      endDate: currentVolunteer ? null : formData.endDate
    };
    
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Organization name *
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
Role *
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
start date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate as string}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
end date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate as string}
            onChange={handleChange}
            disabled={currentVolunteer}
            className="w-full h-11 px-4 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="currentVolunteer"
          checked={currentVolunteer}
          onChange={(e) => setCurrentVolunteer(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="currentVolunteer" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
I am still organizing volunteer services here
        </label>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
describe
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
        >
Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
        >
keep
        </button>
      </div>
    </form>
  );
};

export default VolunteerForm;
```
## 26. Implementation Checklist

Implementation checklist:
1. Create the frontend/src/components/profile directory
2. Create the frontend/src/components/profile/forms directory
3. Create a TypeScript type definition file: frontend/src/types/profile.ts
4. Create Redux Slice: frontend/src/redux/slices/profileSlice.ts
5. Create API service: frontend/src/services/profileService.ts
6. Create page entry: frontend/src/pages/profile/index.tsx
7. Create the ProfilePage main component: frontend/src/components/profile/ProfilePage.tsx
8. Create ProfileCompleteness component: frontend/src/components/profile/ProfileCompleteness.tsx
9. Create ProfileHeader component: frontend/src/components/profile/ProfileHeader.tsx
10. Create ProfileSidebar component: frontend/src/components/profile/ProfileSidebar.tsx
11. Create the general block component ProfileSection: frontend/src/components/profile/ProfileSection.tsx
12. Create education experience block component: frontend/src/components/profile/EducationSection.tsx
13. Create education experience form component: frontend/src/components/profile/forms/EducationForm.tsx
14. Create the work experience section component: frontend/src/components/profile/WorkExperienceSection.tsx
15. Create work experience form component: frontend/src/components/profile/forms/WorkExperienceForm.tsx
16. Create skills section component: frontend/src/components/profile/SkillsSection.tsx
17. Create skill form component: frontend/src/components/profile/forms/SkillForm.tsx
18. Create certificate block component: frontend/src/components/profile/CertificationsSection.tsx
19. Create certificate form component: frontend/src/components/profile/forms/CertificationForm.tsx
20. Create project experience block component: frontend/src/components/profile/ProjectsSection.tsx
21. Create project form component: frontend/src/components/profile/forms/ProjectForm.tsx
22. Create language capability section component: frontend/src/components/profile/LanguagesSection.tsx
23. Create language capability form component: frontend/src/components/profile/forms/LanguageForm.tsx
24. Create the volunteer experience block component: frontend/src/components/profile/VolunteerSection.tsx
25. Create volunteer experience form component: frontend/src/components/profile/forms/VolunteerForm.tsx
26. Register profileSlice in Redux store
27. Configure routing and map the /profile path to ProfilePage
28. Update the navigation menu and add user profile entry
29. Test the overall functional process
