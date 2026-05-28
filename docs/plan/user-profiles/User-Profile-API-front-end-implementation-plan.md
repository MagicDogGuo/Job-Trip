[Mode:Plan][Model:Claude 3.7 Sonnet]

# User profile API front-end implementation plan

## 1. Design profileService.ts

### 1.1 Basic settings and interface
- Define API base URL and request configuration
- Create basic error handling functions
- Design a unified response type interface

### 1.2 Basic User Profile API
- Get current user profile (GET `/user-profiles/me`)
- Update user profile (PUT `/user-profiles/me`)
- Delete user profile (DELETE `/user-profiles/me`)

### 1.3 Educational Experience API
- Add education (POST `/user-profiles/me/educations`)
- Update education experience (PUT `/user-profiles/me/educations/:id`)
- Delete education (DELETE `/user-profiles/me/educations/:id`)

### 1.4 Work Experience API
- Add work experience (POST `/user-profiles/me/work-experiences`)
- Update work experience (PUT `/user-profiles/me/work-experiences/:id`)
- Delete work experience (DELETE `/user-profiles/me/work-experiences/:id`)

### 1.5 Skill API
- Add skills (POST `/user-profiles/me/skills`)
- Update skills (PUT `/user-profiles/me/skills/:id`)
- Delete skills (DELETE `/user-profiles/me/skills/:id`)

### 1.6 Certificate API
- Add certificate (POST `/user-profiles/me/certifications`)
- Update certificate (PUT `/user-profiles/me/certifications/:id`)
- Delete certificate (DELETE `/user-profiles/me/certifications/:id`)

### 1.7 Project Experience API
- Add project (POST `/user-profiles/me/projects`)
- Update project (PUT `/user-profiles/me/projects/:id`)
- Delete project (DELETE `/user-profiles/me/projects/:id`)

### 1.8 Language Capability API
- Add languages (POST `/user-profiles/me/languages`)
- Update languages (PUT `/user-profiles/me/languages/:id`)
- Delete language (DELETE `/user-profiles/me/languages/:id`)

### 1.9 Volunteer Experience API
- Add volunteer experience (POST `/user-profiles/me/volunteer-experiences`)
- Update volunteer experience (PUT `/user-profiles/me/volunteer-experiences/:id`)
- Delete volunteer experience (DELETE `/user-profiles/me/volunteer-experiences/:id`)

### 1.10 Honor Awards API
- Add awards (POST `/user-profiles/me/honors-awards`)
- Update awards (PUT `/user-profiles/me/honors-awards/:id`)
- Delete award (DELETE `/user-profiles/me/honors-awards/:id`)

### 1.11 Letter of Recommendation API
- Add recommendations (POST `/user-profiles/me/recommendations`)
- Update recommendations (PUT `/user-profiles/me/recommendations/:id`)
- Delete recommendations (DELETE `/user-profiles/me/recommendations/:id`)

## 2. Update profileSlice.ts

### 2.1 Status definition
- Make sure state contains the complete UserProfile type
- Added loading status and error status fields
- Add the currently edited section tag

### 2.2 Basic asynchronous Action
- Create fetchUserProfile asynchronous thunk
- Create updateUserProfile asynchronous thunk
- Create deleteUserProfile asynchronous thunk

### 2.3 Educational Experience Action
- Create addEducation asynchronous thunk
- Create updateEducation asynchronous thunk
- Create deleteEducation asynchronous thunk

### 2.4 Work Experience Action
- Create addWorkExperience asynchronous thunk
- Create updateWorkExperience asynchronous thunk
-Create deleteWorkExperience asynchronous thunk

### 2.5 Skill Action
- Create addSkill asynchronous thunk
- Create updateSkill asynchronous thunk
-Create deleteSkill asynchronous thunk

### 2.6 Certificate Action
- Create addCertification asynchronous thunk
- Create updateCertification asynchronous thunk
-Create deleteCertification asynchronous thunk

### 2.7 Project Experience Action
-Create addProject asynchronous thunk
- Create updateProject asynchronous thunk
-Create deleteProject asynchronous thunk

### 2.8 Language Ability Action
- Create addLanguage asynchronous thunk
- Create updateLanguage asynchronous thunk
-Create deleteLanguage asynchronous thunk

### 2.9 Volunteer experience Action
- Create addVolunteerExperience asynchronous thunk
- Create updateVolunteerExperience asynchronous thunk
-Create deleteVolunteerExperience asynchronous thunk

### 2.10 Honorary Awards Action
- Create addHonorAward asynchronous thunk
- Create updateHonorAward asynchronous thunk
-Create deleteHonorAward asynchronous thunk

### 2.11 Recommendation Letter Action
- Create addRecommendation asynchronous thunk
- Create updateRecommendation asynchronous thunk
-Create deleteRecommendation asynchronous thunk

### 2.12 UI Control Action
- Create setActiveSection reducer
- Create setEditMode reducer
-Create clearError reducer

## 3. Type definition update (types/profile.ts)

### 3.1 Core types
- Make sure the UserProfile type is consistent with the backend
- Ensure all subtypes (Education, WorkExperience, etc.) are consistent with the backend
- Add appropriate ID fields and optional fields

### 3.2 Request type
- Define request parameter types for each API endpoint
- Define response types for each API endpoint

### 3.3 State type
- Define ProfileState type
- Contains complete profile fields, loading status and error status

## 4. Component update

### 4.1 Form Component
- Ensure all form components use the correct API requests
- Add proper loading status and error handling
- Implement form validation consistent with back-end requirements

### 4.2 Display components
- Ensure that all list components can correctly display the data returned by the API
- Implement correct sorting and filtering functionality

## Implementation Checklist:
1. Create profileService.ts file
2. Implement all API endpoint functions in profileService
3. Update the asynchronous thunk in profileSlice.ts
4. Make sure all type definitions are consistent with the backend
5. Update components to use new API services
6. Add appropriate loading indicators
7. Add error handling and error display
8. Add form validation
9. Test all CRUD operation functions
10. Optimize performance and user experience
