import { redirect } from "next/navigation";
import { checkSession } from "@/lib/api/serverApi";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await checkSession();
  } catch {
    redirect("/sign-in");
  }

  return <section>{children}</section>;
}
