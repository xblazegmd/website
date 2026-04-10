import { error as httpError, json } from "@sveltejs/kit";

import { supabase } from "$lib/membersDatabase.js";

export async function GET({ url }) {
    const accountID = url.searchParams.get("accountID");
    if (!accountID) {
        console.error("Missing parameter: 'accountID'");
        throw httpError(400, "Missing parameter: 'accountID'");
    }

    console.log("Fetching Patreon access token from database...");

    const { data, error } = await supabase
        .from("members")
        .select("patreon_access_token")
        .eq("account_id", Number(accountID));

    if (error) {
        console.error(`Could not fetch info from database: ${error.message}`);
        throw httpError(500, `Could not fetch info from database: ${error.message}`);
    }

    console.log("Fetched Patreon access token from database");
    console.log("Fetching Patreon tier info...");

    const reqUrl = new URL("https://www.patreon.com/api/oauth2/v2/identity?include=memberships.currently_entitled_tiers&"
        + encodeURIComponent("fields[member]") + "=patron_status&" + encodeURIComponent("fields[tier]") + "=title"
    );

    const req = await fetch(reqUrl.href, {
        headers: { "Authorization": `Bearer ${data[0].patreon_access_token}` }
    });

    if (!req.ok) {
        const message = await req.text();
        console.error(`Could not request Patreon API endpoint '/api/oauth2/v2/identity' (${req.status}): ${message}`);
        throw httpError(500, `Could not request Patreon API endpoint '/api/oauth2/v2/identity': ${req.status}`)
    }

    console.log("Fetched Patreon tier info");

    const jsonRes = await req.json();
    console.log(JSON.stringify(jsonRes));

    // bro hasn't even joined :sob:
    if (jsonRes["data"]["relationships"]["memberships"]["data"].length === 0) {
        console.log("blud hasn't even joined the patreon ;-;");
        return json({ tier: 0 });
    }

    const patronStatus = jsonRes["included"][0]["attributes"]["patron_status"];

    if (!patronStatus || patronStatus !== "active_patron") {
        console.log("Not an active patron");
        return json({ tier: 0 });
    }

    const tierTitle = jsonRes["included"][1]["attributes"]["title"];

    if (tierTitle === "Free") {
        console.log("Free tier");
        return json({ tier: 0 });
    } else if (tierTitle === "Plain Normal Supporter Tier™") {
        console.log("Plain Normal Supporter Tier");
        return json({ tier: 1 });
    } else if (tierTitle === "Amazing Beautiful Crab Tier™") {
        console.log("Amazing Beautiful Crab Tier");
        return json({ tier: 2 });
    } else {
        console.error("THIS SHOULD BE UNREACHABLE!!!!");
        throw httpError(500, "Could not match user's tier (THIS SHOULD BE UNREACHABLE)");
    }
}