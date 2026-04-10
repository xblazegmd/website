import { error, redirect } from "@sveltejs/kit";

import { PATREON_CLIENT_ID, PATREON_CLIENT_SECRET } from "$env/static/private";

export async function GET({ url, cookies }) {
    const code = url.searchParams.get("code");
    if (!code) {
        throw redirect(302, "/patreon/link");
    }

    const req = await fetch("https://www.patreon.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code: code,
            grant_type: "authorization_code",
            client_id: PATREON_CLIENT_ID,
            client_secret: PATREON_CLIENT_SECRET,
            redirect_uri: "https://xblazegmd.vercel.app/patreon/link/callback"
        })
    });

    if (!req.ok) {
        const details = await req.json();
        console.error(`Failed to request 'www.patreon.com/api/oauth2/token' (${req.status}): ${details.error || req.statusText}`);
        throw error(500, "Something went wrong");
    }

    const { access_token, refresh_token, expires_in } = await req.json();

    // yummy
    cookies.set("patreonAccessToken", access_token, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10
    });
    cookies.set("patreonRefreshToken", refresh_token, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10
    });
    cookies.set("patreonExpiresIn", expires_in, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10
    });

    throw redirect(302, "/patreon/link");
}