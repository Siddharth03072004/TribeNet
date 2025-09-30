import React, { useState } from "react";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import DashBoard from "../dashboard";
function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer__left}>
              <p className={styles.cardleft__heading}>
                {" "}
                {userLoginMethod ? "Sign In" : "Sign Up"}
              </p>
              <p style={{ color: authState.isError ? "red" : "green" }}>
                {authState.message.message}
              </p>
              <div className={styles.inputContainers}>
                {!userLoginMethod && (
                  <div className={styles.inputRow}>
                    <input
                      className={styles.inputField}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="UserName"
                    />
                    <input
                      className={styles.inputField}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Name"
                    />
                  </div>
                )}
                <input
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className={styles.inputField}
                  type="email"
                  placeholder="Email"
                />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  type="password"
                  placeholder="Password"
                />

                <div
                  onClick={() => {
                    if (userLoginMethod) {
                      handleLogin();
                    } else {
                      handleRegister();
                    }
                  }}
                  className={styles.buttonWithOutline}
                >
                  <p> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
                </div>
              </div>
            </div>
            <div className={styles.cardContainer__right}>
              {userLoginMethod ? (
                <p>Dont Have an account</p>
              ) : (
                <p>Already Have an account</p>
              )}

              <div
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
                style={{ color: "black", textAlign: "center" }}
                className={styles.buttonWithOutline}
              >
                <p> {userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
