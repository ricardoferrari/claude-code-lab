# Lab 4 - Skills

#### Duração: 20 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Explicar o que é uma skill e quando preferi-la ao `CLAUDE.md`
- Criar skills de projeto com `SKILL.md`, argumentos e contexto dinâmico
- Controlar quem invoca a skill (você ou o Claude) e quais ferramentas ela pré-aprova
- Usar as skills nativas do Claude Code

## 🧩 O que são skills?

Uma **skill** é um conjunto de instruções reutilizáveis salvo em um arquivo `SKILL.md`. Você a chama digitando `/nome`, ou o Claude a carrega sozinho quando a descrição combina com o seu pedido.

| Recurso | Quando carrega | Use para |
|---------|----------------|----------|
| `CLAUDE.md` | **Sempre**, em toda conversa | Fatos e regras do projeto (curtos) |
| **Skill** | Só quando usada (a descrição fica listada; o corpo carrega ao invocar) | Procedimentos e checklists que você repete |
| Subagente (Lab 5) | Quando delegado | Trabalho em contexto isolado |

> Sinal de que vale criar uma skill: você cola as mesmas instruções no chat várias vezes, ou uma seção do `CLAUDE.md` virou um procedimento passo a passo.

## 📁 Anatomia de uma skill

```text
.claude/skills/
└── nome-da-skill/
    ├── SKILL.md        (obrigatório)
    └── reference.md    (opcional: material de apoio, lido só quando necessário)
```

`SKILL.md` = frontmatter YAML (entre `---`, **na primeira linha do arquivo**) + instruções em Markdown.

| Campo | Para que serve |
|-------|----------------|
| `name` | Nome do comando (`/nome`). Padrão: nome da pasta |
| `description` | O que a skill faz **e quando usar**; é o que o Claude lê para decidir se a carrega |
| `disable-model-invocation: true` | Só **você** pode chamar (ideal para commit, deploy, qualquer efeito colateral) |
| `allowed-tools` | Ferramentas liberadas sem perguntar **durante a execução da skill** |
| `argument-hint` | Dica de argumentos no autocompletar |
| `context: fork` + `agent` | Executa a skill em um subagente isolado |

No corpo, `$ARGUMENTS` recebe o que você digitar depois do nome, e `` !`comando` `` executa o comando **antes** de o Claude ler a skill e injeta a saída.

**Onde ficam:**
- Projeto: `.claude/skills/<nome>/SKILL.md` (faça commit para o time)
- Pessoal: `~/.claude/skills/<nome>/SKILL.md` (todos os seus projetos)

> Criar arquivos em `.claude/` pede confirmação mesmo no modo Accept edits (é caminho protegido). Aprove a gravação. Se a pasta `.claude/skills/` **não existia** quando a sessão começou, rode `/reload-skills` para o Claude enxergá-la.

## 🧪 Mão na massa

```bash
cd SampleApps/python-data-processor
claude
```

### Passo 1 - Skill com contexto dinâmico: `/revisar-mudancas`

Peça ao Claude para criar (ou crie você mesmo) `.claude/skills/revisar-mudancas/SKILL.md`:

```markdown
---
name: revisar-mudancas
description: Revisa as mudanças não commitadas (git diff) e aponta riscos. Use quando o usuário pedir para revisar, resumir ou validar o que mudou.
---

## Mudanças atuais

!`git diff HEAD`

## Instruções

1. Resuma as mudanças acima em até 3 tópicos.
2. Liste os riscos: falta de tratamento de erro, valores fixos no código, testes que precisam de atualização.
3. Se não houver diff, diga que não há mudanças.
```

**Prompt para criar:**
```
Crie a skill de projeto revisar-mudancas em .claude/skills/revisar-mudancas/SKILL.md com este conteúdo: [cole o arquivo acima]
```

**Teste:** edite qualquer arquivo do projeto (ou use as mudanças do Lab 2) e rode:

```
/revisar-mudancas
```

O `git diff HEAD` roda antes de o Claude ver a skill, então ele revisa o diff **real**. (Arquivos novos ainda não rastreados pelo Git não aparecem no diff.) Você também pode só perguntar "o que eu mudei?": a descrição faz o Claude carregar a skill sozinho.

### Passo 2 - Skill com argumentos: `/testar-funcao`

Crie `.claude/skills/testar-funcao/SKILL.md`:

