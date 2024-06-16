// Import necessary components and functions
'use client'
// Import necessary components and functions
import { signIn } from 'next-auth/react';

// Example Next.js functional component
export default function SignIn(): JSX.Element {

    // Handle Facebook sign-in
    const handleSignIn = async () => {
        try {
            // Call signIn with 'facebook' provider
            const result = await signIn('facebook', {
                callbackUrl: `${window.location.origin}/dashboard`, // Replace with your desired callback URL
                redirect: false, // Whether to redirect after login, set to true if needed
            });

            // Optionally handle the result
            if (result?.error) {
                console.error("Failed to sign in with Facebook", result.error);
                // Handle error (e.g., show error message)
            } else if (result?.url) {
                // Redirect manually after successful login
                window.location.href = result.url; // Redirect to the URL returned by signIn
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            // Handle any other error (e.g., show error message)
        }
    };

    return (
        <button onClick={handleSignIn}>
            Sign in with Facebook
        </button>
    );
}
