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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();


  // Loading state
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
              <span className="text-white text-xl font-semibold font-poppins">
                Haven Heart
              </span>
              <FaHeart className="text-white ml-1" />
            </Link>
          </div>

          {/* Right side: Auth-based dropdowns */}
          <div className="flex items-center gap-1 sm:flex-row">
            {session ? (
              // Logged-in User Menu
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="ghost" className="px-3 py-2">
                    {/* {session.user?.email ?? "My Account"} */}
                    <Image
                      src={session.user?.image ?? "/images/user.png"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                      width={32}
                      height={32}
                    />
                  </Button>
                </DropdownTrigger>

                <DropdownMenu aria-label="User Menu">
                  <DropdownSection title="Explore">
                    <DropdownItem key="about" href="/info/about-us">
                      About Us
                    </DropdownItem>
                    <DropdownItem key="home" href="/home">
                      Home
                    </DropdownItem>
                    <DropdownItem key="my-workshops" href="/home/upcoming">
                      Upcoming Workshops
                    </DropdownItem>
                    <DropdownItem key="quick-tour" href="/info/quick-tour">
                      Quick Tour
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSection title="Account">
                    <DropdownItem
                      key="logout"
                      color="danger"
                      // For signOut, use onClick instead of href
                      onClick={async () => {
                        await signOut({ callbackUrl: "/" });
                        localStorage.clear();
                        sessionStorage.clear();
                        document.cookie =
                          "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      }}
                    >
                      Logout
                    </DropdownItem>                                      
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            ) : (
              // Guest Menu
              <Dropdown>
                <DropdownTrigger>
                  <IoMenu className="text-3xl hover:bg-slate-300" />
                </DropdownTrigger>

                <DropdownMenu aria-label="Guest Menu">
                  {/* If @heroui supports DropdownSection */}
                  <DropdownSection title="Explore">
                    <DropdownItem key="about" href="/info/about-us">
                      About Us
                    </DropdownItem>
                    <DropdownItem key="workshops" href="/info/faq">
                      FAQ
                    </DropdownItem>
                    <DropdownItem key="quick-tour" href="/info/quick-tour">
                      Quick Tour
                    </DropdownItem>
                  </DropdownSection>

                  <DropdownSection title="Account">
                    <DropdownItem key="login" color="primary" href="/login">
                      Log in
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
                  <DropdownItem key="manage-users" href="/admin/users">
                    Manage Users
                  </DropdownItem>
                  <DropdownItem key="manage-workshops" href="/admin">
                    Manage Workshops
                  </DropdownItem>
                  <DropdownItem key="add-workshops" href="/admin/workshops/add">
                    Add Workshops
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
