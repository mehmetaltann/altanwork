export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/isletmeler",
    "/odemeler",
    "/projeler",
    "/parametreler",
    "/register",
  ],
};
