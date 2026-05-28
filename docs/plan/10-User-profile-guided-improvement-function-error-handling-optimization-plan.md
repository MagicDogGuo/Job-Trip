[Mode:Plan][Model:Claude 3.7 Sonnet]

# User profile guided improvement function error handling optimization plan

## Problem analysis

The current system cannot correctly trigger the guided improvement process when the user profile does not exist. The main reason is that the error handling of `api.ts` converts the original HTTP error into a normal Error object, resulting in the loss of status code information and making `profileSlice.ts` unable to correctly identify 404 errors.

## Repair target

1. Keep HTTP error status codes and response data
2. Enable profileSlice to correctly identify 404 errors and set profileNotFound status
3. Ensure that users automatically enter the boot wizard process when the file does not exist
4. Maintain the normal functionality of other parts of the system

## Implementation steps

### 1. Create a custom error type

**File**: `frontend/src/types/api.ts`
```typescript
//Add custom API error type
export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    
// Make sure instanceof is working properly
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Determine whether the error is a type protection function of ApiError
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
```
### 2. Modify API service error handling

**File**: `frontend/src/services/api.ts`
```typescript
import { ApiError } from '../types/api';

//Update the catch block in the request function
try {
//The original code remains unchanged...
} catch (error) {
console.error('API error details:', error);
  if (axios.isAxiosError(error) && error.response) {
console.error('Server response:', error.response.data);
console.error('Error status code:', error.response.status);
    
//Special handling of 404 errors - detecting that the user file does not exist
    if (error.response.status === 404 && error.response.config.url?.includes('/user-profiles/me')) {
console.log('User file does not exist - wizard process should be triggered');
    }
    
//Create ApiError instead of ordinary Error
    throw new ApiError(
error.response.data.message || 'Server internal error',
      error.response.status,
      error.response.data
    );
  }
// Non-AxiosError is thrown directly
  throw error;
}
```
### 3. Update profileSlice error handling

**File**: `frontend/src/redux/slices/profileSlice.ts`
```typescript
import { ApiError, isApiError } from '../../types/api';

//Modify the catch block in fetchUserProfile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
console.log('fetchUserProfile: Start fetching user profile');
      const response = await profileService.getUserProfile();
console.log('fetchUserProfile: User profile successfully obtained', response);
      return response;
    } catch (error: any) {
console.log('fetchUserProfile: Error getting user profile', error);
      
// Use improved error handling logic
// Prioritize checking ApiError type and status code
      if (isApiError(error) && error.status === 404) {
console.log('fetchUserProfile: 404 error detected, set profileNotFound=true');
return rejectWithValue({ message: 'User profile does not exist', notFound: true });
      }
      
// Backward compatibility - check for legacy error objects
      if (error.response && error.response.status === 404) {
console.log('fetchUserProfile: Old version 404 error detected, set profileNotFound=true');
return rejectWithValue({ message: 'User profile does not exist', notFound: true });
      }
      
// Check error message content as downgrade
if (error.message && error.message.includes('User file does not exist')) {
console.log('fetchUserProfile: Judging from the error message that the file does not exist, set profileNotFound=true');
return rejectWithValue({ message: 'User profile does not exist', notFound: true });
      }
      
console.log('fetchUserProfile: other errors, set profileNotFound=false');
return rejectWithValue({ message: 'Failed to obtain user profile', notFound: false });
    }
  }
);
```
### 4. Update other Slice error handling

**Files**: `frontend/src/redux/slices/authSlice.ts`, `frontend/src/redux/slices/userJobsSlice.ts`, etc.

Updated error handling logic for each asynchronous thunk, adding support for ApiError but retaining backward compatibility. Here we take `getCurrentUser` in `authSlice.ts` as an example:
```typescript
import { ApiError, isApiError } from '../../types/api';

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error: any) {
// Prioritize using the status code and message of ApiError
      if (isApiError(error)) {
        return rejectWithValue(error.message);
      }
// Downgrade to old error handling
      return rejectWithValue((error as Error).message);
    }
  }
);
```
### 5. Optimize ProfilePageContainer error handling

**File**: `frontend/src/pages/profile/index.tsx`
```typescript
// Enhance error handling logic
if (profileNotFound) {
console.log('ProfilePageContainer: The file does not exist, display the boot wizard');
  try {
    return <ProfileWizard />;
  } catch (e) {
console.error('ProfileWizard rendering error:', e);
//Add more detailed error information
    return (
      <div className="container-lg mx-auto px-4 py-8">
        <div className="rounded-xl bg-yellow-50 dark:bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
<h3 className="text-lg font-medium mb-2">Loading user guide</h3>
<p className="mb-4">We cannot load the boot wizard component, possible reasons:</p>
          <pre className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-xs overflow-auto max-h-32">
            {e instanceof Error ? e.message : String(e)}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
refresh page
          </button>
        </div>
      </div>
    );
  }
}
```
## Test plan

1. Test whether profileNotFound=true is correctly set when the user profile does not exist
2. Test whether the ProfileWizard is successfully displayed when the file does not exist
3. Test whether the user profile is successfully created after completing the boot wizard.
4. Test whether API error handling works normally in other scenarios

## Implementation Checklist:
1. Create the `frontend/src/types/api.ts` file and add the ApiError class
2. Modify the error handling logic in `frontend/src/services/api.ts` and use ApiError
3. Update fetchUserProfile error handling in `frontend/src/redux/slices/profileSlice.ts`
4. Update asynchronous thunk error handling in other Slices in turn
5. Optimize error handling and downgrade UI in `frontend/src/pages/profile/index.tsx`
6. Run a test to confirm that the fix is effective
7. Verify whether the boot wizard is automatically displayed when the user profile does not exist
8. Verify that other API error handling is working properly
9. Deploy updated code
