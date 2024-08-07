import React from "react";
import { RiArrowDownSLine, RiMenuFill } from "react-icons/ri";
import { Dropdown, MenuProps } from "antd";
import greet, { greetEmoji } from "@/shared/utils/greet";
import useAuthStore from "@/store/states/auth";
import StringFormat from "@/shared/utils/string";
import { UserSwitcherModal } from "@/components/Auth/UserSwitch";

interface IHeader {
  toggle: () => void;
}

const Header: React.FC<IHeader> = ({ toggle }) => {
  let { logout, user, impersonated_user } = useAuthStore();
  const [showModal, setShowModal] = React.useState(false);
  const items: MenuProps["items"] = [
    {
      label: <a onClick={() => logout()}>Log out</a>,
      key: "0",
    },
  ];

  if (user?.role === "SUPER_ADMINISTRATOR" && !impersonated_user) {
    items.unshift({
      label: <a onClick={() => setShowModal(true)}>Switch User</a>,
      key: "1",
    });
  }

  return (
    <>
      <div className="flex items-center justify-between py-4 px-7 bg-white border-b h-16">
        <button
          className="md:hidden hover:text-gray-600 text-gray-800"
          onClick={toggle}
        >
          <RiMenuFill className="text-3xl" />
        </button>

        <h1 className="text-2xl font-medium mx-auto md:ml-0">
          {`${greet()}`}
          <span className="hidden md:inline">{`, ${
            user?.lastName
          } ${greetEmoji()} `}</span>
        </h1>

        <div className="flex gap-x-2 items-center">
          <div className="w-12 h-12 bg-blue-50 text-sm font-bold rounded-full border flex justify-center items-center">
            {`${StringFormat.getCharacter(
              user?.firstName,
              1
            )}${StringFormat.getCharacter(user?.lastName, 1)}`}
          </div>
          <div className="hidden md:inline">
            <h4 className="text-sm">
              {user?.firstName} {user?.lastName}
            </h4>
            {user.role && (
              <p className="text-xs">{StringFormat.toTitleCase(user.role)}</p>
            )}
          </div>

          <Dropdown menu={{ items }} trigger={["click"]}>
            <RiArrowDownSLine className="md:ml-4 text-xl cursor-pointer" />
          </Dropdown>
        </div>
      </div>

      <UserSwitcherModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Header;
