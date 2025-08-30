# Setup Guide - Resolving User Creation and Login Issues

## Problem Description
When creating a "Nouvel Utilisateur" from the admin dashboard and then trying to login with those credentials, you get "Invalid login credentials" error.

## Root Cause
The issue was in the user creation process:
1. **Client-side Admin Operations**: The system was trying to create Supabase auth users from the client side, which doesn't work due to security restrictions
2. **Missing Service Role Access**: The client-side code couldn't access the service role key needed for admin operations
3. **Database Schema**: The `user_profiles` table might not exist or have the correct structure

## Solution Steps

### Step 1: Set Up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-setup.sql` file
4. Run the script to create the necessary tables and policies

### Step 2: Verify Environment Variables
Your `.env` file should contain:
```env
NEXT_PUBLIC_SUPABASE_URL=https://okjyvpfkcjhnpieregun.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` should NOT have the `NEXT_PUBLIC_` prefix as it's used server-side only.

### Step 3: Create Initial Admin User
1. **First, create an auth user manually**:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Enter email: `admin@ormvao.ma`
   - Enter password: `password` (or your chosen password)
   - Set email confirmed to true

2. **Then create the user profile**:
   - Go to SQL Editor
   - Run this query (replace `YOUR_AUTH_USER_ID` with the actual user ID from step 1):
   ```sql
   INSERT INTO user_profiles (user_id, email, full_name, role, department, status)
   VALUES (
       'YOUR_AUTH_USER_ID', -- Replace with actual auth user ID
       'admin@ormvao.ma',
       'Administrateur Principal',
       'admin',
       'Administration',
       'active'
   );
   ```

### Step 4: Test the System
1. **Login with the admin account** you just created
2. **Navigate to the admin dashboard**
3. **Try creating a new user** using "Nouvel Utilisateur"
4. **Test login** with the newly created user

## How the Fixed System Works

### Before (Broken):
- Client-side code tried to create auth users directly
- Failed due to security restrictions
- Only user profiles were created, no auth users

### After (Fixed):
- User creation goes through server-side API routes (`/api/users`)
- API routes use service role key for admin operations
- Both auth user and profile are created properly
- Users can login immediately after creation

## API Routes Created

### POST `/api/users`
- Creates new Supabase auth user
- Creates user profile
- Links them together

### PUT `/api/users/[id]`
- Updates user profile
- Updates auth user password if needed

### DELETE `/api/users/[id]`
- Deletes user profile
- Deletes auth user

## Troubleshooting

### If you still get login errors:
1. **Check browser console** for error messages
2. **Verify the user was created** in Supabase Auth → Users
3. **Verify the profile was created** in Supabase Database → Tables → user_profiles
4. **Check that the user_id in the profile matches the auth user ID**

### Common Issues:
1. **"Table doesn't exist"**: Run the database setup script
2. **"Permission denied"**: Check RLS policies in the database setup
3. **"Service role key invalid"**: Verify the service role key in your .env file

### If the API routes fail:
1. **Check server logs** in your terminal
2. **Verify environment variables** are loaded correctly
3. **Check Supabase project settings** and ensure the service role key is correct

## Security Notes
- The service role key has full access to your database
- Keep it secure and never expose it to the client
- The API routes are protected and only accessible from your application
- Row Level Security (RLS) policies ensure users can only access appropriate data

## Next Steps
After fixing the user creation:
1. Test creating users with different roles (agent, manager, admin)
2. Test user updates and deletions
3. Verify that role-based access control works correctly
4. Set up additional database tables for markets, contracts, etc.

## Support
If you continue to have issues:
1. Check the browser console for error messages
2. Check the terminal/server logs for API errors
3. Verify your Supabase project configuration
4. Ensure all environment variables are set correctly
