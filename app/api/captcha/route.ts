import { makeCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";
export const GET = () => Response.json(makeCaptcha());
