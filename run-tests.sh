#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

usage() {
  echo "Usage: $0 [backend|frontend|all]"
  echo ""
  echo "  backend   Run Laravel PHPUnit tests (with coverage if driver available)"
  echo "  frontend  Run Vitest tests with v8 coverage"
  echo "  all       Run both (default)"
  exit 0
}

run_backend() {
  echo -e "${CYAN}${BOLD}=== Backend Tests (PHPUnit) ===${NC}"
  cd "$ROOT_DIR/backend"

  local coverage_args=""
  if php -r "exit(extension_loaded('pcov') || extension_loaded('xdebug') ? 0 : 1);"; then
    coverage_args="--coverage-text"
  else
    echo "Skipping coverage: no driver (Xdebug or PCOV) found."
  fi

  # shellcheck disable=SC2086 -- intentionally unquoted: empty expands to no arg
  php vendor/bin/phpunit --testdox $coverage_args
  echo ""
}

run_frontend() {
  echo -e "${CYAN}${BOLD}=== Frontend Tests (Vitest) ===${NC}"
  cd "$ROOT_DIR/frontend"

  if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm install --loglevel warn
  fi

  npx vitest run --coverage
  echo ""
}

TARGET="${1:-all}"

case "$TARGET" in
  backend)  run_backend ;;
  frontend) run_frontend ;;
  all)
    run_backend
    run_frontend
    echo -e "${GREEN}${BOLD}All test suites completed.${NC}"
    ;;
  -h|--help) usage ;;
  *)
    echo -e "${RED}Unknown target: $TARGET${NC}"
    usage
    ;;
esac
