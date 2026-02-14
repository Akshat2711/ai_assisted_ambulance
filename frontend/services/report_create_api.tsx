const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function createReport(text: string) {
  try {
    const res = await fetch(`${API_BASE}/report_create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }); 

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Report API error:", err);
    throw err;
  }
}
