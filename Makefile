.PHONY: install dev build start stop restart db-init clean all

NPM := npm
NPX := npx
RM  := rm -rf
MKDIR := mkdir -p
KILL := lsof -ti:3001 | xargs -r kill

# Windows detection
ifeq ($(OS),Windows_NT)
  RM   := cmd /c rmdir /s /q 2>nul || true
  MKDIR := cmd /c mkdir 2>nul || true
  KILL := cmd /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do taskkill /PID %a /F >nul 2>nul"
endif

# ---------- targets ----------

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

start:
	$(NPM) run start

stop:
	$(KILL)

restart: stop build start

db-init:
	$(NPM) run db:init

clean:
	$(RM) node_modules
	$(RM) dist
	$(RM) server\dist

all: install build
