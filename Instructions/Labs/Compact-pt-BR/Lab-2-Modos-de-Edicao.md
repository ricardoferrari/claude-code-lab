# Lab 2 - Modos de Edição

#### Duração: 20 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Escolher o **modo de permissão** adequado a cada situação
- Diferenciar `Edit` e `Write` e revisar alterações antes de aceitá-las
- Configurar uma **lista de permissões (allow list)** no `settings.json`
- Editar código e gerar testes com segurança, desfazendo quando necessário

## ✏️ Como o Claude edita arquivos

- **`Edit`** - troca um trecho exato de um arquivo existente (mudança cirúrgica, aparece como diff).
- **`Write`** - cria um arquivo novo ou reescreve um arquivo inteiro.

**Regra prática:** `Edit` para arquivos existentes, `Write` para arquivos novos.

## 🔐 Modos de permissão

O modo define o que o Claude pode fazer **sem perguntar**. Troque durante a sessão com `Shift+Tab`, ou inicie com `claude --permission-mode <valor>`.

| Modo (rótulo) | Valor de config | Roda sem perguntar | Use quando |
|---------------|-----------------|--------------------|------------|
| **Manual** | `default` | Apenas leituras | Código desconhecido ou trabalho sensível |
| **Accept edits** | `acceptEdits` | Leituras, edições de arquivos e comandos simples (`mkdir`, `mv`, `cp`...) na pasta do projeto | Você revisa o resultado depois, com `git diff` |
| **Plan** | `plan` | Apenas leitura e exploração; **não edita** até você aprovar o plano | Antes de uma mudança grande |
| **Auto** | `auto` | Quase tudo; um classificador revisa as ações em segundo plano | Tarefas longas, para reduzir interrupções |
| **Don't ask** | `dontAsk` | Só leituras e o que a allow list já permite; o resto é negado | CI e scripts |
| **Bypass permissions** | `bypassPermissions` | Tudo, sem verificações | **Somente** em container ou VM isolados |

A barra de status mostra o modo ativo (por exemplo `⏸ manual mode on`, `⏵⏵ accept edits on`, `⏸ plan mode on`).

> **Atenção:** dependendo da versão e do plano, a sessão pode **já iniciar em Auto**. Confira a barra de status e use `Shift+Tab` para trocar. Atalho para planejar: `/plan <descrição da tarefa>`.

### Caminhos protegidos

Gravações em `.git`, `.claude`, `.vscode`, `.idea` e alguns arquivos de configuração **nunca são aprovadas automaticamente** (exceto em `bypassPermissions`), nem no modo Accept edits. Quando o Claude for criar arquivos em `.claude/` (Labs 4 e 5), aprove a confirmação.

## 📋 A lista de permissões (allow list)

Os modos definem o comportamento-base. As **regras de permissão** liberam ou bloqueiam ferramentas específicas, e ficam em `permissions` dentro de um `settings.json`:

```json
{
  "permissions": {
    "allow": ["Bash(python -m pytest *)", "Bash(git diff *)"],
    "ask":   ["Bash(git commit *)"],
    "deny":  ["Read(./.env)", "Bash(git push *)"]
  }
}
```

| Lista | Efeito |
|-------|--------|
| `allow` | Executa sem pedir aprovação |
| `ask` | Sempre pergunta |
| `deny` | Bloqueia |

**Ordem de avaliação: `deny` → `ask` → `allow`.** A primeira correspondência vence, então um `deny` sempre prevalece sobre um `allow`. Nas regras de `Bash`, o `*` casa qualquer texto; `Bash(git diff *)` também cobre `git diff` puro.

### Onde a lista fica guardada

| Arquivo | Vale para | Observação |
|---------|-----------|------------|
| `~/.claude/settings.json` | Você, em todos os projetos | No Windows: `%USERPROFILE%\.claude\settings.json` |
| `.claude/settings.json` | Todos que trabalham no projeto | Faça commit para compartilhar com o time |
| `.claude/settings.local.json` | Só você, neste projeto | Não vai para o git. É onde o Claude grava "Yes, and don't ask again" |

As listas de arquivos diferentes **se combinam**. Use `/permissions` para ver todas as regras e de qual arquivo cada uma vem.

