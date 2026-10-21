# Lab 5 - Integração com MCP

#### Duração: 30 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste lab, você será capaz de:
- Entender o que é o Model Context Protocol (MCP)
- Aprender como conectar ferramentas externas e fontes de dados
- Configurar servidores MCP
- Integrar com serviços comuns (sistemas de arquivos, bancos de dados, APIs)
- Construir integrações MCP personalizadas para seu fluxo de trabalho

## 🔌 O que é MCP?

**Model Context Protocol (MCP)** é um padrão aberto para conectar ferramentas de IA a fontes de dados e serviços externos. Pense nele como um adaptador universal que permite ao Claude Code se comunicar com:

- **Sistemas de arquivos e bancos de dados**
- **APIs e serviços web** (GitHub, Slack, Jira)
- **Armazenamento em nuvem** (Google Drive, S3)
- **Ferramentas de desenvolvimento** (Git, Docker)
- **Suas ferramentas personalizadas** e sistemas internos

### Por que o MCP é Importante

Sem MCP:
- Claude só conhece o que está no seu projeto local
- Não pode acessar documentação externa
- Não pode atualizar tickets ou enviar notificações
- Limitado ao sistema de arquivos local

Com MCP:
- Claude pode ler seus documentos do Confluence
- Atualizar tickets do Jira automaticamente
- Extrair dados de bancos de dados
- Enviar notificações no Slack
- Acessar qualquer sistema que você conectar!

## 🏗️ Como o MCP Funciona

```
Claude Code
    ↕️ (Protocolo MCP)
Servidor MCP (ex: Servidor MCP do GitHub)
    ↕️ (Chamadas de API)
Serviço Externo (ex: API do GitHub)
```

**Servidor MCP**: Um pequeno programa que:
- Expõe ferramentas que Claude pode usar
- Gerencia autenticação
- Traduz entre MCP e o serviço externo

**Você configura**: Quais servidores MCP executar
**Claude usa**: Ferramentas expostas por esses servidores

## 📋 Passo 1: Entendendo a Configuração do MCP

Os servidores MCP são configurados em um arquivo `.mcp.json` no seu projeto ou diretório do usuário.

### Estrutura Básica de Configuração

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

### Onde Colocar a Configuração

**Nível de projeto**: `.mcp.json` na raiz do projeto
- Disponível apenas naquele projeto
- Compartilhado com a equipe via git

**Nível de usuário**: `~/.claude/mcp.json`
- Disponível em todos os projetos
- Configuração pessoal

## 🚀 Passo 2: Seu Primeiro Servidor MCP (Sistema de Arquivos)

Vamos começar com um servidor MCP simples integrado: acesso ao sistema de arquivos.

### Criar Configuração MCP

Navegue até seu projeto:

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
```

Peça ao Claude para ajudar a configurá-lo:

**Prompt para experimentar:**
```
Me ajude a configurar o servidor MCP de sistema de arquivos para que você possa acessar arquivos fora deste diretório do projeto. Quero dar a você acesso de leitura à minha pasta Documentos.
```

Claude ajudará a criar ou atualizar `.mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/Documents"]
    }
  }
}
```

### Testar o Servidor MCP

**Reinicie o Claude Code** para carregar a configuração MCP:

```bash
exit
claude
```

**Prompt para experimentar:**
```
Liste os arquivos na minha pasta Documentos usando o servidor MCP de sistema de arquivos.
```

**O que observar:**
- Claude agora tem acesso além do projeto!
- Pode ler arquivos aos quais você concedeu acesso
- Mostra o uso da ferramenta MCP na saída

## 🗄️ Passo 3: Integração MCP com Banco de Dados

Vamos conectar a um banco de dados SQLite para que Claude possa consultar dados.

### Configurar Servidor MCP SQLite

**Prompt para experimentar:**
```
Me ajude a configurar o servidor MCP SQLite para conectar a um banco de dados em ./data/analytics.db. Crie a configuração e verifique se funciona.
```

Adição esperada ao `.mcp.json`:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "./data/analytics.db"]
    }
  }
}
```

