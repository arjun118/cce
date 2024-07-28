//  wont be using this component alltogether
// use this for testing

import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";
import { Link } from "@chakra-ui/react";
const Users = () => {
  const [users, setUsers] = useState();
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers((prev) => response.data.users);
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  console.log("from users state :", users);
  return (
    <article>
      <h2>users list</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => {
            return <li key={i}>{user?.userid}</li>;
          })}
        </ul>
      ) : null}

      <Link href="/home">Home</Link>
    </article>
  );
};

export default Users;
