"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "./common/Logo";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { UserNav } from "./common/UserNav";
import { usePathname } from "next/navigation";

type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
};

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pantry", href: "/pantry" },
  { name: "Recipes", href: "/recipes" },
  { name: "Nutrition", href: "/nutrition" },
  { name: "Friends", href: "/friends" },
  { name: "Feed", href: "/feed" },
];

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className=" ">
      {({ open }) => (
        <>
          <div className="flex items-center bg-white h-16 sm:h-20">
            <div className="container px-2 sm:px-0">
              <div className="relative flex h-16 items-center justify-between">
                {/* Logo removed from header for both mobile and desktop */}
                <div className="flex flex-1 items-center justify-center ">
                  <div className="hidden sm:ml-6 sm:block">
                    <ul className="flex space-x-28">
                      {navigation.map((item) => {
                        const isCurrent =
                          item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={`text-[#2D2D2D] text-center text-xl not-italic font-normal leading-[normal] ${
                                isCurrent ? "font-bold underline" : ""
                              }`}
                              aria-current={isCurrent ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                {user ? (
                  <div className="hidden sm:flex absolute inset-y-0 right-0 gap-6 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <UserNav
                      image={user?.imageUrl}
                      name={user?.fullName!}
                      email={user?.primaryEmailAddress?.emailAddress!}
                    />
                  </div>
                ) : null}
                <div className="block sm:hidden">
                  {/* Mobile menu button*/}
                  <DisclosureButton className="relative inline-flex  items-center justify-center rounded-md p-2 text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 flex flex-col gap-3 items-start">
              {navigation.map((item) => {
                const isCurrent =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <DisclosureButton
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={`text-[#2D2D2D] text-center text-xl not-italic font-normal leading-[normal] ${
                      isCurrent ? "font-bold underline" : ""
                    }`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                );
              })}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
