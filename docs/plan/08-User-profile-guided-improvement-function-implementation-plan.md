[Mode:Plan][Model:Claude 3.7 Sonnet]

# User profile guided improvement function implementation technical specifications

## 1. Overview

This plan aims to improve the user profile improvement process in the JobTrip career assistant project, changing the current "automatic creation of empty files" to "guided step-by-step improvement" to enhance the user experience. After implementation, when a user accesses their personal profile for the first time, the system will guide the user to fill in the various parts of the profile in a certain order, rather than directly creating an empty profile.

## 2. System architecture changes

### 2.1 Backend controller modification

The user profile controller needs to be modified so that it no longer automatically creates an empty profile when the user profile does not exist, but instead returns a specific status code to allow the front end to display the boot process.

### 2.2 Front-end component extension

Add guided step components to realize the process of gradually improving user profiles, including:
- Main boot component (ProfileWizard)
- Step display and navigation components
- Form components required for each step

## 3. Backend modification details

### 3.1 Modify user profile controller (`backend/src/controllers/userProfileController.ts`)
```typescript
/**
* @desc Get the current user's profile
 * @route   GET /api/v1/user-profiles/me
* @access private
 */
export const getCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

// If the user profile does not exist, return a 404 status code instead of creating a new profile
    if (!userProfile) {
      return res.status(404).json(createApiResponse(
        404,
'User file does not exist',
        { profileExists: false }
      ));
    }

    res.status(200).json(createApiResponse(
      200,
'Get user profile successfully',
      userProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
* @desc Create user profile (new API)
 * @route   POST /api/v1/user-profiles/me
* @access private
 */
export const createUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
// Check if user profile already exists
    const existingProfile = await UserProfile.findOne({ userId: req.user?._id });
    
    if (existingProfile) {
      return res.status(400).json(createApiResponse(
        400,
'User file already exists',
        { profileExists: true }
      ));
    }
    
//Create new user profile
    const newUserProfile = await UserProfile.create({
      userId: req.user?._id,
      ...req.body,
profileCompleteness: 0 //Initial completeness is 0
    });

    res.status(201).json(createApiResponse(
      201,
'User profile created successfully',
      newUserProfile
    ));
  } catch (error) {
    next(error);
  }
};

/**
* @desc Update the current user's profile
 * @route   PUT /api/v1/user-profiles/me
* @access private
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });

    if (!userProfile) {
      return res.status(404).json(createApiResponse(
        404,
'User profile does not exist, please create a profile first',
        { profileExists: false }
      ));
    }

//Update user profile
// Do not allow changes to the userId field
    const { userId, ...updateData } = req.body;

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      updateData,
      { new: true, runValidators: true }
    );

// Calculate the updated file integrity
    const profileCompleteness = calculateProfileCompleteness(updatedProfile);
    updatedProfile.profileCompleteness = profileCompleteness;
    await updatedProfile.save();

    res.status(200).json(createApiResponse(
      200,
'User profile updated successfully',
      updatedProfile
    ));
  } catch (error) {
    next(error);
  }
};

//Add file integrity calculation function
const calculateProfileCompleteness = (profile) => {
  if (!profile) return 0;
  
  let completedSections = 0;
let totalSections = 8; //Basic information, education, work, skills, certificates, projects, languages, honors and awards
  
//Basic information (title, photo, introduction)
  if (profile.headline && profile.photo && profile.biography) completedSections++;
  
// contact information
  if (profile.contactInfo && (profile.contactInfo.email || profile.contactInfo.phone)) completedSections++;
  
//Other parts
  if (profile.educations && profile.educations.length > 0) completedSections++;
  if (profile.workExperiences && profile.workExperiences.length > 0) completedSections++;
  if (profile.skills && profile.skills.length > 0) completedSections++;
  if (profile.certifications && profile.certifications.length > 0) completedSections++;
  if (profile.projects && profile.projects.length > 0) completedSections++;
  if (profile.languages && profile.languages.length > 0) completedSections++;
  if (profile.honorsAwards && profile.honorsAwards.length > 0) completedSections++;
  
  return Math.round((completedSections / totalSections) * 100);
};
```
### 3.2 Modify user profile routes (`backend/src/routes/userProfileRoutes.ts`)

