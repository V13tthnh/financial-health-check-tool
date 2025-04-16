import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center mt-5">
      <Image
        src="/images/logo.png"
        alt="Money with Mina Logo"
        width={70}
        height={70}
        unoptimized={true}
      />
    </div>
  );
}