### Usar Acesso ao Banco de Dados

Primeiro crie um banco de dados de exemplo:

**Prompt para experimentar:**
```
Crie um banco de dados SQLite em ./data/analytics.db com um esquema simples:
- Tabela: processed_data
- Colunas: id (chave primária), filename, processed_date, record_count, status

Insira alguns dados de exemplo.
```

Agora consulte via MCP:

```
Usando o servidor MCP SQLite, consulte a tabela processed_data e me mostre todos os registros dos últimos 7 dias.
```

**Insight chave**: Claude agora pode trabalhar diretamente com bancos de dados!

## 🐙 Passo 4: Integração MCP com GitHub

Conecte Claude ao GitHub para gerenciar issues e PRs.

### Configurar Servidor MCP GitHub

**Pré-requisitos**:
- Token de acesso pessoal do GitHub
- Ferramenta CLI `gh` instalada

**Prompt para experimentar:**
```
Me ajude a configurar o servidor MCP GitHub. Quero que você seja capaz de:
- Ler issues e PRs
- Criar e atualizar issues
- Comentar em PRs
- Verificar status de CI/CD

Me guie pelo processo de obter um token do GitHub e configurar o servidor MCP.
```

Exemplo de configuração:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Usar Integração com GitHub

**Prompt para experimentar:**
```
Usando o servidor MCP GitHub:
1. Liste todas as issues abertas neste repositório
2. Crie uma nova issue intitulada "Adicionar validação de entrada" com uma descrição das melhorias de validação necessárias
3. Me mostre o status de CI/CD do PR mais recente
```

**O que Claude pode fazer agora:**
- Criar issues automaticamente para bugs encontrados
- Atualizar issues com progresso
- Revisar status de PR
- Muito mais!

## 💬 Passo 5: Integração MCP com Slack

Conecte ao Slack para notificações e atualizações.

### Configurar Servidor MCP Slack

**Pré-requisitos**:
- Workspace do Slack
- Token de Bot do Slack (começa com `xoxb-`)

**Prompt para experimentar:**
```
Me ajude a configurar a integração MCP com Slack. Quero que você seja capaz de:
- Enviar mensagens para canais específicos
- Ler mensagens recentes
- Atualizar conversas em threads

Me guie pelo processo de criar um app do Slack e obter o token do bot.
```

Configuração:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

### Usar Integração com Slack

**Prompt para experimentar:**
```
Usando o servidor MCP Slack:
1. Envie uma mensagem para o canal #development: "Revisão de código concluída. Encontrados 3 problemas, todos resolvidos."
2. Leia as últimas 5 mensagens do #development
```

**Cenários do mundo real:**
```
Após completar a suíte de testes, envie um resumo para o canal #ci-cd incluindo contagens de aprovação/falha e porcentagem de cobertura.
```

```
Se você encontrar problemas críticos de segurança, poste imediatamente em #security-alerts com detalhes.
```

## 🌐 Passo 6: Integração MCP com Busca na Web

Habilite Claude a buscar na web por informações atuais.

### Configurar Servidor MCP de Busca na Web

**Prompt para experimentar:**
```
Me ajude a configurar o servidor MCP Brave Search para que você possa buscar na web por:
- Documentação de APIs
- Soluções para mensagens de erro
- Exemplos de uso de bibliotecas
- Melhores práticas atuais
```

