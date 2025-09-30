import React from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { BASE_URL } from "@/config";
import styles from "./index.module.css";
//import ViewProfilePage from "../view_profile/[username]";
function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1>Discover</h1>
          <div className={styles.allUserProfiles}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.user.username}`);
                    }}
                    key={user._id}
                    className={styles.userCard}
                  >
                    <img
                      className={styles.userCard__image}
                      src={`${BASE_URL}/${user.user.profilePicture}`}
                      alt=""
                    />
                    <div>
                      <h1>{user.user.name}</h1>
                      <p>@{user.user.username}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
