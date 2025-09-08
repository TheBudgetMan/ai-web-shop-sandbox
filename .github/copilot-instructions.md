# Copilot Instructions for This Monorepo

This repository contains multiple projects in Python and TypeScript/React. Follow these guidelines to maximize AI agent productivity and maintain project conventions.

## Monorepo Structure
- `02_python_tools/`: Standalone Python package (simple CLI/game, Python 3.13+)
- `03_python_fastapi_project/`: FastAPI backend with async SQLAlchemy, SQLite, and Pydantic
- `04_market/`: React + TypeScript + Vite frontend, communicates with FastAPI backend

## Key Workflows

### Python Projects
- Use `uv` for dependency management and running scripts in `03_python_fastapi_project/`:
  - Install: `uv sync`
  - Dev server: `uv run uvicorn main:app --reload`
  - Tests: `uv run pytest`
  - Format: `uv run black . && uv run isort .`
  - Lint: `uv run flake8 .`
- Environment config via `.env` (see `.env.example`).
- Database auto-creates on first run; models in `database.py`.
- `02_python_tools/` is a minimal Python package, entrypoint: `main.py`.

### Frontend (04_market)
- Start dev server: `npm run dev` (Vite)
- Build: `npm run build`
- Lint: `npm run lint`
- Uses React 19, Ant Design, Unstated-next for state, Axios for API
- API base URL is hardcoded to `http://localhost:8000` (see `src/api.ts`)
- TypeScript strict mode enabled; see `tsconfig.*.json`

## Architectural Patterns
- **Backend**: RESTful API for products, async/await everywhere, CORS enabled for all origins
- **Frontend**: Container pattern for state (`productsContainer.tsx`), React Router for navigation, Ant Design for UI
- **Integration**: Frontend expects backend at `localhost:8000` with `/products/` endpoints

## Conventions & Tips
- Keep backend and frontend models in sync (see `Product` types/classes)
- Use async/await for all DB and API calls
- Add new Python dependencies via `pyproject.toml` and run `uv sync`
- For new frontend dependencies, use `npm install <pkg>` in `04_market/`
- Place new backend endpoints in `main.py` (FastAPI)
- Place new React pages in `src/pages/` and add routes in `App.tsx`
- Use module CSS for component styles

## Examples
- To add a new product field, update:
  - Backend: `Product` model in `database.py`, DTOs in `main.py`
  - Frontend: `Product` interface in `src/api.ts`, forms in `ProductDetail.tsx`

## External Integrations
- Figma MCP, Playwright, and other servers can be configured via `.vscode/mcp.json`

---
For any unclear or missing conventions, check the relevant `README.md` or ask for clarification.
