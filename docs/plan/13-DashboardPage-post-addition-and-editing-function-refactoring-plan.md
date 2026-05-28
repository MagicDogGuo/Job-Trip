[Mode:Plan][Model:Claude 3.7 Sonnet]

# DashboardPage position addition and editing functionality refactoring plan

## Target
Refactor the job adding and editing functions in the Dashboard page to link to the dedicated job management page through routing, and remove the local modal box logic.

## Analysis

### Current implementation
1. Use local state `editingJob` and `EditModal` components to manage job addition/editing
2. Edit and save to update the local status through the `handleSaveEdit` function
3. The deletion function is implemented through the `handleDelete` function

### Need to modify the content
1. Import navigation-related dependencies (`useNavigate` of React Router)
2. Remove the `EditModal` component
3. Modify the "Add Job" button to link to `/jobs/new`
4. Modify the editing function and navigate to `/jobs/{jobId}/edit`
5. Remove `editingJob` status and related processing functions

## Technical solution

### Removed code
- `EditModal` component definition (about 56 lines)
- `editingJob` status definition
- `handleSaveEdit` function
- Modal box rendering part

### Added code
- import `useNavigate`
- Use `useNavigate` to define navigation functions
- Modify the processing functions of add button and edit button

## Implementation steps

1. Introduce React Router navigation dependency
2. Define navigation function
3. Modify the processing logic of the add position button
4. Modify the processing logic of editing positions
5. Retain the function of deleting positions (implemented through API calls)
6. Remove code that is no longer needed:
   - `EditModal` component
   - `editingJob` status
   - `handleSaveEdit` function
   - Modal box rendering part

## Detailed code modifications

### 1. Import dependencies and Hook definitions
```jsx
import { useNavigate } from 'react-router-dom';
// ... other imports

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
// ...other hooks and status
```
### 2. Remove EditModal component definition
Delete the entire EditModal component definition (about 56 lines of code)

### 3. Remove editingJob status
```jsx
// remove this line
const [editingJob, setEditingJob] = useState<Job | null>(null);
```
### 4. Modify the processing functions for adding and editing positions
```jsx
//Modify handleEdit function
const handleEdit = (job: Job) => {
  navigate(`/jobs/${job.id}/edit`);
};

//Click processing of button to add position
const handleAddJob = () => {
  navigate('/jobs/new');
};
```
### 5. Modify the add position button
```jsx
<button 
  onClick={handleAddJob}
  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors"
>
  <Plus className="h-5 w-5" />
Add job
</button>
```
### 6. Remove EditModal rendering part
Remove the EditModal rendering code at the end of the DashboardPage component

## Implementation Checklist:
1. Import useNavigate of React Router
2. Define navigation constants in the DashboardPage component
3. Delete the complete definition of the EditModal component
4. Delete editingJob status
5. Delete handleSaveEdit function
6. Modify the handleEdit function to navigate to the editing page
7. Add handleAddJob function to navigate to the add page
8. Modify the onClick handler function of the add position button
9. Delete the EditModal rendering code at the end of the component
10. Keep the handleDelete function (can be adjusted to API call later)
