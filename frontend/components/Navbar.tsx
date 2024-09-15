'use client'
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, } from "next/navigation";





const Navbar = () => {
  const pathname = usePathname();
  const [isClicked, setIsClicked] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/signup" },
  ];

  const toggleNavbar = () => {
    setIsClicked(pre => !pre)
  }
  return (
    <nav className="bg-gray-800 sticky top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="" className="text-white">
                Logo
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">

              {navigation.map((item, index) => {


                const isActive = pathname === item.href;
                console.log("is active is " + isActive)
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={` text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 font-medium rounded-md ${isActive ? "bg-gray-900 text-white" : ""}`}
                  >
                    {item.name}
                  </Link>
                );
              })}






              <DropdownMenu>
                <DropdownMenuTrigger> <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer ">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Profile</span></DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button className="inline-flex justify-center items-center p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset" onClick={toggleNavbar}>
              {isClicked ? (<svg className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor" >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>) : (
                <svg className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>

          </div>
        </div>
      </div>
      {isClicked && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

            {navigation.map((item, index) => {


              const isActive = pathname === item.href;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 font-medium rounded-md ${isActive ? "bg-gray-900 text-white" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
