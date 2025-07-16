import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function PantryPalHome() {
  return (
    <main className="bg-[#EDEDED] min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="bg_image">
        <div className="container py-16 sm:py-36 px-6 sm:px-0 flex flex-col-reverse sm:flex-row items-center justify-between">
          <div className="max-w-xl">
            <h2 className="font-montserrat pb-7 sm:pb-[26px] text-black text-[44px] sm:text-[64px] not-italic font-medium leading-[111.3%] tracking-[-1.1px] sm:tracking-[-1.875px]">
              Welcome to PantryPal
            </h2>
            <p className="font-montserrat sm:pb-16 max-w-[680px] text-black text-xl sm:text-2xl not-italic font-normal leading-[103.3%] tracking-[-0.5px] sm:tracking-[-0.75px] pb-11">
              Track what ingredients you have, discover recipes you can make, and share your culinary creations with friends. PantryPal makes your kitchen smarter and your meals more social!
            </p>
            <Link href={"/pantry"}>
              <button className="button gap-2.5 px-8 py-4 font-montserrat text-white text-xl sm:text-2xl not-italic font-semibold leading-[90.3%] tracking-[-0.5px] sm:tracking-[-0.75px]">
                Get Started
              </button>
            </Link>
          </div>
          <div className="max-w-[570px] w-full h-full mb-10 sm:mb-0">
            <div className="relative max-w-[570px] w-full h-[320px] sm:h-[420px]">
              <div className="absolute z-10 inset-0 flex justify-center items-center bg-[#0983DF99] opacity-40 blur-[102px] rounded-[673px]">
                <Image
                  src={"/images/hero_image_bg.svg"}
                  width={541}
                  height={673}
                  alt="hero background"
                  className="w-[344px] sm:w-[541px] "
                />
              </div>
              <div className=" absolute z-50 inset-0 flex justify-center items-center">
                <Image
                  src={"/images/Fantasy.png"}
                  width={400}
                  height={320}
                  alt="PantryPal hero"
                  className="w-[260px] sm:w-[400px] rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="Benefits" className="relative">
        <Image
          src={"/images/blue-circle.svg"}
          width={503}
          height={531}
          alt=""
          className="absolute hidden sm:block -left-40 -top-48 h-[531px]"
        />
        <div className="container py-16 px-2 md:px-0">
          <p className="text-black text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] text-center font-montserrat pb-2 sm:pb-[18px]">
            Features
          </p>
          <h3 className=" text-black text-3xl sm:text-[48px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat text-center pb-[46px] sm:pb-[60px]">
            Why PantryPal?
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 ">
            <div className="flex flex-col items-center bg-white border rounded-[17px] py-8 px-6 border-solid border-[#B8B5B5] shadow-xl">
              <Image src="/images/pantry.png" width={80} height={80} alt="Pantry" className="mb-4" />
              <h4 className="text-black text-[24px] sm:text-[32px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] pb-2 font-montserrat">
                Pantry Tracking
              </h4>
              <p className="font-montserrat text-black text-[17px] sm:text-xl not-italic font-normal leading-[90.3%] tracking-[-0.75px] text-center">
                Keep an up-to-date list of everything in your pantry, so you always know what you have on hand.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white border rounded-[17px] py-8 px-6 border-solid border-[#B8B5B5] shadow-xl">
              <Image src="/images/recipes.png" width={80} height={80} alt="Recipes" className="mb-4" />
              <h4 className="text-black text-[24px] sm:text-[32px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] pb-2 font-montserrat">
                Smart Recipes
              </h4>
              <p className="font-montserrat text-black text-[17px] sm:text-xl not-italic font-normal leading-[90.3%] tracking-[-0.75px] text-center">
                Instantly find recipes you can make with what you already have—no more wasted food or last-minute store runs.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white border rounded-[17px] py-8 px-6 border-solid border-[#B8B5B5] shadow-xl">
              <Image src="/images/friends.png" width={80} height={80} alt="Friends" className="mb-4" />
              <h4 className="text-black text-[24px] sm:text-[32px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] pb-2 font-montserrat">
                Share with Friends
              </h4>
              <p className="font-montserrat text-black text-[17px] sm:text-xl not-italic font-normal leading-[90.3%] tracking-[-0.75px] text-center">
                Share your favorite recipes and pantry lists with friends, and get inspired by their creations too!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary mt-20">
        <div className="flex flex-wrap md:flex-nowrap justify-between container py-20 px-6 sm:px-0">
          <div className="max-w-[802px]">
            <h2 className="font-montserrat text-wrap text-white not-italic text-3xl md:text-[48px] font-semibold sm:leading-[109.3%] sm:tracking-[-1.425px] leading-[97.3%] tracking-[-0.75px] pb-[31px] sm:pb-[38px]">
              Ready to make your pantry smarter?
            </h2>
            <p className="text-white max-w-[681px] text-xl sm:text-2xl not-italic font-normal leading-[103.3%] tracking-[-0.75px] font-montserrat pb-[40px] sm:pb-[32px]">
              Sign up now and start discovering recipes, tracking your ingredients, and sharing with friends—all in one place.
            </p>
            <Link href={"/pantry"}>
              <button className="linear_gradient flex max-w-[438px] w-full justify-center items-center gap-2.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-8 py-4 rounded-[11px]  text-black text-xl sm:text-2xl not-italic font-semibold leading-[90.3%] tracking-[-0.75px]">
                Get Started For Free
              </button>
            </Link>
          </div>
          <div className="mt-20 md:mt-0">
            <Image
              src="/images/monitor.png"
              alt="PantryPal preview"
              width={400}
              height={320}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
