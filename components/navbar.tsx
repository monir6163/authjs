import { handleSignOut } from "@/app/actions/authActions";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Test from "./test";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="flex justify-between items-center py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-slate-100">
      <Link href="/" className="text-xl font-bold">
        Auth.js
      </Link>
      <Link href="/page2" className="text-xl font-bold">
        Page 2
      </Link>
      <Link href="/page1" className="text-xl font-bold">
        Page 1 (Protected)
      </Link>
      {!session ? (
        <div className="flex gap-2 justify-center">
          <Test />
        </div>
      ) : (
        <form action={handleSignOut}>
          <Button variant="default" type="submit">
            Sign Out
          </Button>
        </form>
      )}
    </nav>
  );
}
