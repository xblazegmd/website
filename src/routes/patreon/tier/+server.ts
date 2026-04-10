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

    if (error) {
        throw httpError(500, `Could not fetch info from database: ${error.message}`);
    }

    const reqUrl = new URL("https://www.patreon.com/api/oauth2/v2/identity?include=memberships.currently_entitled_tiers,memberships.campaign&"
        + encodeURIComponent("fields[member]") + "=patron_status&" + encodeURIComponent("fields[tier]") + "=title"
    );

    const req = await fetch(reqUrl.href, {
        headers: { "Authorization": `Bearer ${data[0].patreon_access_token}` }
    });

    if (!req.ok) {
        const message = await req.text();
        console.error(message);
        throw httpError(500, `${req.status}`)
    }

    const stuff = await req.json();
    console.log(stuff.toString());
    return json({ ok: true });
}