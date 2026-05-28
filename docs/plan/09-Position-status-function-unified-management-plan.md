[Mode:Plan][Model:Claude 3.7 Sonnet]

# Position status function unified management plan (revised version)

## 1. Project background

By studying the current code base, it was found that functions related to job status (JobStatus) are repeatedly implemented in multiple components, including:
- The status options array (statusOptions) is repeatedly defined in multiple places
- Status style functions (getStatusStyles, getStatusColor) are scattered in different files
- Inconsistent status labels (e.g. "New Added" vs "New Position")

This leads to code redundancy, consistency issues, and maintenance difficulties.

## 2. Solution

Create a centralized tool file to manage all job status related functions, following the DRY (Don’t Repeat Yourself) principle. At the same time, a new status type "pending application" is added, and the style processing method is unified.

## 3. Detailed design

### 3.1 JobStatus enumeration update

First, update the JobStatus enumeration in the `frontend/src/types/index.ts` file to add the PENDING status:
```typescript
//Position status enumeration
export enum JobStatus {
  NEW = 'new',
PENDING = 'pending', // New: pending application
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  CLOSED = 'closed',
  NOT_INTERESTED = 'not_interested',
}
```
### 3.2 Tool file structure

Create a new file `jobStatusUtils.ts` in the `frontend/src/utils` directory, containing the following functions:
```typescript
import { JobStatus } from '@/types';

//Array of status options - for dropdown menu
export const JOB_STATUS_OPTIONS = [
{ value: JobStatus.NEW, label: 'Newly added' },
{ value: JobStatus.PENDING, label: 'Pending application' },
{ value: JobStatus.APPLIED, label: 'Applied' },
{ value: JobStatus.INTERVIEWING, label: 'Interviewing' },
{ value: JobStatus.OFFER, label: 'Hired' },
{ value: JobStatus.REJECTED, label: 'Rejected' },
{ value: JobStatus.WITHDRAWN, label: 'Withdrawn' },
{ value: JobStatus.CLOSED, label: 'Close' },
{ value: JobStatus.NOT_INTERESTED, label: 'Not considered' }
];

/**
* Get status label
* @param status status value
* @returns corresponding display tag
 */
export const getStatusLabel = (status: string): string => {
  const option = JOB_STATUS_OPTIONS.find(opt => opt.value === status);
  return option ? option.label : status;
};

/**
* Get status style
* @param status status value
* @param styleType style type: 'badge' is used for badge tags, 'tailwind' is used for direct Tailwind class
* @returns corresponding CSS class name
 */
export const getStatusStyle = (status: string, styleType: 'badge' | 'tailwind' = 'badge'): string => {
  if (styleType === 'badge') {
// Return the badge class name, used for JobDetailPage, etc.
    switch (status) {
      case JobStatus.NEW:
        return 'badge-primary';
      case JobStatus.PENDING:
        return 'badge-pending';
      case JobStatus.APPLIED:
        return 'badge-info';
      case JobStatus.INTERVIEWING:
        return 'badge-warning';
      case JobStatus.OFFER:
        return 'badge-success';
      case JobStatus.REJECTED:
        return 'badge-error';
      case JobStatus.WITHDRAWN:
        return 'badge-default';
      case JobStatus.CLOSED:
        return 'badge-default';
      case JobStatus.NOT_INTERESTED:
        return 'badge-purple';
      default:
        return 'badge-default';
    }
  } else {
// Return the Tailwind class combination, used for JobsPage, etc.
    switch (status) {
      case JobStatus.NEW:
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case JobStatus.PENDING:
        return 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case JobStatus.APPLIED:
        return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
      case JobStatus.INTERVIEWING:
        return 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case JobStatus.OFFER:
        return 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400';
      case JobStatus.REJECTED:
        return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400';
      case JobStatus.WITHDRAWN:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400';
      case JobStatus.CLOSED:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400';
      case JobStatus.NOT_INTERESTED:
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  }
};

/**
* Get the status color value - used in scenarios such as charts
* @param status status value
* @returns corresponding color hexadecimal value
 */
export const getStatusColorValue = (status: string): string => {
  switch (status) {
    case JobStatus.NEW:
      return '#3b82f6'; // blue-500
    case JobStatus.PENDING:
      return '#f97316'; // orange-500
    case JobStatus.APPLIED:
      return '#6366f1'; // indigo-500
    case JobStatus.INTERVIEWING:
      return '#eab308'; // yellow-500
    case JobStatus.OFFER:
      return '#22c55e'; // green-500
    case JobStatus.REJECTED:
      return '#ef4444'; // red-500
    case JobStatus.WITHDRAWN:
      return '#6b7280'; // gray-500
    case JobStatus.CLOSED:
      return '#6b7280'; // gray-500
    case JobStatus.NOT_INTERESTED:
      return '#a855f7'; // purple-500
    default:
      return '#6b7280'; // gray-500
  }
};
```
### 3.3 Improve Badge style definition

