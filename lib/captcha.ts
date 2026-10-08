import crypto from "crypto";

const sign = (ans: number, exp: number) =>
  crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(`${ans}:${exp}`)
    .digest("hex");

export function makeCaptcha() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const exp = Date.now() + 5 * 60 * 1000; // ৫ মিনিট
  return { q: `${a} + ${b} = ?`, exp, sig: sign(a + b, exp) };
}

export function verifyCaptcha(
  ans: string | null,
  exp: string | null,
  sig: string | null,
) {
  const a = Number(ans),
    e = Number(exp);
  if (!sig || !Number.isFinite(a) || !Number.isFinite(e) || e < Date.now())
    return false;
  const good = sign(a, e);
  return (
    good.length === sig.length &&
    crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig))
  );
}
