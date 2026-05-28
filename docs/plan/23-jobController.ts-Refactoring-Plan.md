This is a refactoring plan for `backend/src/controllers/jobController.ts` to achieve the three goals you proposed:

**`jobController.ts` Refactoring plan**

**Goal:**

1. Remove the original `userToken` authentication logic in `createJobFromExtension` and use the `protect` middleware uniformly.
2. Merge the functionality of `createJobsBatch` and `createJobFromExtension` into the new `createJobs` function (or enhance the existing `createJobsBatch`) to be able to handle input of a single job object or an array of job objects.
3. Unify the code style and reduce duplicate code by extracting shared logic into auxiliary functions.

**Prerequisite:**

  * All related API routes (including routes that originally called `createJobFromExtension` and `createJobsBatch`) will be authenticated through the `protect` middleware to ensure that the `req.user` object is available in the controller.
  * When the front end or plug-in calls the new job creation interface, it will pass the JWT through the standard `Authorization: Bearer <token>` request header.

**Refactoring steps:**

**Phase 1: Preparation and auxiliary function extraction**

1. **Create core job processing auxiliary function `_processJobData`**

      * **Purpose**: Encapsulate the processing logic of a single position data, including data verification, company information processing, position creation/search, user position association and historical record creation.
      * **Input parameters**:
          * `jobData: any`: The data object of a single position (consistent with the structure sent by the front end or plug-in).
          * `userId: string`: The ID of the current operating user.
          * `companyCache: Map<string, string>` (optional, used to cache company IDs during batch processing to avoid repeated queries).
      * **Core logic**:
          * **Data extraction and verification**: Extract all necessary job fields from `jobData` (`platform`, `title`, `companyName`, `location`, `sourceId`, `sourceUrl`, `description`, `salary`, `jobType`, `status` (as initial application status), `source`, `requirements`, `deadline`, `notes`, `companyInfo`, etc.). Perform necessary format verification.
          * **Company processing (`_findOrCreateCompany` helper function)**:
              * Find or create a company based on `jobData.companyName` and `userId` (and optionally `jobData.companyInfo`).
              * Return the company ID. Batch processing can be optimized using `companyCache`.
          * **Job uniqueness check**: Checks if a `Job` with the same `sourceId` (if provided) and `userId` already exists. If one exists, no new `Job` is created, but the `UserJob` association may still need to be created or updated.
          * **Create `Job` document**: If the position is new, create a `Job` document using the extracted data and the obtained `companyId`, with `createdBy` set to `userId`.
          * **Create/Update `UserJob` document**:
              * Find if the user is already associated with this job (via `jobId`).
              * If not associated, creates a new `UserJob` document containing `userId`, `jobId`, and `status` obtained from `jobData` or the default value (e.g., `'new'`).
              * If it is associated, you can consider whether to update some fields (such as `notes`) according to your needs, or skip it directly.
          * **Create `ApplicationHistory` document**: records the initial state for the new `UserJob` association.
      * **Return value**:
          * On success: Return an object containing `{ job: IJob, userJob: IUserJob, applicationHistory: IApplicationHistory, company: ICompany }`.
          * On failure or skipping (such as duplication): Return an object containing error information or processing status, such as `{ error: string, jobDetails: any }` or `{ skipped: true, reason: string, jobDetails: any }`.
      * **Location**: This function is available as a private helper function within `jobController.ts`.

2. **Create the helper function `_findOrCreateCompany`** (if it does not exist yet or needs to be optimized)

      * **Purpose**: Find or create a company record for a specific user based on the company name and optional company information.
      * **Input parameters**: `companyName: string`, `userId: string`, `companyInfo?: any`, `companyCache?: Map<string, string>`.
      * **Logic**:
          * Look in `companyCache` first.
          * If not found, look for the company in the database based on `name` and `createdBy: userId`.
          * If still not found, create a new company using `companyName` and `companyInfo`, `createdBy: userId`.
          * Store the results in `companyCache`.
          * Return the company ID.
      * **Location**: Private helper function within `jobController.ts`.

