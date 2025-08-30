import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const updates = await request.json()
    
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

    // Get the current user data to check if we need to update auth
    const { data: currentUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('user_id, email, password')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch current user: ${fetchError.message}` },
        { status: 400 }
      )
    }

    // If password is being updated and user has an auth account, update auth user
    if (updates.password && currentUser?.user_id && updates.password !== currentUser.password) {
      try {
        // Update the auth user's password
        const { error: authError } = await supabase.auth.admin.updateUserById(
          currentUser.user_id,
          { password: updates.password }
        )
        
        if (authError) {
          console.warn('Failed to update auth user password:', authError.message)
          return NextResponse.json(
            { error: `Failed to update password: ${authError.message}` },
            { status: 400 }
          )
        }
      } catch (authErr) {
        console.warn('Auth user password update failed:', authErr.message)
        return NextResponse.json(
          { error: `Failed to update password: ${authErr.message}` },
          { status: 400 }
        )
      }
    }

    // Update the user profile (remove password from profile updates since it's handled separately)
    const { password, ...profileUpdates } = updates
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileUpdates)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: `Failed to update user profile: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data[0],
      message: 'User updated successfully'
    })

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
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

    // Get the current user data to check if we need to delete auth user
    const { data: currentUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch current user: ${fetchError.message}` },
        { status: 400 }
      )
    }

    // Delete the auth user if it exists
    if (currentUser?.user_id) {
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.user_id)
        if (authError) {
          console.warn('Failed to delete auth user:', authError.message)
        }
      } catch (authErr) {
        console.warn('Auth user deletion failed:', authErr.message)
      }
    }

    // Delete from user_profiles
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: `Failed to delete user profile: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}
