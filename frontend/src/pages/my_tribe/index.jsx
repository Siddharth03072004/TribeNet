import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AcceptConnection,
  getMyConnectionRequest,
} from "@/config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { connection } from "next/server";

export default function MyTribePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequests.length !== 0) {
      console.log(authState.connectionRequests);
    }
  }, [authState.connectionRequests]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h4>Requests</h4>
          {authState.connectionRequests.length === 0 && (
            <h1>No Connection Requests Pending</h1>
          )}
          {authState.connectionRequests.length !== 0 &&
            authState.connectionRequests
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.user.username}`);
                    }}
                    className={styles.userCard}
                    key={index}
                  >
                    <div>
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.user.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.user.name}</h3>
                        <p>@{user.user.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            AcceptConnection({
                              connectionId: user.id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            })
                          );
                        }}
                        className={styles.acceptButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}

          <h4>My Tribe</h4>
          {authState.connectionRequests
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.user.username}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div>
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.user.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.user.name}</h3>
                      <p>@{user.user.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
