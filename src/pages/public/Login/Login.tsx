import useAuthStore from "@/store/states/auth";
import { message } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";

const Login: React.FC = () => {
  let { authLoading, login, error, setAuthValue, email, password } =
    useAuthStore();

  useEffect(() => {
    if (error) {
      message.error(error);
    }

    return () => {
      setAuthValue("error", "");
    };
  }, [error]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (email && password) {
      await login();
    } else {
      message.warning("Please enter a valid username or password");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6 h-full">
      <h1 className="text-gray-800  text-center md:text-start text-2xl pt-6 md:pl-6 font-semibold">
        Welcome Back!
      </h1>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="p-6 text-gray-800 ">
          <div className="mb-6">
            <label
              className="text-sm block mb-1"
              htmlFor="user-email"
              tabIndex={-1}
            >
              Email or Username
            </label>
            <input
              type="text"
              id="user-email"
              className="w-full form-input"
              value={email}
              onChange={(e) => setAuthValue("email", e.target.value)}
              placeholder="jane@doe.com"
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="user-password">Password</label>
              <Link
                to="/forget-password?flag=r"
                className=" hover:text-gray-500 transition duration-200 ease-in-out italic"
              >
                Forgot Password
              </Link>
            </div>
            <input
              type="password"
              id="user-password"
              placeholder="***********"
              value={password}
              onChange={(e) => setAuthValue("password", e.target.value)}
              className="w-full form-input"
              tabIndex={0}
            />
          </div>
          <Button
            title="Login"
            block
            size="large"
            isLoading={authLoading}
            type="primary"
            className="my-8 mx-auto text-sm"
            disabled={authLoading}
            forForm
          />
        </div>
      </form>

      <p className="flex gap-1 text-center w-fit mx-auto text-gray-800 text-sm mt-auto">
        New User?
        <Link
          to="/forget-password?flag=c"
          className="font-bold hover:text-gray-500 transition duration-200 ease-in-out"
        >
          Activate Account
        </Link>
      </p>
    </div>
  );
};

export default Login;
