import React from "react";
import { Outlet } from "react-router-dom";
import { GiPayMoney } from "react-icons/gi";
import Logo from "@/assets/images/logo.png";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex h-screen flex-col p-0 lg:p-4 lx:p-0 md:justify-center md:items-center bg-gray-50">
      <div className="xl:w-1/2 w-full md:bg-white flex flex-col md:flex-row h-screen md:h-fit md:min-h-[500px] transition duration-200 ease-in-out shadow-md">
        <div className="bg-blue-100 md:bg-transparent md:w-1/2 w-full px-2 py-12 md:p-16 flex flex-col justify-between">
          <div className="text-center md:text-start">
            {/* TODO: IBL LOGO */}
            <GiPayMoney className="text-6xl text-red-800 mb-2 mx-auto md:ml-0" />

            <h1 className="text-3xl text-red-800">Integrated Business Logic</h1>
            <p className="text-gray-700 text-sm">
              Driving operational efficiency with simplicity...
            </p>
          </div>

          <div className="hidden md:block">
            <img src={Logo} className="w-56 mb-4" alt="Octiver Logo" />
            <p className="text-gray-700 text-sm">
              Connect to the one-stop Enterprise Solution from any location on
              your desktop, laptop or mobile devices!
            </p>
          </div>
        </div>
        <div className="md:bg-blue-100 md:w-1/2 w-full">
          <Outlet />
        </div>
        <div className="block md:hidden mt-auto p-6 text-center">
          <img src={Logo} className="w-40 mb-2 mx-auto" alt="Octiver Logo" />
          <p className="text-gray-700 text-xs italic">
            Connect to the one-stop Enterprise Solution from any location on
            your desktop, laptop or mobile devices!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
