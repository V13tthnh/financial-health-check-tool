import Image from "next/image";
import moneyWithMinaLogo from "@/public/images/money-with-mina-logo.png";

export default function Logo() {
  return (
    <div className="flex justify-center mt-5">
      <Image
        src={moneyWithMinaLogo}
        alt="Money with Mina Logo"
        width={140}
        height={50}
        priority={true}
        crossOrigin="anonymous"
      />
    </div>
  );
}
