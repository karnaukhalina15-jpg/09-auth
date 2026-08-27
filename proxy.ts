import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const data = await checkSession();
        const setCookie = data?.headers?.["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          // 1. Формуємо відповідь залежно від типу маршруту
          let response: NextResponse;

          if (isPublicRoute) {
            response = NextResponse.redirect(new URL("/", request.url));
          } else {
            response = NextResponse.next();
          }

          // 2. Встановлюємо оновлені куки у NextResponse (додає Set-Cookie для браузера)
          // та прокидаємо Cookie заголовок для подальших Server Components
          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);

            if (parsed.name && parsed.value) {
              // Явно прописуємо кукі у вихідну відповідь (для браузера клієнта)
              response.cookies.set(parsed.name, parsed.value, {
                domain: parsed.domain,
                path: parsed.path,
                expires: parsed.expires,
                maxAge: parsed.maxAge,
                sameSite: parsed.sameSite as
                  | "strict"
                  | "lax"
                  | "none"
                  | undefined,
                secure: parsed.secure,
                httpOnly: parsed.httpOnly,
              });
            }
          }

          // Також передаємо оновлені куки в поточний запит (щоб Next.js Server Components бачили їх одразу)
          response.headers.set("Cookie", cookieStore.toString());

          return response;
        }
      } catch (error) {
        console.error("Proxy session check failed:", error);
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
