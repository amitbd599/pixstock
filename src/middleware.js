export { default } from "next-auth/middleware";
// /admin/login বাদে সব /admin রুট প্রটেক্টেড
export const config = { matcher: ["/admin", "/admin/((?!login).*)"] };
