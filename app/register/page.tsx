import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
        {/* header */}
        <div className="bg-accent min-h-14 w-full p-4">
            <Link href="/landing">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 stroke-background fill-background">
                    <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
                </svg>
            </Link>
        </div>
        {/* main */}
        <div className="flex flex-col items-center justify-center ">
            <h1 className="text-2xl font-bold text-accent m-10">Set up your account</h1>
            <form className="flex flex-col items-center justify-center">
                <p className="font-bold self-left">Email Address</p>
                <input type="text" placeholder="Email" className="w-80 h-10 p-2 mb-5 border border-accent rounded shadow-md" />
                <p className="font-bold">Password</p>
                <input type="password" placeholder="Password" className="w-80 h-10 p-2 mb-5 border border-accent rounded shadow-md" />
                <p className="font-bold">Confirm Password</p>
                <input type="password" placeholder="Confirm Password" className="w-80 h-10 p-2 mb-5 border border-accent rounded shadow-md" />
                <button className="w-80 h-10 p-2 m-2 bg-accent text-primary rounded shadow-md">Sign up</button>
            </form>
        </div>
    </div>

  );
}