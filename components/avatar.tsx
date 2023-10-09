'use client'
import React, { useEffect, useState } from 'react'
import { Database } from '@/lib/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/24/solid'

type Profiles = Database['public']['Tables']['profiles']['Row']

export default function Avatar({
    uid,
    url,
    size,
    onUpload,
    upload = true,
    className,
}: {
    uid: string
    url: Profiles['avatar_url']
    size: number
    onUpload: (url: string) => void
    upload?: boolean
    className?: string
}) {
    const supabase = createClientComponentClient<Database>()
    const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(url)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage.from('avatars').download(path)
                if (error) {
                    throw error
                }

                const url = URL.createObjectURL(data)
                setAvatarUrl(url)
            } catch (error: any) {
                setError("Error downloading image: " + error.message)
            }
        }

        if (url) downloadImage(url)
    }, [url, supabase])

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error: any) {
            setError("Error uploading image: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className={`flex space-x-4 items-center pt-5`}>
            {/* message */}
            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}
            {avatarUrl ? (
                <Image
                    width={size}
                    height={size}
                    src={
                        avatarUrl
                    }
                    alt="Avatar"
                    className={`avatar ${className}`}
                    style={{ height: size, width: size }}
                />
            ) : (
                    <div className={`avatar ${className} w-40 h-40 ring-0 bg-gray-800 dark:bg-gray-200`}>
                        <UserCircleIcon className="w-full h-full text-gray-300" />
                    </div>
            )}
            {
                upload && (
                    <label
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:text-orange-500 p-2 focus-within:ring-offset-2 hover:text-orange-500 mt-2"
                    >
                        <span>{uploading ? "loading" : "Upload a File"}</span>
                        <input type="file"
                        id="avatar"
                        className="sr-only rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading} />
                    </label>
                )
            }
        </div>
    )
}