> As regras de `Bash` casam o **texto do comando**; não são uma barreira de segurança contra variações (`/usr/bin/curl`, `bash -c '...'`). Para isolamento real, use o [sandbox](https://code.claude.com/docs/en/sandboxing).

## 🧪 Mão na massa

```bash
cd SampleApps/python-data-processor
claude
```

### Passo 1 - Planejar antes de editar (modo Plan)

Pressione `Shift+Tab` até **plan mode** (ou use `/plan`):

**Prompt para experimentar:**
```
/plan Verifique o que acontece em DataProcessor.process_file com um CSV totalmente vazio e com um JSON malformado. Se houver falhas, proponha um tratamento com mensagens de erro claras (ValueError).
```

Leia o plano. Você pode aprovar (escolhendo revisar cada edição manualmente) ou pedir ajustes. Nada é editado antes da aprovação.

### Passo 2 - Revisar cada edição (modo Manual)

Após aprovar o plano com **"manually approve edits"**, observe:
1. O Claude usa `Read` e depois `Edit`
2. Cada edição aparece como diff (antes → depois)
3. Você aceita ou recusa uma a uma

### Passo 3 - Editar e testar (modo Accept edits)

Pressione `Shift+Tab` até **accept edits on**:

```
Escreva testes pytest para os casos de borda que você tratou (CSV vazio, JSON malformado, formato não suportado) em tests/test_data_processor.py e rode a suíte com python -m pytest.
```

**O que observar:**
- As edições passam sem perguntar, mas rodar `pytest` (um comando `Bash`) **pede aprovação**
- Escolha **"Yes, and don't ask again"**: o Claude grava uma regra `allow` em `.claude/settings.local.json`

### Passo 4 - Conferir e ajustar a allow list

```
/permissions
```

Veja a regra criada e o arquivo de origem. Depois peça ao Claude para completar a lista do projeto:

```
Crie .claude/settings.json neste projeto permitindo Bash(python -m pytest *) e Bash(git diff *), e negando a leitura de ./.env.
```

Aprove a gravação em `.claude/` quando solicitado e confira novamente com `/permissions`.

### Passo 5 - Revisar e desfazer

```
/diff
```

Mostra tudo que mudou na árvore de trabalho. Para voltar atrás no código e/ou na conversa, use `/rewind` (checkpoints). Para tudo que for do Git, o seu branch `lab-pratica` é a rede de segurança.

## 💡 Boas práticas

1. **Revise o diff** antes de commitar; não aceite edições às cegas.
2. **Dê contexto:** nomeie arquivo, função e regra esperada.
3. **Teste depois de editar:** peça para rodar a suíte e corrigir falhas.
4. **Planeje mudanças grandes** em modo Plan antes de liberar edições.
5. **Aumente a autonomia aos poucos:** Manual → Accept edits → Auto, conforme a confiança na tarefa.

## 🎯 Exercício

`DataProcessor.save_results` decide o formato com `output_path.endswith('.csv')`, ou seja, **diferencia maiúsculas de minúsculas**.

1. Em modo **Plan**, peça um plano para aceitar `.CSV`/`.JSON` e rejeitar `output_path` vazio, com `ValueError` descritivo.
2. Em modo **Accept edits**, implemente o plano e adicione os testes.
3. Verifique com `/diff` e rode `python -m pytest`. Compare com o seu baseline do Lab 1.

## ✅ Pontos-chave

- **Modo = base de comportamento; regras = exceções precisas.** `deny` sempre vence.
- `Edit` altera, `Write` cria; ambos passam pelo modo de permissão.
- A allow list mora em `permissions.allow` (usuário, projeto ou local) e é gerenciada com `/permissions`.
- `/plan` antes, `/diff` depois, `/rewind` se algo sair do esperado.

## 📋 Referência rápida

```text
Shift+Tab                    alterna o modo de permissão
/plan <tarefa>               entra em plan mode com uma tarefa
/permissions                 gerencia regras allow / ask / deny
/diff                        revisa as mudanças
/rewind                      volta a um checkpoint
claude --permission-mode plan    inicia direto em um modo
```

## 📚 Referências

- [Modos de permissão](https://code.claude.com/docs/en/permission-modes#choose-a-permission-mode)
- [Regras e sintaxe de permissões](https://code.claude.com/docs/en/permissions#manage-permissions)
- [Arquivos de configuração e escopos](https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect)

## 🔜 Próximo Lab

No [Lab 3 - Janelas de Contexto](Lab-3-Janelas-de-Contexto.md) você vai aprender a manter a conversa leve e a dar memória permanente ao projeto com o `CLAUDE.md`.

---

#### Você concluiu o Lab 2! Clique em [Próximo Lab →](Lab-3-Janelas-de-Contexto.md) para continuar.
