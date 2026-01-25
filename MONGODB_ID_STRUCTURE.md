# MongoDB ID Storage Structure for EduTrack

## Student Document Structure

```json
{
  "_id": "ObjectId('694f8114bccfc9334b67d83f')",  // ← MongoDB Document ID (Primary Key)
  "name": "Harish",
  "registerNumber": "714024104076",              // ← Student Register Number (Unique)
  "cgpa": 10,
  "semesters": [
    {
      "num": 1,
      "sgpa": 10,
      "totalCredits": 3,
      "subjects": [
        {
          "code": "cs101",
          "title": "Datastructures",
          "credits": 3,
          "grade": "O",
          "_id": "ObjectId('694f8129bccfc9334b67d843')"  // ← Subject ID
        }
      ],
      "_id": "ObjectId('694f8129bccfc9334b67d842')"    // ← Semester ID
    }
  ],
  "__v": 1  // ← Mongoose Version Key
}
```

## ID Types Explained

### 1. **Document ID** (`_id`)
- **Location**: Top-level field in each student document
- **Type**: `ObjectId`
- **Purpose**: MongoDB's unique identifier for the entire student document
- **Generated**: Automatically by MongoDB when document is created
- **Example**: `ObjectId('694f8114bccfc9334b67d83f')`

### 2. **Register Number** (`registerNumber`)
- **Location**: Student document field
- **Type**: `String`
- **Purpose**: Human-readable student identifier (your college roll number)
- **Unique**: Yes (enforced by schema)
- **Example**: `"714024104076"`

### 3. **Semester ID** (`_id` in semesters array)
- **Location**: Each semester object in the `semesters` array
- **Type**: `ObjectId`
- **Purpose**: Unique identifier for each semester
- **Generated**: Automatically by Mongoose
- **Example**: `ObjectId('694f8129bccfc9334b67d842')`

### 4. **Subject ID** (`_id` in subjects array)
- **Location**: Each subject object within a semester
- **Type**: `ObjectId`
- **Purpose**: Unique identifier for each subject
- **Generated**: Automatically by Mongoose
- **Example**: `ObjectId('694f8129bccfc9334b67d843')`

## How IDs Are Used in Your Application

### Frontend Uses:
- **Register Number** for student login and identification
- **Document ID** is typically handled internally by MongoDB

### Backend Uses:
- **Document ID** (`_id`) for internal MongoDB operations
- **Register Number** for student lookups and API endpoints

### API Endpoints:
```javascript
// Find student by register number
GET /api/students/:registerNumber

// Add/update student by register number
POST /api/students/
POST /api/students/:registerNumber/semesters
```

## Database Collection Structure

**Collection Name**: `students`
**Database**: `edutrack`

Each student document contains:
- 1 Document ID (`_id`)
- 1 Register Number (`registerNumber`)
- Multiple Semester IDs (one per semester)
- Multiple Subject IDs (one per subject)

## Summary

Your MongoDB stores **4 types of IDs**:
1. **Document ID** - MongoDB's primary key for each student
2. **Register Number** - Your student's roll number (used for login)
3. **Semester IDs** - Unique IDs for each semester
4. **Subject IDs** - Unique IDs for each subject within semesters

The **Register Number** is what you use in the application, while **Document IDs** are used internally by MongoDB.
