import Link from "next/link";

export default function RegisterPage() {
  return (
    <div>
        {/* header */}
        <div className="bg-accent min-h-14 w-full p-4">
            <Link href="/landing">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 stroke-background fill-background">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </Link>

        </div>
        {/* main */}
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-black mt-10 pb-10">Oops, something went wrong.</h1>
            <p className="">Please contact the team @calista</p>
        </div>
    </div>

  );
}