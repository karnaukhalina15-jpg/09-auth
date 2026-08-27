import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | Application",
  description: "User Profile Page",
};

export default async function ProfilePage() {
  const user = await getMe();

  if (!user) {
    redirect("/sign-in");
  }

  const avatarSrc = user.avatar || "/default-avatar.png";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatarSrc}
            alt={`${user.username || "User"}'s avatar`}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username || user.username || "N/A"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
