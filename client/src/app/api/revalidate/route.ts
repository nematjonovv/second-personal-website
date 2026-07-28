import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const slug = body?.slug as string | undefined;

  revalidatePath("/work");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/work/${slug}`);
  }

  return NextResponse.json({ revalidated: true });
}