Configuração:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-brave-api-key"
      }
    }
  }
}
```

### Usar Busca na Web

**Prompt para experimentar:**
```
Usando busca na web, encontre as melhores práticas mais recentes para tratamento de erros com async/await em Python. Então aplique esses padrões ao nosso processador de dados.
```

**Combinação poderosa:**
```
Busque soluções para este erro: [colar erro]
Então corrija o código com base no que você encontrar.
```

## 🎭 Passo 7: Playwright MCP para Automação de Navegador

Teste e valide aplicações web usando automação real de navegador.

### O que é Playwright MCP?

**Playwright MCP** dá ao Claude a habilidade de controlar navegadores e testar aplicações web. Isso é incrivelmente poderoso para:

- **Testar implementações de UI** em navegadores reais
- **Validar interações do usuário** (cliques, formulários, navegação)
- **Tirar screenshots** para documentação ou relatórios de bugs
- **Executar testes end-to-end** automaticamente
- **Verificar design responsivo** em diferentes viewports
- **Medir desempenho** (tempos de carregamento, Core Web Vitals)
- **Auditorias de acessibilidade** para conformidade WCAG

### Configurar Servidor MCP Playwright

Primeiro, instale o Playwright:

```bash
npm install -D @playwright/test
npx playwright install chromium
```

**Prompt para experimentar:**
```
Me ajude a configurar o servidor MCP Playwright para testes de automação de navegador.
Quero ser capaz de testar aplicações web em navegadores reais.
```

Configuração em `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

**Reinicie Claude** para carregar a configuração:

```bash
exit
claude
```

### Exemplo 1: Testar o App Angular de Tarefas

Vamos testar a aplicação Angular do lab!

Primeiro, inicie o app (em um terminal separado):

```bash
cd hol-claude-code-lab/SampleApps/angular-task-app
npm install
npm start
```

**Prompt para experimentar:**
```
Usando Playwright MCP, teste o app Angular de tarefas em http://localhost:4200:

1. Navegue até a página inicial
2. Verifique se a página carrega com sucesso
3. Verifique o título da página
4. Tire um screenshot
5. Relate os resultados
```

**O que Claude fará:**
- Iniciar um navegador Chromium
- Navegar até seu app
- Verificar se carrega sem erros
- Capturar um screenshot
- Relatar sucesso/falha com detalhes

### Exemplo 2: Testar Fluxo de Criação de Tarefa

**Prompt para experimentar:**
```
Usando Playwright MCP, valide a funcionalidade de criação de tarefa:

1. Navegue até http://localhost:4200
2. Clique no botão "Nova Tarefa" ou "Adicionar Tarefa"
3. Preencha o formulário de tarefa:
   - Nome da Tarefa: "Tarefa de Teste Automatizada"
   - Descrição: "Criada pela automação Playwright"
4. Envie o formulário
5. Verifique se a nova tarefa aparece na lista
6. Tire screenshots antes e depois
7. Relate os resultados
```

**O que acontece:**
- Navegador abre e navega até o app
- Encontra e clica no botão "Nova Tarefa"
- Preenche campos do formulário automaticamente
- Envia o formulário
- Valida que a tarefa aparece
- Captura prova visual
- Relata sucesso ou quaisquer problemas encontrados

### Exemplo 3: Teste de Design Responsivo

**Prompt para experimentar:**
```
Usando Playwright MCP, teste design responsivo:

1. Teste o app Angular nestes tamanhos de viewport:
   - Mobile: 375x667 (iPhone)
   - Tablet: 768x1024 (iPad)  
   - Desktop: 1920x1080
2. Para cada tamanho:
   - Tire um screenshot
   - Verifique se não há rolagem horizontal
   - Verifique se a navegação está acessível
3. Gere um relatório de design responsivo
```

### Exemplo 4: Teste de Desempenho

**Prompt para experimentar:**
```
Usando Playwright MCP, meça métricas de desempenho para o app de tarefas:

1. Navegue até http://localhost:4200
2. Meça:
   - First Contentful Paint (FCP)
   - Tempo de carregamento completo
   - Número de recursos carregados
3. Compare com limiares de Web Vitals
4. Relate status de desempenho (Bom/Precisa Melhorar/Ruim)
```

**Limiares de desempenho:**
- **FCP Bom:** < 1.8s
- **FCP Precisa Melhorar:** 1.8s - 3.0s
- **FCP Ruim:** > 3.0s

### Exemplo 5: Teste de Validação de Formulário

