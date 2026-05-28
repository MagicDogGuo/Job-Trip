# Plan: Enhance the job details interface to include user-related status

## 1. Background

Currently, the job details page (`JobDetailPage.tsx`) obtains job information by calling the backend API `GET /api/v1/jobs/:id` (corresponding to the `jobController.getJob` function). This controller only retrieves and returns general job data from the `jobs` collection, which does not contain status information related to the position for a specific user (such as application status, whether to favorite, notes, etc.). These user-related information is stored in the `user_jobs` collection.

This results in the job status (`job.status`) displayed on the job details page being potentially inaccurate as it reflects the default or global status in the `Job` model rather than the currently logged in user's individual tracked status for the job.

## 2. Goal

Modify the `jobController.getJob` function so that it includes in the response specific information about the currently logged in user related to the requested job. Specifically, the returned job object should contain the following fields from the corresponding `UserJob` record (if a relationship exists):

- `status` (user’s application status for this position)
- `isFavorite`
- `notes`
- `customTags`
- `reminderDate`
- `userJobId` (`_id` recorded by `UserJob`)

If there is no user associated with the job (`UserJob` record), these user-specific fields can be `null`, `undefined`, or the job object can have an explicit indication that there is no user-associated data.

## 3. Plan

Modify the `getJob` function in the `backend/src/controllers/jobController.ts` file.

### 3.1. Modify `getJob` function logic

1. **Get basic job information**:
    * As before, first get the basic data of the position from the `jobs` collection through `Job.findById(req.params.id)`. If the position is not found, a 404 error is returned.

2. **Get current user information**:
    * Get the `userId` of the currently logged in user from `req.user._id`. Since this route (`GET /api/v1/jobs/:id`) is already protected by the `protect` middleware (as configured in `jobRoutes.ts`), `req.user` should be available. Consider returning an error or not trying to get user-specific information if `req.user` or `req.user._id` does not exist, but this should not happen in theory.

3. **Query `UserJob` related records**:
    * Use the obtained `userId` and job ID (`req.params.id` or `job._id`) to query the corresponding `UserJob` record in the `user_jobs` collection:
        `const userJob = await UserJob.findOne({ userId: userId, jobId: job._id });`

4. **Consolidate information and prepare response**:
* Convert the underlying `job` object to a normal JavaScript object for modification: `let jobData = job.toObject();`
* **If the `userJob` record is found**:
* Merge relevant fields in `userJob` into `jobData` object:
            *   `jobData.status = userJob.status;`
            *   `jobData.isFavorite = userJob.isFavorite;`
*   `jobData.notes = userJob.notes;` (or `userJob.notes || null`)
*   `jobData.customTags = userJob.customTags;` (or `userJob.customTags || []`)
*   `jobData.reminderDate = userJob.reminderDate;` (or `userJob.reminderDate || null`)
            *   `jobData.userJobId = userJob._id;`
* **If no `userJob` record is found** (i.e. the user is not yet associated with this job):
* Consider setting default values ​​or `null` for these user-specific fields to ensure the integrity of the front-end `Job` type. For example:
* `jobData.status = jobData.status || 'new';` (or use the default status that may exist in the `Job` model, if there is no user association, the status can be treated as "newly discovered")
            *   `jobData.isFavorite = false;`
            *   `jobData.notes = null;`
            *   `jobData.customTags = [];`
            *   `jobData.reminderDate = null;`
            *   `jobData.userJobId = null;`
* Alternatively, it is possible to not add these fields and let the front-end handle possible missing cases, but this is usually not as good as providing a consistent structure in the back-end.

5. **Return response**:
* Construct and return a successful response using a `jobData` object containing the merged information.
`res.status(200).json(createApiResponse(200, 'Getting job details successfully', jobData));`
### 3.2. Front-end type consideration (no need to modify, but need to pay attention)

- The front-end `Job` type definition (`frontend/src/types/job.ts`) already contains optional `status?: string;`, `isFavorite?: boolean;`, `notes?: string;`, `userJobId?: string;` and other fields. As long as the data returned by the backend is compatible with these optional fields, the frontend should handle it correctly.

## 4. Test key points

1. **Records related to users and positions**:
    * When requesting job details, verify that the response correctly includes `status`, `isFavorite`, `notes`, `customTags`, `reminderDate`, and `userJobId` from `UserJob`.
2. **There is no associated record between user and position**:
    * When requesting job details, verify that user-specific fields in the response have default values set as expected (e.g. `status: 'new'`, `isFavorite: false`) or are `null`/`undefined`.
3. **Details page display**:
    * Confirm that `JobDetailPage.tsx` correctly displays the merged status and other user-related information.
4. **No user logged in or invalid user (edge case)**:
    * Although routing is protected, consideration should be given to whether the behavior of the system is robust if `req.user` is unavailable for some reason (e.g. whether only underlying job information is returned).

## 5. Implementation Checklist

1. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** After obtaining the `job` object through `Job.findById`, check whether `job` exists. If it does not exist, return 404 according to the existing logic.
2. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** Check whether `req.user` and `req.user._id` exist. If not (theoretically unlikely since the route is protected), log a warning and prepare to return only the underlying `job` data (no user correlation query).
3. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** If `req.user._id` exists, get `userId` from it.
4. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** Use `userId` and `job._id` to query `UserJob.findOne({ userId: userId, jobId: job._id })` and store the result in `userJob`.
5. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** Convert `job` into a modifiable object: `let jobData = job.toObject();`.
6. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** **If `userJob` exists**:
    * Assign `userJob.status` to `jobData.status`.
    * Assign `userJob.isFavorite` to `jobData.isFavorite`.
    * Assign `userJob.notes` (or `userJob.notes || null`) to `jobData.notes`.
    * Assign `userJob.customTags` (or `userJob.customTags || []`) to `jobData.customTags`.
    * Assign `userJob.reminderDate` (or `userJob.reminderDate || null`) to `jobData.reminderDate`.
    * Assign `userJob._id` to `jobData.userJobId`.
7. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** **If `userJob` does not exist**:
    * Set `jobData.status` to its current value or `'new'` (e.g., `jobData.status = jobData.status || 'new';`).
    * Set `jobData.isFavorite` to `false`.
    * Set `jobData.notes` to `null` if it does not exist yet.
    * Set `jobData.customTags` to `[]` (if it does not exist yet or `null`).
    * Set `jobData.reminderDate` to `null` if it does not exist yet.
    * Set `jobData.userJobId` to `null`.
8. **[Modify `backend/src/controllers/jobController.ts` - `getJob` function]** Modify the `res.status(200).json(...)` call so that it uses `jobData` instead of the original `job` object as the response data.
9. **[Test]** Test whether the status and other related information from `UserJob` are correctly displayed on the job details page when the user has a `UserJob` association with the position.
10. **[Test]** Test whether the position details page displays the default/fallback status and related information as expected when there is no `UserJob` association between the user and the position.
11. **[Test]** Confirm that the `JobDetailPage.tsx` component can correctly consume the updated `job` object structure.
12. **[Documentation]** Update `progress.md` and `project-status.md` based on implemented changes and test results.
