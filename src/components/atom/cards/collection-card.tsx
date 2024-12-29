import Image from "next/image";
import { Global, Notepad, Profile2User } from "iconsax-react";
import { CollectionDataType } from "@/lib/types";
import React from "react";
import { s3ImageUrlBuilder } from "@/lib/utils";
import HoverCard from "@/components/section/collections/hoverCard";

export type CardType = {
  data: CollectionDataType;
  handleNav: () => void;
};

const formatPrice = (price: number) => {
  return price?.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

const CollectionCard: React.FC<CardType> = ({ data, handleNav }) => {
  return (
    <button
      onClick={handleNav}
      className="w-[280px] h-[432px] transition-transform duration-300 hover:scale-[1.02] backdrop-blur-sm bg-gradient-to-br collection from-gradientStart to-transparent border border-neutral400 rounded-xl p-3 sm:p-4 flex flex-col justify-between items-center"
    >
      <Image
        width={248}
        height={248}
        src={s3ImageUrlBuilder(data?.logoKey)}
        className="object-cover aspect-square rounded-xl"
        alt={`${data.name || "Collection"} image`}
      />

      <div className="pt-3 sm:pt-4 grid gap-3 sm:gap-4 w-full">
        <p className="text-xl font-bold text-start text-neutral00 line-clamp-1">
          {data.name}
        </p>

        <div className="grid grid-cols-2 w-full gap-2 sm:gap-4">
          <div className="text-start">
            <p className="text-xs sm:text-sm font-medium text-neutral200">
              Floor price
            </p>
            <p className="pt-1 sm:pt-2 font-bold text-sm sm:text-md text-neutral-50">
              {formatPrice(data.floor)}
              <span className="ml-1">cBTC</span>
            </p>
          </div>
          <div className="text-start">
            <p className="text-xs sm:text-sm font-medium text-neutral200">
              Volume
            </p>
            <p className="pt-1 sm:pt-2 font-bold text-sm sm:text-md text-neutral-50">
              {formatPrice(data?.volume)}
              <span className="ml-1">cBTC</span>
            </p>
          </div>
        </div>

        <div className="border-t border-neutral400 w-full my-1 sm:my-0"></div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
          <div className="flex items-center">
            <Profile2User size={16} className="text-brand" />
            <p className="ml-2 font-medium text-sm sm:text-md text-neutral50">
              <span>{data?.ownerCount ? data?.ownerCount : 0}</span> owners
            </p>
          </div>
          <div className="flex items-center">
            <Notepad size={16} className="text-brand" />
            <p className="ml-2 font-medium text-sm sm:text-md text-neutral50">
              <span>{data?.supply}</span> items
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 delay-500">
        <HoverCard data={data} />
      </div>
    </button>
  );
};

export default CollectionCard;
