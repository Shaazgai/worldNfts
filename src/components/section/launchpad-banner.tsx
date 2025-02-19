import React, { useEffect, useState } from "react";
import Image from "next/image";
import { s3ImageUrlBuilder } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import moment from "moment";
import Link from "next/link";
import { Launchschema } from "@/lib/validations/launchpad-validation";

interface BannerProps {
  data?: Launchschema;
}

const LaunchpadBanner: React.FC<BannerProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();
  const [timeDisplay, setTimeDisplay] = useState("");
  const [status, setStatus] = useState("");
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      if (!data) return;

      const now = moment();
      const convertToSeconds = (timestamp: number) => {
        return timestamp?.toString().length === 13
          ? Math.floor(timestamp / 1000)
          : timestamp;
      };

      // Early return if supply is reached
      if (
        data.supply &&
        data.mintedAmount !== undefined &&
        data.mintedAmount >= data.supply
      ) {
        setStatus("Ended");
        setTimeDisplay("");
        setIsClickable(false);
        return;
      }

      const formatTimeDisplay = (duration: moment.Duration) => {
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          return "";
        }

        if (days > 0) {
          return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
            .toString()
            .padStart(2, "0")}m`;
        } else if (hours > 0) {
          return `${hours.toString().padStart(2, "0")}h ${minutes
            .toString()
            .padStart(2, "0")}m`;
        } else if (minutes > 0) {
          return `${minutes.toString().padStart(2, "0")}m ${seconds
            .toString()
            .padStart(2, "0")}s`;
        } else {
          return `${seconds.toString().padStart(2, "0")}s`;
        }
      };

      const { wlStartsAt, wlEndsAt, poStartsAt, poEndsAt, isWhitelisted } =
        data;

      // Convert timestamps to moments
      const wlStart = moment.unix(convertToSeconds(wlStartsAt));
      const wlEnd = wlEndsAt ? moment.unix(convertToSeconds(wlEndsAt)) : null;
      const poStart = moment.unix(convertToSeconds(poStartsAt));
      const poEnd = poEndsAt ? moment.unix(convertToSeconds(poEndsAt)) : null;

      // Handle Whitelist Period (if applicable)
      if (isWhitelisted) {
        if (now.isBefore(wlStart)) {
          setStatus("Starts in:");
          setTimeDisplay(formatTimeDisplay(moment.duration(wlStart.diff(now))));
          setIsClickable(false);
          return;
        }

        if (wlEnd && now.isBetween(wlStart, wlEnd)) {
          setStatus("Ends in:");
          setTimeDisplay(formatTimeDisplay(moment.duration(wlEnd.diff(now))));
          setIsClickable(true);
          return;
        }
      }

      // Handle Public Offering Period
      // If there's no poEnd, it's an indefinite offering after poStart
      if (!poEnd) {
        if (now.isAfter(poStart)) {
          setStatus("Indefinite");
          setTimeDisplay("");
          setIsClickable(true);
          return;
        }

        if (now.isBefore(poStart)) {
          setStatus("PO starts in:");
          setTimeDisplay(formatTimeDisplay(moment.duration(poStart.diff(now))));
          setIsClickable(false);
          return;
        }
      } else {
        // There is a poEnd date
        if (now.isAfter(poEnd)) {
          setStatus("Ended");
          setTimeDisplay("");
          setIsClickable(false);
          return;
        }

        if (now.isBetween(poStart, poEnd)) {
          setStatus("Ends in:");
          setTimeDisplay(formatTimeDisplay(moment.duration(poEnd.diff(now))));
          setIsClickable(true);
          return;
        }

        if (now.isBefore(poStart)) {
          setStatus("Starts in:");
          setTimeDisplay(formatTimeDisplay(moment.duration(poStart.diff(now))));
          setIsClickable(false);
          return;
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        autoplay={true}
        delayMs={5000}
        className="w-full mt-4 sm:mt-8 lg:mt-12"
        setApi={setApi}
      >
        <CarouselContent>
          {/* Static banner slide */}
          <CarouselItem>
            <div className="relative h-[320px] w-full">
              <div className="w-full h-full relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
                <Image
                  src="/banner.png"
                  alt="worldNftsBanner"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/20">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <p className="text-xl sm:text-2xl lg:text-3xl text-neutral00 font-bold">
                      We are live on
                    </p>
                    <Image
                      src="/wallets/Citrea.png"
                      alt="citrea"
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
                    />
                    <p className="text-xl sm:text-2xl lg:text-3xl text-neutral00 font-bold">
                      Citrea testnet!
                    </p>
                  </div>
                  <p className="text-sm lg:text-lg text-neutral50 px-4 text-center">
                    Mint Park is live on Citrea testnet! Start minting and
                    trading NFTs.
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Dynamic data slide */}
          {data && data.logoKey && (
            <CarouselItem>
              <div className="relative h-[320px] w-full">
                <div className="w-full h-[320px] relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
                  <div
                    className="absolute z-0 inset-0"
                    style={{
                      backgroundImage: data?.logoKey
                        ? `url(${s3ImageUrlBuilder(data.logoKey)})`
                        : "url(/path/to/fallback/image.png)",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  />

                  <div className="absolute inset-0 flex items-end bg-gradient-to-b from-transparent to-[#111315]">
                    <div className="w-full p-4 sm:p-6 lg:p-8">
                      <div className="flex flex-col gap-2 sm:gap-4">
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-lg sm:text-2xl lg:text-3xl text-neutral00 font-bold line-clamp-1">
                            {data?.name}
                          </p>
                          <p className="text-md sm:text-md lg:text-md text-neutral50 line-clamp-2">
                            {data?.description}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                          <div className="bg-white4 flex gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium text-neutral100 items-center w-fit">
                            {(status === "Indefinite" ||
                              status === "Ends in:") && (
                              <div className="bg-success20 h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 rounded-full flex justify-center items-center">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-success rounded-full" />
                              </div>
                            )}
                            <p className="text-lg font-normal text-neutral100">
                              {status}
                            </p>
                            <p className="text-lg font-medium text-neutral00">
                              {timeDisplay}
                            </p>
                          </div>
                          {(status === "Indefinite" ||
                            status === "Ends in:") && (
                            <Link
                              href={`/launchpad/${data.id}`}
                              className="sm:ml-auto text-neutral600"
                            >
                              <Button className="w-full text-neutral600 sm:w-auto text-md2">
                                Go to minter
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {/* Custom navigation buttons */}
        <div className="absolute -bottom-6 left-1/2 flex gap-2 transform -translate-x-1/2">
          <button
            onClick={() => api?.scrollTo(0)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
              activeIndex === 0
                ? "w-3 sm:w-4 bg-brand"
                : "w-1.5 sm:w-2 bg-neutral400"
            }`}
            aria-label="Go to slide 1"
          />
          {data && data.logoKey && (
            <button
              onClick={() => api?.scrollTo(1)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-200 ${
                activeIndex === 1
                  ? "w-3 sm:w-4 bg-brand"
                  : "w-1.5 sm:w-2 bg-neutral400"
              }`}
              aria-label="Go to slide 2"
            />
          )}
        </div>
      </Carousel>
    </div>
  );
};

export default LaunchpadBanner;
