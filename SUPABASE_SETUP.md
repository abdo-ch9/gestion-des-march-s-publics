# Supabase Authentication Setup

This project has been updated to use Supabase for authentication. Follow these steps to complete the setup:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Create a new project
3. Wait for the project to be ready

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key

## 3. Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Example:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Create Test Users

1. In your Supabase dashboard, go to Authentication > Users
2. Click "Add User" to create test accounts:
   - `agent@ormvao.ma` (password: `password`)
   - `manager@ormvao.ma` (password: `password`)
   - `admin@ormvao.ma` (password: `password`)

## 5. Configure Authentication Settings

1. Go to Authentication > Settings
2. Enable Email confirmations if desired
3. Configure any additional authentication providers

## 6. Run the Application

```bash
npm run dev
# or
pnpm dev
```

## Current Implementation Notes

- **Role Assignment**: Currently, user roles are assigned based on email domain (agent, manager, admin)
- **Future Enhancement**: Consider creating a `user_profiles` table in Supabase to store user roles and additional information
- **Security**: The current implementation is suitable for development. For production, implement proper role-based access control using Supabase Row Level Security (RLS)

## Troubleshooting

- Make sure your environment variables are correctly set
- Check the browser console for any authentication errors
- Verify that your Supabase project is active and accessible
- Ensure test users are created in Supabase before testing login 