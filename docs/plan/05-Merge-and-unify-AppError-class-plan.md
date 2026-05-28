[Mode:Plan][Model:Claude 3.7 Sonnet]

# Merge unified AppError class plan

## 1. Analyze the current situation

### Current problems
- The AppError class is defined differently in two places: `utils/AppError.ts` and `middleware/errorHandler.ts`
- Different files import AppError from different locations, causing inconsistency
- More feature-rich version of AppError in errorHandler.ts, with isOperational property and stack trace

### Existing file analysis
- `utils/AppError.ts`: simple version
- `middleware/errorHandler.ts`: Contains error handling middleware and AppError class
- Most services import AppError from `../middleware/errorHandler`
- A few services (such as aiController) are imported from `../utils/AppError`

## 2. Detailed implementation plan

### Step 1: Update utils/AppError.ts
1. Extend the existing AppError class and add the isOperational attribute
2. Add stack trace function
3. Make sure the constructor is compatible with existing code
4. Add appropriate type annotations and documentation
```typescript
// Optimized AppError.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}
```
### Step 2: Modify middleware/errorHandler.ts
1. Delete the AppError class definition
2. Import AppError in utils/AppError.ts
3. Keep other error handling functions unchanged
```typescript
// Modify the beginning of errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

/**
* Unified API response format
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
  traceId?: string;
}

// ...the rest of the code remains the same
```
### Step 3: Update the import references in the project
Files that import AppError from `../middleware/errorHandler` need to be updated to import from `../utils/AppError`

The import statements of the following files need to be updated:
1. controllers/jobController.ts
2. controllers/userJobController.ts
3. controllers/userProfileController.ts
4. controllers/resumeController.ts
5. controllers/userController.ts
6. controllers/companyController.ts
7. middleware/authMiddleware.ts

Modifications to each file follow the same pattern:
```typescript
//Original import
import { AppError, createApiResponse } from '../middleware/errorHandler';

// modified import
import { AppError } from '../utils/AppError';
import { createApiResponse } from '../middleware/errorHandler';
```
## 3. Test plan
1. Check whether the compilation passes
2. Run system tests
3. Test various error scenarios to ensure error handling works properly
4. Verify that the stack trace is displayed correctly

## 4. Rollback plan
If something goes wrong after merging, prepare a rollback script to restore the files to their original state.

## 5. Documentation updates after implementation
Updated related documentation to explain the unified usage and best practices of AppError.

Implementation checklist:
1. Update the AppError class in utils/AppError.ts to add the isOperational attribute and stack trace
2. Modify middleware/errorHandler.ts, delete the AppError class definition, and import utils/AppError
3. Consider re-exporting AppError in errorHandler.ts to reduce the amount of modifications
4. Update the import statement of controllers/jobController.ts
5. Update the import statement of controllers/userJobController.ts
6. Update the import statement of controllers/userProfileController.ts
7. Update the import statement of controllers/resumeController.ts
8. Update the import statement of controllers/userController.ts
9. Update the import statement of controllers/companyController.ts
10. Update the import statement of middleware/authMiddleware.ts
11. Compile and test the system
12. Verify that error handling functions work properly
13. Update relevant documents to explain the unified usage of AppError
