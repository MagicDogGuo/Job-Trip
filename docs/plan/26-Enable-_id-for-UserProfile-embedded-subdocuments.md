We will adopt the solution: modify the back-end model to allow Mongoose to generate `_id` for embedded sub-documents (such as education experience, work experience, etc.). This will provide a stable `key` for the frontend and simplify update and delete operations.

**Schedule Documents: Enable _id for UserProfile embedded subdocuments**

**1. Purpose**
   Solve the warning caused by the lack of a unique `key` prop when the front-end React component renders a list (such as education experience, work experience, etc.). By enabling automatic generation of `_id` for these embedded subdocuments in the back-end Mongoose model, a stable unique identifier can be provided, simplifying the front-end list rendering and data manipulation logic.

**2. Affected files**
   * `backend/src/models/userProfileModel.ts`: The Schema definition of the embedded document needs to be modified.
   * `backend/src/controllers/userProfileController.ts`: Some logic involving subdocument array operations may need to be adjusted to adapt to the new `_id` field (mainly to confirm whether the existing logic can handle subdocuments with `_id`).
   * `backend/src/routes/userProfileRoutes.ts`: The relevant request/response body Schema in the Swagger document may need to be updated to reflect that the subdocument contains `_id`.
   * `backend/scripts/initdb.js`: The test data generation script needs to be updated. Manually add `_id` for embedded subdocuments (if Mongoose does not automatically add `_id` to existing data during `create` or `insertMany`), or ensure that newly generated test data can automatically obtain `_id`.
   * `docs/database-requirements.md`: Update the structure of the `user_profiles` collection in the database requirements document to explicitly state that objects in the embedded array will contain `_id`.
   * Front-end related files (such as `EducationSection.tsx`, `WorkExperienceSection.tsx`, etc.): Although this plan mainly focuses on the back-end, the ultimate goal is to allow the front-end to use these `_id` as `key`. Modifications to the front end will be made in subsequent steps, but this plan is a prerequisite.

**3. Detailed plan**

   **3.1. Modify `backend/src/models/userProfileModel.ts`**
      * **Task**: Enable `_id` for subdocument Schema definitions of all embedded arrays in the `user_profiles` model.
      * **Specific operations**:
         * Find the following Schema definition:
            * `educationSchema`
            * `workExperienceSchema`
            * `skillSchema`
            * `certificationSchema`
            * `projectSchema`
            * `languageSchema`
            * `volunteerExperienceSchema`
            * `honorAwardSchema`
            * `recommendationSchema`
         * For each Schema above, remove the `{ _id: false }` option. If this option is not present, no action is required as Mongoose will add `_id` to the subdocument by default.
            * For example, would:
              ```typescript
              const educationSchema = new Schema({ ... }, { _id: false });
              ```
Modify to:
              ```typescript
              const educationSchema = new Schema({ ... });
              ```
Or specify it explicitly:
              ```typescript
              const educationSchema = new Schema({ ... }, { _id: true });
              ```
(Mongoose defaults to `_id: true` for subdocument Schema, so remove `{ _id: false }`.)

   **3.2. Update `docs/database-requirements.md`**
      * **Task**: In the document structure of the `user_profiles` collection, add an `_id: ObjectId` field for each object example in the embedded array (`educations`, `workExperiences`, `skills`, etc.).
      * **Specific operations**:
         * For example, the structure of `educations`:
           ```javascript
           educations: [{
             institution: String,
             // ...
           }],
           ```
Modify to:
           ```javascript
           educations: [{
_id: ObjectId, // Add this line
             institution: String,
             // ...
           }],
           ```
* Apply this change to all relevant embedded arrays.

   **3.3. Update `backend/scripts/initdb.js`**
      * **Task**: Ensure that `_id` is available for embedded subdocuments in test data.
      * **Specific operations**:
         * When Mongoose adds new subdocuments through `create()` or the `save()` method of a model instance, if the Schema allows it (that is, without `_id: false`), `ObjectId` will be automatically generated for them as `_id`.
         * Check how `userProfiles` is created in the `insertTestData` function. Since JavaScript objects are defined directly and then `insertMany` is used here, Mongoose may not automatically add `_id` to these predefined subdocuments because `insertMany` may bypass some Mongoose middleware and default behaviors.
         * **Option A (recommended)**: Manually add the `_id` field to each embedded array member of the `userProfiles` test data object and assign a new `ObjectId`. This requires the introduction of `mongodb.ObjectId`.
            ```javascript
            const { ObjectId } = require('mongodb');
            // ...
            educations: [
              {
_id: new ObjectId(), // Add manually
institution: "University of Auckland",
                // ...
              },
            // ...
            ```