**Phase 2: Consolidation and Refactoring of Main Controller Functions**

1. **Refactor/create `createJobs` (replaces `createJobsBatch` and `createJobFromExtension`)**

* **Purpose**: Unify processing of single or batch job creation requests.
      * **Function signature**: `export const createJobs = async (req: Request, res: Response, next: NextFunction) => { ... }`
      * **Input**: `req.body` can be a position data object, or an array containing multiple position data objects (for example, `req.body.jobs` or directly `req.body` is an array).
      * **Core logic**:
          * **Get `userId`**: Get the user ID from `req.user._id`. If `req.user` does not exist, an error will be returned via `next(new AppError('User not authenticated', 401));` (theoretically the `protect` middleware will handle it).
          * **Determine input type**: Check whether `req.body` (or `req.body.jobs`) is a single object or an array.
              * Pack a single object into a single-element array for subsequent unified processing.
          * **Initialize result collector**: `const createdJobsResults: any[] = []; const errors: any[] = [];`
          * **Initialize `companyCache`**: `const companyCache = new Map<string, string>();`
          * **Traverse position data**: For each position data object in the array:
              * Call `await _processJobData(jobDataItem, userId, companyCache);`
              * Based on the return result of `_processJobData`, add successfully created job information to `createdJobsResults`, and add error or skipped information to `errors`.
          * **Build response**:
              * If the original input is a single object, and processing is successful, a single created position can be returned (HTTP 201).
              * If the original input is an array, or individual object processing failed/skipped, return batch processing results (HTTP 200 or 207 Multi-Status) containing `createdJobs` and `errors`.
      * **Remove `userToken` logic**: Since all requests calling this interface have passed through the `protect` middleware, there is no longer a need to check and process `req.body.userToken`.

2. **Remove old functions**:

      * Removed `createJobFromExtension` function.
      * Delete the old `createJobsBatch` function (if the new function is named `createJobs`, or modify `createJobsBatch` directly).

**Phase 3: Update Routing and Test**

1. **Update `jobRoutes.ts`**:

      * Remove `/extension` route.
      * Modify the original `/batch` route (or create a new route, such as `/` POST request) so that it points to the new `createJobs` (or the refactored `createJobsBatch`) function.
      * Make sure this route is protected by the `protect` middleware.
        ```typescript
        // Example in jobRoutes.ts
        // import { createJobs, /* other job controller functions */ } from '../controllers/jobController';
        // import { protect } from '../middleware/authMiddleware';

        // router.post('/', protect, createJobs); // Handles both single and batch job creation
        ```
2. **Code style and consistency check**:

      * Read through `jobController.ts` to ensure that all functions follow a consistent asynchronous processing pattern ( `async/await` ).
      * Use consistent error handling (for example, pass errors via `next(error)` or `next(new AppError(...))`).
      * Ensure that variable naming, comment style, etc. are consistent.
      * Remove unnecessary `console.log` and commented out code.

3. **Comprehensive Test**:

      * **Unit Test**:
          * Test the `_findOrCreateCompany` helper function.
          * Test the `_processJobData` helper function, covering various scenarios (new positions, positions that the user has associated with, new companies, existing companies, incomplete data, etc.).
          * Test the new `createJobs` function, covering scenarios such as success/failure of a single job creation, batch job creation (all successes, partial successes, all failures, handling duplicates), etc.
      * **Integration Test**: Test the API endpoint to ensure correct response with or without the `Authorization` header, single job data, batch job data, etc.
      * **Front-end/plug-in side adjustments**: Ensure that front-end applications and browser plug-ins update their API calling methods to adapt to the new endpoints and request/response structures, and use standard JWT Bearer tokens for authentication.

**Expected results:**

  * `jobController.ts` is more concise, and the core job creation logic is encapsulated and reused.
  * The plugin-specific `userToken` authentication method has been removed, and all job creation operations rely on the standard `protect` middleware for user authentication.
  * Provides a unified entry point (`createJobs` or enhanced `createJobsBatch`) to handle single and batch job creation, simplifying the API interface.
  * Improved code maintainability and readability.
