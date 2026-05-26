.PHONY: install dev build start db-init clean all

NPM := npm
NPX := npx
RM  := rm -rf
MKDIR := mkdir -p

# Windows detection
ifeq ($(OS),Windows_NT)
  RM   := cmd /c rmdir /s /q 2>nul || true
  MKDIR := cmd /c mkdir 2>nul || true
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

db-init:
	$(NPM) run db:init

clean:
	$(RM) node_modules
	$(RM) dist
	$(RM) server\dist

all: install build