**Prompt para experimentar:**
```
Usando Playwright MCP, teste validação de formulário:

1. Tente enviar um formulário de tarefa vazio
2. Verifique se mensagens de erro aparecem
3. Preencha apenas o campo de nome
4. Verifique se a validação parcial funciona
5. Preencha todos os campos obrigatórios corretamente
6. Verifique envio bem-sucedido
7. Relate todas as regras de validação testadas
```

### Avançado: Teste de Regressão Visual

**Prompt para experimentar:**
```
Usando Playwright MCP, configure teste de regressão visual:

1. Navegue até o dashboard
2. Aguarde todo o conteúdo carregar completamente
3. Tire um screenshot base
4. Salve como "dashboard-baseline.png"
5. No futuro, compare novos screenshots contra esta baseline
6. Relate quaisquer diferenças visuais
```

### Cenários do Mundo Real

**Cenário 1: Investigação de Bug**
```
Há um bug onde tarefas não são enviadas no mobile. Usando Playwright MCP:

1. Configure viewport para tamanho mobile (375x667)
2. Tente criar uma nova tarefa
3. Tire screenshots em cada etapa
4. Verifique o console para erros
5. Inspecione o estado do botão de envio
6. Relate o que está impedindo o envio
```

**Cenário 2: Validação Pré-Deploy**
```
Antes de fazer deploy, valide o app Angular com Playwright MCP:

1. Teste todos os fluxos principais de usuário (operações CRUD de tarefas)
2. Verifique design responsivo em 3 tamanhos de viewport
3. Meça métricas de desempenho
4. Verifique se não há erros no console
5. Tire screenshots para documentação
6. Gere um relatório de go/no-go para deploy
```

**Cenário 3: Teste Cross-Browser**
```
Usando Playwright MCP, teste o app em múltiplos navegadores:

1. Teste no Chromium
2. Teste no Firefox
3. Teste no WebKit (Safari)
4. Para cada navegador, execute os fluxos principais de usuário
5. Relate quaisquer problemas específicos de navegador
```

### Melhores Práticas

**1. Use seletores estáveis:**
```javascript
// ❌ Frágil
await page.click('div > div > button:nth-child(3)');

// ✅ Robusto
await page.click('button[aria-label="Create New Task"]');
await page.click('text=Submit');
```

**2. Aguarde corretamente:**
```javascript
// ❌ Timeout arbitrário
await page.waitForTimeout(3000);

// ✅ Aguarde condições específicas
await page.waitForSelector('.task-list', { state: 'visible' });
await page.waitForLoadState('networkidle');
```

**3. Sempre tire screenshots em falhas:**
```javascript
try {
  await page.click('button:has-text("Submit")');
} catch (error) {
  await page.screenshot({ path: 'error-state.png' });
  throw error;
}
```

### Por que Playwright MCP é Poderoso

| Sem Playwright MCP | Com Playwright MCP |
|------------------------|---------------------|
| Escrever testes manualmente | Claude escreve e executa testes |
| Não consegue ver problemas visuais | Testa em navegadores reais |
| Fluxo de teste separado | Integrado no desenvolvimento |
| Comparação manual de screenshots | Teste visual automatizado |
| Debug apenas do código | Vê o que usuários realmente veem |

**Insight chave:** Playwright MCP transforma Claude em um engenheiro de QA que pode testar seu app em navegadores reais, apenas pedindo!

## 🎯 Passo 8: Múltiplos Servidores MCP Juntos

O verdadeiro poder vem de combinar servidores MCP.

### Exemplo de Fluxo de Trabalho Integrado

**Prompt para experimentar:**
```
Execute este fluxo de trabalho completo usando MCP:

1. Consulte o banco de dados SQLite para jobs de processamento falhados
2. Para cada falha:
   a. Busque na web soluções para o erro
   b. Aplique correções ao código
   c. Crie uma issue no GitHub documentando a correção
   d. Poste um resumo no canal #development do Slack

Forneça um resumo quando concluído.
```

**O que acontece:**
- SQLite MCP: Consulta banco de dados
- Web Search MCP: Encontra soluções
- Operações de arquivo: Corrige código
- GitHub MCP: Cria issues
- Slack MCP: Envia notificações

