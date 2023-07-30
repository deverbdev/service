'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Database } from "@/lib/database.types"
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Avatar from '@/components/avatar'
import Link from 'next/link'

export default function ProfileForm({ session, params }: { session: Session |null, params: { user: string } }) {
    const supabase = createClientComponentClient<Database>()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const [id, setId] = useState<string | null>(null)
    const session_id = session?.user?.id

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`id, full_name, username, website, avatar_url`)
                .eq('username', params.user)
                .single()

            if (error && status !== 406) {
                throw new Error(error.message)
            }

            if (data) {
                setFullname(data.full_name)
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setId(data.id)
            }
        } catch (error) {
            throw new Error("Error getting profile")
        } finally {
            setLoading(false)
        }
    }, [params.user, supabase])

    useEffect(() => {
        getProfile()
    }, [getProfile])

    return (
        <div>
            <Avatar
                uid={params.user}
                url={avatar_url}
                size={200}
                onUpload={(url) => {
                    setAvatarUrl(url)
                }}
                upload={false}
            />
            <div>
                {/* show fullname */}
                {fullname && (
                    <div>{fullname}</div>
                )}
            </div>
            <div>
                {
                    // show username
                    username && (
                        <div>@{username}</div>
                    )
                }
            </div>
            <div>
                {
                    // show website
                    website && (
                        <div>{website}</div>
                    )
                }
            </div>
            {/* <div>
                {
                    // show id
                    id && (
                        <div>
                            <div>id: {id}</div>
                            <div>session_id: {session_id}</div>
                        </div>
                    )
                }
            </div> */}

            {/* edit profile */}
            {session_id === id && (
                <div>
                    <Link href={`/settings/profile`}>
                        <p>Edit Profile</p>
                    </Link>
                </div>
            )}
            

            {/* loading */}
            {loading && (
                <div>Loading ...</div>
            )}
        </div>
    )
}