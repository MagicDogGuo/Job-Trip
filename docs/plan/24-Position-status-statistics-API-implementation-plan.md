# Job-Trip status statistics API implementation plan

## 1. Requirements Overview

Implement a new API interface to obtain statistics on the number of jobs in different statuses of users to support the statistics card function in the front-end Dashboard page.

## 2. Technical specifications

### 2.1 API Endpoint Specification

- **Path**: `/api/v1/userjobs/stats/status`
- **Method**: GET
- **Authentication**: User login required
- **Response Format**:
  ```typescript
  {
    "success": true,
    "code": 200,
"message": "Get status statistics successfully",
    "data": {
      "new": 5,
      "applied": 3,
      "interviewing": 2,
      "offer": 1,
      "rejected": 0,
      "withdrawn": 0
    }
  }
  ```
### 2.2 Implementation details

Files that need to be modified:
1. `backend/src/controllers/userJobController.ts` - Add new controller function
2. `backend/src/routes/userJobRoutes.ts` - add new routes

## 3. Specific implementation steps

### 3.1 Create controller function

Add a new function to get statistics in the `userJobController.ts` file:
```typescript
/**
* @desc Get user position status statistics
 * @route   GET /api/v1/userjobs/stats/status
* @access private
 */
export const getStatusStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
return next(new AppError('Not authenticated, cannot access', 401));
    }

// Use the MongoDB aggregation pipeline to get the number of each state
    const stats = await UserJob.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

// Initialize the count of all possible states to 0
    const result: Record<string, number> = {
      new: 0,
      not_interested: 0
      pending: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      closed: 0
    };

// Fill in the actual count
    stats.forEach((stat) => {
      if (stat._id) {
        result[stat._id] = stat.count;
      }
    });

    res.status(200).json(createApiResponse(
      200,
'Get status statistics successfully',
      result
    ));
  } catch (error) {
    next(error);
  }
};
```
### 3.2 Add new route

Add a new route in the `userJobRoutes.ts` file:
```typescript
/**
 * @swagger
 * /userjobs/stats/status:
 *   get:
* summary: Get user position status statistics
* tags: [user position association]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
* description: Successfully obtained status statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
* example: Obtain status statistics successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     new:
 *                       type: number
 *                       example: 5
 *                     applied:
 *                       type: number
 *                       example: 3
 *                     interviewing:
 *                       type: number
 *                       example: 2
 *                     offer:
 *                       type: number
 *                       example: 1
 *                     rejected:
 *                       type: number
 *                       example: 0
 *                     withdrawn:
 *                       type: number
 *                       example: 0
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stats/status', getStatusStats);
```
## 4. Verification test method

Manual testing:
1. Use Postman/curl to send a request to `/api/v1/userjobs/stats/status`
2. Confirm whether the response format meets expectations
3. Test whether the statistics card displays data correctly on the front-end Dashboard page

## 5. Implementation Checklist:

1. Import the required modules and types in userJobController.ts
2. Implement the getStatusStats controller function in userJobController.ts
3. Export getStatusStats function
4. Import the new getStatusStats function in userJobRoutes.ts
5. Add a GET route for the /stats/status path in userJobRoutes.ts
6. Restart the Node.js server to test the new interface
7. Verify in the browser whether the front-end Dashboard page displays statistics correctly