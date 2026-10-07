"use client";
import { useEffect } from "react";

export default function AdSlot({ className = "" }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  useEffect(() => {
    if (!client) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, [client]);
  if (!client || !slot) return null;
  return (
    <ins className={`adsbygoogle block ${className}`} style={{ display: "block" }}
      data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
  );
}
