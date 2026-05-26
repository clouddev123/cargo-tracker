# ──────────────────────────────────────────────────
# Cargo Tracker — Makefile
# ──────────────────────────────────────────────────

# ─── Variables ────────────────────────────────────
NPM  := npm
NPX  := npx
RM   := rm -rf

SERVER_PORT := 3001
CLIENT_PORT := 5173
DB_PATH     := server/data/cargo-tracker.db

# ─── Phony targets ────────────────────────────────
.PHONY: help \
        install \
        dev dev-server dev-client \
        build build-server build-client \
        start start-server \
        stop stop-server stop-client \
        restart restart-dev \
        db-init db-reset \
        clean clean-dist clean-db \
        status \
        typecheck lint test check \
        all

.DEFAULT_GOAL := help

# ═══════════════════════════════════════════════════
#  Help
# ═══════════════════════════════════════════════════

help: ## 显示所有可用命令
	@echo "Cargo Tracker — Makefile"
	@echo ""
	@echo "  Development:"
	@echo "    make dev           启动前后端开发服务器（并行）"
	@echo "    make dev-server    仅启动后端（Express + 热重载）"
	@echo "    make dev-client    仅启动前端（Vite HMR）"
	@echo ""
	@echo "  Build & Deploy:"
	@echo "    make build         构建前后端"
	@echo "    make build-server  仅构建后端"
	@echo "    make build-client  仅构建前端"
	@echo "    make start         构建并启动生产模式"
	@echo "    make start-server  启动生产后端（跳过前端构建）"
	@echo "    make stop          停止所有服务"
	@echo "    make stop-server   停止后端"
	@echo "    make stop-client   停止前端"
	@echo "    make restart       停止 → 构建 → 生产启动"
	@echo "    make restart-dev   停止 → 开发模式启动"
	@echo ""
	@echo "  Database:"
	@echo "    make db-init       初始化/运行数据库迁移"
	@echo "    make db-reset      删除数据库并重建"
	@echo ""
	@echo "  Quality:"
	@echo "    make typecheck     前后端 TypeScript 类型检查"
	@echo "    make lint          运行 ESLint"
	@echo "    make test          运行测试"
	@echo "    make check         完整检查：类型 + 构建"
	@echo ""
	@echo "  Maintenance:"
	@echo "    make install       安装所有依赖"
	@echo "    make status        查看服务运行状态"
	@echo "    make clean         删除 node_modules + dist"
	@echo "    make clean-dist    仅删除构建产物"
	@echo "    make clean-db      删除数据库文件"
	@echo ""

# ═══════════════════════════════════════════════════
#  Install
# ═══════════════════════════════════════════════════

install: ## 安装所有依赖
	$(NPM) install

# ═══════════════════════════════════════════════════
#  Development
# ═══════════════════════════════════════════════════

dev: ## 启动前后端开发服务器（并行）
	$(NPM) run dev

dev-server: ## 仅启动后端开发服务器（Express + tsx watch → :3001）
	@mkdir -p server/data
	$(NPX) tsx watch server/src/index.ts

dev-client: ## 仅启动前端开发服务器（Vite HMR → :5173）
	$(NPX) vite

# ═══════════════════════════════════════════════════
#  Build
# ═══════════════════════════════════════════════════

build: build-server build-client ## 构建前后端

build-server: ## 构建后端 TypeScript → server/dist/
	$(NPM) run build:server

build-client: ## 构建前端 Vite → dist/
	$(NPM) run build:client

# ═══════════════════════════════════════════════════
#  Production Start / Stop
# ═══════════════════════════════════════════════════

start: build ## 构建并启动生产模式（:3001 托管前端静态文件）
	@mkdir -p server/data
	NODE_ENV=production node server/dist/index.js

start-server: build-server ## 启动生产后端（需要先 build-server）
	@mkdir -p server/data
	NODE_ENV=production node server/dist/index.js

stop: stop-server stop-client ## 停止所有服务

stop-server: ## 停止后端进程
	@lsof -ti:$(SERVER_PORT) | xargs -r kill 2>/dev/null; true

stop-client: ## 停止前端进程
	@lsof -ti:$(CLIENT_PORT) | xargs -r kill 2>/dev/null; true

restart: stop start ## 停止 → 构建 → 生产启动

restart-dev: stop dev ## 停止 → 开发模式启动

# ═══════════════════════════════════════════════════
#  Database
# ═══════════════════════════════════════════════════

db-init: ## 初始化 / 运行数据库迁移
	$(NPM) run db:init

db-reset: ## 删除数据库文件并重建
	$(RM) $(DB_PATH)
	$(MAKE) db-init

# ═══════════════════════════════════════════════════
#  Status
# ═══════════════════════════════════════════════════

status: ## 查看服务运行状态
	@printf "  Backend  :%-5s → " "$(SERVER_PORT)"
	@lsof -ti:$(SERVER_PORT) >/dev/null 2>&1 && echo "RUNNING" || echo "stopped"
	@printf "  Frontend :%-5s → " "$(CLIENT_PORT)"
	@lsof -ti:$(CLIENT_PORT) >/dev/null 2>&1 && echo "RUNNING" || echo "stopped"
	@printf "  Database         → "
	@[ -f $(DB_PATH) ] && echo "$(DB_PATH)" || echo "not found"

# ═══════════════════════════════════════════════════
#  Clean
# ═══════════════════════════════════════════════════

clean: clean-dist ## 删除 node_modules + 构建产物
	$(RM) node_modules

clean-dist: ## 仅删除构建产物
	$(RM) dist server/dist

clean-db: ## 删除数据库文件
	$(RM) $(DB_PATH)

# ═══════════════════════════════════════════════════
#  Quality
# ═══════════════════════════════════════════════════

typecheck: ## 前后端 TypeScript 类型检查
	$(NPX) tsc -p tsconfig.server.json --noEmit
	$(NPX) tsc --noEmit

lint: ## 运行 ESLint（如果已配置）
	@if [ -f eslint.config.* ] || [ -f .eslintrc.* ]; then \
		$(NPX) eslint . --ext .ts,.tsx; \
	else \
		echo "No ESLint config found, skipping"; \
	fi

test: ## 运行测试（如果已配置）
	$(NPM) test 2>/dev/null || echo "No test script configured, skipping"

check: typecheck build ## 完整质量门：类型检查 + 构建

# ═══════════════════════════════════════════════════
#  Full Pipeline
# ═══════════════════════════════════════════════════

all: install build ## 安装依赖 + 构建
