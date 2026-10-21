# Lab 7 - Agentes Paralelos e Multi-Sessões

#### Duração: 40 minutos

## 🎯 Objetivos de Aprendizagem

Ao final deste laboratório, você será capaz de:
- Compreender as diferentes abordagens para trabalho paralelo no Claude Code
- Iniciar e gerenciar múltiplas sessões Claude simultaneamente
- Usar mensagens entre sessões para coordenar trabalho
- Dominar nomeação e descoberta de sessões com `/rename` e `/list-agents`
- Despachar sessões em segundo plano com agent view
- Aplicar melhores práticas para coordenação multi-sessão

## 🌐 Arquitetura Multi-Sessão

O Claude Code fornece cinco maneiras de trabalhar em múltiplas tarefas ao mesmo tempo:

| Abordagem | O que oferece | Use quando |
|-----------|---------------|------------|
| **Subagents** | Trabalhadores delegados dentro de uma sessão | Uma tarefa secundária inundaria sua conversa com resultados de pesquisa |
| **Agent view** | Sessões em segundo plano que você despacha e monitora | Você tem tarefas independentes para delegar e verificar status depois |
| **Agent teams** | Sessões coordenadas com lista de tarefas compartilhada (experimental) | Claude divide um projeto em partes e as atribui |
| **Projects** | Conversas na nuvem com threads paralelas | Trabalho abrange dias/semanas e deve continuar quando a máquina está desligada |
| **Dynamic workflows** | Orquestração multi-agente dirigida por script | Trabalho precisa de 10+ agentes ou verificação cruzada |

**Este laboratório foca em agent view e mensagens entre sessões.**

## 🔗 Mensagens Entre Sessões

Sessões Claude podem enviar mensagens umas às outras para coordenar trabalho, compartilhar descobertas e relatar status.

### Ferramentas-Chave

- **`/list-agents`** (ou `/peers`): Lista todas as sessões que Claude pode alcançar
- **`/rename <nome>`**: Dá um nome memorável à sua sessão
- **`SendMessage`**: Claude usa esta ferramenta para enviar mensagens a outras sessões

### Como Funciona

```
Sessão "principal" (você)
    ↓ mensagem
Sessão "traducao" (outro terminal)
    ↓ resposta
Sessão "principal"
```

As mensagens viajam:
- **Mesma máquina**: Por socket local (nunca através dos servidores Anthropic)
- **Outras máquinas**: Através da Anthropic via Remote Control
- **Sessões na nuvem**: Através dos servidores Anthropic para a nuvem

## 🚀 Passo 1: Descoberta e Nomeação de Sessões

Vamos começar entendendo como as sessões se identificam e encontram umas às outras.

### Visualizar Sessões Disponíveis

**Tente isto:**
```
/list-agents
```

**O que você verá:**
```
This session: principal [5d9c20] (the name other sessions use to message it)

Peer sessions (1):
  traducao [ea761a]  ·  interactive  ·  waiting  ·  started 15m ago
```

**Observações-chave:**
- Primeira linha mostra o nome da SUA sessão (como outros te endereçam)
- Cada sessão tem um nome e um ID curto
- Status mostra: interactive/background, waiting/working, idade

### Nomeie Sua Sessão

Abra um novo terminal e inicie o Claude:

```bash
cd F:\Desenvolvimento\claude-code-lab
claude --name "revisor"
```

Ou renomeie uma sessão existente:
```
/rename revisor
```

**Melhores práticas para nomeação:**
- Use nomes descritivos: `api-worker`, `test-runner`, `db-migration`
- Mantenha nomes curtos (menos de 20 caracteres)
- Use hífens, não espaços: `bug-fix` não `bug fix`
- Nomes ajudam com @-menções e desambiguação

## 📨 Passo 2: Sua Primeira Mensagem Entre Sessões

Vamos fazer duas sessões se comunicarem.

### Configuração: Duas Sessões

