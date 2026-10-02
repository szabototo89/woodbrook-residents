# Laura build-time content

Status: Available

## Job to be done

When people browse Laura's website, I want them to use content captured during the build so visits do not consume Sanity content API calls and help keep the project within the free tier.

## Visible behavior

- Home, About, Services, Contact and every gallery collection use the same published content snapshot across direct visits, navigation, preloads and swipes.
- Each standard or static build makes four Sanity GROQ queries before Vite runs. Contact reuses Services and shared settings. Sitemap generation and static verification reuse the build snapshot without extra queries.
- Browser and server route loaders read bundled content and never request Sanity's content API or API CDN.
- New published content becomes visible after rebuilding and deploying. A missing document, invalid required field or unavailable API stops the build before bundling.
- Development captures content once on server startup; restarting captures changes.
- Images continue to load from Sanity's image CDN. This removes visitor content API calls; it does not remove image bandwidth or guarantee that all free-tier limits will remain unmet.

## Acceptance criteria

- Given a build, content capture loads each of Home, About, Services and Gallery exactly once and fails if a required load fails.
- Given a built site, direct visits to all main routes and client navigation to collections and About still work while all Sanity API and API CDN hosts are blocked, with zero attempted requests.
- Given the static artifact, all main and collection pages and their sitemap entries exist; generated client JavaScript contains no Sanity API endpoint code.
- Given an editor publishes a change after a build, visitors continue to see the build's content until the next deployment.

## Scope

Included: Laura website content capture, static snapshot bundling, route loaders, sitemap generation, static verification, and browser tests using build-time gallery fixtures.

Excluded: hosting or webhook configuration, changes to Sanity Studio, draft previews, image hosting changes, and changes to other apps.
