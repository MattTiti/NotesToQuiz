import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import ButtonAccount from "@/components/ButtonAccount";
import logo from "@/app/icon.png";
import TabsNavigation from "@/components/TabNavigation";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-yellow-50 shadow-sm">
      <div className="container flex items-center justify-between px-1 py-2 mx-auto">
        <Link
          className="flex items-center gap-2 shrink-0"
          href="/"
          title={`${config.appName} homepage`}
        >
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="w-12 h-12"
            placeholder="blur"
            priority={true}
            width={48}
            height={48}
          />
          <span className="font-semibold text-xl text-neutral-700">
            {config.appName}
          </span>
        </Link>
        <div className="flex-grow flex justify-end">
          <TabsNavigation />
          <ButtonAccount />
        </div>
      </div>
    </nav>
  );
}