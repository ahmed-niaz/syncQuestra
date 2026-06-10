import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const Home = async () => {
  // session
  await auth();

  // console.log(session)

  return (
    <>
      <div className="font-shareTechMono text-red-500">Home</div>
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.LOGIN });
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </>
  );
};

export default Home;
