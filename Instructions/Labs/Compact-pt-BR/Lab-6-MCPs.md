# Lab 6 - MCPs (Model Context Protocol)

#### Duração: 15 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Explicar o que é MCP e quando conectar um servidor
- Adicionar servidores remotos (HTTP) e locais (stdio) com `claude mcp add`
- Entender os escopos de configuração e o arquivo `.mcp.json`
- Usar o Playwright MCP para validar a interface de uma aplicação em um navegador real
- Aplicar práticas de segurança ao conectar servidores

## 🔌 O que é MCP?

O **Model Context Protocol** é um padrão aberto para conectar o Claude a ferramentas e dados externos: rastreadores de issues, bancos de dados, documentação, navegadores. Conecte um servidor quando perceber que está **copiando dados de outra ferramenta para o chat**.

```
Claude Code  ⇄  Servidor MCP  ⇄  Serviço externo (GitHub, banco, navegador...)
```

| Transporte | Onde roda | Exemplo |
|------------|-----------|---------|
| **HTTP** (recomendado para serviços na nuvem) | Remoto, por URL | `https://mcp.sentry.dev/mcp` |
| **stdio** | Processo local na sua máquina | `npx -y @playwright/mcp@latest` |

> O transporte SSE está **obsoleto**; prefira HTTP quando disponível.

## 🧪 Mão na massa

### Passo 1 - Servidor remoto sem login (HTTP)

Rode no **terminal** (não dentro da sessão):

```bash
claude mcp add --transport http claude-code-docs https://code.claude.com/docs/mcp
claude mcp list
```

Em `claude mcp list`, procure `✔ Connected` (em consoles antigos do Windows, `√`). Depois inicie a sessão e use o servidor:

```bash
cd SampleApps/python-data-processor
claude
```

```
Use o servidor claude-code-docs para explicar o que a variável MCP_TIMEOUT faz.
```

A chamada aparece rotulada com o **nome do servidor**: é assim que você confirma que a resposta veio do MCP.

### Passo 2 - Servidor local (stdio): Playwright

O Playwright MCP dá ao Claude um navegador que ele consegue navegar, clicar e ler. Não exige conta, mas precisa do Node.js 18+ e usa o Chrome instalado.

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
claude mcp list
```

- Tudo depois de `--` é o comando que inicia o servidor (o `-y` do `npx` instala sem perguntar).
- Na primeira vez, `✘ Failed to connect` pode aparecer enquanto o `npx` baixa o pacote: aguarde e rode `claude mcp list` de novo.
- Para outro navegador, acrescente `--browser firefox` depois de `@playwright/mcp@latest`.

Em **outro terminal**, suba a aplicação Angular (as dependências foram instaladas no Lab 1):

```bash
cd SampleApps/angular-task-app
npm start
```

Na sessão do Claude (reinicie-a para carregar o novo servidor):

```
Usando o playwright, abra http://localhost:4200, descreva o que aparece na tela, tire um screenshot e informe se há erros no console do navegador.
```

Uma janela do navegador abre e você acompanha a navegação. Como a API (`http://localhost:5000/api`) não está no ar, o esperado é ver o estado de erro **"Failed to load tasks"**, e o Claude deve relatar isso. Agora feche o ciclo código ↔ navegador:

```
Leia task-list.component.ts e task-list.component.html. Melhore o estado de erro: mensagem amigável em português e um botão "Tentar novamente" que chama loadTasks(). Implemente e depois valide no navegador com o playwright.
```

> Se `npm start` falhar, cole a saída do erro na sessão e peça o diagnóstico.

### Passo 3 - Escopos e `.mcp.json`

`claude mcp add` grava a configuração em um de três escopos:

| Escopo | Flag | Vale para | Fica em |
|--------|------|-----------|---------|
| **local** (padrão) | `--scope local` | Só você, só este projeto | `~/.claude.json` |
| **project** | `--scope project` | Todo o time, via git | `.mcp.json` na raiz do projeto |
| **user** | `--scope user` | Só você, todos os projetos | `~/.claude.json` |

Para compartilhar com o time, regrave o servidor no escopo `project` (na pasta onde você inicia o `claude`):

```bash
claude mcp remove playwright --scope local
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
claude mcp get playwright
```

