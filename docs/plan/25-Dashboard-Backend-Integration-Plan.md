This is a plan to integrate `frontend/src/pages/DashboardPage.tsx` with the backend, focusing on pulling and displaying user-related job data.

**Goal:**

Convert the job tracking panel (`DashboardPage.tsx`) from a pure front-end static display to a dynamic display of actual job data tracked by users through the JobTrip app. Users can view and manage their job listings based on job status (such as "New", "Applied", "Interviewing", "Offer", "Rejected", etc.).

**Integration Planning Steps:**

1. **Understand the existing structure of the front end (`DashboardPage.tsx`)**
    * Analyze how the current component organizes and displays job cards (`DraggableJobCard`) and status columns (`DroppableColumn`).
    * Determine the current state management method used to store and manage position data (maybe internal component state, or Redux).
    * Understand the existing data structures, especially the fields of the job object (`Job` type).

2. **API service layer docking (`frontend/src/services/`)**
    * **Confirm API endpoint**: According to `backend/src/routes/jobRoutes.ts`, the API endpoint to get user-related jobs is `GET /api/v1/jobs/user`.
    * **Create or update API service function**:
        * In `frontend/src/services/jobService.ts` (or `userJobService.ts`, depending on the responsibilities), create a function (such as `getUserJobs` or `WorkspaceUserDashboardJobs`).
        * This function will use Axios to send a request to `GET /api/v1/jobs/user`.
        * Make sure the request includes the JWT Token for user authentication (usually the Axios instance handles this automatically).
        * This function should be able to receive filtering parameters (such as status, sorting, etc.). Although all filtering may not be needed initially, future expansion should be considered.
    * **Define data type**:
        * In `frontend/src/types/job.ts` (or related type files), ensure that the frontend's `Job` type is consistent with the job data structure returned by the backend (including `status`, `isFavorite`, `userJobId` and other user-specific fields). The data structure returned by the `getUserRelatedJobs` function in the backend `jobController.ts` is the key reference.

3. **State Management (Redux Toolkit - `frontend/src/redux/`)**
    * **Create/Update Redux Slice**:
        * Consider adding state for storing user dashboard job data in `userJobsSlice.ts` (if existing) or `jobsSlice.ts`.
        * Define related reducers to handle data loading, success, and failure status.
        * Create an `asyncThunk` to call the API service function (`getUserJobs`) defined in step 2 and update the Redux store based on the API response.
    * **Action Dispatch**: When the `DashboardPage.tsx` component is loaded (for example, in the `useEffect` hook), dispatch this `asyncThunk` to get the data.

4. **`DashboardPage.tsx` component modification**
    * **Get data**:
        * Use `useAppSelector` (custom Redux selector hook) to get user position data, loading status and error information from the Redux store.
    * **Data display**:
        * Dynamically render `DroppableColumn` and `DraggableJobCard` based on job data obtained from Redux store.
        * Ensure job data is passed correctly to the `DraggableJobCard` component.
        * Handle loading status (display loading indicator) and error status (display error prompt).
    * **Status column logic**:
        * Currently `DashboardPage.tsx` may have predefined columns (such as "New", "Applied"). You need to ensure that the `id` or `title` of these columns matches the job status value (such as `job.status`) returned by the backend or defined by the frontend, so that the job cards are correctly classified into the corresponding columns.
        * Adjust the display of columns based on actual data, or dynamically generate columns.

5. **Position status update (drag and drop interaction)**
    * **Confirm API endpoint**: According to `backend/src/routes/jobRoutes.ts`, the API endpoint for updating job status is `PUT /api/v1/jobs/:id/status`.
    * **API service function**:
        * Create or update a function (e.g. `updateUserJobStatus`) in `jobService.ts` or `userJobService.ts` to call this API. This function requires `jobId` (where `id` refers to `Job._id`) and the new `status` as parameters.
    * **Redux Action (Optimistic Update optional)**:
        * Create an `asyncThunk` to call `updateUserJobStatus`.
        * In the drag completion callback function (`onDragEnd` or similar logic):
            1. Dispatch this `asyncThunk` to synchronize state changes to the backend.
            2. (Optional but recommended) Implement Optimistic Update: Update the job status in the Redux store immediately after the API request is sent to provide a smoother user experience. If the API request fails, the state is rolled back.
            3. If the backend is successful, the Redux store should reflect the latest status returned by the backend (the backend will return updated position data after `PUT /:id/status` is successful).
    * **`DashboardPage.tsx` drag and drop logic update**:
        * In `onDragEnd` (or other functions that handle the end of dragging), get the status of the dragged position ID and target column.
        * Call Redux action to update job status.

6. **Error handling and user feedback**
    * Implement robust error handling in API calls and Redux actions.
    * Use `AlertMessage` or similar components to display loading status, success messages, or error messages to the user.

7. **TEST**
    * Manually test data loading and position display in different status columns.
    * Test the function of dragging positions to different status columns and verify whether the backend data has been updated.
    * Test edge cases, such as no job data, API request failure, etc.

**Aspects to consider:**

* **User Authentication**: Ensure that all API requests handle user authentication correctly.
* **Data Synchronization**: If the user updates the job status elsewhere (such as the job details page), the dashboard page should reflect those changes (this can be achieved by re-fetching the data or smarter Redux store updates).
* **Performance**: If the user has many positions, consider paging or virtualized loading. Although `GET /api/v1/jobs/user` already supports paging, the column layout of the dashboard may require loading more data at one time, which needs to be weighed.
* **Code Reuse**: Reuse existing components and Redux logic as much as possible.
