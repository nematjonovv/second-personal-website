export async function revalidateClient(paths: string[]) {
  try {
    await fetch(`${process.env.CLIENT_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paths }),
    });
  } catch (err) {
    console.error("Revalidate failed:", err);
  }
}