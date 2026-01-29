# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Antigravity Kit** is an AI Agent Capability Expansion Toolkit — a modular framework of specialist agents, skills, and workflows that extend Claude Code's capabilities. It is not a traditional application codebase; there is no build system, package manager, or compiled output. The entire framework operates through dynamic agent invocation and skill loading at runtime.

## Key Commands

### Validation (run from project root)

```bash
# Quick development validation (security, lint, types, schema, tests, UX, SEO)
python .agent/scripts/checklist.py .

# Full pre-deployment verification (adds Lighthouse, Playwright E2E, bundle analysis, mobile, i18n)
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

### Individual Skill Scripts

Scripts live under `.agent/skills/<skill>/scripts/` and can be run directly:

```bash
python .agent/skills/<skill>/scripts/<script>.py
```

Key scripts: `security_scan.py`, `lint_runner.py`, `test_runner.py`, `schema_validator.py`, `ux_audit.py`, `seo_checker.py`, `lighthouse_audit.py`, `playwright_runner.py`, `mobile_audit.py`, `bundle_analyzer.py`, `dependency_analyzer.py`, `accessibility_checker.py`.

### Workflows (Slash Commands)

`/plan`, `/create`, `/debug`, `/deploy`, `/enhance`, `/orchestrate`, `/preview`, `/status`, `/test`, `/brainstorm`, `/ui-ux-pro-max`

## Architecture

### Three-Layer System

1. **Agents** (`.agent/agents/`, 20 specialists) — Role-based AI personas with frontmatter defining their tools, skills, and model. Each agent has decision frameworks, quality checkpoints, and anti-patterns.
2. **Skills** (`.agent/skills/`, 36 modules) — Domain-specific knowledge loaded on-demand. Each skill has a `SKILL.md` index and optional `scripts/`, `references/`, `assets/` subdirectories.
3. **Workflows** (`.agent/workflows/`, 11 commands) — Slash command procedures that coordinate agents.

### Rule Priority

`GEMINI.md (P0)` > `Agent .md (P1)` > `SKILL.md (P2)`. All rules are binding.

### Request Flow

```
User Request → GEMINI.md classifies request type → Auto-selects agent(s)
→ Agent loads skills from frontmatter → Executes with loaded skills
→ Validation scripts run → Output
```

### Skill Loading Protocol

Agent frontmatter declares `skills:` → Read `SKILL.md` (index only) → Read only sections relevant to the current request. Never bulk-read all files in a skill folder.

### Key Global Rules (from `.agent/rules/GEMINI.md`)

- **Socratic Gate**: Complex requests require clarifying questions before implementation. Never assume — ask when anything is unclear.
- **Agent Routing Checklist**: Before any code/design work: identify agent → read agent `.md` → announce agent → load required skills.
- **Language Handling**: Respond in the user's language; keep code comments/variables in English.
- **File Dependency Awareness**: Check `CODEBASE.md` before modifying files; update all dependent files together.
- **Validation**: A task is not finished until `checklist.py` passes. Fix Critical blockers (Security/Lint) first.

### Agent Quick Reference

| Need | Agent | Key Skills |
|------|-------|------------|
| Multi-agent coordination | `orchestrator` | parallel-agents, behavioral-modes |
| Planning & discovery | `project-planner` | brainstorming, plan-writing, architecture |
| Web UI | `frontend-specialist` | nextjs-react-expert, frontend-design, tailwind-patterns |
| API/Backend | `backend-specialist` | api-patterns, nodejs-best-practices, database-design |
| Database | `database-architect` | database-design, prisma-expert |
| Mobile (iOS/Android/RN) | `mobile-developer` | mobile-design |
| Security | `security-auditor` | vulnerability-scanner, red-team-tactics |
| Testing | `test-engineer` | testing-patterns, tdd-workflow, webapp-testing |
| Debugging | `debugger` | systematic-debugging |
| DevOps/Deploy | `devops-engineer` | deployment-procedures, docker-expert |
| Performance | `performance-optimizer` | performance-profiling |
| SEO | `seo-specialist` | seo-fundamentals, geo-fundamentals |

**Important**: Mobile projects must use `mobile-developer`, never `frontend-specialist`.

### Validation Priority Order

P0: Security → P1: Lint/Types → P2: Schema → P3: Tests → P4: UX → P5: SEO → P6: Lighthouse/E2E
