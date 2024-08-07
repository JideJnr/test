import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import Logo from "@/assets/images/logo.png";
import LogoSM from "@/assets/images/favicon.png";
import { RiArrowRightSLine } from "react-icons/ri";
import MenuList, { IMenuList } from "@/components/layouts/private/menu";
import { roleChecker } from "@/shared/utils/role";
import useStore from "@/store";

const SideNav: React.FC<any> = ({
  openMainParents,
  openSecondLevelParents,
  setOpenMainParents,
  setOpenSecondLevelParents,
}) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [prevOpenMainParent, setPrevOpenMainParent] = useState("");
  const [prevOpenSecondLevelParent, setPrevOpenSecondLevelParent] =
    useState("");

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1024) {
        setIsSideNavOpen(false);
      } else {
        setIsSideNavOpen(true);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    if (!isSideNavOpen) {
      setPrevOpenMainParent(openMainParents);
      setPrevOpenSecondLevelParent(openSecondLevelParents);
      setOpenMainParents("");
      setOpenSecondLevelParents("");
    } else {
      setOpenMainParents(prevOpenMainParent);
      setOpenSecondLevelParents(prevOpenSecondLevelParent);
    }
  }, [isSideNavOpen]);

  return (
    <div
      className={`${
        isSideNavOpen ? "w-72" : "w-24"
      } sidebar bg-blue-50 border-r border-blue-100 text-gray-800 space-y-6 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition-all duration-200 ease-in-out flex flex-col z-30`}
    >
      {/* Logo */}
      <div
        className={`flex h-16 border-b items-center border-gray-200 ${
          isSideNavOpen ? "justify-start p-4" : "px-2 justify-center "
        }`}
      >
        <Link to="/">
          <img
            src={!isSideNavOpen ? LogoSM : Logo}
            className={`${
              !isSideNavOpen ? "w-10" : "h-7"
            } transition duration-300 ease-in-out `}
            alt="Logo"
          />
        </Link>
      </div>

      {/* Menu List */}
      <div className="overflow-y-auto p-4">
        <p
          className={`text-xs mb-4 uppercase text-gray-500 font-medium ${
            !isSideNavOpen && "text-center"
          }`}
        >
          {!isSideNavOpen ? "..." : "Menu"}
        </p>
        <SideMenu
          menu={MenuList}
          isSideNavOpen={isSideNavOpen}
          openMainParents={openMainParents}
          openSecondLevelParents={openSecondLevelParents}
          setOpenMainParents={setOpenMainParents}
          setOpenSecondLevelParents={setOpenSecondLevelParents}
        />
      </div>

      {/* collapse */}
      <button
        className="hidden md:flex absolute bottom-24 border -right-5 gap-x-2 text-gray-100 bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <RiArrowRightSLine
          className={`text-2xl transition duration-300 ease-in-out text-gray-50 ${
            isSideNavOpen && "rotate-180"
          }`}
        />
      </button>
    </div>
  );
};

export default SideNav;

