import Image from "next/image";
import RecorderBar from "@/components/recorder_ui";
import TierSelector from "@/components/tier_selector";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* navbar at top */}
{/*       <Navbar/> */}
      {/* for selecting tier */}
      <TierSelector/>

      <RecorderBar/>
    </div>
  );
}
