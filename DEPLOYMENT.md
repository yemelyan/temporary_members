# Cloudflare Pages Deployment Guide

## Prerequisites

- Cloudflare account
- Node.js 18+ installed locally
- Wrangler CLI (optional, for local testing)

## Environment Variables

Configure the following environment variables in Cloudflare Pages dashboard:

1. Go to Cloudflare Pages → Your Project → Settings → Environment Variables
2. Add the following variables for both Production and Preview:

   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Build Configuration

In Cloudflare Pages dashboard:
- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: (leave empty or use `/`)

## Local Testing

Before deploying, test the build locally:

```bash
# Build the Next.js app (works on all platforms)
npm run build

# Build for Cloudflare Pages (requires bash/Linux - use WSL on Windows)
npm run pages:build

# Test locally with Wrangler (optional, requires Wrangler CLI)
npm run pages:dev
```

⚠️ **Windows Users**: The `pages:build` command requires bash and may not work on Windows. It will work fine on Cloudflare Pages (Linux) or in WSL. The regular `npm run build` command works on all platforms and verifies the code is correct.

## Important Notes

⚠️ **Deprecation Warning**: `@cloudflare/next-on-pages` is deprecated. Consider migrating to `@opennextjs/cloudflare` for better Next.js 16 support.

## Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Cloudflare Pages
3. Configure build settings as mentioned above
4. Add environment variables in the dashboard
5. Deploy!

## Troubleshooting

- If build fails, check that all environment variables are set
- Ensure Node.js version is compatible (check `package.json` engines if specified)
- Verify `wrangler.toml` has correct compatibility flags
