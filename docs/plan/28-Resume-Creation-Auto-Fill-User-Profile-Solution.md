[Mode:Plan][Model:Claude 3.7 Sonnet]

# Resume creation auto-fill user profile solution (revised version)

## 1. Requirements Overview

When creating a new resume, information is automatically obtained from the user's profile database to populate the form, reducing repeated entry while retaining the user's ability to edit the auto-populated information.

## 2. Technical solution

### 2.1 Using existing user profile service

There is already a user profile service in the project, we will use the existing profileService:

**File path:** `/frontend/src/services/profileService.ts`

The service already contains the required methods:
```typescript
// Get the current user's profile
const getUserProfile = async (): Promise<UserProfile> => {
  return api.get<UserProfile>(`${API_PATH}/me`);
};
```
### 2.2 Using existing type definitions

The project already has a profile type defined, the existing type will be used:

**File path:** `/frontend/src/types/profile.ts`

The complete UserProfile interface definition is included.

### 2.3 Using existing date utility functions

The project already has a date utility function, the existing function will be used:

**File path:** `/frontend/src/utils/dateUtils.ts`
```typescript
// Will use the existing formatDateForInput function instead of creating a new formatDate function
export const formatDateForInput = (dateValue: string | Date | undefined | null): string => {
  if (!dateValue) return '';
  
  try {
// Process ISO date string (for example: 2015-09-01T00:00:00.000+00:00)
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
return date.toISOString().split('T')[0]; // Return the YYYY-MM-DD part
  } catch (error) {
console.error('Date formatting error:', error);
    return '';
  }
};
```
### 2.4 Create archive data mapping tool

**File path:** `/frontend/src/utils/profileToResumeMapper.ts`
```typescript
import { UserProfile } from '@/types/profile';
import { formatDateForInput } from '@/utils/dateUtils';

/**
* Map user profile data to resume form data
* @param profile user profile
* @returns mapping data required by the resume form
 */
export const mapProfileToResume = (profile: UserProfile) => {
//Personal information mapping
  const personalInfo = {
    fullName: profile.firstName && profile.lastName 
      ? `${profile.firstName} ${profile.lastName}` 
      : profile.firstName || profile.lastName || '',
    email: profile.contactInfo?.email || '',
    phone: profile.contactInfo?.phone || '',
    location: profile.contactInfo?.address || ''
  };

// Education background mapping
  const educations = profile.educations?.map(edu => ({
    education: edu.degree || '',
    school: edu.institution || '',
    major: edu.field || '',
    startDate: formatDateForInput(edu.startDate),
    endDate: formatDateForInput(edu.endDate)
  })) || [];

// If there is no education experience, add an empty record
  if (educations.length === 0) {
    educations.push({
      education: '',
      school: '',
      major: '',
      startDate: '',
      endDate: ''
    });
  }

// Work experience mapping
  const workExperiences = profile.workExperiences?.map(work => ({
    company: work.company || '',
    position: work.position || '',
    startDate: formatDateForInput(work.startDate),
    endDate: work.current ? '' : formatDateForInput(work.endDate),
    responsibilities: work.description || (work.achievements ? work.achievements.join('\n') : '')
  })) || [];

// If there is no work experience, add an empty record
  if (workExperiences.length === 0) {
    workExperiences.push({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    });
  }

//Skill mapping
  const skillsText = profile.skills?.map(skill => {
    const levelText = {
'beginner': 'Junior',
'intermediate': 'intermediate',
'advanced': 'Advanced',
'expert': 'expert'
    }[skill.level] || '';
    
    return `• ${skill.name}${levelText ? ` (${levelText})` : ''}`;
  }).join('\n') || '';

  return {
    personalInfo,
    educations,
    workExperiences,
    skillsText
  };
};
```
### 2.5 Modify the ResumeFormPage component

**File path:** `/frontend/src/pages/ResumeFormPage.tsx`

