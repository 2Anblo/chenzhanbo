# Bundled fonts

These fonts are loaded with `next/font/local` so production builds do not request
Google Fonts CSS or depend on its font URL format. Keep the existing CSS variables
in `app/layout.tsx` when updating them.

Downloaded from the official Google Fonts repository on 2026-10-12:

- https://github.com/google/fonts/tree/main/ofl/jetbrainsmono
- https://github.com/google/fonts/tree/main/ofl/cormorantgaramond
- https://github.com/google/fonts/tree/main/ofl/alexbrush

The variable font filenames replace `[wght]` with `-Variable`; font contents are
unchanged. Each family includes its SIL Open Font License in `OFL.txt`.

Run `node scripts/verify-local-fonts.mjs` to exercise Next's local font loader using
the actual layout declarations, including both normal and italic faces.
