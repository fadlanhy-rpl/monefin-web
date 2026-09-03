export async function GET(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path || [];
  const filePath = Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments;
  
  const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000";
  const backendUrl = `${backendBase}/storage/${filePath}`;

  try {
    const res = await fetch(backendUrl);
    if (!res.ok) {
      return new Response(null, { status: res.status });
    }
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
