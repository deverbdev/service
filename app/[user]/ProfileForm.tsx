'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Database } from "@/lib/database.types";
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Avatar from '@/components/avatar';
import Banner from '@/components/banner';
import { Link2 } from 'lucide-react';
import Image from 'next/image';



export default function ProfileForm({ session, params }: { session: Session | null; params: { user: string; }; }) {
    const supabase = createClientComponentClient<Database>();
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [banner_url, setBannerUrl] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const session_id = session?.user?.id;

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`id, full_name, username, description, website, avatar_url, banner_url`)
                .eq('username', params.user)
                .single();

            if (error && status === 406) {
                throw new Error(error.message);
            }

            if (data) {
                setFullname(data.full_name);
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
                setBannerUrl(data.banner_url);
                setId(data.id);
            }
        } catch (error) {
            throw new Error("Error getting profile");
        } finally {
            setLoading(false);
        }
    }, [params.user, supabase]);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <div>
            <div className='relative'>
                <div className='h-48 bg-gray-200 dark:bg-gray-800 z-0 w-full'>
                    <Banner
                        uid={params.user}
                        url={banner_url}
                        size={120}
                        onUpload={(url) => {
                            setBannerUrl(url);
                        }}
                        upload={false}
                        className='absolute z-0 w-full h-full object-cover' 
                    />
                    {username && (
                        <span className='md:right-10 md:bottom-24 absolute text-7xl font-semibold text-white'>@{username}</span>
                    )}
                </div>
                <div>
                    <div className='px-64 my-10 item-center'>
                        <Avatar
                            uid={params.user}
                            url={avatar_url}
                            size={120}
                            onUpload={(url) => {
                                setAvatarUrl(url);
                            }}
                            upload={false}
                            className='absolute z-10 my-[-3rem] rounded-full ring-8 ring-white dark:ring-slate-950 bottom-0' />
                    </div>
                </div>
            </div>
            
           <div className='flex-col space-y-5'>
                <div className="max-w-[90rem] mx-auto p-5">
                    <div className="flex md:justify-between items-center">

                        {
                            fullname && (
                                <span className='text-4xl font-semibold'>{fullname}</span>
                            )
                        }

                        <div className="flex space-x-5 ">
                            <button>
                                <label>Following</label>
                                <div>0</div>
                            </button>
                            <div className="border-r-2 border-gray-300 dark:border-gray-700">
                            </div>
                            <button>
                                <label>Followers</label>
                                <div>0</div>
                            </button>

                        </div>
                        
                    </div>
                </div>

                <div className="max-w-[90rem] mx-auto px-5">
                    <div className="flex md:justify-between items-center">
                        <div className='flex space-x-3'>
                            <div className='rounded-lg p-2 space-x-2 flex items-center border hover:bg-gray-100 dark:hover:bg-gray-700 duration-500'>
                                <Link2 size={24} />
                                <a href={
                                    website?.startsWith('http') ? website : `https://${website}`
                                } className='text-blue-500 dark:text-blue-400'>{website}</a>
                            </div>

                            {/* follow button */}
                            <div className='border rounded-lg p-2 space-x-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 duration-500'>
                                {/* follow button */}
                                <button>
                                    <span>Follow</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className='border rounded-lg p-2 space-x-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 duration-500'>
                            {/* edit profile */}
                            {
                                session_id === id ? (
                                    <button>
                                        <a href='/settings/profile'>
                                            <span>Edit Profile</span>
                                        </a>
                                    </button>
                                ) : 
                                (
                                    <button>
                                        <span>Message</span>
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>

           </div>
        </div>
    );
}


