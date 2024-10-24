ol hub v2


# Implementation Roadmap

## Current Implementation
- Next.js 13+ App Router structure
- Landing page with student/tutor options
- Dashboard layout with basic navigation
- LessonCard component
- Student and Tutor dashboard pages with mock data

## Core Types
```typescript
type UserRole = 'student' | 'tutor';

interface Lesson {
  id: string;
  studentName: string;
  tutorName: string;
  dateTime: string;
  rescheduleRequest?: {
    proposedDateTime: string;
    requestedBy: UserRole;
  };
}
```

## Project Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx   (dashboard wrapper)
│   │   ├── student/
│   │   │   └── page.tsx (student view)
│   │   └── tutor/
│   │       └── page.tsx (tutor view)
│   └── page.tsx         (landing page)
└── components/
    └── LessonCard.tsx   (shared component)
```

## Implementation Stages

### 1. Core Scheduling Logic
```typescript
// State Management in Dashboards
const [lessons, setLessons] = useState<Lesson[]>([...mockData]);

// Required Functions
- requestReschedule(lessonId: string, newDateTime: string)
- acceptReschedule(lessonId: string)
- declineReschedule(lessonId: string)
```

#### LessonCard Updates
- Implement handleReschedule function
- Add accept/decline functionality
- Add basic date selection for new times

### 2. Testing Workflows

#### Student View (/student)
- View all their lessons
- Request reschedule for a lesson
- Accept/decline tutor's reschedule requests

#### Tutor View (/tutor)
- View all lessons for all students
- Request reschedule for any lesson
- Accept/decline student's reschedule requests

#### Shared Features
- Current lesson times display
- Pending reschedule requests
- Success/error states for actions

### 3. UI Enhancements

#### Basic Feedback
- Success/error messages for actions
- Loading states during updates
- Confirmation dialogs for accept/decline actions

#### Date Selection
- Implement simple date/time picker
- Add time validation
- Display available time slots

### 4. Future Enhancements (Post-MVP)
- Calendar view for lessons
- Filter and sort functionality
- Reschedule request history
- Basic UI notifications
- Authentication integration
- Database integration

## Design Notes
- Minimal black/white color scheme
- Clean UI with hover effects
- Consistent button styling
- Mobile-responsive layouts

## Testing Without Auth
Current pseudo-login system allows testing of all core functionality:
- Student flow via /student route
- Tutor flow via /tutor route
- All scheduling features testable without auth

## Next Immediate Steps
1. Implement basic reschedule request functionality
2. Add accept/decline logic
3. Integrate simple date selection
4. Add basic success/error feedback

## Notes
- Keep functionality minimal but complete
- Focus on core scheduling features first
- Maintain consistent UI/UX
- Prioritize mobile responsiveness