**É aqui que o MCP brilha!** 🌟

### Fluxo de Trabalho Multi-MCP Avançado com Playwright

**Prompt para experimentar:**
```
Fluxo de trabalho de validação end-to-end completo:

1. Usando SQLite MCP: Consulte banco de dados para tarefas recentes
2. Usando Playwright MCP: 
   - Navegue até o app de tarefas
   - Verifique se essas tarefas são exibidas corretamente na UI
   - Teste criar uma nova tarefa
3. Usando SQLite MCP: Verifique se a nova tarefa foi salva no banco de dados
4. Usando Playwright MCP: Tire screenshots do estado da UI
5. Usando GitHub MCP: Crie uma issue com resultados de teste
6. Usando Slack MCP: Poste resumo no canal #qa

Relate os resultados completos do fluxo de trabalho.
```

**Outro exemplo poderoso:**
```
Validação de deploy automatizada:

1. Usando Playwright MCP: Execute suíte completa de testes de UI
2. Se todos os testes passarem:
   - Usando GitHub MCP: Crie um PR com screenshots de teste
   - Usando Slack MCP: Notifique canal #releases
3. Se algum teste falhar:
   - Usando Playwright MCP: Capture screenshots detalhados de falha
   - Usando GitHub MCP: Crie uma issue de bug com screenshots
   - Usando Slack MCP: Alerte #dev-team com detalhes de falha
```

## 🛠️ Passo 9: Servidor MCP Personalizado

Construa seu próprio servidor MCP para integrações personalizadas.

### Servidor MCP Personalizado Simples

Vamos criar um servidor MCP personalizado simples para uma API interna mock.

**Prompt para experimentar:**
```
Me ajude a criar um servidor MCP personalizado que expõe estas ferramentas:
1. get_team_members() - Retorna lista de membros da equipe
2. get_project_status(project_name) - Retorna status do projeto
3. log_work_item(description, hours) - Registra trabalho

Crie o servidor em Node.js e configure Claude Code para usá-lo.
```

### Template de Servidor Personalizado

Claude ajudará a criar algo como:

```javascript
// custom-mcp-server.js
const { Server } = require("@modelcontextprotocol/sdk/server");

const server = new Server({
  name: "custom-internal-api",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_team_members",
      description: "Get list of team members",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    // ... mais ferramentas
  ]
}));

// Implementações de handlers...
```

### Testar Seu Servidor Personalizado

**Prompt para experimentar:**
```
Usando meu servidor MCP personalizado:
1. Obtenha a lista de membros da equipe
2. Verifique status do projeto 'data-processor'
3. Registre 2 horas de trabalho: "Completou lab de integração MCP"
```

## 💡 Melhores Práticas para MCP

### 1. Segurança em Primeiro Lugar

```
# ❌ Não comite segredos
{
  "env": {
    "API_KEY": "actual-key-here"
  }
}

# ✅ Use variáveis de ambiente
{
  "env": {
    "API_KEY": "${GITHUB_TOKEN}"
  }
}
```

Configure no seu shell:
```bash
export GITHUB_TOKEN="your-token"
```

### 2. Escopo Apropriado

Dê permissões mínimas necessárias:
- Somente leitura quando possível
- Apenas canais/repos específicos
- Evite privilégios de admin

### 3. Teste Incrementalmente

Comece com operações simples:
1. Operações de leitura/consulta
2. Operações de escrita seguras
3. Fluxos de trabalho complexos

### 4. Tratamento de Erros

```
Se o servidor MCP falhar, me mostre o erro e sugira passos para solucionar problemas.
```

### 5. Documente Integrações

```
Crie um README.md documentando todas as integrações MCP, tokens necessários e passos de configuração para novos membros da equipe.
```

## 🎯 Exercício: Construa Sua Pilha de Integração

Complete este exercício para solidificar seu conhecimento de MCP!

**Tarefa**: Configure um fluxo de trabalho de desenvolvimento completo com MCP.