* **Option B**: If you want Mongoose to handle it automatically, you can consider inserting test data through the creation and saving methods of the Mongoose model instance instead of directly using `insertMany` to drive native MongoDB. But this may make the script more complex. For initialization scripts, it is more straightforward to manually add `_id` to the test data.
         * Select option A and add `_id: new ObjectId()` to all sub-objects embedded in the array in `userProfiles` (such as each object in the `educations`, `workExperiences`, etc. arrays).

   **3.4. Review `backend/src/controllers/userProfileController.ts`**
      * **Task**: Check all controller functions that handle the `user_profiles` subdocument array (add, delete, modify) to ensure that they can correctly handle or utilize the new `_id` field.
      * **Specific operations**:
         * **Add operation (e.g., `addEducation`)**:
            * When pushing a new child item to the array `push`, Mongoose will automatically generate `_id` for the new child item when the parent document `save()`. The controller code usually does not need to be changed significantly, because the returned userProfile object will contain these newly generated _id`s.
            * Current code: `userProfile.educations.push(req.body); await userProfile.save();` - This is correct, `req.body` (as a new element in the array) will be assigned `_id` after `save()`.
         * **Update operations (e.g., `updateEducation`)**:
            * Functions such as `updateEducation` currently use an array index (`req.params.index`) to locate the subdocument to be updated. This will still work.
            * If you want to target subdocuments for updates by `_id` in the future (which is more robust), you will need to modify the API routing (e.g. `/me/educations/:educationId`) and controller logic (use `$set` with array filters or `findOneAndUpdate` with `arrayFilters`). **This plan does not include this modification and maintains the existing index-based update logic. **
            * Just make sure that the updated subdocument returned to the frontend contains its `_id`.
         * **Delete operation (e.g., `deleteEducation`)**:
            * Currently also uses array indexing. Again, this can continue to work.
            * If you want to delete via `_id` in the future, you will also need to modify the API and controller logic (using `$pull`). **This plan does not include this modification. **
         * **Conclusion**: The controller level may not need to make major logical changes in this plan. The main thing is to ensure that Mongoose correctly handles the generation of `_id` and that these `_id` are included in the response.

   **3.5. Review `backend/src/routes/userProfileRoutes.ts`**
      * **Task**: Update the Swagger (OpenAPI) documentation to reflect that embedded subdocuments will now contain the `_id` field.
      * **Specific operations**:
         * Check all Swagger JSDoc comments involving the `UserProfile` response body (especially arrays containing `educations`, `workExperiences`, etc.).
         * In the corresponding Schema definition, add `_id` to the attribute list of the embedded object.
         * For example, in `#/components/schemas/UserProfileResponse` (or similar Schema definition) annotated with `@swagger`, if `Education` is defined as:
           ```yaml
           Education:
             type: object
             properties:
               institution:
                 type: string
               # ...
           ```
Need to be modified to:
           ```yaml
           Education:
             type: object
             properties:
               _id:
type: string # Usually ObjectId is represented as string in JSON
                 format: objectid
                 description: The unique identifier for the education entry.
               institution:
                 type: string
               # ...
           ```
* Repeat this for all affected subdocument types.

**4. Expected results**
   * Embedded array members (such as education experience, work experience, etc.) in the `user_profiles` collection in the database will have unique `_id` automatically generated by Mongoose.
   * The API response will include their `_id` when returning these embedded array members.
   * Database requirements documents and initialization scripts will be consistent with this change.
   * Pave the way for the frontend to use these `_id` as `key` for React lists, resolve "missing key prop" warnings, and lay the foundation for more robust sub-document CRUD operations.

