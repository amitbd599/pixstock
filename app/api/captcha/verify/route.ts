import { verifyCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams;
    return Response.json({
      ok: verifyCaptcha(sp.get("ans"), sp.get("exp"), sp.get("sig")),
    });
  } catch (err) {
    console.error("Captcha verify error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
