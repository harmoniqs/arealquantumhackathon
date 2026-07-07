#!/usr/bin/env bash
# Build and publish to GitHub Pages (gh-pages branch).
#
# This is the deploy path while the gh token lacks the `workflow` scope.
# Once `gh auth refresh -h github.com -s workflow` has been run, move
# docs/deploy-via-actions.yml.pending to .github/workflows/deploy.yml and
# switch Pages to "GitHub Actions" — then this script is obsolete.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run lint
npm run build
touch out/.nojekyll

cd out
git init -q -b gh-pages
git add -A
git commit -qm "deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -f https://github.com/harmoniqs/arealquantumhackathon.git gh-pages
cd ..
rm -rf out/.git

echo "deployed → https://harmoniqs.github.io/arealquantumhackathon/"