**Terminal 1 (Sessão A):**
```bash
claude --name "analisador"
```

**Terminal 2 (Sessão B):**
```bash
claude --name "coordenador"
```

### Enviar uma Mensagem

**Na sessão "coordenador", tente:**
```
Liste todas as sessões disponíveis, depois envie uma mensagem para a sessão analisador pedindo para revisar o processador de dados Python em busca de problemas de performance.
```

**O que Claude faz:**
1. Executa `/list-agents` para descobrir sessões
2. Usa a ferramenta `SendMessage` para alcançar "analisador"
3. A mensagem aparece na sessão analisador

**Na sessão "analisador", você verá:**
```
› Message from @coordenador: Por favor, revise data_processor.py para problemas de performance (ctrl+o para expandir)
```

**Pressione `Ctrl+O`** para ver a mensagem completa no visualizador de transcrições.

### Responder a uma Mensagem

**Na sessão "analisador":**
```
Revise o processador de dados para problemas de performance conforme solicitado. Quando terminar, envie suas descobertas de volta para a sessão coordenador.
```

Claude vai:
1. Realizar a revisão
2. Enviar as descobertas de volta ao coordenador
3. Coordenador recebe os resultados

## 🎛️ Passo 3: Agent View - Gerenciando Sessões em Segundo Plano

Agent view é o painel do Claude para despachar e monitorar múltiplas sessões paralelas.

### Iniciar Agent View

**Em um novo terminal:**
```bash
claude agents
```

**O que você vê:**
- Lista de todas as sessões em segundo plano
- Indicadores de estado (working, idle, blocked, completed)
- Input de despacho na parte inferior

### Despache Sua Primeira Sessão em Segundo Plano

**No prompt do agent view, digite:**
```
Revise o aplicativo Angular de tarefas para problemas de acessibilidade - foque em labels ARIA e navegação por teclado
```

**Pressione Enter.**

**O que acontece:**
1. Claude gera uma nova sessão em segundo plano
2. Sessão aparece na lista com ícone "working" animado
3. Você está livre para despachar mais tarefas
4. Quando concluído, status muda para "completed"

### Despache Múltiplas Tarefas Paralelas

**Despache estas tarefas uma após a outra:**

```
Tarefa 1: Encontre todos os comentários TODO no código e crie uma lista priorizada
```

```
Tarefa 2: Analise o processador de dados Python para potenciais vulnerabilidades de segurança
```

```
Tarefa 3: Gere testes unitários para quaisquer funções sem cobertura de testes no app Angular
```

**Observe:**
- Todas as três executam simultaneamente
- Cada tem sua própria linha com status
- Elas completam independentemente

### Gerenciando Sessões

| Tecla | Ação |
|-------|------|
| `↑` / `↓` | Navegar entre sessões |
| `Enter` ou `→` | Anexar à sessão selecionada |
| `Space` | Espiar saída sem anexar |
| `Ctrl+R` | Renomear sessão |
| `Ctrl+X` duas vezes | Parar e deletar sessão |
| `Ctrl+F` | Encontrar sessões por nome |
| `Ctrl+S` | Alternar agrupamento (por estado/diretório) |

**Tente:**
1. Use `↑`/`↓` para navegar
2. Pressione `Space` para espiar a saída de uma sessão
3. Pressione `Enter` para anexar completamente a uma sessão
4. Pressione `←` para retornar ao agent view

## 🔄 Passo 4: Fluxos de Trabalho Multi-Sessão Coordenados

Agora vamos coordenar múltiplas sessões trabalhando em tarefas relacionadas.

### Cenário: Revisão de Código Paralela

**Objetivo**: Revisar toda a base de código de múltiplos ângulos simultaneamente.

### Configurar o Fluxo de Trabalho

**Terminal 1 - Coordenador:**
```bash
claude --name "coordenador-revisao"
```

**Prompt:**
```
Vou coordenar uma revisão de código multi-sessão. Liste todas as sessões disponíveis para nos prepararmos.
```

