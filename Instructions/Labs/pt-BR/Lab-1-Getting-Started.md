# Lab 1 - Introdução ao Claude Code

#### Duração: 15 minutos

## 🎯 Objetivos de Aprendizagem

Ao final deste laboratório, você será capaz de:
- Entender o que é o Claude Code e como ele difere de outros assistentes de IA
- Instalar com sucesso o Claude Code no seu sistema
- Autenticar e iniciar sua primeira sessão
- Executar comandos básicos e interagir com o Claude
- Compreender o fluxo de trabalho fundamental ao trabalhar com o Claude Code

## 🚀 O que é o Claude Code?

O Claude Code é um **assistente de codificação de IA agêntico** que age como um parceiro inteligente de desenvolvimento. Diferente de ferramentas simples de autocompletar, o Claude Code:

- **Compreende contexto** - Lê e analisa toda a sua base de código
- **Age** - Edita arquivos, executa comandos e valida mudanças
- **Usa ferramentas** - Aproveita Read, Write, Edit, Grep, Glob, Bash e muito mais
- **Trabalha de forma autônoma** - Pode dividir tarefas complexas e executá-las
- **Coordena trabalho** - Gera múltiplos agentes para execução paralela

Pense nele como ter um desenvolvedor sênior que pode:
- Navegar por bases de código desconhecidas instantaneamente
- Escrever e refatorar código em múltiplos arquivos
- Executar testes e corrigir falhas
- Criar commits e pull requests
- Conectar-se a ferramentas e fontes de dados externas

## 🔍 Passo 1: Verificar Pré-requisitos

Antes de instalar o Claude Code, vamos verificar se você tem os pré-requisitos necessários.

### Verifique Seu Sistema

1. **Sistema Operacional**: Certifique-se de estar executando um SO suportado
   - macOS 13.0 ou posterior
   - Windows 10 1809+ ou Windows Server 2019+
   - Linux (Ubuntu 20.04+, Debian 10+, Alpine 3.19+)

2. **Hardware**: 4 GB+ de RAM, processador x64 ou ARM64

3. **Conexão com a Internet**: Necessária para instalação e uso

### Verifique o Software Necessário

Abra um terminal (Prompt de Comando/PowerShell no Windows, Terminal no macOS/Linux) e verifique se estes estão instalados:

**Python 3.9+:**
```bash
python --version
# ou
python3 --version
```

**Node.js 18+:**
```bash
node --version
```

**Git:**
```bash
git --version
```

