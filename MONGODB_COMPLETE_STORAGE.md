# MongoDB Student Data Storage - Complete Structure

## Current Student Record in MongoDB

```json
{
  "_id": "694f8a42eb7df319331e2621",
  "name": "Harish",
  "registerNumber": "714024104076",
  "email": "harish@college.edu",
  "phone": "+91 9876543210",
  "department": "Computer Science",
  "year": "3rd Year",
  "currentSemester": 1,
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
          "grade": "O"
        }
      ]
    }
  ],
  "createdAt": "2025-12-27T07:26:58.837Z",
  "updatedAt": "2025-12-27T07:26:58.837Z"
}
```

## Complete Field Breakdown

### Personal Information
- **name**: Student's full name (String, Required)
- **registerNumber**: Unique college registration number (String, Required, Unique)
- **email**: Student's email address (String, Required, Unique)
- **phone**: Contact phone number (String, Optional)

### Academic Information
- **department**: Student's department (String, Required, Enum)
  - Computer Science
  - Information Technology
  - Electronics & Communication
  - Electrical Engineering
  - Mechanical Engineering
  - Civil Engineering
  - Chemical Engineering
- **year**: Current academic year (String, Required, Enum)
  - 1st Year, 2nd Year, 3rd Year, 4th Year
- **currentSemester**: Current semester number (Number, Required, Min: 1, Max: 8)
- **cgpa**: Cumulative Grade Point Average (Number, Default: 0)

### Semester Data (Array)
Each semester contains:
- **num**: Semester number (Number, Required)
- **sgpa**: Semester Grade Point Average (Number, Default: 0)
- **totalCredits**: Total credits for the semester (Number, Default: 0)
- **subjects**: Array of subjects in this semester

### Subject Data (within each semester)
Each subject contains:
- **code**: Subject code (String, Required)
- **title**: Subject title (String, Required)
- **credits**: Credit hours (Number, Required)
- **grade**: Grade obtained (String, Required)
  - O, A+, A, B+, B, C, P, F

### System Fields
- **_id**: MongoDB unique identifier (ObjectId, Auto-generated)
- **createdAt**: Record creation timestamp (Date, Auto-generated)
- **updatedAt**: Last update timestamp (Date, Auto-updated)

## Database Operations

### Student Registration
```javascript
// POST /api/students/register
{
  "name": "John Doe",
  "registerNumber": "REG2024001",
  "email": "john@college.edu",
  "phone": "+91 9876543210",
  "department": "Computer Science",
  "year": "1st Year",
  "currentSemester": 1
}
```

### Student Login/Simple Registration
```javascript
// POST /api/students
{
  "name": "John Doe",
  "registerNumber": "REG2024001"
  // Additional fields optional
}
```

### Add Semester Data
```javascript
// POST /api/students/:registerNumber/semesters
{
  "semesterData": {
    "num": 2,
    "subjects": [
      {
        "code": "CS201",
        "title": "Algorithms",
        "credits": 4,
        "grade": "A"
      }
    ]
  }
}
```

## Data Validation

### Backend Validation (Mongoose Schema)
- All required fields must be present
- Email must be unique and valid format
- Register number must be unique
- Department and year must match enum values
- Semester number must be 1-8
- Grades must be valid values

### Frontend Validation
- Real-time form validation
- Email format checking
- Register number format validation
- Required field validation

## Security Features
- Unique constraints on email and register number
- Input sanitization
- Error handling for duplicate entries
- Automatic timestamp updates

## API Endpoints
- `GET /api/students/:registerNumber` - Get student details
- `POST /api/students/register` - Full student registration
- `POST /api/students` - Simple student login/registration
- `POST /api/students/:registerNumber/semesters` - Add semester data
- `GET /api/students` - Get all students (Admin only)

All student details are now fully stored and managed in MongoDB with proper validation and security measures.
