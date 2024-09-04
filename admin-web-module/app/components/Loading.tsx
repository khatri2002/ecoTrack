import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image
        alt="ecoTrack logo"
        height={100}
        src="/logo/ecoTrack_logo.png"
        width={100}
      />
    </div>
  );
};

export default Loading;
