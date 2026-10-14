#!/usr/bin/env bash
# Publica paNeo en GitHub Pages (gratis). Requiere: gh auth login (una sola vez).
set -euo pipefail
cd "$(dirname "$0")"
gh auth status >/dev/null 2>&1 || { echo "Primero ejecuta: gh auth login"; exit 1; }
USUARIO=$(gh api user --jq .login)
if ! gh repo view "$USUARIO/paneo" >/dev/null 2>&1; then
  gh repo create paneo --public --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USUARIO/paneo.git"
  git push -u origin main
fi
gh api -X POST "repos/$USUARIO/paneo/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true
echo
echo "Listo. En 1-2 minutos estará en:"
echo "  Web: https://$USUARIO.github.io/paneo/"
echo "  App: https://$USUARIO.github.io/paneo/app/"