### Despachar Sessões de Revisão

**Do agent view (`claude agents`):**

**Tarefa 1:**
```
Nome da sessão: revisao-seguranca
Tarefa: Realize auditoria de segurança do processador de dados Python - verifique injeção SQL, operações de arquivo inseguras, problemas de validação de entrada. Relate descobertas com níveis de severidade.
```

**Tarefa 2:**
```
Nome da sessão: revisao-performance
Tarefa: Analise o processador de dados Python para gargalos de performance - algoritmos lentos, consultas de banco de dados ineficientes, problemas de memória. Sugira otimizações.
```

**Tarefa 3:**
```
Nome da sessão: revisao-acessibilidade
Tarefa: Audite o app Angular de tarefas para acessibilidade - labels ARIA, navegação por teclado, contraste de cores, compatibilidade com leitor de tela. Gere correções.
```

**Tarefa 4:**
```
Nome da sessão: cobertura-testes
Tarefa: Analise cobertura de testes em ambos os projetos. Identifique caminhos críticos sem testes e gere casos de teste faltantes.
```

### Agregar Resultados

Uma vez que todas as sessões completem, **na sessão coordenador:**

```
Verifique todas as sessões de revisão. Para cada sessão concluída, solicite que me enviem suas descobertas. Então agregue todas as descobertas, elimine duplicatas e crie um plano de ação priorizado.
```

**O que Claude faz:**
1. Usa `/list-agents` para verificar estados das sessões
2. Envia `SendMessage` para cada sessão de revisão
3. Recebe descobertas de cada uma
4. Agrega e prioriza

## 🎯 Passo 5: Cenários Multi-Sessão do Mundo Real

Vamos praticar cenários realistas de desenvolvimento.

### Cenário 1: Pipeline de Desenvolvimento de Feature

**Objetivo**: Implementar uma nova funcionalidade de exportação CSV em frontend e backend.

**Configuração:**
```bash
# Terminal 1
claude agents
```

**Despache estas sessões:**

**Sessão 1: Fase de Design**
```
nome: design-csv
tarefa: Projete arquitetura de exportação CSV para o processador de dados - endpoints de API, formatação de dados, tratamento de erros, streaming para grandes datasets
```

**Aguarde o design completar, então:**

**Sessão 2: Implementação Backend**
```
nome: backend-csv
tarefa: Verifique a sessão design-csv para o plano de arquitetura. Implemente a funcionalidade de exportação CSV em Python baseado nesse design.
```

**Sessão 3: Integração Frontend** (pode executar em paralelo com Sessão 2)
```
nome: frontend-csv
tarefa: Adicione botão de exportação CSV ao app Angular de tarefas. Implemente funcionalidade de download e feedback do usuário durante exportação.
```

**Sessão 4: Testes**
```
nome: testes-csv
tarefa: Escreva testes abrangentes para exportação CSV - testes unitários para exportador Python, testes de integração para API, testes E2E para botão da UI.
```

**Sessão coordenador:**
```
Monitore as sessões de desenvolvimento da feature CSV. À medida que cada completa, peça que relatem status para mim. Verifique que todas as peças se integram corretamente.
```

### Cenário 2: Debugging Entre Serviços

**Objetivo**: Rastrear um bug afetando múltiplos componentes.

**Despacho:**

**Sessão 1: Análise de Logs**
```
nome: cacador-logs
tarefa: Busque em toda a base de código por logs de erro relacionados a "timeout" ou "connection refused". Relate arquivos, números de linha e contexto.
```

**Sessão 2: Revisão de Rede**
```
nome: revisao-rede
tarefa: Analise todo código de cliente HTTP para configurações de timeout, lógica de retry e tratamento de erros. Identifique inconsistências.
```

**Sessão 3: Gerenciamento de Estado**
```
nome: revisao-estado
tarefa: Revise gerenciamento de estado do frontend para condições de corrida ao lidar com erros de rede. Verifique boundaries de erro adequados.
```

