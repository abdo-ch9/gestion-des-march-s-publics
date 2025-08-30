import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const userData = await request.json()
    
    // Create Supabase client with service role key (server-side only)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Step 1: Create the auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
        role: userData.role,
        department: userData.department
      }
    })

    if (authError) {
      console.error('Auth user creation failed:', authError)
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 400 }
      )
    }

    const authUserId = authData.user.id
    console.log('Auth user created successfully:', authUserId)

    // Step 2: Create the user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: authUserId,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role || 'agent',
        department: userData.department,
        phone: userData.phone,
        status: userData.status || 'active'
      }])
      .select()

    if (profileError) {
      console.error('Profile creation failed:', profileError)
      // Try to clean up the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authUserId)
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }
      return NextResponse.json(
        { error: `Failed to create user profile: ${profileError.message}` },
        { status: 400 }
      )
    }

    console.log('User profile created successfully:', profileData[0])

    return NextResponse.json({
      success: true,
      user: profileData[0],
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}
