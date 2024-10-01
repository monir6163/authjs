"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Test() {
  return (
    <>
      <Link href="/auth/signin">
        <Button variant="default">Sign In</Button>
      </Link>
      <Link href="/auth/signup">
        <Button variant="default">Sign Up</Button>
      </Link>
    </>
  );
}
