import { error as httpError, json } from "@sveltejs/kit";

import { supabase } from "$lib/membersDatabase.js";

export async function GET({ url }) {
    const accountID = url.searchParams.get("accountID");
    if (!accountID) {
        throw httpError(400, "Missing parameter: 'accountID'");
    }

    const { data, error } = await supabase
        .from("members")
        .select("patreon_access_token")
        .eq("account_id", Number(accountID));
    console.log(data[0]);

    if (error) {
        throw httpError(500, `Could not fetch info from database: ${error.message}`);
    }

    const reqUrl = new URL("https://www.patreon.com/api/oauth2/v2/identity");
    reqUrl.searchParams.set("include", "memberships.currently_entitled_tiers,memberships.campaign");
    reqUrl.searchParams.set(encodeURIComponent("fields[user]"), "patron_status");
    reqUrl.searchParams.set(encodeURIComponent("fields[tier]"), "title");

    const req = await fetch(reqUrl.href, {
        headers: { "Authorization": `Bearer ${data[0]}` }
    });

    if (!req.ok) {
        throw httpError(500, `${req.status}`)
    }

    const stuff = await req.json();
    console.log(stuff.toString());
    return json({ ok: true });
}