Add new create profile route:
```typescript
//Add route to create user profile
router.post('/me', auth, userProfileController.createUserProfile);
```
## 4. Front-end modification details

### 4.1 Add new Profile Wizard component (`frontend/src/components/profile/wizard/`)

#### 4.1.1 Main wizard component (`ProfileWizard.tsx`)
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { createUserProfile } from '../../../redux/slices/profileSlice';
import WizardSteps from './WizardSteps';
import WizardNavigation from './WizardNavigation';
import BasicInfoStep from './steps/BasicInfoStep';
import ContactInfoStep from './steps/ContactInfoStep';
import EducationStep from './steps/EducationStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import SkillsStep from './steps/SkillsStep';
import CertificationsStep from './steps/CertificationsStep';
import ProjectsStep from './steps/ProjectsStep';
import LanguagesStep from './steps/LanguagesStep';
import HonorsAwardsStep from './steps/HonorsAwardsStep';
import SummaryStep from './steps/SummaryStep';

const ProfileWizard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    headline: '',
    photo: '',
    biography: '',
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      address: '',
      socialMedia: {
        linkedin: '',
        github: '',
        twitter: ''
      }
    },
    educations: [],
    workExperiences: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    honorsAwards: []
  });
  
  const steps = [
{ title: 'Basic information', description: 'Add your professional title, photo and introduction' },
{ title: 'Contact information', description: 'Fill in your contact information' },
{ title: 'Education Experience', description: 'Add your academic information' },
{ title: 'Work experience', description: 'Add your work experience' },
{ title: 'Professional skills', description: 'Add your professional skills' },
{ title: 'Certificate Qualification', description: 'Add your professional certificate' },
{ title: 'Project experience', description: 'Add your project experience' },
{ title: 'Language skills', description: 'Add your language skills' },
{ title: 'Honorary Awards', description: 'Add the awards and honors you have received' },
{ title: 'Complete creation', description: 'Submit and create your profile' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleUpdateData = (stepData) => {
    setProfileData({
      ...profileData,
      ...stepData
    });
  };

  const handleFinish = async () => {
//Create user profile
    try {
      await dispatch(createUserProfile(profileData)).unwrap();
      navigate('/profile');
    } catch (error) {
console.error('Failed to create user profile:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
        />;
      case 1:
        return <ContactInfoStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
        />;
      case 2:
        return <EducationStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 3:
        return <WorkExperienceStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 4:
        return <SkillsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 5:
        return <CertificationsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 6:
        return <ProjectsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 7:
        return <LanguagesStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 8:
        return <HonorsAwardsStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />;
      case 9:
        return <SummaryStep 
          data={profileData}
          onFinish={handleFinish}
          onPrevious={handlePrevious}
        />;
      default:
        return <BasicInfoStep 
          data={profileData} 
          onUpdate={handleUpdateData}
          onNext={handleNext} 
        />;
    }
  };

  return (
    <div className="container-lg mx-auto px-4 py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5 p-6">
<h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Create your profile</h1>
        
        <WizardSteps steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {renderStep()}
        </div>
        
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          isLastStep={currentStep === steps.length - 1}
          onFinish={handleFinish}
        />
      </div>
    </div>
  );
};

export default ProfileWizard;
```
#### 4.1.2 Step navigation components (`WizardSteps.tsx` and `WizardNavigation.tsx`)

The specific code is omitted here, but it needs to be implemented:
- Step display and progress indication
- Previous/Next/Skip/Finish buttons

#### 4.1.3 Form components for each step

The following steps form components need to be created:
- `BasicInfoStep.tsx` - basic information (title, name, introduction)
- `ContactInfoStep.tsx` - Contact details
- `EducationStep.tsx` - Education experience
- `WorkExperienceStep.tsx` - work experience
- `SkillsStep.tsx` - Professional skills
- `CertificationsStep.tsx` - Certificate qualifications
- `ProjectsStep.tsx` - project experience
- `LanguagesStep.tsx` - Language skills
- `HonorsAwardsStep.tsx` - Honor Awards
- `SummaryStep.tsx` - final confirmation

### 4.2 Modify the profile page component (`frontend/src/pages/profile/index.tsx`)
```typescript
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchUserProfile } from '../../redux/slices/profileSlice';
import ProfilePage from '../../components/profile/ProfilePage';
import ProfileWizard from '../../components/profile/wizard/ProfileWizard';
import { RootState } from '../../redux/store';

const ProfilePageContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, error, profileNotFound } = useAppSelector((state: RootState) => state.profile);
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && !profileNotFound) {
    return (
      <div className="container-lg mx-auto px-4 py-8">
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

// If the file does not exist, display the wizard component
  if (profileNotFound) {
    return <ProfileWizard />;
  }

// Otherwise, display the normal file page
  return <ProfilePage profile={profile} />;
};

export default ProfilePageContainer;
```
### 4.3 Update Redux Slice (`frontend/src/redux/slices/profileSlice.ts`)
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, UserProfile, Education, WorkExperience, Skill, Certification, Project, Language, VolunteerExperience, HonorAward, Recommendation } from '../../types/profile';
import profileService from '../../services/profileService';

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  profileNotFound: false,
  activeSection: 'basic',
  editMode: false,
  currentEditItem: null
};

// Asynchronous thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile();
      return response;
    } catch (error: any) {
// Check if it is a 404 error (the file does not exist)
      if (error.status === 404) {
return rejectWithValue({ message: 'User profile does not exist', notFound: true });
      }
return rejectWithValue({ message: 'Failed to obtain user profile', notFound: false });
    }
  }
);

//Add a thunk to create user files
export const createUserProfile = createAsyncThunk(
  'profile/createUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await profileService.createUserProfile(profileData);
      return response;
    } catch (error) {
return rejectWithValue('Failed to create user profile');
    }
  }
);

// Other thunks and reducers remain unchanged...

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
//Keep existing reducers...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.profileNotFound = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
        state.profileNotFound = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
state.error = action.payload?.message || 'Failed to obtain user profile';
        state.profileNotFound = action.payload?.notFound || false;
      })
      .addCase(createUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
        state.profileNotFound = false;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
//Other cases remain unchanged...
  }
});

export default profileSlice.reducer;
```
### 4.4 Update Profile Service (`frontend/src/services/profileService.ts`)
```typescript
import api from './api';
import { UserProfile, Education, WorkExperience, Skill, Certification, Project, Language, VolunteerExperience, HonorAward, Recommendation } from '../types/profile';

const API_PATH = 'user-profiles';

// Get the current user's profile
const getUserProfile = async (): Promise<UserProfile> => {
  return api.get<UserProfile>(`${API_PATH}/me`);
};

// New: Create user profile
const createUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  return api.post<UserProfile>(`${API_PATH}/me`, profileData);
};

//Update the current user's profile
const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  return api.put<UserProfile>(`${API_PATH}/me`, profileData);
};

// Other methods remain the same...

export default {
  getUserProfile,
createUserProfile, // New
  updateUserProfile,
// Other methods...
};
```
### 4.5 Update Profile Types (`frontend/src/types/profile.ts`)
```typescript
// Some types are used for state management
export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
profileNotFound: boolean; // Add new field
  activeSection: string;
  editMode: boolean;
  currentEditItem: any | null;
}
```
## 5. Implementation Checklist

1. [Backend] Modify the `getCurrentUserProfile` method in `userProfileController.ts` and delete the code that automatically creates empty files
2. [Backend] Add new `createUserProfile` method to `userProfileController.ts`
3. [Backend] Modify the `updateUserProfile` method to no longer automatically create files
4. [Backend] Add `calculateProfileCompleteness` auxiliary function
5. [Backend] Update `userProfileRoutes.ts` to add new create profile route
6. [Front-end] Create the `frontend/src/components/profile/wizard/` directory
7. [Front-end] Implement `ProfileWizard.tsx` main wizard component
8. [Front-end] Implement `WizardSteps.tsx` step display component
9. [Front-end] Implement `WizardNavigation.tsx` navigation component
10. [Front-end] Create basic information step component `BasicInfoStep.tsx`
11. [Front-end] Create the contact step component `ContactInfoStep.tsx`
12. [Front-end] Create educational experience step component `EducationStep.tsx`
13. [Front-end] Create work experience step component `WorkExperienceStep.tsx`
14. [Front-end] Create professional skills step component `SkillsStep.tsx`
15. [Front-end] Create certificate qualification step component `CertificationsStep.tsx`
16. [Front-end] Create project step component `ProjectsStep.tsx`
17. [Front-end] Create language ability step component `LanguagesStep.tsx`
18. [Front-end] Create honors award step component `HonorsAwardsStep.tsx`
19. [Front-end] Create summary step component `SummaryStep.tsx`
20. [Front-end] Modify `profileSlice.ts` to add `profileNotFound` status and `createUserProfile` thunk
21. [Front-end] Modify `profileService.ts` and add `createUserProfile` method
22. [Front-end] Update `profile/index.tsx` page component and add wizard component conditional rendering
23. [Front-end] Update `types/profile.ts` to add `profileNotFound` field to `ProfileState` interface
24. [Test] Test the onboarding experience when users access their profile for the first time
25. [Test] Test the filling and saving of data in each step of the form
26. [Test] Test the completion of the entire boot process and file creation

# User profile guided improvement function implementation progress

## Backend modification

- [x] Modify the `getCurrentUserProfile` method in `userProfileController.ts` and delete the code that automatically creates empty files
- [x] Add new `createUserProfile` method to `userProfileController.ts`
- [x] Modify the `updateUserProfile` method to no longer automatically create files
- [x] Add `calculateProfileCompleteness` helper function
- [x] Update `userProfileRoutes.ts` to add new create profile route

## Front-end modification

### Component directory structure

- [x] Create `frontend/src/components/profile/wizard/` directory

### Main components

- [x] Implement `ProfileWizard.tsx` main wizard component
- [x] Implement `WizardSteps.tsx` step display component
- [x] Implement `WizardNavigation.tsx` navigation component

### Step component

- [x] Create basic information step component `BasicInfoStep.tsx`
- [x] Create contact step component `ContactInfoStep.tsx`
- [x] Create educational experience step component `EducationStep.tsx`
- [ ] Create work experience step component `WorkExperienceStep.tsx`
- [ ] Create professional skills step component `SkillsStep.tsx`
- [ ] Create certificate qualification step component `CertificationsStep.tsx`
- [ ] Create project step component `ProjectsStep.tsx`
- [ ] Create language proficiency step component `LanguagesStep.tsx`
- [ ] Create honors award step component `HonorsAwardsStep.tsx`
- [x] Create summary step component `SummaryStep.tsx`

### Status management and service modification

- [x] Modify `profileSlice.ts` to add `profileNotFound` status and `createUserProfile` thunk
- [x] Modify `profileService.ts` to add `createUserProfile` method
- [x] Update `profile/index.tsx` page component and add conditional rendering of wizard component
- [x] Update `types/profile.ts` to add `profileNotFound` field to `ProfileState` interface

## Test

- [ ] Test the onboarding experience when users access their profile for the first time
- [ ] Test the data filling and saving of each step form
- [ ] Test the completion of the entire boot process and archive creation

## Known issues

- When the user profile does not exist, "Failed to obtain user profile" is displayed, but does not automatically switch to the wizard interface. The step rendering logic of the ProfileWizard component has been fixed, solving the problem that the page cannot load the boot process normally.
- The wizard steps are currently simplified and only include basic information, contact information, educational experience and summary steps. They will be added after other step components are implemented.

## Current fixes

- [x] Add console logs to API error handling, paying special attention to the 404 error handling process
- [x] Added verbose logging in Redux Thunk to ensure profileNotFound flag is set correctly
- [x] Add logging and error handling in the Profile page component to enhance the rendering reliability of the ProfileWizard component
- [x] Add error capture logic for ProfileWizard component rendering to avoid page crashes

## Next steps

1. Check the console log to find out the root cause of why profileNotFound did not trigger the wizard process correctly.
2. Fixed the type error in component import ("Module not found..."), which may affect the correct rendering of the component.
3. Make sure the page transitions correctly from error state to wizard view
4. Implement the remaining step components (work experience, skills, certificates, etc.)
5. Complete comprehensive process testing