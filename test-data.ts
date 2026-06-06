export type Credentials = {
  email: string;
  password: string;
  role?: string;
};

 

export const validUser: Credentials = {
  email: "email",
  password: "password",
  role: "admin",
};

 

export function getLoginUrl(env: string): string {
  return `https://${env}.example.com/login`;
}