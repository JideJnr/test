import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Worker } from "@react-pdf-viewer/core";
import SideNav from "@/components/layouts/private/Sidebar";
import MobileMenu from "@/components/layouts/private/MobileNav";
import Header from "@/components/layouts/private/Header";
import useStore from "@/store";
import { Spin } from "antd";
import { ImpersonatedUser } from "@/components/Auth/UserSwitch";

const AppLayout: React.FC<any> = () => {
  const {
    miscStore: { spinner },
    authStore: { impersonated_user },
  } = useStore();
  const [openMainParents, setOpenMainParents] = useState<string>();
  const [openSecondLevelParents, setOpenSecondLevelParents] =
    useState<string>();
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenu) {
      setIsMobileMenu(false);
    }
  }, [location]);

  return (
    <Spin spinning={spinner}>
      <div className="relative h-screen flex">
        <SideNav
          openMainParents={openMainParents}
          openSecondLevelParents={openSecondLevelParents}
          setOpenMainParents={setOpenMainParents}
          setOpenSecondLevelParents={setOpenSecondLevelParents}
        />
        <MobileMenu
          toggle={() => setIsMobileMenu(false)}
          show={isMobileMenu}
          openMainParents={openMainParents}
          openSecondLevelParents={openSecondLevelParents}
          setOpenMainParents={setOpenMainParents}
          setOpenSecondLevelParents={setOpenSecondLevelParents}
        />

        <div
          onClick={() => setIsMobileMenu(false)}
          className={`fixed md:hidden inset-0 z-30 bg-gray-900 bg-opacity-90 pointer-events-none transition-opacity ease-linear duration-300 ${
            isMobileMenu
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        ></div>

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header toggle={() => setIsMobileMenu(true)} />
          <main
            className={`mt-0 p-4 md:px-12 py-10 md:py-8 bg-gray-50 flex-1 relative z-0 overflow-y-auto transition-all ease-in-out duration-300 h-screen ${
              impersonated_user && "md:pb-32"
            }`}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.min.js">
              <Outlet />
            </Worker>
          </main>
        </div>
      </div>

      {impersonated_user && (
        <div className="fixed bottom-0 z-50 w-full">
          <ImpersonatedUser />
        </div>
      )}
    </Spin>
  );
};

export default AppLayout;
