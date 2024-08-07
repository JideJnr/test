import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { useQuery } from "@/shared/utils";
import { message } from "antd";
import useAuthStore from "@/store/states/auth";

const ForgetPassword: React.FC = () => {
  let {
    authLoading,
    forgetPassword,
    error,
    message: msg,
    email,
    setAuthValue,
  } = useAuthStore();
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      message.error(error);
    }

    if (msg) {
      message.success(msg);
      navigate("/reset-password");
    }

    return () => {
      setAuthValue("message", "");
      setAuthValue("error", "");
    };
  }, [error, msg]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email) {
      await forgetPassword();
    } else {
      message.warning("Please enter a valid email");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6 h-full">
      <h1 className="text-gray-800  text-center md:text-start text-2xl pt-6 md:pl-6 font-semibold">
        {query.get("flag") === "c" ? "Activate Account" : "Recover Password"}
      </h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="p-6 text-gray-800 ">
          <div className="mb-6">
            <label className="text-sm block mb-1" htmlFor="forget-email">
              Email
            </label>
            <input
              type="email"
              inputMode="email"
              id="forget-email"
              className="w-full form-input"
              placeholder="jane@doe.com"
              value={email}
              onChange={(e) => setAuthValue("email", e.target.value)}
              tabIndex={-1}
            />
          </div>
          <Button
            title={query.get("flag") === "c" ? "Proceed" : "Recover Password"}
            block
            size="large"
            type="primary"
            isLoading={authLoading}
            disabled={authLoading}
            className="my-8 mx-auto text-sm"
            forForm
          ></Button>
        </div>
      </form>

      <p className="flex gap-1 text-center w-fit mx-auto text-gray-800 text-sm mt-auto">
        {query.get("flag") === "c" ? "Old User" : "Remember Password"}?
        <Link
          to="/"
          className="font-bold hover:text-gray-500 transition duration-200 ease-in-out"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default ForgetPassword;