Isso cria o `.mcp.json`, que você versiona. Quem clonar o repositório vê um **prompt de aprovação** na primeira vez, para que um repositório de terceiros não inicie processos sem o seu consentimento. O arquivo tem este formato (e aceita `${VAR}` para segredos):

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": { "Authorization": "Bearer ${GITHUB_MCP_PAT}" }
    }
  }
}
```

> Reinicie a sessão depois de editar o `.mcp.json`. Se recusou um servidor por engano: `claude mcp reset-project-choices`.
> O servidor `github` do exemplo é apenas ilustrativo: ele só conecta se `GITHUB_MCP_PAT` estiver definida no seu ambiente.

### Passo 4 (opcional) - Servidor com token ou login

- **Token estático (ex.: GitHub):** gere um *fine-grained personal access token* no GitHub, com o **mínimo de permissões**, e adicione:
  ```bash
  claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer SEU_TOKEN"
  ```
  Depois: `Liste os pull requests abertos deste repositório.`
- **OAuth (ex.: Sentry):** `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`, depois `/mcp` → selecione o servidor → **Authenticate** e conclua o login no navegador.

## 🛠️ Gerenciar e depurar

```bash
claude mcp list              # servidores e status
claude mcp get <nome>        # detalhes, escopo e motivo de falha
claude mcp remove <nome>     # remove (use --scope se houver mais de um)
```

Dentro da sessão, `/mcp` mostra o status, permite reconectar e autenticar.

| Status | Significado |
|--------|-------------|
| `✔ Connected` | Pronto para uso |
| `! Needs authentication` | Faça login via `/mcp` ou informe o token com `--header` |
| `✘ Failed to connect` | Rode `claude mcp get <nome>`; para servidores stdio, execute o comando manualmente no terminal e veja o erro |

- **Timeout na primeira execução?** `MCP_TIMEOUT=60000 claude` (PowerShell: `$env:MCP_TIMEOUT = "60000"; claude`).
- **Mais detalhes:** `claude --debug=mcp`.

## 🔒 Segurança e custo

1. **Conecte só servidores em que confia.** Conteúdo externo pode conter instruções maliciosas (*prompt injection*).
2. **Menor privilégio:** tokens somente leitura, escopo restrito, usuário de banco read-only.
3. **Nunca grave segredos** no `.mcp.json`: use `${VARIAVEL}` e defina-a no seu ambiente (use um nome próprio, como `GITHUB_MCP_PAT`; variáveis de credenciais conhecidas são ignoradas na expansão para servidores remotos).
4. **Revise o `.mcp.json`** de repositórios de terceiros antes de aprovar.
5. **Cada servidor ocupa contexto** (nomes de ferramentas e instruções). O Claude Code adia a carga das ferramentas até serem necessárias, mas remova o que não usa. Confira em `/context`.

## 🎯 Exercício

Peça um **checklist pré-publicação** da aplicação Angular com o Playwright:

```
Usando o playwright, valide a página em http://localhost:4200 em três tamanhos: 375x667, 768x1024 e 1920x1080. Para cada um, tire um screenshot e informe se há rolagem horizontal ou elementos cortados. Termine com um resumo go/no-go.
```

## ✅ Pontos-chave

- MCP conecta o Claude a sistemas externos, em vez de você copiar e colar dados.
- `claude mcp add --transport http <nome> <url>` para remotos; `claude mcp add <nome> -- <comando>` para locais.
- Escopos: **local** (padrão), **project** (`.mcp.json`, compartilhado) e **user**.
- Segurança primeiro: servidores confiáveis, permissões mínimas, segredos fora do repositório.

## 📚 Referências

- [Guia rápido de MCP](https://code.claude.com/docs/en/mcp-quickstart)
- [Referência completa de MCP](https://code.claude.com/docs/en/mcp)
- [Servidor Playwright MCP](https://github.com/microsoft/playwright-mcp)

## 🔜 Próximo Lab

No [Lab 7 - Paralelismo](Lab-7-Paralelismo.md) você vai rodar várias sessões ao mesmo tempo, sem que uma atrapalhe a outra.

---

#### Você concluiu o Lab 6! Clique em [Próximo Lab →](Lab-7-Paralelismo.md) para continuar.