**Coordenador:**
```
Coordene as sessões de debugging. À medida que cada encontra problemas potenciais, peça que me enviem mensagens. Faça referência cruzada das descobertas para identificar a causa raiz.
```

### Cenário 3: Projeto de Migração

**Objetivo**: Migrar de uma biblioteca para outra através da base de código.

**Despacho:**

**Sessão 1: Inventário**
```
nome: inventario-migracao
tarefa: Encontre todos os usos da biblioteca antiga através da base de código. Categorize por padrão de uso e complexidade.
```

**Aguarde inventário, então despache trabalhadores:**

**Sessões 2-5: Migração Paralela**
```
nome: trabalhador-migracao-1
tarefa: Verifique inventario-migracao para descobertas. Migre arquivos no diretório /src/components da biblioteca antiga para a nova.
```

```
nome: trabalhador-migracao-2
tarefa: Verifique inventario-migracao para descobertas. Migre arquivos no diretório /src/services da biblioteca antiga para a nova.
```

```
nome: trabalhador-migracao-3
tarefa: Verifique inventario-migracao para descobertas. Migre arquivos no diretório /src/utils da biblioteca antiga para a nova.
```

```
nome: trabalhador-migracao-4
tarefa: Verifique inventario-migracao para descobertas. Atualize todos os arquivos de teste para usar a nova biblioteca.
```

**Sessão 6: Verificação**
```
nome: verificacao-migracao
tarefa: Após todos os trabalhadores completarem, execute suite completa de testes e verifique que não restam referências à biblioteca antiga. Relate quaisquer problemas.
```

## 💡 Melhores Práticas para Trabalho Multi-Sessão

### 1. Estratégia de Nomeação de Sessões

**Bons nomes:**
```
✅ api-bug-fix
✅ db-migration
✅ revisao-performance
✅ feature-exportacao-csv
```

**Nomes ruins:**
```
❌ claude-code-lab-43
❌ teste
❌ sessao-sem-titulo
❌ asdf
```

### 2. Escolha a Abordagem Certa

**Use subagentes quando:**
- Tarefa é parte do seu trabalho atual
- Você precisa dos resultados nesta conversa
- Delegação simples (1-3 agentes)

**Use sessões em segundo plano quando:**
- Tarefas são independentes
- Você quer verificar depois
- Executando 4+ tarefas paralelas
- Não precisa de atualizações constantes

**Use mensagens entre sessões quando:**
- Sessões precisam coordenar
- Compartilhando descobertas entre sessões
- Uma sessão depende dos resultados de outra
- Construindo pipelines multi-etapa

### 3. Design de Mensagens

**Mensagens claras:**
```
✅ "Revisão de segurança encontrou 3 vulnerabilidades críticas de injeção SQL em data_processor.py linhas 45, 67 e 103. Recomendo correção imediata."

❌ "Encontrei alguns problemas, dê uma olhada"
```

**Inclua:**
- O que foi encontrado
- Onde está (arquivo:linha)
- Severidade/prioridade
- Ação recomendada

### 4. Isolamento e Worktrees

Sessões em segundo plano automaticamente usam worktrees para isolamento de arquivos:

```
Diretório de trabalho principal
    ├── .claude/worktrees/sessao-1/  (cópia isolada)
    ├── .claude/worktrees/sessao-2/  (cópia isolada)
    └── .claude/worktrees/sessao-3/  (cópia isolada)
```

**Benefícios:**
- Sessões paralelas não conflitam
- Cada pode editar arquivos diferentes
- Mudanças não afetam diretório principal até commit

**Para mesclar mudanças de volta:**
```bash
cd .claude/worktrees/nome-sessao
git log  # Revisar commits
git push origin branch-sessao
```

### 5. Gerenciamento de Recursos

