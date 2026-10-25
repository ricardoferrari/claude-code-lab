# Lab 1 - Setup: Instalação e Primeira Sessão

#### Duração: 15 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Instalar e autenticar o Claude Code
- Iniciar uma sessão dentro de um projeto e entender o ciclo pedido → ferramentas → resultado
- Deixar o ambiente dos projetos de exemplo pronto para os próximos labs

## 🚀 O que é o Claude Code?

O Claude Code é um **assistente de programação agêntico**: além de sugerir código, ele lê o seu projeto, edita arquivos, roda comandos (testes, build, git) e valida o resultado, sempre mostrando o que está fazendo.

## 🔍 Passo 1: Verificar pré-requisitos

```bash
python --version   # 3.9 ou superior (no macOS/Linux pode ser python3)
node --version     # 18 ou superior
git --version
```

Sistemas suportados: macOS 13+, Windows 10 (1809+), Ubuntu 20.04+ / Debian 10+, com 4 GB+ de RAM e internet.

## 📥 Passo 2: Instalar o Claude Code

| Sistema | Comando |
|---------|---------|
| macOS / Linux | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Windows (PowerShell) | `irm https://claude.ai/install.ps1 \| iex` |
| Windows (CMD) | `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd` |
| Windows (WinGet) | `winget install Anthropic.ClaudeCode` |
| macOS (Homebrew) | `brew install --cask claude-code` |

Abra um **novo terminal** e confirme:

```bash
claude --version
claude doctor      # diagnóstico da instalação (somente leitura)
```

> Se aparecer `command not found` / `não é reconhecido`: feche e reabra o terminal (o PATH pode não ter atualizado) e rode `claude doctor`.
> Instalações por Homebrew e WinGet não atualizam sozinhas: use `brew upgrade claude-code` ou `winget upgrade Anthropic.ClaudeCode`.

## 🔐 Passo 3: Autenticar

Inicie o Claude Code em qualquer pasta:

```bash
claude
```

Escolha **uma** das formas de autenticação:

- **Assinatura Claude (Pro, Max, Team, Enterprise):** o Claude abre o navegador; conclua o login e volte ao terminal.
- **Chave de API (Console):** defina `ANTHROPIC_API_KEY` antes de iniciar e aprove o uso quando solicitado.
  - macOS/Linux/Git Bash: `export ANTHROPIC_API_KEY='sua-chave'`
  - PowerShell: `$env:ANTHROPIC_API_KEY = 'sua-chave'`
- **Provedores de nuvem:** Amazon Bedrock, Google Cloud Agent Platform e Microsoft Foundry têm guias próprios na [documentação](https://code.claude.com/docs/en/quickstart).

Saia com `/exit` (ou `Ctrl+C` duas vezes).

## 🧰 Passo 4: Preparar o ambiente dos exemplos

Os labs usam dois projetos em `SampleApps/`. Prepare os dois agora para não perder tempo depois.

**Crie um branch só para os seus experimentos** (a partir da raiz do repositório):

```bash
git switch -c lab-pratica
```

**Python (`python-data-processor`):**

```bash
cd SampleApps/python-data-processor
python -m venv venv
pip install -r requirements.txt   # rode depois de ativar o venv
```

| Terminal | Ativar o venv |
|----------|---------------|
| macOS / Linux | `source venv/bin/activate` |
| Git Bash (Windows) | `source venv/Scripts/activate` |
| PowerShell | `venv\Scripts\Activate.ps1` |
| CMD | `venv\Scripts\activate.bat` |

Rode os testes e **anote quantos passam e quantos falham** (é o seu ponto de partida):

```bash
python -m pytest
```

> Use `python -m pytest` em vez de `pytest`: os testes importam `from src...` e, assim, a pasta do projeto entra no caminho de importação.

**Angular (`angular-task-app`)** - deixe instalando em **outro terminal** enquanto continua (será usado no Lab 6):

```bash
cd SampleApps/angular-task-app
npm install
```

## 💬 Passo 5: Sua primeira sessão

```bash
cd SampleApps/python-data-processor
claude
```

**Prompts para experimentar:**

```
Explique em até 5 linhas o que este projeto faz e como está organizado.
```

```
Liste as funções públicas de src/validators.py e diga quais casos de borda elas não tratam.
```

**O que observar:** o Claude mostra cada ferramenta que usa (`Read`, `Glob`, `Grep`...) e depois resume as conclusões. Você pode continuar com perguntas de acompanhamento, e ele lembra da conversa.

### O ciclo de trabalho

1. Você descreve a tarefa em linguagem natural
2. O Claude decide quais ferramentas usar
3. Ele executa (ler, buscar, editar, rodar comandos) e pede aprovação quando necessário
4. Ele relata o resultado, e você refina com novos pedidos

### Ferramentas principais

| Ferramenta | Para que serve |
|------------|----------------|
| `Read` | Ler arquivos |
| `Grep` / `Glob` | Buscar texto no código / encontrar arquivos por padrão |
| `Edit` | Alterar trechos de arquivos existentes |
| `Write` | Criar arquivos novos ou reescrever por completo |
| `Bash` | Executar comandos de shell (testes, git, build) |

## 💡 Como escrever bons prompts

| Menos eficaz | Mais eficaz |
|--------------|-------------|
| "Corrija o bug" | "Corrija o bug em `data_processor.py` em que arquivos vazios quebram o processamento" |
| "Adicione testes" | "Adicione testes para `validate_dataframe` cobrindo entrada válida, vazia e `None`" |
| "Faça um sistema completo" | Divida em etapas pequenas e revise cada uma |

**Confie, mas verifique:** revise o que o Claude altera e rode os testes antes de commitar.

## ⌨️ Comandos úteis para começar

| Comando | Função |
|---------|--------|
| `/help` | Lista os comandos disponíveis |
| `/status` | Versão, modelo, conta e conexão |
| `/doctor` | Checkup da configuração (propõe correções e pede confirmação) |
| `/exit` | Encerra a sessão |

## ❓ Perguntas rápidas

<details>
  <summary><strong>Meu código é enviado para servidores da Anthropic?</strong></summary>

  Sim. Seus prompts e os trechos de código que o Claude lê são enviados para processamento. Consulte a [política de privacidade](https://www.anthropic.com/privacy) e os termos aplicáveis à sua conta.
</details>

<details>
  <summary><strong>O Claude pode commitar ou alterar arquivos sem a minha aprovação?</strong></summary>

  Depende do **modo de permissão** da sessão. Você aprende a controlar isso no próximo lab.
</details>

## ✅ Checklist

- [ ] `claude --version` funciona e você está autenticado
- [ ] Branch `lab-pratica` criado
- [ ] Ambiente Python pronto e baseline de testes anotado
- [ ] `npm install` do Angular concluído (ou em andamento)
- [ ] Primeira sessão feita no `python-data-processor`

## 📚 Referências

- [Quickstart](https://code.claude.com/docs/en/quickstart)
- [Solução de problemas de instalação](https://code.claude.com/docs/en/troubleshoot-install)
- [Referência da CLI](https://code.claude.com/docs/en/cli-reference)

## 🔜 Próximo Lab

No [Lab 2 - Modos de Edição](Lab-2-Modos-de-Edicao.md) você vai controlar **o que o Claude pode fazer sozinho** e editar código com segurança.

---

#### Você concluiu o Lab 1! Clique em [Próximo Lab →](Lab-2-Modos-de-Edicao.md) para continuar.
