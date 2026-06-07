import authImage from "@/public/images/auth_bg_image.jpg";
import darkLogo from "@/public/icons/sync-black.svg";
import whiteLogo from "@/public/icons/sync-white.svg";
import Image from "next/image";
import SocialAuthForm from "@/components/forms/socialAuthForm";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url(${authImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <section className="light-border background-light800_dark200 shadow-light-100_dark100 min-w-full rounded-[10] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900">join syncQuestra</h1>
            <p className="paragraph-regular text-dark500_light400">To get your questions answer</p>
          </div>
          <Image src={darkLogo} width={80} height={80} alt="syncQuestra" className="block object-contain dark:hidden" />
          <Image
            src={whiteLogo}
            width={80}
            height={80}
            alt="syncQuestra"
            className="hidden object-contain dark:block"
          />
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