What needs to be modified:
```typescript
// add import
import profileService from '@/services/profileService';
import { mapProfileToResume } from '@/utils/profileToResumeMapper';
import { UserProfile } from '@/types/profile';
import { useTranslation } from 'react-i18next';

// Add user profile status to the component
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
const [profileError, setProfileError] = useState<string | null>(null);
const { t } = useTranslation('resume');

// Get user profile data when creating a new resume
useEffect(() => {
// Get user profile only in new resume mode
  if (!isEditMode && !baseId) {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        setProfileError(null);
        const profileData = await profileService.getUserProfile();
        setUserProfile(profileData);
        
// Map and populate the form using profile data
        if (profileData) {
          const { personalInfo, educations: mappedEducations, workExperiences: mappedWorkExperiences, skillsText } = mapProfileToResume(profileData);
          
//Set education background and work experience
          setEducations(mappedEducations);
          setWorkExperiences(mappedWorkExperiences);
          
// Use setTimeout to ensure that the DOM element already exists
          setTimeout(() => {
// Fill in personal information
            const fullNameElement = document.getElementById('fullName') as HTMLInputElement;
            const emailElement = document.getElementById('email') as HTMLInputElement;
            const phoneElement = document.getElementById('phone') as HTMLInputElement;
            const locationElement = document.getElementById('location') as HTMLInputElement;
            const skillsElement = document.getElementById('skills') as HTMLTextAreaElement;
            
            if (fullNameElement) fullNameElement.value = personalInfo.fullName;
            if (emailElement) emailElement.value = personalInfo.email;
            if (phoneElement) phoneElement.value = personalInfo.phone;
            if (locationElement) locationElement.value = personalInfo.location;
            if (skillsElement) skillsElement.value = skillsText;
          }, 100);
        }
      } catch (error) {
console.error('Failed to obtain user profile:', error);
setProfileError(t('profile_load_error', 'Unable to load user profile data, please refresh the page and try again'));
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }
}, [isEditMode, baseId, t]);

//Add UI display of loading status and error prompts
//Add in the appropriate position in the return section (after isLoading check)
{isLoadingProfile && <div className="text-center py-4">{t('loading_profile', 'Loading profile data...')}</div>}
{profileError && (
  <AlertMessage 
    open={!!profileError} 
    severity="error" 
    message={profileError} 
    onClose={() => setProfileError(null)} 
  />
)}
// Show prompt after file data has been loaded successfully
{userProfile && !isLoadingProfile && !profileError && !isEditMode && !baseId && (
  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl">
{t('profile_data_filled', 'Your profile information has been automatically filled, you can modify it as needed')}
  </div>
)}
```
### 2.6 Add internationalized strings

**File path:** `/frontend/public/locales/zh-CN/resume.json` (part)
```json
{
"loading_profile": "Loading profile data...",
"profile_load_error": "Unable to load user profile data, please refresh the page and try again",
"profile_data_filled": "Your profile information has been automatically filled, you can modify it as needed",
"no_profile_data": "Personal profile data not found, please fill it in manually"
}
```
## 3. Test plan

Test the following scenarios to ensure normal functionality:

1. Automatically fill in personal profile data when creating a new resume
2. Keep the original data when editing an existing resume
3. Users can freely modify the pre-populated data
4. When the file data is incomplete, the blank fields can be properly processed and displayed.
5. Error prompts for abnormal situations such as network errors

## 4. Front-end and back-end interface requirements

The backend needs to ensure that the following APIs are functioning properly:
```
GET /user-profiles/me
```
Returns the complete user profile data, with a structure matching the `UserProfile` type definition.

## 5. Implementation plan document

Create and save a planning document:

**File path:** `/docs/plan/resume-autofill-from-profile.md`

## Implementation Checklist:
1. ~~Use the existing profileService service~~ (existing)
2. ~~Use existing UserProfile type definition~~ (existing)
3. ~~Use the existing dateUtils tool function~~ (existing)
4. Create profileToResumeMapper.ts tool function
5. Modify the ResumeFormPage.tsx component to add data acquisition and filling logic
6. Add internationalized strings
7. Write tests and verify that functionality works properly
8. Ensure that the API interface is implemented correctly
9. Documentation new features
