"use client";

import { useEffect } from "react";
import { auth } from "./firebaseConfig";
import { useRouter } from "next/navigation";
import Taskify from "./taskify/page";
import Sidebar from "./components/sidebar";

const Home = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (!user) {
  //       router.push("/login");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [router]);

  return (
    <div>
      <Sidebar />
      <Taskify />
    </div>
  );
};

export default Home;
