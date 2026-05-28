[Mode:Plan][Model:Claude 3.7 Sonnet]

# Position status acquisition and management reconstruction plan

## Problem analysis

In the current Job-Trip system, the acquisition and management of job status have the following core issues:

1. **Data redundancy**: Both the `jobs` collection and the `user_jobs` collection store position status information, causing the status to be inconsistent.
2. **Front-end acquisition error**: The job list page directly obtains positions and their status from the `jobs` collection instead of obtaining the status associated with the current user.
3. **API route is unclear**: The API route for the front-end to call `/jobs/${jobId}/status` to update the status is not clearly defined on the back-end.
4. **Blurred Responsibility Boundaries**: The position itself should not have an application status, the application status should belong to the user-position relationship

## Technical reconstruction plan

### 1. Data model modification

#### 1.1 Remove the status field in the Job model
```typescript
// Remove the status field and related enumerations from jobModel.ts
export interface IJob extends Document {
  platform: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  requirements?: string[];
  salary?: string;
  jobType?: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  appliedDate?: Date;
  deadline?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
//Remove status field
}
```
#### 1.2 Move JobStatus enumeration

Move status enum from `jobModel.ts` to `userJobModel.ts`:
```typescript
//Job application status enumeration
export enum JobStatus {
NEW = 'new', // newly discovered positions
NOT_INTERESTED = 'not_interested', // not interested
PENDING = 'pending', // pending application
APPLIED = 'applied', // Applied
INTERVIEWING = 'interviewing', // Interviewing
OFFER = 'offer', //offer received
REJECTED = 'rejected', // Rejected
WITHDRAWN = 'withdrawn', // The application has been withdrawn
CLOSED = 'closed', // closed
}
```
### 2. Backend API adjustment

#### 2.1 Create position status update route

Add explicit status update routes in `backend/src/routes/jobRoutes.ts`:
```typescript
// Update job status - actually update the status of the user-job association
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?._id;

    if (!userId) {
return next(new AppError('Not authenticated, cannot access', 401));
    }

// Find or create user-position association
    let userJob = await UserJob.findOne({ userId, jobId: id });
    
    if (!userJob) {
// If no association exists, create a new association
      userJob = await UserJob.create({
        userId,
        jobId: id,
        status,
        isFavorite: false
      });
      
// Create status history record
      await ApplicationHistory.create({
        userJobId: userJob._id,
        previousStatus: '',
        newStatus: status,
notes: 'Initial state',
        updatedBy: userId
      });
    } else {
//Record previous state
      const previousStatus = userJob.status;
      
// update status
      userJob.status = status;
      await userJob.save();
      
//Create status change history
      if (previousStatus !== status) {
        await ApplicationHistory.create({
          userJobId: userJob._id,
          previousStatus,
          newStatus: status,
          notes: req.body.notes || '',
          updatedBy: userId
        });
      }
    }

// Get complete job information
    const job = await Job.findById(id);
    
//return result
    res.status(200).json(createApiResponse(
      200,
'Update position status successfully',
      {
        ...job.toObject(),
        userStatus: userJob.status
      }
    ));
  } catch (error) {
    next(error);
  }
});
```
#### 2.2 Add an API interface to obtain the user’s associated positions

Add new method in `jobController.ts`:
```typescript
/**
* @desc Get the list of positions associated with the user
 * @route   GET /api/v1/jobs/user
* @access private
 */
export const getUserRelatedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
return next(new AppError('Not authenticated, cannot access', 401));
    }

// Build query conditions
    const queryObj: any = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

// paging
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

// Query user-position association
    const userJobs = await UserJob.find({ userId, ...queryObj })
      .populate({
        path: 'jobId',
        select: 'title company location description salary jobType platform sourceUrl createdAt updatedAt'
      })
      .sort(req.query.sort ? req.query.sort : '-createdAt')
      .skip(skip)
      .limit(limit);

//Format data
    const jobs = userJobs.map(userJob => {
      const job = userJob.jobId as any;
      return {
        ...job.toObject(),
        status: userJob.status,
        isFavorite: userJob.isFavorite,
        userJobId: userJob._id,
        customTags: userJob.customTags,
        notes: userJob.notes,
        reminderDate: userJob.reminderDate
      };
    });

// Get the total number
    const total = await UserJob.countDocuments({ userId, ...queryObj });

//return result
    res.status(200).json(createApiResponse(
      200,
'Getting user associated job list successfully',
      {
        total,
        page,
        size: limit,
        data: jobs,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    ));
  } catch (error) {
    next(error);
  }
};
```
Then add routes in `jobRoutes.ts`:
```typescript
router.get('/user', getUserRelatedJobs);
```
### 3. Front-end service layer modification

#### 3.1 Update JobStatusService

Modify `frontend/src/services/jobStatusService.ts`:
```typescript
import api from './api';
import { Job } from '@/types';

/**
*Job status service
* Directly interact with the API, bypassing Redux, and used for rapid UI update scenarios
 */
const jobStatusService = {
  /**
* Update job status
* @param jobId job ID
* @param status new status
* @returns updated position object
   */
  updateJobStatus: async (jobId: string, status: string): Promise<Job> => {
    try {
      return await api.put<Job>(`/jobs/${jobId}/status`, { status });
    } catch (error) {
console.error(`Failed to update job status (ID: ${jobId}, status: ${status}):`, error);
      throw error;
    }
  },
  
  /**
* Get the user's status for a specific position
* @param jobId job ID
* @returns user-position association object
   */
  getUserJobStatus: async (jobId: string): Promise<any> => {
    try {
      return await api.get(`/userjobs/job/${jobId}`);
    } catch (error) {
console.error(`Failed to obtain job status (ID: ${jobId}):`, error);
      throw error;
    }
  }
};

export default jobStatusService;
```
#### 3.2 Add user-position API interface

