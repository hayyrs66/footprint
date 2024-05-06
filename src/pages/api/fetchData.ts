import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { db, Storage, NOW, eq } from "astro:db";
import { getSession } from "auth-astro/server";

const res = (
  body: string,
  {
    status,
    statusText,
    headers,
  }: { status: number; statusText?: string; headers?: HeadersInit }
): Response => new Response(body, { status, statusText, headers });

export const GET: APIRoute = async ({
  params,
  request,
  redirect,
}: APIContext) => {
  const session = (await getSession(request)) as any;

  if (!session || session?.user == null) {
    return res("Unauthorized", { status: 401 });
  }

  try {
    const token = session.user.accessToken;
    const userId = session.user.id.toString();

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
        storageQuota: { usage, limit },
      } = data;

      const storage = {
        userId,
        storage: usage,
        storageLimit: limit,
        calculatedAt: NOW,
      };

      try {
        await db.insert(Storage).values(storage);
      } catch (insertionError) {
        console.error(
          "Error al insertar datos en la base de datos:",
          insertionError
        );
        return res("Error al insertar datos en la base de datos", {
          status: 500,
        });
      }

      try {
        // we verify that the user can only make one request per day

        const today = new Date();

        const lastStorageData = await db
          .select()
          .from(Storage)
          .where(eq(Storage.userId, userId));

        if (lastStorageData !== null && lastStorageData.length > 1) {
          console.log("hasta aqui actuo", lastStorageData);

          const lastStorageDate = new Date(
            lastStorageData[lastStorageData.length - 1].calculatedAt
          );

          // we are gonna calculate the difference between the last time the user made a request and today
          // and if the difference is less than 24 hours we are gonna return a 400 status code

          const difference = today.getTime() - lastStorageDate.getTime();
          const differenceInHours = difference / (1000 * 3600);

          if (differenceInHours < 24) {
            return res(
              "You can only make one request per day. Please try again later.",
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error(
          "Error al verificar la cantidad de solicitudes por día:",
          error
        );
        return res("Error al verificar la cantidad de solicitudes por día", {
          status: 500,
        });
      }

      return redirect("/dashboard", 302);
    } else {
      console.error("No se pudo obtener el token de acceso.");
    }
  } catch (error) {
    console.error("Error al acceder a Google Drive:", error);
  }

  return res("We couldn't retrieve your data.", { status: 400 });
};
