import React, { useState, useEffect } from "react";
import styles from "../styles/Auth.module.css";
import { useCookies } from "react-cookie";
import { addUserData } from "../slices/UserData";
import { jwtDecode, InvalidTokenError } from "jwt-decode";
import { useDispatch } from "react-redux";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [check, setCheck] = useState("");
  const dispatch = useDispatch();


  const submitBtn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/usersApi/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        window.sessionStorage.setItem("token", data.token);

        // Dispatch the addUserData action with user information
        dispatch(
          addUserData({
            user_id: data.user_id,
            email: data.email,
            sellerType: data.sellerType,
          })
        );

        console.log("Login successful");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during login:", error);
    
    }
  };

  console.log(check);
  return (
    <div class="flex min-h-full flex-col justify-centerlg">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm mt-24">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" onSubmit={submitBtn}>
          <div>
            <label
              for="email"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div class="mt-2">
              <input
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                class="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                name="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div class="mt-2">
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                autocomplete="current-password"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3 "
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <a
            href="/User_SignUp"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};