**5. Potential Risks and Mitigations**
   * **Data Migration**: For existing `user_profiles` data, its embedded subdocuments will not automatically obtain `_id`. A one-time migration script needs to be written to add `_id` to these subdocuments in the existing data. **This plan does not include the writing and execution of migration scripts, but you need to be aware of this requirement. **
   * **Test data script**: If the manual addition of `_id` in `initdb.js` is incorrect (for example, `ObjectId` is not generated or introduced correctly), there may be problems with the test data. Test the script carefully.
   * **API Compatibility**: While the goal is to enhance functionality, adding a new field (`_id`) to the response is theoretically generally backwards compatible. Existing clients should not be disrupted by this, but clients that rely on exact schema matching may need to be updated.

---

**Implementation Checklist:**
1. **Modify `backend/src/models/userProfileModel.ts`**:
    * [ ] Removed `{ _id: false }` from `educationSchema` definition.
    * [ ] Removed `{ _id: false }` from `workExperienceSchema` definition.
    * [ ] Removed `{ _id: false }` from `skillSchema` definition.
    * [ ] Removed `{ _id: false }` from `certificationSchema` definition.
    * [ ] Removed `{ _id: false }` from `projectSchema` definition.
    * [ ] Removed `{ _id: false }` from `languageSchema` definition.
    * [ ] Removed `{ _id: false }` from `volunteerExperienceSchema` definition.
    * [ ] Removed `{ _id: false }` from `honorAwardSchema` definition.
    * [ ] Remove `{ _id: false }` from `recommendationSchema` definition.
2. **Update `docs/database-requirements.md`**:
    * [ ] Add `_id: ObjectId` to the `educations` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `workExperiences` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `skills` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `certifications` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `projects` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `languages` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `volunteerExperiences` array object definition in the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` to the `honorsAwards` array object definition of the `user_profiles` collection.
    * [ ] Add `_id: ObjectId` in the `recommendations` array object definition of the `user_profiles` collection.
3. **Update `backend/scripts/initdb.js`**:
    * [ ] introduces `mongodb.ObjectId`.
    * [ ] Add `_id: new ObjectId()` to each member of the `educations` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `workExperiences` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `skills` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `certifications` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `projects` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `languages` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `volunteerExperiences` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `honorsAwards` array of the `userProfiles` test data object.
    * [ ] Add `_id: new ObjectId()` to each member of the `recommendations` array of the `userProfiles` test data object.
4. **Review `backend/src/controllers/userProfileController.ts`**:
    * [ ] Confirm that after adding, updating, or deleting a subdocument, in the returned `userProfile` object, the corresponding subdocument contains `_id`. (It is expected that Mongoose will handle it automatically, mainly verification)
5. **Update `backend/src/routes/userProfileRoutes.ts` (Swagger documentation)**:
    * [ ] In the relevant `UserProfile` response Schema definition, add `_id` to the attribute of the `educations` array object.
    * [ ] In the relevant `UserProfile` response schema definition, add `_id` to the attribute of the `workExperiences` array object.
    * [ ] In the relevant `UserProfile` response schema definition, add `_id` to the attribute of the `skills` array object.
    * [ ] In the relevant `UserProfile` response schema definition, add `_id` to the attribute of the `certifications` array object.
    * [ ] In the relevant `UserProfile` response Schema definition, add `_id` to the attribute of the `projects` array object.
    * [ ] In the relevant `UserProfile` response Schema definition, add `_id` to the attribute of the `languages` array object.
    * [ ] In the relevant `UserProfile` response schema definition, add `_id` to the attribute of the `volunteerExperiences` array object.
    * [ ] In the relevant `UserProfile` response schema definition, add `_id` to the attribute of the `honorsAwards` array object.
    * [ ] In the relevant `UserProfile` response schema definition, add `_id` to the attribute of the `recommendations` array object.
6. **Test**:
    * [ ] Run the `initdb.js` script to check whether the data generated in the database is as expected (the subdocument contains `_id`).
    * [ ] Verify that the response contains the `_id` of the subdocument by API testing (e.g. using Postman or unit/integration testing) the `POST`, `PUT`, `DELETE` endpoints of the subdocument.
    * [ ] (manually) Check the Swagger UI to confirm that the API documentation has been updated.
