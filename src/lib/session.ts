import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    return !!store.get("rasik-auth");
  } catch {
    return false;
  }
}
