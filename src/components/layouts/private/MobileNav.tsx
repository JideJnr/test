import { useEffect } from "react";
import MenuList from "@/components/layouts/private/menu";
import Logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import { SideMenu } from "./Sidebar";

const MobileMenu: React.FC<any> = ({
  show = false,
  toggle,
  openMainParents,
  openSecondLevelParents,
  setOpenMainParents,
  setOpenSecondLevelParents,
}) => {
  useEffect(() => {
    const resize = () => {
      toggle(false);
    };

    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggle(false);
      }
    };

    resize();
    window.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", () => {});
      window.removeEventListener("keydown", () => {});
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 max-w-xs w-full bg-blue-50 transform ease-in-out duration-300 -translate-x-full  p-4 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex mt-12  mb-6 border-b border-gray-200 px-2 pb-8 justify-center 
          `}
        >
          <Link to="/">
            <img
              src={Logo}
              className={`
                h-7 transition duration-300 ease-in-out `}
              alt="Logo"
            />
          </Link>
        </div>

        <div>
          <p className={`text-xs mb-4 uppercase text-gray-500 font-medium`}>
            Menu
          </p>

          <SideMenu
            menu={MenuList}
            isSideNavOpen={true}
            openMainParents={openMainParents}
            openSecondLevelParents={openSecondLevelParents}
            setOpenMainParents={setOpenMainParents}
            setOpenSecondLevelParents={setOpenSecondLevelParents}
          />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
