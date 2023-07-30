import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();

    // Create authenticated Supabase Client.
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // non-authenticated users are redirected to the login page

    if (!user) {
        if (req.nextUrl.pathname !== '/login'
            && req.nextUrl.pathname !== '/register'
            && req.nextUrl.pathname !== '/') {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    // authenticated users are redirected to the home page

    if (user) {
        if (req.nextUrl.pathname === '/login'
            || req.nextUrl.pathname === '/register'
            || req.nextUrl.pathname === '/') {
            return NextResponse.redirect(new URL('/home', req.url))
        }

    }


}

export const config = {
    matcher: [
        '/settings/profile', 
        '/home', '/login', '/register', 
        '/',
    ],
}
