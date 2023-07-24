import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'
import Navbar from '@/components/navbar'

export default async function Profile({ params }: { params: { user: string } }) {

    const supabase = createServerComponentClient<Database>({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    return (
        <div>
            <Navbar session={session} />
            <h1>{params.user}</h1>
        </div>
    )
}