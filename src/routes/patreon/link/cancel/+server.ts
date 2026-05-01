import { redirect } from '@sveltejs/kit';

export function GET({ cookies }) {
    cookies.delete("patreonAccessToken", { path: "/" });
    cookies.delete("patreonRefreshToken", { path: "/" });
    cookies.delete("patreonExpiresIn", { path: "/" });
    throw redirect(302, "https://xblaze.netlify.app/patreon/link");
}