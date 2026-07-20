export type Role = "customer" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string | null;
  role: Role;
}