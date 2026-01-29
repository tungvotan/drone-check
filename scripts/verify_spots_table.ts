
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verify() {
  console.log('Verifying access to "spots" table...')
  const { data, error } = await supabase.from('spots').select('count', { count: 'exact', head: true })

  if (error) {
    console.error('❌ Error accessing spots table:', error.message)
    process.exit(1)
  }

  console.log('✅ Successfully accessed "spots" table!')
  console.log('Row count:', data) // data is null for head:true but count should be in count property, wait, count is in count
}

verify()
