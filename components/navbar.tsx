"use client"
import { useCallback, useEffect, useState } from 'react';
import Logo from '@/components/logo';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { Session } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar({session}: {session: Session | null}) {
    const supabase = createClientComponentClient<Database>()
    const user = session?.user

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    const fetchPP = useCallback(async () => {
        try {
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`avatar_url`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data?.avatar_url) {
                const path = data.avatar_url
                try {
                    const { data, error } = await supabase.storage.from('avatars').download(path)
                    if (error) {
                        throw error
                    }

                    const url = URL.createObjectURL(data)
                    setAvatarUrl(url)
                } catch (error) {
                    console.log('Error downloading image: ', error)
                }
                
            }
        } catch (error) {
            alert('Error loading user data!')
        }
    }, [user, supabase])

    useEffect(() => {
        if (user) fetchPP()
    }, [fetchPP, user])

    const menu = session ? [
        { 
            title: <div>
                {avatarUrl ? (
                    <Avatar>
                        <AvatarImage src={avatarUrl} alt={user?.email} />
                        <AvatarFallback>{user?.email}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="avatar no-image" style={{ height: 32, width: 32 }} />
                )}
            </div>,
            path: '/account' 
        },
    ] : [
        { title: 'Login', path: '/login' },
        { title: 'Register', path: '/register' },
    ]

    return (
        <nav className=''>
            <div className="max-w-7xl mx-auto p-9">
                <div className="flex md:justify-between justify-center">
                    <div className='flex items-center space-x-4'>
                        <Link href='/'>
                            <Logo />
                        </Link>
                    </div>

                    {/* add a div here for a middle section */}
                    
                    {/* desktop view */}
                    <div className='hidden md:block'>
                        <div className='flex space-x-4 items-center'>
                            {menu.map((item, index) => (
                                <Link href={item.path} key={index}>
                                    {/* check if child is an image */}
                                    {typeof item.title === 'string' ? (
                                        <span className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 block transition duration-1000 px-3 py-2 rounded-md font-medium border'>
                                        {item.title}
                                    </span>
                                    ) : (
                                        <span className=''>
                                            {item.title}
                                        </span>
                                    )}                                    
                                </Link>
                            ))}

                            <ModeToggle />
                        </div>
                    </div>
                </div>
                {/* mobile view */}
                <div className='md:hidden flex justify-center mt-4 space-x-2'>
                    <ModeToggle />
                    <div className='flex space-x-3'>
                        {menu.map((item, index) => (
                            <Link href={item.path} key={index}>
                                {/* check if child is an image */}
                                {typeof item.title === 'string' ? (
                                    <span className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 block transition duration-1000 px-3 py-2 rounded-md font-medium border'>
                                    {item.title}
                                </span>
                                ) : (
                                    <span className=''>
                                        {item.title}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            
        </nav>
    )
}