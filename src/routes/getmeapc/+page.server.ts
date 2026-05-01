import { redirect } from '@sveltejs/kit';

export function load() {
    throw redirect(301, "https://xblaze.netlify.app/getmeapc");
}