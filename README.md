<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Df5VyOSMmw57_MuoMVbP8meSe3zt7Zdw

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Authentication removed

This branch (remove-auth) contains a codebase scan and cleanup for authentication-related code. After a repository-wide search there were no sign-up, sign-in, or authentication components or libraries found in this repository snapshot (no `next-auth`, `firebase`, `supabase`, `auth0`, `passport`, `jsonwebtoken`, etc.).

What I changed on the `remove-auth` branch:
- Added this note to the README to document the audit and that no auth code was present.

Notes & next steps:
- If your project uses external or hosting-level authentication (for example, GitHub/Google sign-in configured in your hosting provider, or a separate backend service), those systems are not represented in this repository and must be disabled or edited in the respective service console.
- If you want me to remove auth code from an associated backend repo, provide the repo and I will scan it the same way.
- To open a pull request from `remove-auth` to `main`, visit: https://github.com/Shepherdwilliams/Dev-Archive/compare/remove-auth

If you want additional cleanup (remove environment variables, delete auth packages if present, or migrate server-side user data), tell me and I will continue.