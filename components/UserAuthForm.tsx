'use client'

import { useState } from "react"
import Logo from "@/components/logo"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import HCaptcha from "@hcaptcha/react-hcaptcha"
import Link from "next/link"
import { useTheme } from "next-themes"
import Navbar from "@/components/Navbar"

const UserAuthForm = () => {
    const supabase = createClientComponentClient()

    const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    // message should be an array with string and number ""
    const [message, setMessage] = useState<any>('')
    const [subMessage, setSubMessage] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')


    const [captchaToken, setCaptchaToken] = useState<string>('')
    const { theme } = useTheme()

    const handleRegister = async (e: any) => {
        try {
            e.preventDefault()
            setLoading(true)

            if (password !== passwordConfirm) {
                throw new Error('Passwords do not match.')
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'http://localhost:3000/auth/callback',
                    captchaToken,
                }
            })

            if (error) throw error
            setMessage(['Check your email for the confirmation link.'])
        } catch (error: any) {
            setMessage([error.error_description || error.message, 0])
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <section>
                <div className="flex flex-col items-center justify-center mx-auto lg:py-0">

                    {/* message */}
                    {message && (
                        <div className={`px-4 py-2 mb-4 text-sm text-white  rounded-md  ${message[1] === 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                            {message[0]}
                        </div>
                    )}

                    
                        <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>

                                <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500" placeholder="example@company.com"
                                    onChange={
                                        // do not set state if email is invalid
                                        (e) => {
                                            if (EmailRegex.test(e.target.value)) setEmail(e.target.value)
                                            else setEmail('')
                                        }
                                    }
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                                    onChange={
                                        (e) => setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                {/* sub message */}
                                {subMessage && (
                                    <div className={`mb-4 text-sm rounded-md  ${subMessage[1] === 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {subMessage[0]}
                                    </div>
                                )}

                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                                    onChange={
                                        (e) => {

                                            if (e.target.value !== password) {
                                                setSubMessage(['Passwords do not match', 0])
                                                setPasswordConfirm('')
                                            }
                                            else {
                                                setSubMessage(['Passwords match', 1])
                                                setPasswordConfirm(e.target.value)
                                            }
                                        }
                                    }
                                />
                            </div>
                            
                            {/* hcaptcha */}
                            <div className="flex flex-col items-center">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm you are human</label>
                                <HCaptcha
                                    sitekey="10000000-ffff-ffff-ffff-000000000001"
                                    onVerify={(token) => setCaptchaToken(token)}
                                    onError={(err) => console.log(err)}
                                    theme={theme === 'dark' ? 'dark' : 'light'}
                                />
                            </div>

                            <button type="submit" className={`w-full text-white bg-orange-400 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 transition duration-300 ease-in-out ${!email || !password || !passwordConfirm || !captchaToken ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? "Loading..." : "Create an account"}</button>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link href="/login"
                                    className="font-medium text-orange-600 hover:underline dark:text-orange-500">Login here</Link>
                            </p>
                        </form>
                </div>
            </section>
        </>
    )
}

export default UserAuthForm



