---
"@remix-run/web-fetch": patch
---

fix: Remove content-encoding header from already decompressed responses. This eases the use of fetch in senarios where you wish to use it as a sort of makeshift proxy.
