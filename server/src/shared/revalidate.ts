export async function revalidateClient(slug?: string) {
  try {
    await fetch(`${process.env.CLIENT_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });
  } catch (err) {
    console.error("Revalidate failed:", err);
  }
}