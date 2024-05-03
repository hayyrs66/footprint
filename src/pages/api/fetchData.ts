import { getToken } from "@auth/core/jwt";
import type { Session } from "@auth/core/types";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
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
  const session = (await getSession(request)) as Session;

  if (!session || session?.user == null) {
    return res("Unauthorized", { status: 401 });
  }

  const getAccessToken = () => {
    return session?.accessToken;
  };

  try {
    const token = getAccessToken();

    if (token) {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/about?fields=storageQuota",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log("Data traida correctamente", data);
    } else {
      console.error("No se pudo obtener el token de acceso.");
    }
  } catch (error) {
    console.error("Error al acceder a Google Drive:", error);
  }

  return res("Hello, world!", { status: 200 });
};