**Sugestão de prompt:**
```
Configure esta pilha completa de integração MCP:

1. Filesystem MCP: Acesso a ~/projects e ~/documents
2. SQLite MCP: Conexão com banco de dados de analytics
3. Playwright MCP: Automação de navegador para testes
4. GitHub MCP: Gerenciamento de repositório
5. Slack MCP (se disponível): Notificações da equipe

Então demonstre:
- Lendo requisitos do projeto de ~/documents/requirements.txt
- Implementando uma nova funcionalidade no app Angular de tarefas
- Usando Playwright MCP para testar a funcionalidade em um navegador
- Registrando resultados de teste no banco de dados de analytics
- Se testes passarem, criar um PR no GitHub com screenshots
- Postar um resumo no Slack com status de teste

Me guie pelo processo inteiro.
```

**Exercício alternativo - Automação de QA:**
```
Construa um fluxo de trabalho completo de automação de QA:

1. Configure Playwright MCP para testes de navegador
2. Configure SQLite MCP para armazenamento de resultados de teste
3. Crie um fluxo de trabalho que:
   - Testa o app Angular de tarefas (todas as funcionalidades principais)
   - Tira screenshots de cada etapa de teste
   - Registra resultados aprovado/reprovado no banco de dados
   - Se falhas ocorrerem, salva informações detalhadas de erro
   - Gera um relatório de teste com evidência visual

Então execute o fluxo de trabalho e me mostre os resultados.
```

## 🔍 Solução de Problemas MCP

### Problemas Comuns

**Servidor MCP Não Inicia**

```
Me ajude a debugar por que o servidor MCP não está iniciando. Verifique:
- O comando está correto?
- As dependências estão instaladas?
- As variáveis de ambiente estão configuradas?
- Verifique logs do Claude Code
```

**Falhas de Autenticação**

```
O servidor MCP está falhando na autenticação. Me ajude a:
- Verificar o token/chave de API
- Verificar permissões do token
- Testar o token fora do Claude
```

**Ferramenta Não Disponível**

```
Liste todas as ferramentas MCP disponíveis. Se a ferramenta que eu preciso não estiver lá, me ajude a solucionar problemas da configuração do servidor.
```

## 🎓 O que Você Aprendeu

Ao completar este lab, você agora entende:

✅ **Fundamentos do MCP** - O que é e por que é importante

✅ **Configuração do MCP** - Como configurar servidores

✅ **Integrações comuns** - Sistema de arquivos, bancos de dados, GitHub, Slack, busca na web

✅ **Automação de navegador** - Testando apps web com Playwright MCP

✅ **Fluxos de trabalho combinados** - Usando múltiplos MCPs juntos

✅ **Servidores personalizados** - Construindo suas próprias integrações

✅ **Melhores práticas** - Segurança, escopo, testes

## 🚀 Principais Conclusões

1. **MCP é um adaptador universal** - Conecte Claude a qualquer coisa

2. **Comece simples** - Acesso a arquivo e banco de dados primeiro

3. **Combine para poder** - Múltiplos MCPs criam fluxos de trabalho

4. **Segurança importa** - Nunca comite tokens

5. **Personalização é possível** - Construa suas próprias integrações

6. **Documentação ajuda** - Documente para sua equipe

## 📚 Recursos Adicionais

- **Documentação MCP**: [MCP Guide](https://code.claude.com/docs/en/mcp)
- **MCP Quickstart**: [Getting Started](https://code.claude.com/docs/en/mcp-quickstart)
- **Servidores Disponíveis**: [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- **Construa o Seu**: [MCP SDK](https://github.com/modelcontextprotocol/sdk)

## 🔜 Próximos Passos

No [Lab 6 - Personalizando Claude Code](Lab-6-Customization.md), você aprenderá:
- Arquivos CLAUDE.md para instruções de projeto
- Criando habilidades personalizadas
- Configurando hooks de automação
- Sistema de memória para aprendizado persistente

---

#### Você completou com sucesso o Lab 5! Clique em [Próximo Lab →](Lab-6-Customization.md) para continuar.
