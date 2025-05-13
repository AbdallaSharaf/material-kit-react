export interface User {
  id: string;
  name?: string;
  profilePic?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}
