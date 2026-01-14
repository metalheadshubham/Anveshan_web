import { app, registerAndServe } from "../server/index";

// Initialize the server routes but don't start listening on a port
// Vercel handles the request/response lifecycle
// We need to make sure routes are registered before handling the request
let readyPromise: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
    if (!readyPromise) {
        readyPromise = registerAndServe();
    }

    await readyPromise;

    // Vercel's Node.js runtime passes (req, res) compatible with Express
    app(req, res);
}
