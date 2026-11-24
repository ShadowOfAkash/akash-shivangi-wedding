export async function POST(request) {
  const origin = process.env.MARRIAGE_MANAGER_URL;
  if (!origin) {
    return Response.json({ error: "Online RSVP is unavailable. Please contact your host." }, { status: 503 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Check your RSVP details." }, { status: 400 });
  }

  try {
    const response = await fetch(new URL("/api/public/wedding-site/rsvps", origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (response.ok) return Response.json({ success: true });
    if (response.status === 400) {
      return Response.json({ error: "Check your mobile number and RSVP details." }, { status: 400 });
    }
  } catch (error) {
    console.error("Could not submit wedding RSVP:", error.message);
  }
  return Response.json({ error: "Your RSVP could not be confirmed. Please try again." }, { status: 502 });
}
