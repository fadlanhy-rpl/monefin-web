export async function GET(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path || [];
  const filePath = Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments;
  
  let backendBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  backendBase = backendBase.replace(/(\/index\.php)?\/api\/?$/, "").replace(/\/+$/, "");
  const directStorageUrl = `${backendBase}/storage/${filePath}`;

  return Response.redirect(directStorageUrl, 307);
}
