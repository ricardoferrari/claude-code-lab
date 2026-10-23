# Lab 5 - Agentes

#### Duração: 20 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Explicar o que são subagentes e como eles preservam o seu contexto
- Delegar exploração e revisões a subagentes, inclusive em paralelo
- Criar um subagente personalizado com ferramentas restritas
- Decidir quando usar (ou não) subagentes

## 🤖 O que são subagentes?

Um **subagente** é um assistente especializado que trabalha **na própria janela de contexto**, com prompt, ferramentas e permissões próprios. Ele faz o trabalho pesado (buscas, leituras, saídas longas) e devolve **só o resumo** para a sua conversa.

```
Sessão principal (você + Claude)
    ├── Subagente "Explore"        → lê e busca código, só leitura
    ├── Subagente "Plan"           → pesquisa para montar planos
    └── Subagentes personalizados  → ex.: revisor-de-codigo
```

**Por que usar:**
- **Preserva contexto:** a exploração fica fora da sua conversa (Lab 3)
- **Restringe ferramentas:** um revisor que não consegue editar arquivos
- **Paraleliza:** várias investigações independentes ao mesmo tempo
- **Reduz custo:** pode rodar em um modelo mais leve

### Subagentes nativos

| Subagente | Ferramentas | Serve para |
|-----------|-------------|------------|
| **Explore** | Somente leitura | Encontrar e analisar código |
| **Plan** | Somente leitura | Pesquisar para o modo Plan |
| **general-purpose** | Todas | Tarefas de vários passos que exploram **e** alteram |

> `Explore` e `Plan` começam **sem** o `CLAUDE.md`. Se uma regra do projeto importa para eles, repita-a no pedido.

## 🧪 Mão na massa

```bash
cd SampleApps/python-data-processor
claude
```

### Passo 1 - Delegar uma exploração

**Prompt para experimentar:**
```
Use um subagente Explore para mapear como DataProcessor usa Database e os validators. Devolva um resumo curto com referências arquivo:linha.
```

**O que observar:**
- Uma linha de chamada como `Explore(...)` no transcript
- O resultado chega **resumido**, sem as leituras de arquivos
- Rode `/context`: sua conversa quase não cresceu

### Passo 2 - Revisões em paralelo

```
Em paralelo, use três subagentes separados para revisar SampleApps/python-data-processor:
1. Segurança: entradas, operações com arquivos, acesso a banco
2. Qualidade: complexidade, duplicação, tratamento de erros
3. Testes: caminhos críticos sem cobertura
Cada um deve devolver achados com arquivo:linha e severidade. Depois consolide e priorize.
```

**O que observar:**
- Os subagentes rodam **em segundo plano** por padrão, e os resultados chegam como notificações
- `/tasks` lista o trabalho em andamento e os subagentes que terminaram
- Três análises no tempo de uma, mas cada subagente gasta tokens (e cota) próprios

### Passo 3 - Criar um subagente personalizado

Subagentes são arquivos Markdown com frontmatter, em `.claude/agents/` (projeto) ou `~/.claude/agents/` (pessoal). Peça ao Claude para criar:

```
Crie um subagente de projeto chamado revisor-de-codigo em .claude/agents/. Ele revisa código Python em busca de bugs, riscos de segurança e falta de testes, usa git diff para ver as mudanças e não pode editar arquivos. Use o modelo da sessão.
```

O arquivo resultante deve ser parecido com:

```markdown
---
name: revisor-de-codigo
description: Revisa código Python em busca de bugs, riscos de segurança e falta de testes. Use proativamente depois de alterações de código.
tools: Read, Grep, Glob, Bash
model: inherit
---

Você é um revisor de código sênior.

Ao ser chamado:
1. Rode `git diff` para ver as mudanças recentes
2. Concentre-se nos arquivos modificados
3. Dê o feedback organizado por prioridade: crítico, aviso, sugestão

Para cada problema, cite arquivo:linha e mostre como corrigir. Nunca altere arquivos.
```

