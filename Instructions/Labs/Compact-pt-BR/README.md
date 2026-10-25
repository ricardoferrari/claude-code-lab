# Claude Code Hands-On Lab - Curso Compacto (pt-BR)

Versão condensada, em português do Brasil, do laboratório completo. Em cerca de **2 horas** você passa pelos sete temas essenciais para ficar produtivo com o Claude Code, sempre com exercícios práticos nos projetos de exemplo (`SampleApps/`).

## 🗺️ Roteiro

| Lab | Tema | Duração | Você vai... |
|-----|------|---------|-------------|
| [Lab 1](Lab-1-Setup.md) | Setup | 15 min | Instalar, autenticar e fazer a primeira sessão |
| [Lab 2](Lab-2-Modos-de-Edicao.md) | Modos de Edição | 20 min | Dominar modos de permissão, `Edit` x `Write` e a allow list do `settings.json` |
| [Lab 3](Lab-3-Janelas-de-Contexto.md) | Janelas de Contexto | 15 min | Medir e compactar o contexto e usar o `CLAUDE.md` |
| [Lab 4](Lab-4-Skills.md) | Skills | 20 min | Criar comandos reutilizáveis com `SKILL.md` |
| [Lab 5](Lab-5-Agentes.md) | Agentes | 20 min | Delegar a subagentes e criar o seu |
| [Lab 6](Lab-6-MCPs.md) | MCPs | 15 min | Conectar ferramentas externas e testar a UI com Playwright |
| [Lab 7](Lab-7-Paralelismo.md) | Paralelismo | 15 min | Rodar sessões em paralelo com worktrees e agent view |

**Duração total:** ~2 horas

## 📋 Pré-requisitos

- Conhecimentos básicos de Python e/ou TypeScript, terminal e Git
- Python 3.9+, Node.js 18+ e Git instalados
- Assinatura Claude (Pro, Max, Team ou Enterprise) ou chave de API do Console
- Este repositório clonado. Os comandos assumem que você começa na **raiz do repositório**

## 🧭 Convenções

- Blocos com `Prompt para experimentar` são para colar na sessão do Claude.
- Comandos que começam com `/` (como `/context`) são digitados **dentro** da sessão; os que começam com `claude`, `git`, `npm` ou `python` rodam no **terminal**.
- Nos exemplos de terminal, `cd SampleApps/...` parte da raiz do repositório.

## 🔀 De onde vem cada lab

| Curso compacto | Origem no curso completo |
|----------------|--------------------------|
| 1 - Setup | [Lab 1](../Lab-1-Getting-Started.md) (e a exploração de código do [Lab 2](../Lab-2-Exploring-Codebases.md)) |
| 2 - Modos de Edição | [Lab 3](../Lab-3-Code-Editing.md) |
| 3 - Janelas de Contexto | [Lab 4](../Lab-4-Context-Windows-and-Session-Management.md) |
| 4 - Skills | [Lab 7](../Lab-7-Customization.md) (parte de skills) |
| 5 - Agentes | [Lab 5](../Lab-5-Working-With-Agents.md) |
| 6 - MCPs | [Lab 6](../Lab-6-MCP-Integration.md) |
| 7 - Paralelismo | [Lab 8](../Lab-8-Parallel-Agents-Multi-Sessions.md) |

Ficam para o curso completo: hooks e memória automática (Lab 7 completo), workflows com muitos agentes e MCPs de banco de dados, Slack e servidores customizados.

## ℹ️ Observação sobre versões

O Claude Code evolui rápido. Se um comando ou rótulo for diferente do descrito, rode `claude --version` e `claude update`, e consulte a [documentação oficial](https://code.claude.com/docs/en/).

---

**Pronto para começar?** Vá para o [Lab 1 - Setup](Lab-1-Setup.md).
