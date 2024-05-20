import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/Auth.module.css";

//import { useCookies } from "react-cookie";
//import { useSelector } from "react-redux";
//import icon2 from "../icons/icon2.png";

import {
  faCheck,
  faTimes,
  faInfoCircle,
  faTrash,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core";


export const User_SignUp = () => {
  const [error, setError] = useState(null);


  //*************** */
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const REGISTER_URL = "/register";

  const userRef = useRef();
  const errRef = useRef();


  const [name, setName] = useState("");


  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    /*console.log(result);
   console.log(user);*/
    setValidName(result);
  }, [username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd, matchPwd]);

  console.log(username, email, pwd);

  const submitBtn = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/usersApi/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password: pwd}),
      });
      const data = await response.json();
      console.log(data);
      if (data.detail) {
        setError(data.detail);
      } else {
        /*setCookie("Email",data.email)
      setCookie('AuthToken', data.token)*/

        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div class="flex min-h-full flex-col justify-center">
      <div class="mt-14 mb-0 ">
        <h2 class="mt-4 text-center text-2xl font-bold  tracking-tight text-gray-900">
          Sign up to get started
        </h2>
      </div>
      <p
        ref={errRef}
        className={errMsg ? styles.errmsg : styles.offscreen}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6">
          <div>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                value={name}
              />
            </div>

            <div>
              <label
                for="username"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div class="mt-2">
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  autocomplete="email"
                  class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <p
              id="uidnote"
              className={
                userFocus && username && !validName
                  ? styles.instructions
                  : styles.offscreen
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
          </div>

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
                autocomplete="email"
                required
                class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? styles.valid : styles.hide}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? styles.hide : styles.invalid}
              />
            </div>
            <div class="mt-2">
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                placeholder="Password"
                onBlur={() => setPwdFocus(false)}
                autocomplete="current-password"
                class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <p
                id="pwdnote"
                className={
                  pwdFocus && !validPwd ? styles.instructions : styles.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                {" "}
                Confirm Password
              </label>
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? styles.valid : styles.hide}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  validMatch || !matchPwd ? styles.hide : styles.invalid
                }
              />
            </div>
            <div class="mt-2">
              <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                placeholder="Confirm Password"
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                autocomplete="current-password"
                class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? styles.instructions
                    : styles.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>
            </div>
          </div>

          <div>
            <p>Become A Seller</p>
            <button>As Printer Owner</button>
            <button>As Model Designer</button>
          </div>

          <p class="mt-10 text-center text-sm text-gray-500">
            Already have an account?
            <a
              href="/Login"
              class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
