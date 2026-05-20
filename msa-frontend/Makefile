SHELL := /bin/zsh

APP_DIR        := market-msa-app
BACKEND_URL    ?= http://localhost:8100
SWAGGER_URL    := $(BACKEND_URL)/webjars/swagger-ui/index.html
FRONTEND_PORT  ?= 5173
FRONTEND_URL   := http://localhost:$(FRONTEND_PORT)
DEV_LOG        := $(APP_DIR)/.dev-server.log
DEV_PID        := $(APP_DIR)/.dev-server.pid
DEMO_SLOW_MO   ?= 500

export DEMO_BASE_URL = $(FRONTEND_URL)
export DEMO_BACKEND  = $(BACKEND_URL)
export DEMO_SLOW_MO

.PHONY: help install playwright-install check-backend dev dev-bg dev-stop demo demo-bg demo-record clean

help:
	@echo "KT Cloud Market MSA — demo Makefile"
	@echo ""
	@echo "Backend (must be running externally):"
	@echo "    $(BACKEND_URL)"
	@echo "    Swagger: $(SWAGGER_URL)"
	@echo ""
	@echo "Targets:"
	@echo "  make install         npm install + chromium for Playwright"
	@echo "  make check-backend   curl the backend, fail if not reachable"
	@echo "  make dev             start the Vite dev server in the foreground"
	@echo "  make dev-bg          start the Vite dev server detached (logs to $(DEV_LOG))"
	@echo "  make dev-stop        kill the detached dev server"
	@echo "  make demo            headful, slow Playwright run — needs backend + dev server"
	@echo "  make demo-bg         starts dev server in background, runs demo, stops it"
	@echo "  make demo-record     same as demo, then converts the captured webm to ./demo-video.mp4 (webm deleted)"
	@echo "  make clean           remove Playwright artifacts and dev-server logs"
	@echo ""
	@echo "Tunables (env):"
	@echo "  DEMO_SLOW_MO=$(DEMO_SLOW_MO)   ms delay between every Playwright action"
	@echo "  DEMO_STEP_PAUSE_MS=1200        pause between micro-steps"
	@echo "  DEMO_NARRATION_PAUSE_MS=2000   pause on narrated section boundaries"
	@echo "  DEMO_HEADLESS=1                run headless (skip for the demo video)"
	@echo "  DEMO_EMAIL / DEMO_PASSWORD     override the demo user"

install:
	@cd $(APP_DIR) && npm install
	@$(MAKE) playwright-install

playwright-install:
	@cd $(APP_DIR) && npx --yes playwright install chromium

check-backend:
	@echo "→ Probing backend at $(BACKEND_URL) ..."
	@code=$$(curl --silent --show-error --max-time 5 -o /dev/null -w "%{http_code}" "$(BACKEND_URL)" 2>/dev/null); \
	if [ -z "$$code" ] || [ "$$code" = "000" ]; then \
	  echo "✗ Backend not reachable at $(BACKEND_URL)."; \
	  echo "  Start it first, then verify Swagger at $(SWAGGER_URL)"; \
	  exit 1; \
	fi; \
	echo "✓ Backend is up (HTTP $$code)."

dev: check-backend
	@cd $(APP_DIR) && npm run dev

dev-bg: check-backend
	@if [ -f $(DEV_PID) ] && kill -0 $$(cat $(DEV_PID)) 2>/dev/null; then \
	  echo "Dev server already running (pid $$(cat $(DEV_PID)))."; \
	else \
	  echo "→ Starting dev server in background → $(DEV_LOG)"; \
	  cd $(APP_DIR) && (npm run dev >../$(DEV_LOG) 2>&1 & echo $$! >../$(DEV_PID)); \
	  for i in {1..60}; do \
	    if curl --silent --fail --max-time 1 -o /dev/null "$(FRONTEND_URL)"; then \
	      echo "✓ Frontend up at $(FRONTEND_URL)"; exit 0; \
	    fi; \
	    sleep 1; \
	  done; \
	  echo "✗ Dev server did not respond at $(FRONTEND_URL) within 60s. See $(DEV_LOG)"; exit 1; \
	fi

dev-stop:
	@if [ -f $(DEV_PID) ]; then \
	  pid=$$(cat $(DEV_PID)); \
	  if kill -0 $$pid 2>/dev/null; then \
	    echo "→ Stopping dev server (pid $$pid)"; \
	    kill $$pid 2>/dev/null || true; \
	    sleep 1; \
	    kill -9 $$pid 2>/dev/null || true; \
	  fi; \
	  rm -f $(DEV_PID); \
	else \
	  echo "No pid file; dev server not tracked."; \
	fi

demo: check-backend
	@echo "→ Make sure the Vite dev server is running ($(FRONTEND_URL)); use 'make dev' in another shell if not."
	@cd $(APP_DIR) && npm run e2e:demo

demo-bg: check-backend dev-bg
	@set -e; \
	cd $(APP_DIR) && npm run e2e:demo; \
	rc=$$?; \
	cd ..; \
	$(MAKE) dev-stop; \
	exit $$rc

demo-record: demo-bg
	@command -v ffmpeg >/dev/null 2>&1 || { \
	  echo "✗ ffmpeg not found in PATH."; \
	  echo "  Install it (e.g. 'brew install ffmpeg') and re-run."; \
	  exit 1; \
	}
	@latest=$$(find $(APP_DIR)/tests/e2e/.artifacts -name "*.webm" -print0 2>/dev/null \
	  | xargs -0 ls -t 2>/dev/null | head -n 1); \
	if [ -z "$$latest" ]; then \
	  echo "✗ No webm captured under $(APP_DIR)/tests/e2e/.artifacts"; exit 1; \
	fi; \
	echo "→ Staging $$latest"; \
	rm -f ./demo-video.webm ./demo-video.mp4; \
	cp "$$latest" ./demo-video.webm; \
	echo "→ Converting webm → mp4 with ffmpeg"; \
	ffmpeg -y -loglevel error -i ./demo-video.webm -c:v libx264 -c:a aac ./demo-video.mp4 \
	  || { echo "✗ ffmpeg conversion failed"; rm -f ./demo-video.webm; exit 1; }; \
	rm -f ./demo-video.webm; \
	echo "✓ Saved → ./demo-video.mp4 (intermediate webm removed)"

clean:
	@rm -rf $(APP_DIR)/tests/e2e/.artifacts
	@rm -f $(DEV_LOG) $(DEV_PID)
	@echo "✓ Cleaned Playwright artifacts and dev-server logs."
