import React from "react";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { getOrderById } from "@/lib/service/queryHelper";
import { useQuery } from "@tanstack/react-query";

const OrderDetail = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ["orderData"],
    queryFn: () => getOrderById(),
  });

  console.log(orders);
  const formatDateTime = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day}, ${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "inscribed":
        return "text-[#2cb59e]";
      case "closed":
        return "text-[#ff5c69]";
      case "pending...":
        return "text-[#B0B0B1]";
      default:
        return "text-[#B0B0B1]]";
    }
  };
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  return (
    <div className="container relative m-auto z-50 pt-11 flex flex-col gap-8">
      <div className="flex w-full gap-4">
        <div className="flex">
          <Image
            src="/collections/search.png"
            alt="search icon"
            width={20}
            height={20}
            className="w-[17.08px] h-[17.08px] relative left-8 top-4"
          />
          <input
            type="email"
            name="Search"
            placeholder="Search by Order ID"
            className="w-[813px] h-[48px] rounded-xl pt-[14px] pr-[14px] pb-[14px] pl-10 bg-transparent border border-neutral400 text-neutral200"
          />
        </div>
        <div className="flex justify-center items-center rounded-xl h-12 w-12 border border-neutral400 hover:border-neutral300 cursor-pointer">
          <Image
            src="/collections/refresh.png"
            alt="refresh"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
      </div>

      <div className="flex flex-col w-full pr-[52px] pl-5 gap-4">
        <div className="grid grid-cols-4 pl-5 w-full h-[18px]">
          {["Order ID", "Quantity", "Status", "Date"].map((header) => (
            <p key={header} className="font-medium text-md text-neutral200">
              {header}
            </p>
          ))}
        </div>
        <ScrollArea className="h-[700px] w-full pb-8 border-t-2 border-neutral500">
          {orders.map((item: any) => (
            <div className="flex flex-col w-full pt-4 gap-4">
              <div className="bg-gray50 rounded-2xl p-5">
                <div className="grid grid-cols-4 w-full h-[18px]">
                  <p className="font-medium text-md w-[160px] text-neutral200 truncate">
                    {item?.orderId}
                  </p>
                  <p className="pl-2 font-medium text-md text-neutral200">
                    {item?.quantity}
                  </p>
                  <p
                    className={`pl-3 font-medium text-md ${getStatusColor(item?.status)} capitalize truncate`}
                  >
                    {capitalizeFirstLetter(item?.status)}
                  </p>
                  <p className="pl-4 font-medium text-md text-neutral200">
                    {formatDateTime(item?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrderDetail;
