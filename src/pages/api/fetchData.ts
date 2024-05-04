import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { db, Storage, NOW } from "astro:db";
import { getSession } from "auth-astro/server";

const res = (
  body: string,
  {
    status,
    statusText,
    headers,
  }: { status: number; statusText?: string; headers?: Headers }
): Response => new Response(body, { status, statusText, headers });

export const GET: APIRoute = async ({ params, request }: APIContext) => {
  const session = (await getSession(request)) as any;

  if (!session || session?.user == null) {
    return res("Unauthorized", { status: 401 });
  }

  try {
    const token = session.user.accessToken;
    const userId = (session.user.id).toString();

    if (token) {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/about?fields=storageQuota",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      const {
        storageQuota: { usage },
      } = data;

      const storage = { userId, storage: usage, calculatedAt: NOW };

      console.log("Antes de DB token:", typeof token);
      console.log("Antes de DB userId:", typeof userId);

      await db.insert(Storage).values(storage);

      return res("Data retrieved correctly", { status: 200 });
    } else {
      console.error("No se pudo obtener el token de acceso.");
    }
  } catch (error) {
    console.error("Error al acceder a Google Drive:", error);
  }

  return res("We couldn't retrieve your data.", { status: 400 });
};