**Limites de taxa se aplicam:**
- 10 sessões paralelas = ~10x uso de tokens
- Monitore custos com `/status`
- Pare sessões ociosas com `Ctrl+X`

**Ciclo de vida:**
```bash
claude agents               # Ver todas as sessões
claude stop <nome>          # Parar uma sessão
claude rm <nome>            # Remover da lista
claude attach <nome>        # Reanexar a sessão
```

## 🎯 Exercício: Auditoria Multi-Sessão de Projeto

Complete este exercício avançado por conta própria!

### Exercício: Auditoria Abrangente de Projeto

**Objetivo**: Realize uma auditoria completa do claude-code-lab usando sessões coordenadas.

**Arquitetura:**
```
coordenador (você)
    ├── auditoria-seguranca (segundo plano)
    ├── auditoria-performance (segundo plano)
    ├── auditoria-qualidade-codigo (segundo plano)
    ├── auditoria-documentacao (segundo plano)
    └── auditoria-testes (segundo plano)
```

**Sua tarefa:**

1. **Inicie sessão coordenador:**
   ```bash
   claude --name "coordenador-auditoria"
   ```

2. **Inicie agent view e despache 5 sessões de auditoria:**
   ```bash
   # Em outro terminal
   claude agents
   ```

3. **Cada auditoria deve:**
   - Revisar ambos projetos Python e Angular
   - Relatar descobertas com referências arquivo:linha
   - Atribuir níveis de severidade
   - Sugerir correções
   - Enviar mensagem ao coordenador quando completa

4. **Coordenador deve:**
   - Rastrear progresso de todas as auditorias
   - Receber descobertas de cada sessão
   - Eliminar duplicatas entre auditorias
   - Criar relatório unificado
   - Priorizar top 10 problemas
   - Gerar plano de ação

**Prompts para começar:**

**Auditoria 1: Segurança**
```
Auditoria abrangente de segurança de ambos projetos: injeção SQL, XSS, CSRF, dependências inseguras, segredos hardcoded, operações de arquivo inseguras. Envie mensagem ao coordenador-auditoria quando completo com descobertas.
```

**Auditoria 2: Performance**
```
Auditoria de performance: complexidade de algoritmo, eficiência de consulta de banco de dados, vazamentos de memória, tamanho de bundle, performance de renderização. Envie mensagem ao coordenador-auditoria quando completo.
```

**Auditoria 3: Qualidade de Código**
```
Auditoria de qualidade de código: code smells, duplicação, complexidade, convenções de nomenclatura, tratamento de erros. Envie mensagem ao coordenador-auditoria quando completo.
```

**Auditoria 4: Documentação**
```
Auditoria de documentação: docstrings faltando, comentários desatualizados, completude do README, documentação de API. Envie mensagem ao coordenador-auditoria quando completo.
```

**Auditoria 5: Testes**
```
Auditoria de testes: lacunas de cobertura, testes instáveis, casos extremos faltando, organização de testes. Envie mensagem ao coordenador-auditoria quando completo.
```

**Critérios de sucesso:**
- Todas as 5 auditorias executam em paralelo
- Cada envia mensagem ao coordenador ao completar
- Coordenador agrega em relatório unificado
- Sem cópia-cola manual entre sessões
- Relatório tem itens de ação priorizados

## 🔍 Compreendendo Estados de Sessão

Sessões passam por estes estados:

| Estado | Ícone | Significado | O que fazer |
|--------|-------|-------------|-------------|
| Working | 🔄 | Processando ativamente | Aguarde ou verifique outras sessões |
| Idle | ⚪ | Pronto para entrada | Envie novo prompt ou pare |
| Blocked | 🟡 | Precisa permissão/entrada | Anexe e responda |
| Completed | 🟢 | Tarefa finalizada | Revise resultados |
| Failed | 🔴 | Erro ocorreu | Anexe e depure |

