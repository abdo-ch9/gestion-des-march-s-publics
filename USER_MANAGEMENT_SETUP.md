# Dynamic User Management System Setup Guide

## Overview

This guide explains how to set up and use the dynamic user management system that replaces the static mock data with real-time database operations.

## What's New

The user management page has been transformed from a static interface with hardcoded data to a fully dynamic system that:

- ✅ Fetches users from a real database
- ✅ Supports real-time CRUD operations (Create, Read, Update, Delete)
- ✅ Includes advanced filtering and search capabilities
- ✅ Provides proper loading states and error handling
- ✅ Shows toast notifications for user feedback
- ✅ Implements proper form validation and submission states

## Database Setup

### 1. Create the User Profiles Table

Run the SQL script `create_user_profiles_table.sql` in your Supabase database:

```sql
-- This will create the user_profiles table with proper structure
-- and sample data for testing
```

### 2. Table Structure

The `user_profiles` table includes:

- **id**: Unique identifier (UUID)
- **user_id**: Reference to Supabase auth user (optional)
- **email**: User's email address (unique)
- **full_name**: User's full name
- **role**: User role (admin, manager, agent)
- **department**: User's department
- **phone**: Phone number
- **status**: Account status (active, inactive, suspended)
- **last_login**: Last login timestamp
- **created_at/updated_at**: Timestamps
- **created_by/updated_by**: Audit trail

### 3. Row Level Security (RLS)

The table includes RLS policies that ensure:
- Users can only view their own profile
- Admins can view, create, update, and delete all profiles
- Users can update their own profile

## Features

### Advanced Filtering

- **Role Filter**: Filter by admin, manager, or agent
- **Status Filter**: Filter by active, inactive, or suspended
- **Department Filter**: Dynamic filter based on existing departments
- **Search**: Search across name, email, and department
- **Reset Filters**: One-click reset for all filters

### Real-time Operations

- **Create Users**: Add new users with full profile information
- **Edit Users**: Modify existing user profiles
- **Delete Users**: Remove users with confirmation
- **Status Management**: Change user account status
- **Department Assignment**: Assign users to departments

### User Experience

- **Loading States**: Visual feedback during operations
- **Error Handling**: Proper error messages and recovery
- **Success Notifications**: Toast messages for successful operations
- **Responsive Design**: Works on all device sizes
- **Empty States**: Helpful messages when no users are found

## Usage

### 1. Viewing Users

The system automatically loads all users when the page loads. Users are displayed in a table with:

- User avatar and contact information
- Role badges (color-coded)
- Department information
- Status indicators
- Last login time
- Action buttons

### 2. Adding Users

1. Click the "Nouvel Utilisateur" button
2. Fill in the required fields:
   - Full name
   - Email address
   - Role selection
   - Department assignment
   - Phone number (optional)
   - Status (defaults to active)
3. Click "Créer l'Utilisateur"

### 3. Editing Users

1. Click the edit button (pencil icon) for any user
2. Modify the desired fields
3. Click "Sauvegarder les Modifications"

### 4. Deleting Users

1. Click the delete button (trash icon) for any user
2. Confirm the deletion in the popup
3. User will be removed from the system

### 5. Filtering and Searching

- Use the search bar to find users by name, email, or department
- Use the dropdown filters to narrow results by role, status, or department
- Click "Réinitialiser" to clear all filters

## Technical Implementation

### Hooks Used

- **useAdmin**: Provides all CRUD operations for users
- **useToast**: Shows success/error notifications

### State Management

- Local state for UI components (modals, forms, filters)
- Global state managed by the useAdmin hook
- Automatic data refresh after operations

### Error Handling

- Try-catch blocks around all async operations
- User-friendly error messages
- Automatic error clearing
- Fallback UI states

## Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

### Sample Data

The setup script includes 5 sample users:

1. **Ahmed Benali** - Agent (Irrigation)
2. **Fatima Zahra** - Manager (Formation)
3. **Mohammed Alami** - Agent (Équipement)
4. **Amina Tazi** - Admin (Administration)
5. **Hassan El Fassi** - Agent (Infrastructure) - Inactive

### Testing Scenarios

1. **Create User**: Add a new user with different roles
2. **Edit User**: Modify existing user information
3. **Delete User**: Remove a user and verify removal
4. **Filtering**: Test all filter combinations
5. **Search**: Test search functionality with various terms
6. **Error Handling**: Test with invalid data or network issues

## Troubleshooting

### Common Issues

1. **Users not loading**: Check Supabase connection and RLS policies
2. **Permission errors**: Ensure current user has admin role
3. **Form submission fails**: Check required fields and data validation
4. **Toast not showing**: Verify useToast hook is properly imported

### Debug Steps

1. Check browser console for errors
2. Verify Supabase client configuration
3. Check database table structure
4. Verify RLS policies are active
5. Test database connection directly

## Security Considerations

- All operations require proper authentication
- RLS policies enforce data access control
- User input is validated before database operations
- Audit trail tracks who created/modified users
- Sensitive operations require confirmation

## Performance

- Efficient database queries with proper indexing
- Debounced search input
- Optimistic UI updates
- Minimal re-renders with proper state management

## Future Enhancements

Potential improvements for the system:

- Bulk user operations (import/export)
- User activity logging
- Advanced role permissions
- User profile pictures
- Two-factor authentication
- User session management
- Audit reports and analytics

## Support

If you encounter issues:

1. Check this documentation first
2. Review the console for error messages
3. Verify database setup and permissions
4. Test with the sample data provided
5. Check Supabase dashboard for any issues

---

The dynamic user management system provides a robust, scalable solution for managing users in your application. With proper setup and configuration, it offers a professional user experience with enterprise-grade functionality. 