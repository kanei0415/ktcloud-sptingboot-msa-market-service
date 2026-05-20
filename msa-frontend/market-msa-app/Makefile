PYTHON       ?= python3
VENV         := .venv
VENV_BIN     := $(VENV)/bin
PIP          := $(VENV_BIN)/pip
PYTEST       := $(VENV_BIN)/pytest
PLAYWRIGHT   := $(VENV_BIN)/playwright

E2E_BASE_URL ?= http://localhost:5173
DEV_PORT     := 5173
DEV_PID_FILE := .dev-server.pid

.DEFAULT_GOAL := help

.PHONY: help install install-node install-py test test-watch e2e e2e-ci dev clean reset-py

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n\nTargets:\n"} \
	  /^[a-zA-Z0-9_-]+:.*##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ---------- setup ----------

install: install-node install-py ## Install all dependencies (node + python venv + browsers)

install-node: ## npm install
	npm install

$(VENV)/.installed: ## Create venv and install python deps + chromium
	$(PYTHON) -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install pytest-playwright
	$(PLAYWRIGHT) install chromium
	@touch $(VENV)/.installed

install-py: $(VENV)/.installed ## Set up the Python venv and Playwright (idempotent)

reset-py: ## Remove and rebuild the Python venv
	rm -rf $(VENV)
	$(MAKE) install-py

# ---------- run ----------

dev: ## Run the Vite dev server in the foreground
	npm run dev

test: ## Run unit tests once (Vitest)
	npm test

test-watch: ## Run unit tests in watch mode (Vitest)
	npm run test:watch

e2e: install-py ## Run Playwright e2e tests against an already-running dev server
	E2E_BASE_URL=$(E2E_BASE_URL) $(PYTEST) tests/e2e

# Start dev server, wait for it, run e2e, then always stop the server.
e2e-ci: install-py ## Boot dev server, run e2e, tear it down
	@echo ">> starting dev server on :$(DEV_PORT)"
	@npm run dev > .dev-server.log 2>&1 & echo $$! > $(DEV_PID_FILE)
	@echo ">> waiting for dev server"
	@for i in $$(seq 1 60); do \
	  if curl -sf $(E2E_BASE_URL) >/dev/null; then break; fi; \
	  sleep 1; \
	done
	@trap 'kill `cat $(DEV_PID_FILE)` 2>/dev/null; rm -f $(DEV_PID_FILE)' EXIT; \
	  E2E_BASE_URL=$(E2E_BASE_URL) $(PYTEST) tests/e2e

# ---------- housekeeping ----------

clean: ## Remove venv, node_modules, build artifacts
	rm -rf $(VENV) node_modules dist .dev-server.log $(DEV_PID_FILE)
