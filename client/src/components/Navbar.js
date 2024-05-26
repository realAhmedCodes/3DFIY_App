import React from 'react'

export const Navbar = () => {
  return (
    <div>
      <nav class="">
        <div class="mx-auto max-w-7xl mt-2">
          <div class="flex h-16 items-center border-b">
            <div class="flex flex-1 items-center justify-between  sm:items-stretch sm:justify-start">
              <div class="flex flex-shrink-0 items-center">
                <a href="#" class="text-2xl text-green-600 font-semibold">
                  3Dify
                </a>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 font-medium flex gap-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button class="py-2 px-4 w-32 bg-[#539e60] text-white rounded-[8px] font-medium">
                Login
              </button>
              <button class="py-2 px-4 w-32 bg-gray-600 text-white rounded-[8px] font-medium">
                Sign Up
              </button>
            </div>
          </div>

          <div class="border-b py-3 flex flex-row gap-8">
            <a href="">Models</a>
            <a href="">Custom Orders</a>
            <a href="">Printers</a>
            <a href="">Price Estimation</a>
          </div>
        </div>
      </nav>
    </div>
  );
}
