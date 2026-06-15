import { auth } from "@/auth";

const Home = async () => {
  // session
  await auth();

  // console.log(session)

  return (
    <>
      <div className="font-shareTechMono text-red-500">Home</div>
    </>
  );
};

export default Home;
