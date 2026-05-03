import { redirect } from "next/navigation";

/**
 * Root page redirects to the admin login.
 * Public marketing page can replace this later.
 */
export default function Home() {
  redirect("/admin/login");
}
