import { StarsBackground } from "@/components/ui/stars";

export default function StarsBackgroundExample() {
  return (
    <StarsBackground className="flex w-full h-screen justify-center items-center">
      <div className="flex w-full h-screen justify-center items-center ">
        <div className="font-sans font-bold text-7xl text-[#444444]">
          Stars
        </div>
      </div>
    </StarsBackground>
  );
}
