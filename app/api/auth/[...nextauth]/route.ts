import nextAuth, { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions: AuthOptions = {
    pages: {
        signIn: '/protected/facebook'
    },
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
        })
    ]

}
const handler = nextAuth(authOptions)
export {handler as GET, handler as POST}