<details>
  <summary>💡 Instalando Pré-requisitos Ausentes</summary>
  
  Se algum destes estiver faltando, instale-os:
  - **Python**: [python.org/downloads](https://www.python.org/downloads/)
  - **Node.js**: [nodejs.org](https://nodejs.org/)
  - **Git**: [git-scm.com/downloads](https://git-scm.com/downloads)
  
  Após a instalação, feche e reabra seu terminal, então verifique novamente.
</details>

## 📥 Passo 2: Instalar o Claude Code

Agora vamos instalar o Claude Code. Escolha o método apropriado para seu sistema.

### Instruções de Instalação

<details open>
  <summary><strong>macOS ou Linux</strong></summary>
  
  Abra seu terminal e execute:
  
  ```bash
  curl -fsSL https://claude.ai/install.sh | bash
  ```
  
  O instalador irá baixar e configurar o Claude Code automaticamente. Isso pode levar um minuto sem progresso visível—isso é normal!
  
</details>

<details>
  <summary><strong>Windows PowerShell</strong></summary>
  
  Abra o PowerShell (não o CMD) e execute:
  
  ```powershell
  irm https://claude.ai/install.ps1 | iex
  ```
  
  **Nota**: Seu prompt do PowerShell mostra `PS C:\` no início.
  
</details>

<details>
  <summary><strong>Windows CMD</strong></summary>
  
  Abra o Prompt de Comando (não o PowerShell) e execute:
  
  ```batch
  curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
  ```
  
  **Nota**: Seu prompt do CMD mostra `C:\` sem o `PS` no início.
  
</details>

<details>
  <summary><strong>Alternativa: Homebrew (macOS)</strong></summary>
  
  Se você preferir o Homebrew:
  
  ```bash
  brew install --cask claude-code
  ```
  
  **Nota**: Instalações do Homebrew não atualizam automaticamente. Você precisará executar manualmente:
  ```bash
  brew upgrade claude-code
  ```
  
</details>

<details>
  <summary><strong>Alternativa: WinGet (Windows)</strong></summary>
  
  Se você preferir o WinGet:
  
  ```powershell
  winget install Anthropic.ClaudeCode
  ```
  
  **Nota**: Instalações do WinGet não atualizam automaticamente. Você precisará executar manualmente:
  ```powershell
  winget upgrade Anthropic.ClaudeCode
  ```
  
</details>

### Verificar Instalação

Após o instalador terminar, **abra uma nova janela do terminal** e verifique a instalação:

```bash
claude --version
```

**Resultado esperado**: Você deve ver um número de versão como `2.1.211 (Claude Code)`

<details>
  <summary>🚨 Solução de Problemas: Comando Não Encontrado</summary>
  
  Se você ver `command not found` ou `is not recognized`:
  
  1. **Feche e reabra seu terminal** - O PATH pode não ter sido atualizado
  2. **Verifique o PATH** - Execute `claude doctor` para informações de diagnóstico
  3. **Atualização manual do PATH** (avançado):
     - No macOS/Linux: Adicione `~/.local/bin` ao seu PATH
     - No Windows: Adicione `%USERPROFILE%\.local\bin` ao seu PATH
  4. **Veja a solução de problemas detalhada**: [Troubleshoot Installation](https://code.claude.com/docs/en/troubleshoot-install)
  
</details>

## 🔐 Passo 3: Autenticar

O Claude Code requer autenticação para usar as capacidades de IA do Claude.

### Escolha Seu Método de Autenticação

<details open>
  <summary><strong>Opção 1: Assinatura Claude (claude.ai)</strong></summary>
  
  Se você tem uma assinatura Claude Pro, Team ou Enterprise:
  
  1. Inicie o Claude Code em qualquer diretório:
     ```bash
     claude
     ```
  
  2. O Claude irá solicitar que você faça login e abrirá seu navegador
  
  3. Siga as instruções do navegador para autenticar
  
  4. Retorne ao seu terminal—você deve estar agora em uma sessão interativa do Claude!
  
</details>

<details>
  <summary><strong>Opção 2: Chave de API Anthropic (Console)</strong></summary>
  
  Se você tem uma chave de API do [Anthropic Console](https://console.anthropic.com/):
  
  1. Defina sua chave de API como uma variável de ambiente:
     
     **macOS/Linux:**
     ```bash
     export ANTHROPIC_API_KEY='sua-chave-api-aqui'
     ```
     
     **Windows PowerShell:**
     ```powershell
     $env:ANTHROPIC_API_KEY = 'sua-chave-api-aqui'
     ```
  
  2. Inicie o Claude Code:
     ```bash
     claude
     ```
  
  3. O Claude detectará sua chave de API e perguntará se você quer usá-la—aprove quando solicitado
  
  **Nota**: Para tornar a chave de API persistente, adicione-a ao seu arquivo de configuração do shell (`.bashrc`, `.zshrc` ou perfil do PowerShell).
  
</details>

<details>
  <summary><strong>Opção 3: Provedores Terceiros</strong></summary>
  
  O Claude Code também suporta:
  - [Amazon Bedrock](https://code.claude.com/docs/en/amazon-bedrock)
  - [Google Cloud Agent Platform](https://code.claude.com/docs/en/google-vertex-ai)
  - [Microsoft Foundry](https://code.claude.com/docs/en/microsoft-foundry)
  
  Siga os respectivos guias de configuração na documentação.
  
</details>

## 💬 Passo 4: Sua Primeira Sessão

Agora que o Claude Code está instalado e autenticado, vamos iniciar sua primeira sessão!

### Navegue até o Projeto de Exemplo

1. Abra um terminal e navegue até a aplicação Python de exemplo:
   ```bash
   cd hol-claude-code-lab/SampleApps/python-data-processor
   ```

2. Inicie o Claude Code:
   ```bash
   claude
   ```

Você deve ver o Claude Code iniciar e apresentar um prompt onde você pode digitar mensagens!

### Experimente Estes Comandos

Vamos testar algumas interações básicas:

**1. Pergunte ao Claude sobre o projeto:**
```
O que este projeto faz? Me dê uma visão geral de alto nível.
```

Aguarde o Claude analisar o código e responder. Você verá que ele usa ferramentas como `Read` e `Glob` para explorar os arquivos.

**2. Peça uma análise de arquivo específico:**
```
Leia o arquivo Python principal e explique o que ele faz.
```

**3. Solicite uma verificação de qualidade de código:**
```
Existem bugs óbvios ou melhorias que você sugeriria?
```

### Entendendo as Respostas do Claude

Enquanto o Claude trabalha, você verá:
- **Uso de ferramentas**: O Claude mostra transparentemente quais ferramentas está usando (Read, Grep, Bash, etc.)
- **Processo de raciocínio**: Algumas respostas mostram o raciocínio antes de tomar uma ação
- **Resultados**: Resumos claros das descobertas e ações tomadas

### Sair da Sessão

Quando estiver pronto para encerrar a sessão:
- Digite `exit` ou pressione `Ctrl+C` (ou `Cmd+C` no Mac)

## 🧪 Passo 5: Entendendo o Fluxo de Trabalho

Vamos detalhar o que acabou de acontecer e entender o fluxo de trabalho do Claude Code.

### O Ciclo de Solicitação-Resposta

1. **Você fornece um prompt** - Linguagem natural descrevendo o que você quer
2. **Claude analisa a solicitação** - Determina quais ferramentas e ações são necessárias
3. **Claude executa ferramentas** - Lê arquivos, executa comandos, faz edições
4. **Claude reporta resultados** - Resume as descobertas e ações tomadas
5. **Você pode fazer perguntas adicionais** - Peça esclarecimentos ou solicite mudanças

### Conceitos-Chave

**Ferramentas**: O Claude tem acesso a ferramentas poderosas:
- `Read` - Ler conteúdo de arquivos
- `Write` - Criar novos arquivos
- `Edit` - Fazer edições precisas em arquivos existentes
- `Grep` - Buscar padrões em arquivos
- `Glob` - Encontrar arquivos correspondentes a padrões
- `Bash` - Executar comandos do shell
- E muito mais!

**Contexto**: O Claude mantém o contexto da conversa, então você pode:
- Referir-se a mensagens anteriores
- Construir sobre o trabalho anterior
- Fazer perguntas de acompanhamento

**Permissões**: O Claude Code opera em modos de permissão:
- Algumas ferramentas requerem aprovação antes da execução
- Você pode configurar permissões nas configurações

## 🎯 Exercício: Explore por Conta Própria

Agora é sua vez! Inicie uma nova sessão do Claude Code e tente estes exercícios:

### Exercício 1: Exploração de Código
```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

**Pergunte ao Claude:**
1. "Liste todos os arquivos Python neste projeto"
2. "Quais dependências externas este projeto usa?"
3. "Mostre-me a estrutura da função principal de processamento de dados"

### Exercício 2: Tarefa Rápida
**Pergunte ao Claude:**
```
Crie um arquivo README.md simples que documente como executar este projeto, incluindo etapas de instalação e exemplos de uso básico.
```

Observe como o Claude:
- Analisa a estrutura do projeto
- Identifica dependências e necessidades de configuração
- Cria documentação automaticamente

### Exercício 3: Qualidade de Código
**Pergunte ao Claude:**
```
Revise o código para possíveis melhorias. Foque em tratamento de erros, organização de código e melhores práticas.
```

Observe como o Claude pode fornecer revisões de código e sugestões!

## 💡 Dicas e Melhores Práticas

### Escrevendo Prompts Eficazes

**Seja específico:**
- ❌ "Corrija o bug"
- ✅ "Corrija o bug em data_processor.py onde as datas não estão sendo analisadas corretamente"

**Forneça contexto:**
- ❌ "Adicione testes"
- ✅ "Adicione testes unitários para as funções de validação de dados em validator.py, cobrindo entradas válidas e inválidas"

**Divida tarefas complexas:**
- ❌ "Construa um sistema completo de autenticação"
- ✅ "Primeiro, crie um modelo de usuário com campos de email e senha. Depois, adicione uma função de login que valida as credenciais."

### Confie mas Verifique

- Sempre revise o código que o Claude gera ou modifica
- Teste as mudanças antes de fazer commit
- Peça ao Claude para explicar seu raciocínio se não estiver claro

### Itere e Refine

- Não espere perfeição na primeira tentativa
- Faça perguntas de acompanhamento para refinar os resultados
- Use as sugestões do Claude como ponto de partida

## 🔍 Entendendo a Saída

Quando o Claude usa ferramentas, você verá uma saída como:

```
Reading file: src/data_processor.py
```

Essa transparência ajuda você a:
- Entender o que o Claude está fazendo
- Verificar as ações sendo tomadas
- Aprender quais ferramentas resolvem quais problemas

## 🚀 Próximos Passos

Parabéns! Você concluiu com sucesso:
- ✅ Instalou o Claude Code
- ✅ Autenticou sua sessão
- ✅ Iniciou sua primeira sessão interativa
- ✅ Explorou comandos básicos e fluxos de trabalho
- ✅ Compreendeu conceitos centrais e melhores práticas

### O Que Vem a Seguir?

No [Lab 2 - Explorando Bases de Código](Lab-2-Exploring-Codebases.md), você aprenderá:
- Técnicas avançadas de exploração de código
- Como usar as ferramentas Read, Grep e Glob efetivamente
- Compreender arquitetura de projetos
- Navegar por bases de código grandes rapidamente

## 📚 Recursos Adicionais

- **Documentação do Claude Code**: [code.claude.com/docs](https://code.claude.com/docs/en/)
- **Guia de Início Rápido**: [Quickstart](https://code.claude.com/docs/en/quickstart)
- **Referência de CLI**: [CLI Commands](https://code.claude.com/docs/en/cli-reference)
- **Solução de Problemas**: [Common Issues](https://code.claude.com/docs/en/troubleshooting)

## ❓ Perguntas Comuns

<details>
  <summary><strong>P: Meu código é enviado para os servidores da Anthropic?</strong></summary>
  
  Sim, quando você usa o Claude Code com uma assinatura claude.ai ou chave de API, seus prompts e o código que o Claude lê são enviados para os servidores da Anthropic para processamento. Revise a [política de privacidade](https://www.anthropic.com/privacy) e os [termos de serviço](https://www.anthropic.com/legal/consumer-terms) da Anthropic.
  
</details>

<details>
  <summary><strong>P: Posso usar o Claude Code offline?</strong></summary>
  
  Não, o Claude Code requer uma conexão com a internet para se comunicar com os modelos de IA do Claude.
  
</details>

<details>
  <summary><strong>P: Quanto custa o Claude Code?</strong></summary>
  
  O Claude Code está incluído nas assinaturas Claude Pro ($20/mês), Team e Enterprise. O uso da API através do Console é cobrado separadamente com base no uso de tokens.
  
</details>

<details>
  <summary><strong>P: O Claude Code pode fazer commits sem minha aprovação?</strong></summary>
  
  Não, o Claude Code segue as configurações de permissão. Você pode configurar o que requer aprovação nas suas configurações. Operações destrutivas como force-push requerem confirmação.
  
</details>

---

#### Você concluiu com sucesso o Lab 1! Clique em [Próximo Lab →](Lab-2-Exploring-Codebases.md) para continuar.
