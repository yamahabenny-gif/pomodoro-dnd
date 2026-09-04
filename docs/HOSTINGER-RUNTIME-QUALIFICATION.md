# Hostinger Runtime Qualification — `focus.lang-jamin.de`

**Issue:** #58  
**Release tracker:** #3  
**Scope:** Technical qualification only. **No production cutover.**

## Result

The current application architecture is **compatible in principle** with Hostinger's managed Node.js web-app hosting, provided the concrete hosting account for `focus.lang-jamin.de` has a plan with Node.js Web App support enabled.

This is not yet an account-specific production approval. The remaining hard gate is to verify in hPanel which concrete Hostinger plan/runtime is attached to the target and that `Node.js Web App` can be selected for this site.

## Evidence

### Next.js server capabilities

Hostinger documents managed Next.js hosting with Node.js runtime support for SSR, ISR and API routes. Next.js itself documents that a normal Node.js server using `next build` + `next start` supports all framework features, including server-side features required by this repository.

Sources:
- https://www.hostinger.com/de/web-apps-hosting/nextjs-hosting
- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://nextjs.org/docs/15/app/getting-started/deploying

### Supported Node.js versions

Hostinger currently documents selectable Node.js runtimes **18.x, 20.x, 22.x and 24.x** for managed Node.js applications.

The repository currently uses Next.js `^15.5.2` and React 19. For this project, **Node.js 22.x is the preferred deployment target** during qualification because it is directly supported by Hostinger and aligns with the repository's current `@types/node` major. This document deliberately does not add an `engines` pin to `package.json` until the concrete hPanel runtime has been confirmed.

Sources:
- https://www.hostinger.com/support/how-to-select-the-node-js-version-for-your-application/
- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

### Build and start contract

The repository already exposes:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

That is the standard Next.js Node.js deployment contract. No static export is required or desired.

### Process lifecycle and logs

Hostinger documents managed process handling for Node.js web apps and exposes runtime logs in hPanel. Its API also exposes a restart operation for server-side Node.js applications such as Next.js.

Sources:
- https://www.hostinger.com/tutorials/deploy-node-js-application
- https://www.hostinger.com/support/how-to-use-node-js-runtime-logs-at-hostinger/
- https://developers.hostinger.com/

### Environment variables / secrets

Hostinger's Node.js deployment flow supports environment variables in the deployment settings. This is compatible with the repository requirement that `SUPABASE_SERVICE_ROLE_KEY` remain server-side and never be stored in Git or exposed as `NEXT_PUBLIC_*`.

Source:
- https://www.hostinger.com/tutorials/deploy-node-js-application

## Required hPanel verification before production work

The following must be read back from the actual Hostinger account before any deployment-related repository change or cutover:

1. `focus.lang-jamin.de` is attached to a plan that exposes **Node.js Web App** hosting. Hostinger currently documents this for Business Web Hosting and Cloud plans; VPS is also possible but is a different operational model.
2. Framework detection offers **Next.js** for the repository.
3. **Node.js 22.x** (or another explicitly approved compatible version) can be selected.
4. Build command resolves to `npm run build` and server start resolves to `npm run start` / the managed equivalent.
5. Runtime logs are visible after a test deployment.
6. Environment variables can be configured without writing secrets into the repository.
7. A previous deployment/commit can be redeployed or otherwise restored; the exact rollback interaction must be captured from the actual hPanel account.
8. Domain attachment and HTTPS can be configured for `focus.lang-jamin.de` without changing DNS yet.

## Decision boundary

**Qualified now:** Hostinger's documented managed Node.js platform can support this Next.js architecture; the repository's current build/start model is compatible; no static-export redesign is indicated.

**Not qualified yet:** the concrete Hostinger account/plan and its rollback behavior for `focus.lang-jamin.de` have not been read back from hPanel in this repository workflow.

Until that account-specific verification is documented, Issue #3 remains blocked for production cutover. No DNS, Supabase production configuration, secrets, production build deployment or public release is authorized by this document.
