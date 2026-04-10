import { fail } from '@sveltejs/kit';
import { URLSearchParams } from 'url';

import { supabase } from '$lib/membersDatabase.js';

export function load({ cookies }) {
    const accessToken = cookies.get("patreonAccessToken");
    if (accessToken) {
        return { linkedPatreon: true }
    } else {
        return { linkedPatreon: false }
    }
}

function formatResponse(resp: string): Record<string, string> {
    const pieces = resp.split(":");
    const ret: Record<string, string> = {};

    for (let i = 0; i < pieces.length; i += 2) {
        ret[pieces[i]] = pieces[i + 1];
    }

    return ret;
}

function requestFailed(res: string): boolean {
    return res === "-1";
}

async function makeGJP2(password: string): Promise<string> {
    const salted = new TextEncoder().encode(password.toString() + "mI29fmAnxgTs");
    const gjpbuffer = await crypto.subtle.digest("SHA-1", salted);
    const gjparray = Array.from(new Uint8Array(gjpbuffer));
    return gjparray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();

        // Form data
        const username = form.get("username");
        const password = form.get("password");

        if (!username) {
            return fail(400, { error: "Please specify your username"});
        }
        if (!password) {
            return fail(400, { error: "Please specify your password (the password will not be stored anywhere)"});
        }

        // ooh cookies yummy
        const accessToken = cookies.get("patreonAccessToken");
        const refreshToken = cookies.get("patreonRefreshToken");
        const expiresIn = cookies.get("patreonExpiresIn");

        if (accessToken === undefined || refreshToken === undefined || expiresIn === undefined) {
            return fail(400, { error: "Could not get Patreon credentials" });
        }

        const BOOMLINGS = "http://www.boomlings.com/database";
        const SECRET = "Wmfd2893gb7";

        // Check if user exists
        const usrReq = await fetch(BOOMLINGS + "/getGJUsers20.php", {
            method: "POST",
            headers: { "User-Agent": "" },
            body: new URLSearchParams({
                secret: SECRET,
                str: username.toString()
            })
        })

        if (!usrReq.ok) {
            return fail(500, { error: `Failed to request '/getGJUsers20.php': ${usrReq.status}` });
        }

        const usrStr = await usrReq.text();
        if (requestFailed(usrStr)) {
            return fail(404, { error: `Could not find account '${username}'` });
        }

        const usrRes = formatResponse(usrStr);
        const accountID = usrRes["16"];

        // Validate password
        const gjp = await makeGJP2(password.toString());

        // My "login" method is just trying to load the DMs
        const passReq = await fetch(BOOMLINGS + "/getGJMessages20.php", {
            method: "POST",
            headers: { "User-Agent": "" },
            body: new URLSearchParams({
                accountID: accountID,
                gjp2: gjp,
                secret: "Wmfd2893gb7"
            })
        });

        if (!passReq.ok) {
            return fail(500, { error: `Failed to request '/getGJMessages20.php': ${passReq.status}` });
        }

        const passStr = await passReq.text();
        if (requestFailed(passStr)) {
            return fail(401, { error: "Incorrect password!" });
        }

        // Insert data into database
        const { error } = await supabase
            .from("members")
            .upsert({
                account_id: Number(accountID),
                patreon_access_token: accessToken,
                patreon_refresh_token: refreshToken,
                expires_in: Number(expiresIn)
            });

        if (error) {
            return fail(500, { error: `Could not store data in database: ${error.message}` });
        }

        cookies.delete("patreonAccessToken", { path: "/" });
        cookies.delete("patreonRefreshToken", { path: "/" });
        cookies.delete("patreonExpiresIn", { path: "/" });

        return { success: true }
    }
};