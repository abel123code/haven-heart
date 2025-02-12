"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@heroui/dropdown";
import { Spinner } from "@heroui/react";
import { IoMenu } from "react-icons/io5";

export function Navbar() {
  // 1) Grab the session object
  const { data: session, status } = useSession();
  //console.log('session data:::', session);

  // 2) Optional loading state
  if (status === "loading") {
    return (
      <nav className="bg-white shadow-sm flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Spinner size="md" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side: Logo */}
          <div className="flex-shrink-0 flex items-center flex-col mt-2">
            <Link
              href="/"
              className="flex items-center justify-center bg-red-500 border-2 border-red-500 px-4 py-1 rounded-md"
            >
              <span className="text-white text-xl font-semibold font-poppins">Haven Heart</span>
              <FaHeart className="text-white ml-1" />
            </Link>
            {/* <p className="text-xs text-red-500 font-semibold">The spot for hearts to grow</p> */}
          </div>
          {/* Right side: Conditional - user dropdown or login button */}
          <div className="flex items-center flex-col gap-1 sm:flex-row">

            {session ? (
              // If logged in: NextUI dropdown
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="ghost" className="px-3 py-2">
                    {session.user?.email ?? "My Account"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Menu">
                  <DropdownItem key="about">
                    <Link href="/about">About</Link>
                  </DropdownItem>
                  <DropdownItem key="home">
                    <Link href="/home">Home</Link>
                  </DropdownItem>
                  <DropdownItem key="my-workshops">
                    <Link href="/home/upcoming">Upcoming Workshops</Link>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    <Button
                      type="button"
                      onClick={async () => {
                        await signOut({ callbackUrl: "/" }); // Ensure signOut runs fully
                        localStorage.clear(); // Clear any local storage items
                        sessionStorage.clear(); // Clear session storage items
                        document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      }}
                      className="w-full text-left"
                    >
                      Logout
                    </Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Dropdown>
                <DropdownTrigger>
                  <IoMenu className="text-3xl hover:bg-slate-300  " />
                </DropdownTrigger>
                <DropdownMenu aria-label="Guest Menu">
                  <DropdownSection title="Explore">
                    <DropdownItem key="about">
                      <Link href="/info/about-us">About Us</Link>
                    </DropdownItem>
                    <DropdownItem key="workshops">
                      <Link href="/info/faq">FAQ</Link>
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSection title="Account">
                    <DropdownItem key="login" color="primary">
                      <Link href="/login">
                        <Button variant="ghost" className="w-full text-left">
                          Log in
                        </Button>
                      </Link>
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Admin-Specific Options */}
            {session?.user?.role === "admin" && (
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="ghost" className="px-3 py-2">
                    Admin
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Admin Menu">
                  <DropdownItem key="manage-users">
                    <Link href="/admin/users">Manage Users</Link>
                  </DropdownItem>
                  <DropdownItem key="manage-workshops">
                    <Link href="/admin">Manage Workshops</Link>
                  </DropdownItem>
                  <DropdownItem key="add-workshops">
                    <Link href="/admin/workshops/add">Add Workshops</Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