export const SideMenu = ({
  menu,
  isSideNavOpen,
  openMainParents,
  openSecondLevelParents,
  setOpenMainParents,
  setOpenSecondLevelParents,
}) => {
  const {
    authStore: {
      user: { role: userRole },
      impersonated_user,
    },
  } = useStore();
  const toggleParent = (id) => {
    if (id === openMainParents) {
      setOpenMainParents("");
    } else {
      setOpenMainParents(id);
    }
  };
  const [role, setRole] = useState(
    impersonated_user?.role ? impersonated_user?.role : userRole
  );

  useEffect(() => {
    setRole(impersonated_user?.role ? impersonated_user?.role : userRole);
  }, [impersonated_user, userRole]);

  const toggleSecondLevelParent = (id, parentId) => {
    if (parentId === openMainParents) {
      if (openSecondLevelParents === id) {
        setOpenSecondLevelParents("");
      } else {
        setOpenSecondLevelParents(id);
      }
    } else {
    }
  };

  const renderMenuItem = (item) => {
    if (item.subMenu) {
      const isOpen = openMainParents === item.id ? true : false;

      return (
        roleChecker(item?.permissions, role) && (
          <SubMenu
            key={item.id}
            label={item.name}
            isOpen={isOpen}
            onToggle={() => toggleParent(item.id)}
            isSideNavOpen={isSideNavOpen}
            icon={item.icon}
          >
            {item.subMenu.map((childItem: IMenuList) => {
              if (childItem.subMenu) {
                const isSecondLevelOpen =
                  openSecondLevelParents === childItem.id ? true : false;

                return (
                  roleChecker(childItem?.permissions, role) && (
                    <SubMenu
                      key={childItem.id}
                      label={childItem.name}
                      isOpen={isSecondLevelOpen}
                      isSideNavOpen={isSideNavOpen}
                      icon={childItem.icon}
                      onToggle={() =>
                        toggleSecondLevelParent(childItem.id, item.id)
                      }
                    >
                      {childItem.subMenu.map(renderMenuItem)}
                    </SubMenu>
                  )
                );
              } else {
                return (
                  roleChecker(childItem?.permissions, role) && (
                    <MenuItem
                      key={childItem.id}
                      label={childItem.name}
                      icon={childItem.icon}
                      isSideNavOpen={isSideNavOpen}
                      path={childItem.path}
                    />
                  )
                );
              }
            })}
          </SubMenu>
        )
      );
    } else {
      return (
        roleChecker(item?.permissions, role) && (
          <MenuItem
            key={item.id}
            label={item.name}
            icon={item.icon}
            isSideNavOpen={isSideNavOpen}
            path={item.path}
          />
        )
      );
    }
  };

  return (
    <ul
      className={`${
        isSideNavOpen ? "" : "p-1"
      } flex flex-col gap-y-4 justify-self-start overflow-y-auto`}
    >
      {menu.map(renderMenuItem)}
    </ul>
  );
};

const SubMenu = (prop) => {
  return (
    <li>
      <div
        className={`text-gray-500 ${
          prop.isSideNavOpen
            ? "justify-start py-2 hover:text-blue-600"
            : prop.isOpen
            ? "justify-start py-2 text-blue-600"
            : "justify-center py-3 hover:text-blue-600"
        } text-lg flex items-center gap-x-3 group transition cursor-pointer`}
        onClick={(e) => {
          e.preventDefault();
          prop.onToggle();
        }}
      >
        {prop.icon && <prop.icon />}
        {prop.isSideNavOpen && (
          <span className="font-normal text-sm transition duration-300 ease-out ">
            {prop.label}
          </span>
        )}
        {prop.isSideNavOpen && (
          <RiArrowRightSLine
            className={`ml-auto transition duration-300 ease-in-out ${
              prop.isOpen && "rotate-90 "
            }`}
          />
        )}
      </div>
      {prop.isOpen && (
        <div className="lg:block lg:sidebar-expanded:block 2xl:block">
          <ul
            className={`pl-12 transition duration-300 flex flex-col gap-y-3  ${
              prop.isOpen ? "mt-3" : ""
            } `}
          >
            {prop.children}
          </ul>
        </div>
      )}
    </li>
  );
};

const MenuItem: React.FC<{
  label: string;
  path: string;
  icon: React.FC<any>;
  isSideNavOpen: boolean;
}> = (prop) => {
  return (
    <li>
      <NavLink
        to={prop.path}
        className={`${
          prop.isSideNavOpen
            ? "justify-start py-2 hover:text-blue-600"
            : "justify-center py-3 hover:text-blue-600 "
        } text-sm text-gray-500 flex items-center gap-x-3 group transition [&.active]:text-blue-600`}
      >
        {prop.icon && <prop.icon />}

        {prop.isSideNavOpen && (
          <span className="font-normal text-sm transition duration-300 ease-out ">
            {prop.label}
          </span>
        )}
      </NavLink>
    </li>
  );
};