Modify `frontend/src/services/jobService.ts`:
```typescript
//Add a method to obtain the user's associated position
getUserRelatedJobs: async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}): Promise<PaginatedResponse<Job>> => {
  try {
    return await api.get<PaginatedResponse<Job>>('/jobs/user', params);
  } catch (error) {
console.error('Failed to obtain user associated position list:', error);
    throw error;
  }
}
```
### 4. Front-end UI component update

#### 4.1 Modify JobsPage to obtain the job list

Update `frontend/src/pages/JobsPage.tsx`:
```typescript
//Load job list data
const loadJobs = async () => {
  try {
// Build query parameters
    const queryParams = {
      page,
      limit,
      ...(searchTerm && { search: searchTerm }),
      ...(sortOption && { sort: sortOption }),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
    };
    
    console.log('Fetching jobs with params:', queryParams);
    
// Get a list of positions associated with the user, not all positions
    const result = await dispatch(fetchUserRelatedJobs(queryParams));
    
// handle response
    if (fetchUserRelatedJobs.fulfilled.match(result)) {
// If the current page has no data and is not the first page, return to the first page
      if (result.payload.data.length === 0 && page > 1) {
        setPage(1);
        return;
      }
    }
  } catch (error) {
console.error('Error loading data:', error);
  }
};
```
#### 4.2 Update JobListItem component

Modify `frontend/src/components/jobs/JobListItem.tsx`:
```typescript
interface JobListItemProps {
  job: Job & {
    status?: string;
    userJobId?: string;
    isFavorite?: boolean;
  };
}

const JobListItem: React.FC<JobListItemProps> = ({ job }) => {
// ...existing code...
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        transition: 'transform 0.2s, box-shadow 0.2s', 
        '&:hover': { 
          transform: 'translateY(-2px)', 
          boxShadow: 3 
        }
      }}
    >
      <Grid container spacing={2} alignItems="center">
{/*Basic job information */}
        <Grid item xs={12} md={8}>
{/* ...existing code... */}
          
{/* Add status display */}
          {job.status && (
            <Box sx={{ mt: 1 }}>
              <StatusBadge 
                jobId={job._id} 
                status={job.status} 
                size="sm"
                onStatusChange={(jobId, newStatus) => {
console.log('Status updated:', jobId, newStatus);
                }}
              />
            </Box>
          )}
        </Grid>
        
{/* ...other existing code... */}
      </Grid>
    </Paper>
  );
};
```
#### 4.3 Modify JobDetailPage to obtain job status

Update `frontend/src/pages/JobDetailPage.tsx`:
```typescript
const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { job, isLoading, error } = useSelector((state: RootState) => state.jobs);
  const [userJobStatus, setUserJobStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
//Load job data
  useEffect(() => {
    if (id) {
      dispatch(fetchJob(id));
      
//Additionally obtain the user's status for the position
      const loadUserJobStatus = async () => {
        try {
          const userJobData = await jobStatusService.getUserJobStatus(id);
          if (userJobData) {
            setUserJobStatus(userJobData.status);
          }
        } catch (err) {
console.error('Failed to obtain user-position status', err);
        }
      };
      
      loadUserJobStatus();
    }
  }, [dispatch, id]);
  
// ...existing code...
  
  return (
    <div className="container-lg">
{/* ...existing code... */}
      
{/* Position title and status */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="title-lg">{job.title}</h1>
        <StatusBadge 
          jobId={job._id} 
          status={userJobStatus || job.status} 
          onStatusChange={(jobId, newStatus) => {
            setUserJobStatus(newStatus);
          }}
        />
      </div>
      
{/* ...other existing code... */}
    </div>
  );
};
```
### 5. Redux state management update

#### 5.1 Add Thunk to obtain the user’s associated position

Add in `frontend/src/redux/slices/jobsSlice.ts`:
```typescript
export const fetchUserRelatedJobs = createAsyncThunk(
  'jobs/fetchUserRelatedJobs',
  async (params: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
    status?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await jobService.getUserRelatedJobs(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

//Add the corresponding case in extraReducers
.addCase(fetchUserRelatedJobs.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchUserRelatedJobs.fulfilled, (state, action) => {
  state.isLoading = false;
  state.jobs = action.payload.data;
  state.pagination = action.payload.pagination;
  state.error = null;
})
.addCase(fetchUserRelatedJobs.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
```
## Implementation Checklist

1. [Create] Move the JobStatus enumeration file to userJobModel.ts
2. [Modify] Remove the status field and related enumerations from jobModel.ts
3. [Modify] Update userJobModel.ts with new enumeration
4. [Add] Add getUserRelatedJobs method in jobController.ts
5. [Modify] Modify jobRoutes.ts to add /jobs/user and /jobs/:id/status routes
6. [Modify] Update jobStatusService.ts to add getUserJobStatus method
7. [Modify] Update jobService.ts to add getUserRelatedJobs method
8. [Modification] Modify JobsPage.tsx to obtain the user-related job list
9. [Modify] Update JobListItem.tsx to display job status
10. [Modification] Modify JobDetailPage.tsx to obtain user-job status
11. [Modify] Update jobsSlice.ts to add fetchUserRelatedJobs Thunk
12. [Create] Create a new data migration script backend/scripts/migrateJobStatus.ts
13. [Modify] Update initdb.js to remove status-related fields and indexes in the jobs collection
14. [Execute] Run the data migration script to transfer existing state data
15. [Test] Test whether the job list page can correctly display the user’s job status
16. [Test] Test whether the job details page can display and update status correctly
17. [Test] Verify whether status updates are correctly saved to the user_jobs collection
