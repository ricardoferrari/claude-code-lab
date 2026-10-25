# Lab 7 - Paralelismo

#### Duração: 15 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Escolher entre subagentes, forks, worktrees e sessões em segundo plano
- Isolar sessões paralelas com **git worktrees** (`claude --worktree`)
- Despachar e monitorar várias sessões no **agent view** (`claude agents`)
- Evitar conflitos e controlar custo ao trabalhar em paralelo

## 🌐 Formas de trabalhar em paralelo

| Abordagem | O que é | Use quando |
|-----------|---------|------------|
| **Subagentes** (Lab 5) | Trabalhadores dentro da sua sessão; o resultado volta para a conversa | Uma tarefa lateral encheria o seu contexto |
| **Fork** (`/subtask <tarefa>`) | Subagente que herda a conversa inteira | A tarefa depende do contexto atual |
| **Worktrees** (`claude -w <nome>`) | Sessões interativas, cada uma com **pasta e branch próprios** | Você mesmo conduz duas ou mais frentes de edição |
| **Agent view** (`claude agents`, `/bg`) | Várias sessões independentes em segundo plano, num só painel | Tarefas independentes para delegar e conferir depois |
| `/batch <instrução>` | Mudança em larga escala dividida em 5 a 30 unidades, cada uma em um worktree | Migrações em muitos arquivos. **Pode publicar commits/PRs:** use só em repositório de prática |

> Existem ainda *agent teams* (experimental) e sessões na nuvem; ficam fora deste curso.

## 🧱 Antes de começar

- O repositório precisa ser git (worktrees dependem disso). Faça commit ou stash do que for importante.
- Se ainda não estiver, adicione `.claude/worktrees/` ao `.gitignore` para os worktrees não aparecerem como arquivos não rastreados.
- Rode os comandos a partir da **raiz do repositório**.

## 🧪 Mão na massa

### Passo 1 - Duas sessões isoladas com worktrees

Em **dois terminais**, na raiz do repositório:

```bash
# Terminal A
claude --worktree docs-python --name docs-python

# Terminal B
claude --worktree readme-angular --name readme-angular
```

Cada comando cria `.claude/worktrees/<nome>/` em um branch `worktree-<nome>`. Tarefas sugeridas (sem precisar rodar código):

```
# Terminal A
Em SampleApps/python-data-processor/src/database.py, adicione docstrings no estilo Google e type hints onde faltarem. Não faça commit.
```

```
# Terminal B
No README de SampleApps/angular-task-app, acrescente uma seção "Como rodar os testes" baseada no package.json. Não faça commit.
```

As duas editam **ao mesmo tempo**, sem se pisarem. Confira, a partir da raiz:

```bash
git worktree list
```

**Pontos de atenção:**
- Por padrão o worktree parte do **branch padrão do repositório** (por exemplo `main`), não do seu branch atual. Para partir do seu `HEAD`, configure `{"worktree": {"baseRef": "head"}}` nas settings.
- É um checkout novo: sem `venv` nem `node_modules`. Peça ao Claude para instalar dependências se precisar rodar testes.
- Ao sair (`/exit`), se houver trabalho no worktree o Claude pergunta se mantém ou remove. Para mesclar, use o branch `worktree-<nome>` normalmente (merge ou PR). Limpeza manual: `git worktree remove <caminho>`.

### Passo 2 - Agent view: um painel para várias sessões

Em um terminal, na raiz do repositório:

```bash
claude agents
```

Na primeira vez pode aparecer o diálogo de confiança do workspace; aceite. Digite um prompt no campo inferior e pressione `Enter`: **cada prompt inicia uma nova sessão em segundo plano**. Despache estas três, uma após a outra:

```
Auditoria de segurança de SampleApps/python-data-processor: relate achados com arquivo:linha e severidade. Não edite arquivos.
```

```
Auditoria de acessibilidade de SampleApps/angular-task-app (ARIA, teclado, contraste): relate achados com arquivo:linha. Não edite arquivos.
```

```
Adicione testes para SampleApps/python-data-processor/src/validators.py em tests/ e rode python -m pytest. Não faça commit nem push.
```

> Sessões em segundo plano que **editam** arquivos se movem automaticamente para um **worktree próprio** (`.claude/worktrees/`). Por padrão elas preservam o trabalho com commit e, se houver `remote`, **push do próprio branch**. Por isso o prompt acima diz "não faça commit nem push": instruções suas têm precedência.

#### Ler o estado de cada linha

| Estado | Ícone | Significado |
|--------|-------|-------------|
| Trabalhando | Animado | Rodando ferramentas ou gerando resposta |
| Precisa de você | Amarelo | Aguardando resposta, permissão ou decisão |
| Ocioso | Esmaecido | Pronto para o próximo prompt |
| Concluído | Verde | Terminou com sucesso |
| Falhou | Vermelho | Terminou com erro |
| Parado | Cinza | Você parou a sessão ou ela foi encerrada |

#### Atalhos do agent view

| Tecla | Ação |
|-------|------|
| `↑` / `↓` | Navega entre as sessões |
| `Space` | **Espia** a sessão (última saída ou a pergunta pendente); digite e `Enter` para responder sem entrar |
| `Enter` ou `→` | Entra na sessão (conversa completa) |
| `←` (prompt vazio) | Sai da sessão e volta ao painel |
| `Ctrl+R` | Renomeia |
| `Ctrl+X` (duas vezes) | Para e remove a sessão |
| `Ctrl+S` | Alterna o agrupamento (estado / diretório) |
| `Esc` | Fecha o espiar, limpa o campo ou sai |

