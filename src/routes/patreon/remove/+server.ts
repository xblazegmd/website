import { error } from "@sveltejs/kit";

import { supabase } from "$lib/membersDatabase.js";

export async function DELETE({ url, request }) {
    const accountID = url.searchParams.get("accountID");
    if (!accountID) {
        console.error("Missing parameter: 'accountID'");
        throw error(400, "Missing parameter: 'accountID'");
    }

    // Argon authentication
    const token = request.headers.get("Authorization");
    if (!token) {
        console.error("Missing Argon auth token");
        throw error(401, "Missing Argon auth token");
    }

    console.log("Validating auth token...");

    const reqUrl = new URL("https://argon.globed.dev/v1");
    reqUrl.searchParams.append("account_id", accountID);
    reqUrl.searchParams.append("authtoken", token);

    const req = await fetch(reqUrl.href);
    if (!req.ok) {
        const message = await req.text();
        console.error(`Failed to verify Argon auth token (${req.status}): ${message}`);
        throw error(500, `Failed to verify Argon auth token (${req.status}): ${message}`);
    }

    console.log(`Removing accountID '${accountID}' from database`);

    const res = await req.json();
    if (!res["valid"]) {
        console.log(`Invalid auth token: ${res["cause"]}`);
        throw error(401, `Invalid auth token: ${res["cause"]}`);
    }

    // Remove from database
    const { error: err } = await supabase
        .from("members")
        .delete()
        .eq("account_id", Number(accountID));

    if (err) {
        console.error(`Could not remove data from database: ${err.message}`);
        throw error(500, `Could not remove data from database: ${err.message}`);
    }

    console.log(`Successfully removed accountID ${accountID} from database`);
    return new Response(null, { status: 204 });
}