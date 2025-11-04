// // lib/supabase/middleware.ts
// import { createClient } from "@supabase/supabase-js";
// import { NextResponse, type NextRequest } from "next/server";

// export async function updateSession(request: NextRequest) {
//   // Try to detect Supabase auth cookie (new format)
//   const projectRef =
//     process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0]?.split("//")[1];
//   const authCookieName = `sb-${projectRef}-auth-token`;

//   const rawCookie =
//     request.cookies.get(authCookieName)?.value ??
//     request.cookies.get("sb-access-token")?.value;

//   let accessToken: string | undefined;
//   let refreshToken: string | undefined;

//   if (rawCookie) {
//     try {
//       // New cookie format: JSON array [access_token, refresh_token]
//       const parsed = JSON.parse(rawCookie);
//       if (Array.isArray(parsed)) {
//         accessToken = parsed[0];
//         refreshToken = parsed[1];
//       }
//     } catch {
//       // Old format: individual cookies
//       accessToken = request.cookies.get("sb-access-token")?.value;
//       refreshToken = request.cookies.get("sb-refresh-token")?.value;
//     }
//   }

//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       global: { fetch },
//       auth: {
//         persistSession: false,
//         detectSessionInUrl: false,
//       },
//     }
//   );

//   // Attach tokens manually
//   if (accessToken) {
//     await supabase.auth.setSession({
//       access_token: accessToken,
//       refresh_token: refreshToken ?? "",
//     });
//   }

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const url = request.nextUrl.clone();

//   // Protect admin routes
//   if (
//     request.nextUrl.pathname.startsWith("/admin") &&
//     (!user || !(await isAdmin(supabase, user.id)))
//   ) {
//     url.pathname = "/auth/login";
//     return NextResponse.redirect(url);
//   }

//   // Protect dashboard routes
//   if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
//     url.pathname = "/auth/login";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// async function isAdmin(supabase: any, userId: string): Promise<boolean> {
//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("user_type")
//     .eq("id", userId)
//     .maybeSingle();

//   return profile?.user_type === "admin";
// }

export const runtime = "nodejs";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    (!user || !(await isAdmin(supabase, user.id)))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Protect client dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}

async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", userId)
    .maybeSingle();

  return profile?.user_type === "admin";
}
