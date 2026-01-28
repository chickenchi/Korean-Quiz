"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/lib/client";
import { userAtom } from "@/app/atom/userAtom";
import { useAtom } from "jotai";
import { doc, getDoc } from "firebase/firestore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        setUser({
          uid: user.uid,
          email: user.email,
          role: userData?.role || "user",
        });

        console.log("로그인 상태 유지 중:", user.displayName);
      } else {
        setUser(null);
        console.log("로그아웃 상태");
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
