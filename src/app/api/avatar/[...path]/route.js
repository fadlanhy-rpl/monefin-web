export async function GET(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path || [];
  const filePath = Array.isArray(pathSegments) ? pathSegments.join("/") : String(pathSegments || "");

  // Validasi keamanan: cegah Path Traversal & Open Redirect
  if (
    !filePath ||
    filePath.includes("..") ||
    filePath.includes("\\") ||
    filePath.includes("://") ||
    filePath.startsWith("/") ||
    !/^[a-zA-Z0-9_\-\./]+$/.test(filePath)
  ) {
    return new Response("Bad Request: Invalid avatar path", { status: 400 });
  }

  let backendBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  backendBase = backendBase.replace(/(\/index\.php)?\/api\/?$/, "").replace(/\/+$/, "");
  const directStorageUrl = `${backendBase}/storage/${filePath}`;

  return Response.redirect(directStorageUrl, 307);
}
