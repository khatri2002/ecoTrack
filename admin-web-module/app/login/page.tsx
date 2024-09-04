"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Input } from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { EyeSlashFilledIcon } from "../components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../components/icons/EyeFilledIcon";
import { useAuthContext } from "../context/AuthProvider";
import { login } from "../lib/api";
import { WithoutAuth } from "../components/auth/WithoutAuth";

type Inputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { userIn } = useAuthContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    login(data)
      .then((response) => {
        if (response.status) {
          userIn(response.access_token);
          router.push("/");
        } else {
          setError("username", {});
          setError("password", {});
          setErrorMessage(response.message);
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="flex h-screen justify-center items-center">
        <div className="flex bg-white rounded-lg w-11/12 md:w-7/12 shadow-lg flex-col md:flex-row">
          <div className="px-5 py-20 lg:w-1/2 w-full">
            <div className="flex gap-x-2 items-center">
              <Image
                alt="ecoTrack logo"
                className="w-auto h-auto"
                height={25}
                src="/logo/ecoTrack_logo.png"
                width={25}
              />
              <h4 className="font-semibold">ecoTrack Admin</h4>
            </div>
            <h1 className="font-bold text-3xl mt-10 mb-3">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                color={errors.username ? "danger" : "default"}
                isInvalid={errors.username ? true : false}
                label="Username"
                size="sm"
                type="text"
                variant="faded"
                {...register("username", {
                  required: true,
                })}
              />
              <Input
                className="mt-2"
                color={errors.password ? "danger" : "default"}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                isInvalid={errors.password ? true : false}
                label="Password"
                size="sm"
                type={isVisible ? "text" : "password"}
                variant="faded"
                {...register("password", {
                  required: true,
                })}
              />
              {errorMessage && (
                <p className="mt-3 text-small text-red-600 text-center">
                  {errorMessage}
                </p>
              )}
              <Button
                className="mt-5 w-full bg-black text-white"
                isLoading={loading}
                type="submit"
              >
                Login
              </Button>
            </form>
          </div>
          <div className="w-1/2 py-2 pr-2 hidden lg:block">
            <div className="relative h-full">
              <Image
                alt="environment"
                className="rounded-lg object-cover"
                fill={true}
                sizes="100%"
                src="/environment.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithoutAuth(LoginPage);
