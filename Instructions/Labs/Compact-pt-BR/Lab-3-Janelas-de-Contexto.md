# Lab 3 - Janelas de Contexto

#### Duração: 15 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Entender o que ocupa a janela de contexto e por que gerenciá-la
- Medir e reduzir o uso com `/context`, `/compact` e `/clear`
- Retomar conversas com `/resume`
- Dar memória permanente ao projeto com o `CLAUDE.md`
- Escolher o modelo certo para cada tarefa com `/model`

## 🧠 O que é a janela de contexto?

É a **memória de trabalho** do Claude: tudo que ele "enxerga" ao responder. O tamanho máximo varia conforme o modelo; use `/context` para ver o seu uso real.

**O que ocupa espaço:**
- Suas mensagens e as respostas do Claude
- Conteúdo dos arquivos lidos e saídas de comandos (testes, buscas)
- O `CLAUDE.md` e as instruções do sistema
- Definições de skills, subagentes e ferramentas de MCP

**Por que importa:** mais contexto dá mais entendimento do projeto, mas contexto cheio deixa as respostas mais lentas e caras, e o Claude pode perder detalhes antigos. O objetivo é manter o que é útil e descartar o ruído.

## ⌨️ Comandos de gerenciamento

| Comando | O que faz | Quando usar |
|---------|-----------|-------------|
| `/context` | Mostra o uso de contexto e sugestões de otimização | Para medir antes de decidir |
| `/compact [foco]` | Resume a conversa mantendo o essencial | Contexto alto, mas a tarefa continua |
| `/clear` | Começa uma conversa nova com contexto vazio (mantém o `CLAUDE.md`) | Troca para uma tarefa sem relação |
| `/resume` | Volta a uma conversa anterior (ou `claude -c` / `claude -r` no terminal) | Retomar um trabalho |
| `/btw <pergunta>` | Pergunta rápida que **não** entra no histórico | Dúvida pontual |
| `/rewind` | Volta código e/ou conversa a um checkpoint | Desfazer um caminho errado |
| `/model` | Troca o modelo da sessão | Ajustar custo/capacidade |
| `/init`, `/memory` | Cria e edita o `CLAUDE.md` | Memória do projeto |

## 🧪 Mão na massa

```bash
cd SampleApps/python-data-processor
claude
```

### Passo 1 - Encher e medir

**Prompt para experimentar:**
```
Leia todos os arquivos .py de src/ e tests/, rode python -m pytest e resuma a arquitetura do projeto.
```

Depois:

```
/context
```

Anote o uso. Observe quais itens mais pesam (mensagens, arquivos, saídas).

### Passo 2 - Compactar com foco

```
/compact Mantenha a arquitetura e as decisões; descarte as saídas completas dos testes.
```

```
/context
```

Compare com o valor anterior: o contexto cai bastante, e o Claude ainda lembra do essencial. Pergunte "quais classes existem em src/?" para conferir.

### Passo 3 - Memória permanente com CLAUDE.md

O `CLAUDE.md` é carregado **automaticamente no início de toda conversa**. Nele ficam as instruções que você não quer repetir.

```
/init
```

O Claude analisa o projeto e cria o arquivo. Revise e refine:

```
Edite o CLAUDE.md para refletir estas regras do projeto:
- Comandos: testes com `python -m pytest`; formatação com `black .`; tipos com `mypy src`
- Convenções: type hints em funções públicas, docstrings no estilo Google, `logging` em vez de `print`
- Erros: validar entradas e levantar ValueError com mensagem descritiva
- Não adicionar dependências pesadas sem discutir
```

**O que colocar no CLAUDE.md:** comandos de build/teste, convenções que o Claude não deduz do código, decisões de arquitetura e armadilhas conhecidas. **O que evitar:** o que já é óbvio lendo o código e textos longos (cada linha custa contexto em toda conversa). Use `/memory` para editar a qualquer momento.

### Passo 4 - Começar do zero sem perder o projeto

```
/clear
```

A conversa nova começa vazia, mas com o `CLAUDE.md`. Teste sem pedir leitura de arquivos:

```
Quais comandos devo usar para rodar os testes e formatar o código neste projeto?
```

A resposta vem do `CLAUDE.md`. Para recuperar a conversa anterior:

```
/resume
```

Escolha a sessão na lista. No terminal, `claude -c` continua a conversa mais recente da pasta.

### Passo 5 - O modelo certo para a tarefa

```
/model
```

O seletor lista os modelos disponíveis (aliases como `sonnet`, `opus` e `haiku`). Pressione `s` em uma linha para trocar **só nesta sessão**; sem isso, a escolha vira o padrão para novas sessões. Para iniciar já com um modelo: `claude --model opus`.

| Tarefa | Direção geral |
|--------|---------------|
| Planejar, decisões de arquitetura, depuração difícil | Modelo mais capaz (e mais caro) |
| Edições simples, comandos, perguntas rápidas | Modelo mais rápido e barato |

`/effort` ajusta quanto raciocínio o modelo aplica.

## 💡 Estratégias de gerenciamento

1. **Meça cedo:** olhe `/context` ao fim de cada etapa grande. Como regra prática, considere compactar passando de 60-70%.
2. **Compacte com foco:** diga o que preservar.
3. **`/clear` entre tarefas não relacionadas:** começar limpo costuma render mais do que arrastar contexto antigo.
4. **Repetiu uma instrução duas vezes? Ponha no `CLAUDE.md`.**
5. **Busque antes de ler:** "ache onde X é validado" é melhor do que "leia o projeto inteiro".
6. **Delegue saídas volumosas a subagentes** (Lab 5): só o resumo volta para a sua conversa.
7. **Extensões também custam contexto:** skills, subagentes e servidores MCP aparecem em `/context`. Remova o que não usa.

## 🎯 Exercício

1. Gere contexto pesado (leia vários arquivos e rode os testes) e registre `/context`.
2. Rode `/compact` com um foco à sua escolha e compare.
3. Faça `/clear` e valide que o `CLAUDE.md` foi carregado.
4. Use `/resume` para voltar à conversa pesada.
5. Troque o modelo para uma pergunta de arquitetura e depois volte ao anterior.

## ✅ Pontos-chave

- Contexto é um recurso finito: **meça** (`/context`), **resuma** (`/compact`), **recomece** (`/clear`).
- O `CLAUDE.md` é a memória do projeto, carregada sempre, então mantenha-o curto e útil.
- `/resume` evita perder trabalho entre sessões.
- Troque de modelo conforme a dificuldade da tarefa com `/model`.

## 📚 Referências

- [A janela de contexto](https://code.claude.com/docs/en/context-window)
- [Memória e CLAUDE.md](https://code.claude.com/docs/en/memory)
- [Referência de comandos](https://code.claude.com/docs/en/commands)

## 🔜 Próximo Lab

No [Lab 4 - Skills](Lab-4-Skills.md) você vai empacotar fluxos de trabalho repetitivos em comandos reutilizáveis.

---

#### Você concluiu o Lab 3! Clique em [Próximo Lab →](Lab-4-Skills.md) para continuar.
