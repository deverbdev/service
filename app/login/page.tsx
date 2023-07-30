'use client'

import { useTheme } from "next-themes"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from "react"
import HCaptcha from "@hcaptcha/react-hcaptcha"
import Link from "next/link"
import Logo from "@/components/logo"
import { useRouter } from "next/navigation"


const Login = () => {
    const supabase = createClientComponentClient()
    const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    
    const [message, setMessage] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [captchaToken, setCaptchaToken] = useState<string>('')
    const { theme } = useTheme()
    const router = useRouter()


    const handleLogin = async (e: any) => {
        try {
            e.preventDefault()
            setLoading(true)

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: {
                    captchaToken,
                }
            })


            if (error) throw error
            router.push('/settings/profile')
            
        } catch (error: any) {
            setMessage([error.error_description || error.message, 0])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <Logo />
                    </Link>

                    {/* message */}
                    {message && (
                        <div className={`px-4 py-2 mb-4 text-sm text-white  rounded-md  ${message[1] === 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                            {message[0]}
                        </div>
                    )}

                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500" placeholder="example@company.com"
                                        onChange={
                                            (e) => {
                                                if (EmailRegex.test(e.target.value)) setEmail(e.target.value)
                                                else setEmail('')
                                            }
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm you are human</label>
                                    <HCaptcha
                                        sitekey="10000000-ffff-ffff-ffff-000000000001"
                                        onVerify={(token) => setCaptchaToken(token)}
                                        onError={(err) => console.log(err)}
                                        theme={theme === 'dark' ? 'dark' : 'light'}
                                    />
                                </div>

                                {/* function not finished */}
                                <div className="flex items-center justify-between">
                                    <Link href="#" className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-500">Forgot password?</Link>
                                </div>

                                <button type="submit" className={`w-full text-white bg-orange-400 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 transition duration-300 ease-in-out ${!email || !password || !captchaToken ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {loading ? 'Loading...' : 'Sign in'}
                                </button>

                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link href="/register" className="font-medium text-orange-600 hover:underline dark:text-orange-500">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section> 
        </>
    )
}

export default Login