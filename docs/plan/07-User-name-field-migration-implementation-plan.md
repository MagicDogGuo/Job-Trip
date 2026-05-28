[Mode:Plan][Model:Claude 3.7 Sonnet]

# User name field migration implementation plan

## 1. Overview

This plan aims to migrate the firstName and lastName fields in the user collection (users) to the user profile collection (user_profiles) so that the user's name can be displayed in the basic information part of the user profile. This allows all personal information to be stored uniformly in the user profile, improving data consistency.

## 2. Database model modification

### 2.1 Modify user profile model (userProfileModel.ts)
```javascript
// Modify the IUserProfile interface and add a name field
export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId | IUser;
firstName?: string; // Added: first name
lastName?: string; // Added: last name
  headline?: string;
// ... other existing fields
}

// Modify user profile Schema
const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
required: [true, 'User ID is required'],
      unique: true
    },
firstName: String, // Added: first name
lastName: String, // Added: last name
    headline: String,
// ... other existing fields
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
```
### 2.2 Update front-end Profile type definition
```typescript
// Complete user profile type (profile.ts)
export interface UserProfile {
  _id?: string;
  userId: string;
firstName: string; // Added: first name
lastName: string; // Added: last name
  headline: string;
// ... other existing fields
}
```
## 3. Data migration strategy

No data migration required now

## 4. Backend API modification

### 4.1 Modify user controller (userController.ts)
```javascript
// Modify the registered user controller and create a user profile at the same time
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, firstName, lastName, preferences } = req.body;

// Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
return next(new AppError('User already exists', 400));
    }

//Create new user (retain firstName and lastName for backward compatibility)
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      preferences,
    });

// Create user profile at the same time and copy name information
    await UserProfile.create({
      userId: user._id,
      firstName,
      lastName
    });

// Generate JWT token
    const token = user.generateAuthToken();

// Return user data and token
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      preferences: user.preferences,
      status: user.status,
    };

    res.status(201).json(createApiResponse(
      200,
'User registration successful',
      {
        token,
        user: userData
      }
    ));
  } catch (error) {
    next(error);
  }
};

// Update other related controller methods to maintain backward compatibility
```
### 4.2 Modify user profile controller (userProfileController.ts)
```javascript
// Update the user profile controller to handle the name field
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user?._id });
    const { firstName, lastName } = req.body;

    if (!userProfile) {
// If the user profile does not exist, create a new one
      const newUserProfile = await UserProfile.create({
        userId: req.user?._id,
        firstName,
        lastName,
        ...req.body
      });

// Synchronously update the names in the user collection (maintaining compatibility)
      if (firstName || lastName) {
        await User.findByIdAndUpdate(req.user?._id, { 
          firstName: firstName || '',
          lastName: lastName || ''
        });
      }

      return res.status(201).json(createApiResponse(
        201,
'User profile created successfully',
        newUserProfile
      ));
    }

//Update user profile
// Do not allow changes to the userId field
    const { userId, ...updateData } = req.body;

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      userProfile._id,
      updateData,
      { new: true, runValidators: true }
    );

// Synchronously update the names in the user collection (maintaining compatibility)
    if (firstName || lastName) {
      await User.findByIdAndUpdate(req.user?._id, { 
        firstName: firstName || req.user?.firstName,
        lastName: lastName || req.user?.lastName
      });
    }

    res.status(200).json(createApiResponse(
      200,
'User profile updated successfully',
      updatedProfile
    ));
  } catch (error) {
    next(error);
  }
};
```
### 4.3 Modify the user profile routing API document (userProfileRoutes.ts)

Updated API documentation to add name field to request and response examples.

## 5. Modification of front-end services and components

### 5.1 Update profileService.ts

No modification is required, the existing getUserProfile and updateUserProfile methods can already handle the new fields.

### 5.2 Update user profile related components
```typescript
//Add the display and editing of the name field in the user profile component
// frontend/src/components/profile/forms/BasicInfoForm.tsx
//Add firstName and lastName fields to the form

//In the component that displays the user profile, get the name from profile instead
const fullName = profile.firstName && profile.lastName
  ? `${profile.firstName} ${profile.lastName}`
  : profile.firstName || profile.lastName || '';
```
### 5.3 Modify AuthService synchronization logic

Update authService.ts to ensure that the name field in the user profile is synchronized when the user updates.

## 6. Test Plan

1. Unit testing:
   - Test new fields for user model and user profile model
   - Test the modification logic of user controller and user profile controller

2. Integration testing:
   - Test user registration flow to ensure names are saved correctly to both collections
   - Test user profile updates to ensure names are synced to user collections

3. End-to-end testing:
   - Test the complete process of user registration, login and profile update
   - Test all pages that need to display the user's name

## 7. Release plan

1. Preparation stage:
   - Updated database model and API
   - Run data migration script
   - Updated front-end components

2. Release phase:
   - Deploy database changes
   - Deploy backend API changes
   - Deploy front-end changes
   - Verify system functionality

3. Monitoring phase:
   - Monitor system error logs
   - Collect user feedback

## 8. Rollback plan

To roll back:
1. Restore the original code version
2. Retain migrated data to ensure data consistency
3. Provide a script to synchronize the names in the user profile back to the user collection

## Implementation Checklist:

1. Modify the backend data model (userProfileModel.ts) and add firstName and lastName fields
2. Update the front-end Profile interface definition and add firstName and lastName fields
3. Create a data migration script (migrateUserNames.js) to migrate name data from the users collection to the user_profiles collection
4. Modify the user registration controller (userController.ts) and create a user profile with a name.
5. Modify the user profile update controller (userProfileController.ts) to process the name field and keep the two collections synchronized
6. Update API documentation and add new fields to examples
7. Modify the front-end user profile component and add the display and editing functions of the name field
8. Update the front-end service to ensure that name information is synchronized when user profiles are updated.
9. Write and execute unit tests, integration tests and end-to-end tests
10. Deploy changes and monitor the system according to the release plan
11. Prepare a rollback plan in case of emergencies
