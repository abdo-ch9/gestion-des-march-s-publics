import { useEffect, useRef } from 'react'
import { createClient } from '../supabase'

export function useRealtimeUpdates(onUpdate) {
  const supabase = createClient()
  const subscriptionRef = useRef(null)

  useEffect(() => {
    if (!supabase) return

    // Subscribe to real-time changes in contracts table
    const contractsSubscription = supabase
      .channel('contracts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contracts'
        },
        (payload) => {
          console.log('Real-time contract update:', payload)
          onUpdate('contracts', payload)
        }
      )
      .subscribe()

    // Subscribe to real-time changes in markets table
    const marketsSubscription = supabase
      .channel('markets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'markets'
        },
        (payload) => {
          console.log('Real-time market update:', payload)
          onUpdate('markets', payload)
        }
      )
      .subscribe()

    // Subscribe to real-time changes in user_profiles table
    const usersSubscription = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('Real-time user update:', payload)
          onUpdate('users', payload)
        }
      )
      .subscribe()

    subscriptionRef.current = {
      contracts: contractsSubscription,
      markets: marketsSubscription,
      users: usersSubscription
    }

    return () => {
      // Cleanup subscriptions
      if (subscriptionRef.current) {
        Object.values(subscriptionRef.current).forEach(subscription => {
          if (subscription && subscription.unsubscribe) {
            subscription.unsubscribe()
          }
        })
      }
    }
  }, [supabase, onUpdate])

  return {
    isConnected: !!subscriptionRef.current
  }
} 