import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingPosts = () => {
  return (
    <div className="mt-16  grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))]    gap-y-6 gap-x-10 place-content-center w-full place-items-center">
      {Array.from({ length: 8 }).map((_, index) => {
        return (
          <div
            key={index}
            className="flex flex-col space-y-3 bg-gray-300 p-2 rounded-md h-[330px] w-full"
          >
            <div className="flex items-center gap-3">

              <Skeleton className="h-[25px] w-[25px]  rounded-full" />
              <div className="flex flex-col gap-1">

                <Skeleton className="h-2 w-[100px]  " />
                <Skeleton className="h-2 w-[100px]  " />
              </div>
            </div>

            <Skeleton className="h-[165px]  rounded-md" />
            <div className="">
              <Skeleton className="h-4  mb-5" />

              <div className="space-y-2">
                <Skeleton className="h-4 " />
                <Skeleton className="h-4 " />
                <Skeleton className="h-4 " />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoadingPosts;