**Verificando estado:**
```
/list-agents              # Ver todos os estados de sessão
claude agents --json      # Acesso programático
claude logs <nome>        # Ver saída recente
```

## 🧠 Quando NÃO Usar Multi-Sessões

Multi-sessões nem sempre são a resposta:

**Não use para:**
- Tarefas sequenciais simples (apenas faça-as)
- Quando você quer aprender com o processo
- Trabalho altamente interdependente que não pode ser dividido
- Trabalho exploratório rápido

**Use para:**
- Tarefas paralelas independentes
- Revisões ou auditorias em larga escala
- Features multi-componente
- Quando uma sessão bloqueia esperando outra

## 🎓 O Que Você Aprendeu

Ao completar este laboratório, você agora compreende:

✅ **Arquitetura multi-sessão** - Cinco abordagens e quando usar cada

✅ **Descoberta de sessões** - Usando `/list-agents` e `/rename` efetivamente

✅ **Mensagens entre sessões** - Coordenando trabalho entre sessões

✅ **Agent view** - Despachando e gerenciando sessões em segundo plano

✅ **Fluxos de trabalho paralelos** - Coordenando projetos multi-sessão complexos

✅ **Melhores práticas** - Nomeação, mensagens, isolamento e gerenciamento de recursos

## 🚀 Principais Conclusões

1. **Escolha a ferramenta certa** - Subagentes vs sessões em segundo plano vs mensagens

2. **Nomeie pensadamente** - Bons nomes facilitam coordenação

3. **Mensagens claras** - Inclua o quê, onde, severidade e ação

4. **Isole com worktrees** - Sessões paralelas não conflitam

5. **Coordene explicitamente** - Use padrão coordenador para trabalho complexo

6. **Monitore recursos** - Sessões paralelas multiplicam uso de tokens

7. **Limpe** - Pare sessões ociosas, remova as concluídas

## 🌐 Avançado: Remote Control (Opcional)

Com Remote Control, sessões podem enviar mensagens entre máquinas:

### Configurar Remote Control

```bash
# Conecte esta sessão a claude.ai
claude --remote-control
```

**Agora você pode:**
- Enviar mensagens para sessões em outras máquinas
- Enviar mensagens para sessões na nuvem em claude.ai/code
- Coordenar trabalho através da sua infraestrutura

**Exemplo:**
```
Liste todas as minhas sessões em todas as máquinas. Peça à sessão no meu laptop para executar a suite de testes e relatar de volta.
```

**Aprenda mais:**
- [Documentação Remote Control](https://code.claude.com/docs/en/remote-control)
- [Sessões na Nuvem](https://code.claude.com/docs/en/claude-code-on-the-web)

## 📚 Recursos Adicionais

- **Mensagens Entre Sessões**: [Documentação](https://code.claude.com/docs/en/cross-session-messaging)
- **Agent View**: [Gerenciando Sessões](https://code.claude.com/docs/en/agent-view)
- **Agentes Paralelos**: [Executar Agentes em Paralelo](https://code.claude.com/docs/en/agents)
- **Worktrees**: [Checkouts Isolados](https://code.claude.com/docs/en/worktrees)
- **Agent Teams**: [Experimental](https://code.claude.com/docs/en/agent-teams)
- **Lab Anterior**: [Lab 4 - Trabalhando com Agentes](Lab-4-Trabalhando-Com-Agentes.md)

## 🔜 Próximos Passos

Isso completa os laboratórios principais! Para tópicos avançados, explore:

- **Agentes Avançados e Workflows**: [Guia](../../AdditionalLearning/Advanced-Agents-and-Workflows.md)
- **Exemplos de Workflow**: [Workflows prontos para executar](../../WorkflowExamples/)
- **Integração MCP**: [Lab 5](Lab-5-Integracao-MCP.md)
- **Customização**: [Lab 6](Lab-6-Customizacao.md)

---

#### Parabéns! Você completou o Lab 7 e dominou coordenação multi-sessão no Claude Code! 🎉