Modify the `frontend/src/styles/components.css` file, add the badge-pending class and ensure that all badge types have complete styles:
```css
/* Badge style */
.badge {
  @apply px-3 py-1.5 rounded-full text-sm font-medium;
}

.badge-primary {
  @apply bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400;
}

.badge-pending {
  @apply bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400;
}

.badge-success {
  @apply bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400;
}

.badge-info {
  @apply bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400;
}

.badge-warning {
  @apply bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400;
}

.badge-error {
  @apply bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400;
}

.badge-default {
  @apply bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400;
}

.badge-purple {
  @apply bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400;
}
```
### 3.4 Modify existing code

#### 3.4.1 JobsPage.tsx modification
```typescript
import { getStatusStyle, JOB_STATUS_OPTIONS } from '@/utils/jobStatusUtils';

//Replace local statusOptions definition
const statusOptions = JOB_STATUS_OPTIONS;

//Replace the getStatusStyles function call
<span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusStyle(job.status, 'tailwind')}`}>
```
#### 3.4.2 JobDetailPage.tsx modification
```typescript
import { getStatusStyle } from '@/utils/jobStatusUtils';

//Replace the getStatusColor function call
<span className={`badge ${getStatusStyle(job.status)}`}>
```
#### 3.4.3 JobFormPage.tsx modification
```typescript
import { JOB_STATUS_OPTIONS } from '@/utils/jobStatusUtils';

//Replace local statusOptions definition
const statusOptions = JOB_STATUS_OPTIONS;
```
## 4. Implementation plan

1. Update the `frontend/src/types/index.ts` file and add PENDING status
2. Update the `frontend/src/styles/components.css` file and add the badge-pending style
3. Create `frontend/src/utils/jobStatusUtils.ts` file
4. Modify JobsPage.tsx
5. Modify JobDetailPage.tsx
6. Modify JobFormPage.tsx
7. Test functionality to make sure everything is working properly

## 5. Test plan

- Check whether the job status display on all pages is correct, especially the new "pending application" status
- Confirm whether the status option drop-down menu contains the new status
- Verify whether status styles are applied correctly (badge and tailwind styles)
- Verify that the styles in dark mode are correct

## 6. Expected return

- Reduce code duplication
- Improve maintainability
- Ensure consistency in status labels and styles
- Simplify future modifications to status-related functions
- Add more flexible state processing and support different style types through unified functions

## 7. Implementation Checklist

1. [Enumeration update] Add PENDING status in `frontend/src/types/index.ts` file
2. [Style update] Add badge-pending style in `frontend/src/styles/components.css`
3. [Create tool] Create `frontend/src/utils/jobStatusUtils.ts` file
4. [Import dependencies] Import the JobStatus enumeration in the tool file
5. [Implementation function] Add JOB_STATUS_OPTIONS constant and unified getStatusStyle function
6. [Modify page] Modify JobsPage.tsx and use new tool functions and options
7. [Modify page] Modify JobDetailPage.tsx and use the new getStatusStyle function
8. [Modify page] Modify JobFormPage.tsx and use unified JOB_STATUS_OPTIONS
9. [Test Verification] Start the front-end application and check whether each page is displayed normally
10. [Test Verification] Test the display effect of the new "pending application" status on each page
11. [Test Verification] Confirm whether status filtering and selection functions work properly
12. [Test Verification] Verify whether the style in dark mode is displayed correctly
