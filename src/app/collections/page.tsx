"use client";

import React, { useState } from "react";
import ColumColCard from "@/components/atom/cards/column-col-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import CollectionSideBar from "../../components/section/collections/sideBar";
import { useQuery } from "@tanstack/react-query";
import { getListedCollections } from "@/lib/service/queryHelper";
import { useAuth } from "@/components/provider/auth-context-provider";
import CollectionCard from "@/components/atom/cards/collection-card";
import { CollectionDataType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CollectionSkeleton from "@/components/atom/skeleton/collection-skeletion";
import CollectionsBanner from "@/components/section/collections-banner";

interface CollectionsProps {
  params: {};
  searchParams: { detail?: string };
}

type OrderConfig = {
  orderBy: "floor" | "volume";
  orderDirection: "highest" | "lowest";
};

const orderConfigs: Record<string, OrderConfig> = {
  "highest-volume": { orderBy: "volume", orderDirection: "highest" },
  "lowest-volume": { orderBy: "volume", orderDirection: "lowest" },
  "highest-floor": { orderBy: "floor", orderDirection: "highest" },
  "lowest-floor": { orderBy: "floor", orderDirection: "lowest" },
};

export default function Collections({
  searchParams,
}: CollectionsProps) {
  const detail = searchParams.detail === "true";
  const router = useRouter();
  const { authState } = useAuth();
  const id = authState?.layerId;
  const intervals = ["1h", "24h", "7d", "30d", "All"];
  const [active, setActive] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<string>("highest-volume");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const orderConfig = orderConfigs[selectedOrder];

  const { data: collection = [], isLoading } = useQuery({
    queryKey: [
      "collectionData",
      selectedInterval,
      orderConfig.orderBy,
      orderConfig.orderDirection,
    ],
    queryFn: () =>
      getListedCollections(
        id as string,
        selectedInterval.toLowerCase(),
        orderConfig.orderBy,
        orderConfig.orderDirection,
      ),
    enabled: !!id,
  });

  const handleNavigation = (collectionData: CollectionDataType) => {
    const queryParams = new URLSearchParams({
      id: collectionData.id,
      data: JSON.stringify(collectionData),
    }).toString();
    router.push(`/collections/${collectionData.id}?${queryParams}`);
  };

  const collectionArray = Array.isArray(collection) ? collection : [];

  return (
    <>
      <CollectionsBanner />
      <Tabs
        value={selectedInterval}
        onValueChange={setSelectedInterval}
        className="mt-4 sm:mt-6 lg:mt-8 mb-6 sm:mb-8 lg:mb-10 border-hidden"
      >
        <section className="flex flex-col justify-between md:flex-row gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-7">
          {detail ? (
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <button
                className={`w-12 h-12 rounded-xl p-3 ${
                  !active
                    ? "bg-neutral500 hover:bg-neutral400 border-transparent"
                    : "bg-neutral600 border border-neutral500 hover:border-neutral400"
                }`}
                onClick={() => setActive(!active)}
              >
                <Image
                  src="/collections/sort.png"
                  alt="sort"
                  width={20}
                  height={20}
                />
              </button>
              <div className="relative flex-grow">
                <input
                  type="search"
                  placeholder="Search ID"
                  className="w-full h-12 rounded-xl px-10 py-3 bg-transparent border border-neutral400 text-neutral200"
                />
                <Image
                  src="/collections/search.png"
                  alt="search"
                  width={17}
                  height={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TabsList className="h-12 text-neutral50 p-1 border border-neutral400 rounded-xl gap-1 whitespace-nowrap">
                {intervals.map((interval) => (
                  <TabsTrigger
                    key={interval}
                    value={interval}
                    className="w-[46px] sm:w-[59px] h-10 font-semibold text-[15px] rounded-lg border-hidden"
                  >
                    {interval}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Select
              value={selectedOrder}
              onValueChange={(value) => setSelectedOrder(value)}
            >
              <SelectTrigger className="h-12 rounded-lg bg-transparent border border-neutral400 text-md2 text-neutral50 px-4">
                <SelectValue placeholder="Highest volume" />
              </SelectTrigger>
              <SelectContent className="lg:w-[225px] rounded-xl p-1 bg-neutral600/70 text-neutral50 border-neutral400 backdrop-blur-md">
                {Object.keys(orderConfigs).map((key) => (
                  <SelectItem key={key} value={key} className="px-4">
                    {key
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-center items-center w-[100px] border border-neutral400 p-1 rounded-xl h-12">
              <button
                className={`w-11 h-10 rounded-lg p-3 ${viewType === "grid" ? "bg-white4" : ""}`}
                onClick={() => setViewType("grid")}
              >
                <Image
                  src="/collections/hashtag.png"
                  alt="grid view"
                  width={20}
                  height={20}
                />
              </button>
              <button
                className={`w-11 h-10 rounded-lg p-3 ${viewType === "list" ? "bg-white4" : ""}`}
                onClick={() => setViewType("list")}
              >
                <Image
                  src="/collections/burger.png"
                  alt="list view"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </section>

        {detail && (
          <section
            className={`flex w-full ${active ? "gap-6 lg:gap-10" : "gap-0"} pt-4 sm:pt-6 lg:pt-7`}
          >
            <div
              className={`${active ? "w-full sm:w-[280px] opacity-100" : "w-0 opacity-0"} transition-all duration-300`}
            >
              <CollectionSideBar />
            </div>
            <div className="flex-grow">
              <TabsContent value="ColCard">
                <div className="hidden sm:grid grid-cols-4 gap-4 px-4 pb-4 text-neutral200 font-medium text-sm sm:text-md">
                  <div>Item</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Floor difference</div>
                  <div className="text-center">Owner</div>
                </div>
              </TabsContent>
            </div>
          </section>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedInterval}-${viewType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!detail && (
              <div>
                {viewType === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
                    {isLoading
                      ? Array(8)
                          .fill(null)
                          .map((_, index) => <CollectionSkeleton key={index} />)
                      : collectionArray?.map((item: any) => (
                          <div key={item.id}>
                            <CollectionCard
                              data={item}
                              handleNav={() => handleNavigation(item)}
                            />
                          </div>
                        ))}
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="hidden sm:grid grid-cols-[2fr_3fr_2fr] gap-4 px-4 pb-4 text-neutral200 font-medium text-sm sm:text-md">
                      <div>Name</div>
                      <div className="grid grid-cols-3 text-center">
                        <span>Floor price</span>
                        <span>Volume</span>
                        <span>Market cap</span>
                      </div>
                      <div className="grid grid-cols-3 text-center">
                        <span>Sales</span>
                        <span>Listed</span>
                        <span>Owners</span>
                      </div>
                    </div>
                    <div className="h-[500px] sm:h-[600px] lg:h-[754px] border-t-2 border-neutral500 w-full overflow-y-auto">
                      <div className="flex flex-col gap-4 pt-4 ">
                        {collectionArray?.map((item: any) => (
                          <div key={item.id}>
                            <ColumColCard
                              data={item}
                              handleNav={() => handleNavigation(item)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </>
  );
}

// "use client";
// import React, { useEffect, useState } from "react";
// import ColumColCard from "@/components/atom/cards/ColumColCard";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Image from "next/image";
// import CollectionSideBar from "../../components/section/collections/sideBar";
// import { useQuery } from "@tanstack/react-query";
// import { getListedCollections } from "@/lib/service/queryHelper";
// import { useAuth } from "@/components/provider/auth-context-provider";
// import CollectionCard from "@/components/atom/cards/collectionCard";
// import { CollectionDataType } from "@/lib/types";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import CollectionSkeleton from "@/components/atom/skeleton/collection-skeletion";
// import CollectionsBanner from "@/components/section/collectionsBanner";

// interface CollectionsProps {
//   params: {};
//   searchParams: {
//     detail?: string;
//   };
// }

// type OrderConfig = {
//   orderBy: "floor" | "volume";
//   orderDirection: "highest" | "lowest";
// };

// const orderConfigs: Record<string, OrderConfig> = {
//   "highest-volume": { orderBy: "volume", orderDirection: "highest" },
//   "lowest-volume": { orderBy: "volume", orderDirection: "lowest" },
//   "highest-floor": { orderBy: "floor", orderDirection: "highest" },
//   "lowest-floor": { orderBy: "floor", orderDirection: "lowest" },
// };

// export default function Collections({
//   params,
//   searchParams,
// }: CollectionsProps) {
//   const detail = searchParams.detail === "true";
//   const router = useRouter();
//   const { authState } = useAuth();
//   const id = authState?.layerId;
//   const intervals = ["1h", "24h", "7d", "30d", "all"];
//   const [active, setActive] = useState(false);
//   const [selectedInterval, setSelectedInterval] = useState("all");
//   const [selectedOrder, setSelectedOrder] = useState<string>("highest-volume");
//   const [viewType, setViewType] = useState<"grid" | "list">("grid");

//   // Extract order configuration based on selected order
//   const orderConfig = orderConfigs[selectedOrder];

//   const { data: collection = [], isLoading } = useQuery({
//     queryKey: [
//       "collectionData",
//       selectedInterval,
//       orderConfig.orderBy,
//       orderConfig.orderDirection,
//     ],
//     queryFn: () =>
//       getListedCollections(
//         id as string,
//         selectedInterval.toLowerCase(),
//         orderConfig.orderBy,
//         orderConfig.orderDirection,
//       ),
//     enabled: !!id,
//   });

//   const handleNavigation = (collectionData: CollectionDataType) => {
//     const queryParams = new URLSearchParams({
//       id: collectionData.id,
//       data: JSON.stringify(collectionData),
//     }).toString();
//     router.push(`/collections/${collectionData.id}?${queryParams}`);
//   };

//   const handleOrderChange = (value: string) => {
//     setSelectedOrder(value);
//   };

//   const handleViewTypeChange = (type: "grid" | "list") => {
//     setViewType(type);
//   };

//   const collectionArray = Array.isArray(collection) ? collection : [];

//   return (
//     <>
//     <CollectionsBanner/>
//       <Tabs
//         value={selectedInterval}
//         onValueChange={setSelectedInterval}
//         className="mt-8 mb-10 border-hidden"
//       >
//         <section className="flex justify-between mb-7">
//           {detail ? (
//             <section className="flex justify-between ">
//               <Image
//                 src={"/collections/sort.png"}
//                 alt="sort"
//                 width={20}
//                 height={20}
//                 className={`w-12 h-12 rounded-xl p-3 ${
//                   !active
//                     ? "bg-neutral500 hover:bg-neutral400 border-transparent"
//                     : "bg-neutral600 border border-neutral500 hover:border-neutral400"
//                 }`}
//                 onClick={() => setActive(!active)}
//               />
//               <div className="flex">
//                 <Image
//                   src={"/collections/search.png"}
//                   alt="search"
//                   width={20}
//                   height={20}
//                   className="w-[17.08px] h-[17.08px] relative left-8 top-4"
//                 />
//                 <input
//                   type="email"
//                   name="Search"
//                   placeholder="Search ID"
//                   className="w-[813px] h-[48px] rounded-xl pt-[14px] pr-[14px] pb-[14px] pl-10 bg-transparent border border-neutral400 text-neutral200"
//                 />
//                 <div />
//               </div>
//             </section>
//           ) : (
//             <div>
//               <TabsList className="h-12 text-neutral50 p-1 border border-neutral400 rounded-xl gap-1">
//                 {intervals.map((interval) => (
//                   <TabsTrigger
//                     key={interval}
//                     value={interval}
//                     className="w-[59px] h-10 font-semibold text-[15px] rounded-lg border-hidden"
//                   >
//                     {interval}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//             </div>
//           )}
//           <div className="flex justify-between text-center items-center w-[330px] h-[48px] gap-4">
//             <Select value={selectedOrder} onValueChange={handleOrderChange}>
//               <SelectTrigger className="w-60 h-12 rounded-lg bg-transparent border border-neutral400 text-md2 text-neutral50 pt-2 pr-4 pb-2 pl-5">
//                 <SelectValue placeholder="Highest volume" />
//               </SelectTrigger>
//               <SelectContent
//                 className="w-[225px] h-40 rounded-xl text-center bg-neutral600 bg-opacity-[70%] text-neutral50 border-neutral400"
//                 style={{
//                   backdropFilter: "blur(30px)",
//                 }}
//               >
//                 <SelectItem value="highest-volume" className="pl-10">
//                   Highest volume
//                 </SelectItem>
//                 <SelectItem value="lowest-volume" className="pl-10">
//                   Lowest volume
//                 </SelectItem>
//                 <SelectItem value="highest-floor" className="pl-10">
//                   Highest floor price
//                 </SelectItem>
//                 <SelectItem value="lowest-floor" className="pl-10">
//                   Lowest floor price
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="text-neutral50 border border-neutral400 rounded-xl w-[92px] h-12 flex justify-center items-center">
//               <button
//                 className={`w-10 h-10 font-semibold text-[15px] rounded-lg p-[10px] ${
//                   viewType === "grid" ? "bg-white4" : ""
//                 }`}
//                 onClick={() => handleViewTypeChange("grid")}
//               >
//                 <Image
//                   src="/collections/hashtag.png"
//                   alt="grid view"
//                   width={20}
//                   height={20}
//                 />
//               </button>
//               <button
//                 className={`w-10 h-10 font-semibold text-[15px] rounded-lg p-[10px] ${
//                   viewType === "list" ? "bg-white4" : ""
//                 }`}
//                 onClick={() => handleViewTypeChange("list")}
//               >
//                 <Image
//                   src="/collections/burger.png"
//                   alt="list view"
//                   width={20}
//                   height={20}
//                 />
//               </button>
//             </div>
//           </div>
//         </section>

//         {detail && (
//           <section
//             className={`flex w-full ${active ? "gap-10" : "gap-0"} pt-7`}
//           >
//             <div
//               className={`flex ${
//                 active ? " opacity-100 w-[280px]" : " opacity-0 w-0"
//               } transition-all`}
//             >
//               <CollectionSideBar />
//             </div>

//             <TabsContent value="ColCard" className="w-full">
//               <div className="flex h-[34px] pr-8 pb-4 pl-4">
//                 <div className="w-[392px] h-[18px]">
//                   <p className="font-medium text-md text-neutral200">Item</p>
//                 </div>
//                 <div className="grid grid-cols-4 w-full text-center">
//                   <div className="max-w-[200px] h-[18px]">
//                     <p className="font-medium text-md text-neutral200 pr-7">
//                       Price
//                     </p>
//                   </div>
//                   <div className="max-w-[200px] h-[18px]">
//                     <p className="font-medium text-md text-neutral200">
//                       Floor difference
//                     </p>
//                   </div>
//                   <div className="max-w-[200px] h-[18px]">
//                     <p className="font-medium text-md text-neutral200">Owner</p>
//                   </div>
//                   <div className="max-w-[200px] h-[18px]">
//                     <p className="font-medium text-md text-neutral200 pl-10">
//                       Listed time
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </section>
//         )}

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`${selectedInterval}-${viewType}`}
//             initial={{ opacity: 0, y: 0 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 0 }}
//             transition={{ duration: 0 }}
//           >
//             {!detail && (
//               <div>
//                 {viewType === "grid" ? (
//                   <div className="grid grid-cols-4 gap-10">
//                     {isLoading
//                       ? Array(8)
//                           .fill(null)
//                           .map((_, index) => <CollectionSkeleton key={index} />)
//                       : collectionArray?.map((item: any) => (
//                           <div key={item.id}>
//                             <CollectionCard
//                               data={item}
//                               handleNav={() => handleNavigation(item)}
//                             />
//                           </div>
//                         ))}
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="flex h-[34px] pr-8 pb-4 pl-4">
//                       <div className="w-[376px] h-[18px]">
//                         <p className="font-medium text-md text-neutral200">
//                           Name
//                         </p>
//                       </div>
//                       <div className="w-[468px] h-[18px] flex justify-around">
//                         <p className="font-medium text-md text-neutral200">
//                           Floor price
//                         </p>
//                         <p className="font-medium text-md text-neutral200">
//                           Volume
//                         </p>
//                         <p className="font-medium text-md text-neutral200">
//                           Market cap
//                         </p>
//                       </div>
//                       <div className="w-[324px] h-[18px] flex justify-around">
//                         <p className="font-medium text-md text-neutral200">
//                           Sales
//                         </p>
//                         <p className="font-medium text-md text-neutral200">
//                           Listed
//                         </p>
//                         <p className="font-medium text-md text-neutral200">
//                           Owners
//                         </p>
//                       </div>
//                     </div>
//                     <ScrollArea className="h-[754px] border-t-2 border-neutral500">
//                       <div className="grid grid-cols-1 pt-4 gap-4">
//                         {collectionArray?.map((item: any) => (
//                           <div key={item.id}>
//                             <ColumColCard
//                               data={item}
//                               handleNav={() => handleNavigation(item)}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                   </div>
//                 )}
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </Tabs>
//     </>
//   );
// }
