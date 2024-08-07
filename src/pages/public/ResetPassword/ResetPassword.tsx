import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import OtpInput from "react-otp-input";
import { message } from "antd";
import useAuthStore from "@/store/states/auth";

const ResetPassword: React.FC = () => {
  let {
    authLoading,
    changePassword,
    error,
    message: msg,
    email,
    password,
    verificationCode,
    setAuthValue,
  } = useAuthStore();
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      message.error(error);
    }

    if (msg) {
      message.success(msg);
      navigate("/");
    }

    return () => {
      setAuthValue("message", "");
      setAuthValue("error", "");
    };
  }, [error, msg]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password && confirmPassword && verificationCode) {
      if (password !== confirmPassword) {
        message.error("Passwords do not match");
        return;
      }

      await changePassword();
    } else {
      message.warning("All fields are required");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6 h-full">
      <div className="text-center md:text-start">
        <h1 className="text-gray-800  text-2xl pt-6 md:pl-6 font-semibold">
          Change Password
        </h1>
        <p className="text-gray-500 text-sm md:pl-6">
          We have sent a code to your email{" "}
          <span className="font-medium text-gray-500">{email}</span>
        </p>
      </div>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="p-6 text-gray-800 ">
          <div className="mb-6">
            <label htmlFor="change-pwd" className="block text-sm mb-1">
              Code
            </label>
            <OtpInput
              containerStyle={{
                width: "100%",
                display: "flex",
                columnGap: "1rem",
              }}
              placeholder="000000"
              inputType="tel"
              value={verificationCode}
              onChange={(e) => setAuthValue("verificationCode", e)}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  className="form-input otp"
                  inputMode="numeric"
                />
              )}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="change-pwd" className="block text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="***********"
              id="change-pwd"
              value={password}
              onChange={(e) => setAuthValue("password", e.target.value)}
              className="w-full form-input"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="change-pwd-confirm" className="block text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="change-pwd-confirm"
              placeholder="***********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full form-input"
            />
          </div>
          <Button
            title="Change"
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
        Remember Password?
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

export default ResetPassword;