```markdown
---
name: testar-funcao
description: Gera testes pytest para uma função do projeto e roda a suíte. Uso: /testar-funcao nome_da_funcao
disable-model-invocation: true
argument-hint: [nome_da_funcao]
allowed-tools: Bash(python -m pytest *)
---

Escreva testes pytest para a função `$ARGUMENTS` deste projeto.

1. Localize a função e leia o código e a docstring.
2. Siga o estilo dos testes existentes em `tests/`.
3. Cubra: caso feliz, entradas vazias/inválidas e erros esperados.
4. Rode `python -m pytest` e corrija falhas **nos testes**; não altere o código de produção sem me avisar.
```

Use:

```
/testar-funcao validate_record
```

**O que observar:**
- `disable-model-invocation: true` impede o Claude de disparar a skill por conta própria
- `allowed-tools` libera o `pytest` só durante esta execução (compare com as regras permanentes do Lab 2)
- `$ARGUMENTS` virou `validate_record`

### Passo 3 - Skills nativas

O Claude Code já traz skills prontas. Liste tudo que está disponível:

```
/skills
```

Experimente (com mudanças no seu branch):

| Skill | Função |
|-------|--------|
| `/code-review` | Revisa o diff atual em busca de bugs (aceita `--fix` para aplicar correções) |
| `/simplify` | Revisa o código alterado em busca de simplificações e as aplica |
| `/debug [descrição]` | Liga logs de depuração e investiga o problema |
| `/doctor` | Checkup da instalação e da configuração |

```
/code-review
```

### Passo 4 (leitura) - Skill em contexto isolado

Com `context: fork`, a skill roda em um **subagente** e só o resultado volta à conversa:

```markdown
---
name: mapear-modulo
description: Mapeia um módulo do projeto sem poluir a conversa principal.
context: fork
agent: Explore
---

Explore `$ARGUMENTS` e resuma responsabilidades, dependências e pontos de atenção, citando arquivo:linha.
```

Um subagente não vê a sua conversa, então as instruções da skill precisam ser autossuficientes. Você verá subagentes em detalhe no próximo lab.

## 💡 Boas práticas

1. **Descrição específica**, começando pelo caso de uso: é ela que decide quando a skill dispara.
2. **`disable-model-invocation: true`** para tudo que tem efeito colateral (commit, deploy, envio de mensagens).
3. **`SKILL.md` enxuto** (abaixo de ~500 linhas); detalhes vão em arquivos de apoio.
4. **Escreva instruções que valem para a tarefa toda**: o conteúdo fica na conversa depois de invocado.
5. **Versione `.claude/skills/`** e revise o `allowed-tools` de skills de terceiros antes de usá-las.

## 🛠️ Solução de problemas

| Sintoma | O que fazer |
|---------|-------------|
| Skill não aparece em `/skills` | Pasta nova? Rode `/reload-skills`. Confira o caminho `.claude/skills/<nome>/SKILL.md` |
| `/nome` não reconhecido | O frontmatter precisa começar na **primeira linha** com `---`; valide o YAML |
| Claude não dispara sozinho | Reescreva a `description` com as palavras que você usa no pedido, ou chame `/nome` |
| Dispara sem querer | Torne a descrição mais específica ou use `disable-model-invocation: true` |
| Ficou em dúvida | `claude --debug` mostra erros de leitura do frontmatter |

## 🎯 Exercício

Crie a skill `/documentar` (manual, `disable-model-invocation: true`) que recebe um caminho de arquivo e:
1. Adiciona docstrings no estilo Google às funções e métodos públicos que estiverem sem documentação
2. Adiciona type hints que estiverem faltando
3. Roda `python -m pytest` para confirmar que nada quebrou

Teste com `/documentar src/database.py` e revise com `/diff`.

## ✅ Pontos-chave

- Uma skill é um **procedimento reutilizável** em `.claude/skills/<nome>/SKILL.md`.
- Chame por `/nome` ou deixe o Claude escolher pela `description`.
- `$ARGUMENTS` e `` !`comando` `` tornam a skill dinâmica; `allowed-tools` evita prompts de permissão.
- Skills carregam sob demanda; o `CLAUDE.md` carrega sempre.

## 📚 Referências

- [Skills](https://code.claude.com/docs/en/skills)
- [Skills nativas e comandos](https://code.claude.com/docs/en/commands)

## 🔜 Próximo Lab

No [Lab 5 - Agentes](Lab-5-Agentes.md) você vai delegar trabalho a subagentes com contexto próprio.

---

#### Você concluiu o Lab 4! Clique em [Próximo Lab →](Lab-5-Agentes.md) para continuar.