| Campo | Função |
|-------|--------|
| `name` / `description` | Identificação e **quando delegar** (o Claude usa a descrição; "use proativamente" incentiva a delegação) |
| `tools` | Lista de ferramentas permitidas. Sem `Edit`/`Write`, o subagente não altera arquivos |
| `model` | `sonnet`, `opus`, `haiku` ou `inherit` (mesmo modelo da sessão) |

> Se `.claude/agents/` não existia quando a sessão começou, **reinicie a sessão** para o Claude carregar o subagente. Depois disso, edições nos arquivos são detectadas sozinhas. O `/agents` do Claude Code atual apenas lembra que você pode pedir ao Claude para criar subagentes ou editar essa pasta.

### Passo 4 - Invocar o seu subagente

Três formas, da mais flexível à mais explícita:

```
Use o subagente revisor-de-codigo para revisar as mudanças atuais.
```

```
@"revisor-de-codigo (agent)" revise as mudanças do último commit
```

```bash
claude --agent revisor-de-codigo     # a sessão inteira roda como esse agente
```

Em seguida, encadeie:

```
Use o revisor-de-codigo para achar o problema mais crítico e depois peça ao subagente general-purpose para corrigi-lo com um teste.
```

## ⚖️ Quando usar subagentes

| Use subagentes quando... | Faça na conversa principal quando... |
|--------------------------|--------------------------------------|
| A tarefa gera muita saída que você não vai reler (buscas, logs, testes) | A tarefa exige vai-e-vem frequente com você |
| Você quer limitar ferramentas ou permissões | É uma mudança pequena e pontual |
| As investigações são independentes e podem rodar juntas | As etapas compartilham muito contexto (planejar → implementar → testar) |
| O trabalho é autocontido e devolve um resumo | A latência importa (subagente novo precisa levantar contexto) |

**Limitações para lembrar:**
- Um subagente **não vê** a sua conversa; o pedido precisa conter o que ele precisa saber. (`/subtask <tarefa>` cria um *fork* que herda a conversa inteira, útil quando o contexto importa.)
- Vários subagentes devolvendo resultados longos também enchem o seu contexto.
- Subagentes que **editam** arquivos em paralelo podem conflitar; use `isolation: worktree` no frontmatter para isolá-los (veja o Lab 7).

## 💡 Boas práticas

1. **Um subagente, um foco.** Descrições específicas roteiam melhor.
2. **Mínimo de ferramentas** necessário (revisores não precisam de `Edit`).
3. **Escopo certo:** nem "olhe a linha 42", nem "reescreva a aplicação".
4. **Revise os resultados.** O Claude sintetiza, mas a decisão é sua.
5. **Versione `.claude/agents/`** para o time reutilizar.

## 🎯 Exercício

Crie o subagente `gerador-de-testes` com `tools: Read, Grep, Glob, Edit, Write, Bash`, restrito por instrução a escrever apenas dentro de `tests/`. Peça:

```
Use dois subagentes gerador-de-testes em paralelo: um para src/validators.py e outro para src/database.py, cada um escrevendo em um arquivo de teste próprio. Depois rode python -m pytest e resuma o resultado.
```

Compare o tempo e o `/context` com a mesma tarefa feita na conversa principal.

## ✅ Pontos-chave

- Subagentes trabalham em **contexto isolado** e devolvem um resumo.
- Nativos: **Explore**, **Plan**, **general-purpose**; personalizados ficam em `.claude/agents/*.md`.
- Restrinja `tools` e escreva uma `description` clara para delegação confiável.
- Paralelismo economiza tempo, mas **não** economiza tokens.

## 📚 Referências

- [Subagentes](https://code.claude.com/docs/en/sub-agents)
- [Executar agentes em paralelo](https://code.claude.com/docs/en/agents)

## 🔜 Próximo Lab

No [Lab 6 - MCPs](Lab-6-MCPs.md) você vai conectar o Claude a ferramentas externas, como um navegador real.

---

#### Você concluiu o Lab 5! Clique em [Próximo Lab →](Lab-6-MCPs.md) para continuar.