As sessões continuam rodando mesmo se você fechar o painel ou o terminal.

### Passo 3 - Controlar sessões pelo shell e a partir de uma sessão

```bash
claude --bg "investigue por que o teste X é instável"   # despacha direto para segundo plano
claude agents --json        # estado em JSON (para scripts)
claude logs <id>            # saída recente
claude attach <id>          # entra na sessão neste terminal
claude stop <id>            # para
claude rm <id>              # remove da lista
```

Já está em uma sessão interativa e quer liberar o terminal? Use `/bg` (ou `←` com o prompt vazio): a conversa vai para segundo plano e continua trabalhando.

### Passo 4 - Consolidar

Quando as linhas ficarem **Concluídas**, espie cada uma (`Space`) ou entre (`Enter`) para ler os resultados. Em uma sessão normal, peça a síntese:

```
Aqui estão os achados das auditorias de segurança e acessibilidade: [cole os resumos]. Elimine duplicatas e monte um plano de ação priorizado, com os 5 itens mais críticos.
```

> **Opcional - mensagens entre sessões:** onde a comunicação entre sessões estiver habilitada, `/list-agents` (ou `/peers`) lista as sessões alcançáveis e o Claude pode enviar mensagens a uma sessão pelo nome. Dê nomes claros com `--name` ou `/rename`.

## ⚠️ Cuidados

1. **Cota:** cada sessão consome a sua assinatura de forma independente. Dez sessões gastam cerca de dez vezes mais rápido que uma.
2. **Conflitos:** só use worktrees ou divida as tarefas por pasta; várias sessões editando os mesmos arquivos fora de worktree se sobrescrevem.
3. **Commite antes de apagar:** excluir uma sessão no agent view remove o worktree que o Claude criou, **inclusive alterações não commitadas** (`claude rm` preserva o worktree com alterações pendentes).
4. **Prévia de pesquisa:** o agent view está em *research preview*; atalhos e comportamentos podem mudar.
5. **Limpeza:** `git worktree list` e `git worktree remove <caminho>` removem sobras em `.claude/worktrees/`.

### Quando NÃO paralelizar

- Etapas que dependem do resultado da anterior (planejar → implementar → testar)
- Tarefas pequenas ou exploratórias, em que você quer acompanhar o raciocínio
- Trabalho que toca os mesmos arquivos e não pode ser dividido

## 🎯 Desafio final integrador (se sobrar tempo)

Use tudo que aprendeu em um único painel. No `claude agents`, despache:

1. `/testar-funcao validate_dataframe` - uma **skill** (Lab 4)
2. `@revisor-de-codigo` revise as últimas mudanças deste branch e relate achados por severidade - um **subagente** (Lab 5)
3. `Usando o playwright, valide a página http://localhost:4200 e relate o resultado` - um **MCP** (Lab 6), com a aplicação Angular rodando

Quando alguma sessão pedir permissão, ela aparece como **Precisa de você**: espie, responda e acompanhe. Ao final, revise o que mudou com `/diff` em cada worktree.

## ✅ Pontos-chave

- **Subagentes** ficam dentro da sessão; **worktrees** isolam arquivos; **agent view** orquestra várias sessões independentes.
- `claude --worktree <nome>` cria pasta + branch próprios; `claude agents` despacha e monitora; `/bg` move a sessão atual para segundo plano.
- Peça relatórios (sem editar) para tarefas paralelas de análise e use worktrees para as de edição.
- Paralelismo troca **cota por tempo**: use quando as tarefas forem realmente independentes.

## 📋 Referência rápida

```bash
claude -w <nome> -n <nome>      # sessão em worktree próprio, com nome
claude agents                   # painel de sessões em segundo plano
claude --bg "<prompt>"          # despacha direto para segundo plano
claude logs|attach|stop|rm <id> # gerenciar sessões pelo shell
git worktree list               # worktrees existentes
```

```text
/bg   /subtask <tarefa>   /tasks   /list-agents   /rename <nome>
```

## 📚 Referências

- [Agent view](https://code.claude.com/docs/en/agent-view)
- [Worktrees](https://code.claude.com/docs/en/worktrees)
- [Executar agentes em paralelo](https://code.claude.com/docs/en/agents)

## 🎓 Parabéns!

Você concluiu o curso compacto. Recapitulando:

| Lab | Você aprendeu a... |
|-----|--------------------|
| 1 - Setup | Instalar, autenticar e conduzir uma sessão |
| 2 - Modos de Edição | Escolher modos de permissão e configurar a allow list |
| 3 - Janelas de Contexto | Medir, compactar e dar memória ao projeto com `CLAUDE.md` |
| 4 - Skills | Empacotar fluxos repetitivos em `/comandos` |
| 5 - Agentes | Delegar a subagentes com contexto isolado |
| 6 - MCPs | Conectar o Claude a ferramentas externas |
| 7 - Paralelismo | Rodar várias frentes ao mesmo tempo com segurança |

### Para ir além (curso completo)

- Hooks, memória automática e configurações avançadas: [Lab 7 - Customização](../pt-BR/Lab-7-Customization.md)
- Sessões paralelas e mensagens entre sessões em profundidade: [Lab 8](../pt-BR/Lab-8-Agentes-Paralelos-Multi-Sessoes.md)
- Workflows com muitos agentes: [Advanced Agents and Workflows](../../../AdditionalLearning/Advanced-Agents-and-Workflows.md)
- Documentação oficial: [code.claude.com/docs](https://code.claude.com/docs/en/)

---

#### 🎉 Você concluiu o curso compacto do Claude Code Hands-On Lab!
