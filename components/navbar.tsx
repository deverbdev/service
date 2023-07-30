"use client"
import { useCallback, useEffect, useState } from 'react';
import Logo from '@/components/logo';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { Session } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar({session}: {session: Session | null}) {
    const supabase = createClientComponentClient<Database>()
    const user = session?.user

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)

    const fetchPP = useCallback(async () => {
        try {
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`avatar_url, username`)
                .eq('id', user?.id)
                .single()

            console.log(data)

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

            if (data?.username) {
                setUsername(data.username)
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
                        <AvatarImage src={avatarUrl} alt={user?.email} className='rounded-full' />
                        <AvatarFallback>{user?.email}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                )}
            </div>,
            path: `/${username}`
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