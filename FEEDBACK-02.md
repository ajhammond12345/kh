# Feedback round 02 (Oct 2026) — knighton-hammond.com

Not deployed. Source: Peter Norris + Trust emails, `Comments on new website 02.docx`, `Arthur Hammond narative.docx` + 4 photos.

## Copy
- [x] Aug round (80 years, paintings, catalogue so far, no 1994 footnote, no "catalogue raisonné") — shipped in 7b42519
- [x] Peter's quote → "I regard the work of Knighton-Hammond as the finest examples of English painting of his time."
- [x] Meta description no longer claims "every" painting
- [x] Hyphen in Knighton-Hammond: header brand/library title, Public Collections entry, footer brand + copyright, trustee login/admin brand, page titles
- [x] Hero: drop "society" before portraits
- [x] Countries painted 7 → 6
- [x] Footer Library column: removed "The Trust journal" (duplicate of Blog)
- [x] Gallery Project journal entry links to /gallery-project (blog + homepage)
- [x] "One hundred and one years ago today" removed — wrong (was about a Paris exhibition; he sailed 1920 from Southampton, not Liverpool 1924). Re-add when Peter sends the original text
- [ ] Blog bodies missing for every entry — old site (webfuel) now returns empty pages and archive.org was down 18 Oct; need the text from the Trust or a later Wayback pull
- [ ] Biography: Peter's "accompanying Word document" with the fuller original bio wasn't attached — request it
- [ ] "Under Trust Journal" (round 1) — comment was cut off; superseded by the footer de-dupe above unless Peter meant something else

## Content
- [x] 4 new works prepended to `data/artworks-scraped.json` (Early Morning, Dorset; The Meeting of the Hunt; The Hunt Preparing for the Off; The Gathering for the Hunt). Images generated into `kh-data/uploads/{original,thumb,medium,large}` (outside git). Typos fixed in Peter's text: "complimenting" → "complementing", "finally depicted" → "finely depicted"
- [ ] Hunt works: dates and locations unknown (left blank) — ask Peter
- [ ] Publish to Firestore. `seed-firestore.mjs` overwrites every artwork doc, so running it on prod would clobber any admin edits made since September — write just the 4 docs + rebuild catalog/artworks instead
- [ ] Artwork added on the old site after the scrape — need its details (old site is gone)
- [ ] Incoming family collection — needs a repeatable add process (see below)

## Add an artwork
- [ ] Header "Add an artwork" links to /admin login; public can't use it. Proposed: public CTA → submission instructions (high-res photo, medium, size, label) emailed to the Trust
- [ ] Admin upload disabled pending Cloud Storage (prod billing now live) — decide whether to enable so the Trust can add works themselves
