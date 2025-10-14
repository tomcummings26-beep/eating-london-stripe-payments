import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const date = req.nextUrl.searchParams.get("date");
  const partySize = req.nextUrl.searchParams.get("party_size") || "2";

  const query = new URLSearchParams();
  if (date) query.append("date", date);
  if (partySize) query.append("party_size", partySize);

  const redirectUrl = `https://www.sevenrooms.com/explore/${slug}/reservations/create/search?${query.toString()}`;

  console.log(`🔗 Redirecting to: ${redirectUrl}`);
  return NextResponse.redirect(redirectUrl, 302);
}
