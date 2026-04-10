import { error as httpError, json } from "@sveltejs/kit";

import { supabase } from "$lib/membersDatabase.js";

// This code sucks ;-;
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

    const reqUrl = new URL("https://www.patreon.com/api/oauth2/v2/identity?include=memberships.currently_entitled_tiers&"
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

    const jsonRes = await req.json();
    console.log(JSON.stringify(jsonRes));

    // bro hasn't even joined :sob:
    if (jsonRes["data"]["relationships"]["memberships"]["data"].lenght === 0) {
        return json({ tier: 0 });
    }

    const patronStatus = jsonRes["included"][0]["attributes"]["patron_status"];

    if (!patronStatus || patronStatus !== "active_patron") {
        return json({ tier: 0 });
    }

    const tierTitle = jsonRes["included"][1]["attributes"]["title"];

    if (tierTitle === "Free") {
        return json({ tier: 0 });
    } else if (tierTitle === "Plain Normal Supporter Tier™") {
        return json({ tier: 1 });
    } else if (tierTitle === "Amazing Beautiful Crab Tier™") {
        return json({ tier: 2 });
    }

    return json({ tier: 0 });
}