'use client'
import React, { useEffect, useState } from 'react'
import { Database } from '@/lib/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import {  PhotoIcon } from '@heroicons/react/24/solid'

type Profiles = Database['public']['Tables']['profiles']['Row']

export default function Banner({
    uid,
    url,
    size,
    onUpload,
    upload = true,
    className,
}: {
    uid: string
    url: Profiles['banner_url']
    size: number
    onUpload: (url: string) => void
    upload?: boolean
    className?: string
}) {
    const supabase = createClientComponentClient<Database>()
    const [bannerUrl, setBannerUrl] = useState<Profiles['banner_url']>(url)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage.from('banners').download(path)
                if (error) {
                    throw error
                }

                const url = URL.createObjectURL(data)
                setBannerUrl(url)
            } catch (error) {
                console.log('Error downloading image: ', error)
            }
        }

        if (url) downloadImage(url)
    }, [url, supabase])

    const uploadBanner: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            let { error: uploadError } = await supabase.storage.from('banners').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error: any) {
            // alert('Error uploading banner!')
            alert('Error uploading banner: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className='flex-col items-center'>
            {
                bannerUrl &&  (
                    <Image
                        src={bannerUrl}
                        alt="Banner"
                        width={size}
                        height={0}
                        className={className}
                    />
                )
            }
            {
                upload && (
                    <div className="mt-10">
                        <label
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:text-orange-500 p-2 focus-within:ring-offset-2 hover:text-orange-500"
                        >
                            <span>Upload a file</span>
                            <input type="file"
                                id="banner"
                                className="sr-only rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                accept="image/*"
                                onChange={uploadBanner}
                                disabled={uploading} />
                        </label>
                    </div>
                )
            }
        </div>
    )
}

