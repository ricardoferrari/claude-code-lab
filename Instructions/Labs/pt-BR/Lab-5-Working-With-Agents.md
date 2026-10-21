# Lab 4 - Trabalhando com Agentes

#### Duração: 30 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste laboratório, você será capaz de:
- Entender o que são agentes e quando usá-los
- Criar subagentes para execução paralela
- Coordenar múltiplos agentes trabalhando em tarefas relacionadas
- Aprender as melhores práticas para delegação de agentes
- Compreender a comunicação entre agentes e agregação de resultados

## 🤖 O que são Agentes?

No Claude Code, um **agente** é uma instância do Claude que trabalha em uma tarefa específica. Pense nos agentes como membros da equipe para os quais você pode delegar trabalho.

### Hierarquia de Agentes

```
Sessão Principal do Claude (Você)
    ├── Agente 1: "Revisar código Python em busca de bugs"
    ├── Agente 2: "Revisar código Angular em busca de bugs"
    └── Agente 3: "Gerar testes de integração"
```

### Por que Usar Agentes?

**Execução Paralela:**
- Múltiplas tarefas são concluídas simultaneamente
- Dramaticamente mais rápido que trabalho sequencial

**Isolamento de Tarefas:**
- Cada agente se concentra em um objetivo específico
- Os resultados são mais fáceis de revisar

**Contexto Especializado:**
- Agentes podem usar ferramentas ou abordagens diferentes
- Algumas tarefas se beneficiam de uma perspectiva nova

## 🍎 Cenário: Revisão de Código em Grande Escala

Sua equipe na DataFlow Analytics está se preparando para um lançamento. Você precisa:

1. **Auditoria de segurança** - Revisar código em busca de vulnerabilidades de segurança
2. **Revisão de desempenho** - Identificar gargalos de desempenho
3. **Cobertura de testes** - Garantir que todos os caminhos críticos sejam testados
4. **Auditoria de documentação** - Verificar se todas as APIs públicas estão documentadas

Fazer isso sequencialmente levaria horas. Com agentes, eles podem ser executados em paralelo!

## 🚀 Passo 1: Seu Primeiro Agente

Vamos começar de forma simples criando um único agente.

### Navegue até o Projeto

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

### Crie um Único Agente

**Prompt para experimentar:**
```
Crie um agente para revisar data_processor.py em busca de potenciais vulnerabilidades de segurança. O agente deve:
- Procurar riscos de injeção SQL
- Verificar operações de arquivo inseguras
- Identificar qualquer deserialização insegura
- Relatar descobertas com níveis de severidade
```

**O que acontece:**
1. Claude cria um subagente com suas instruções
2. O agente trabalha de forma independente
3. Quando termina, os resultados retornam para você
4. Você vê um resumo das descobertas

**Observação importante**: O agente tem seu próprio contexto e acesso a ferramentas!

### Revise os Resultados do Agente

O agente irá reportar de volta. Você pode então:

```
Com base nas descobertas do agente, corrija os problemas de maior severidade.
```

## 🔄 Passo 2: Agentes Paralelos

Agora vamos executar múltiplos agentes simultaneamente.

### Lance Revisões de Código Paralelas

**Prompt para experimentar:**
```
Lance três agentes em paralelo para revisar todo o projeto Python:

Agente 1: Revisão de segurança
- Injeção SQL, XSS, operações inseguras
- Relatar problemas críticos primeiro

Agente 2: Revisão de qualidade de código
- Code smells, problemas de complexidade
- Sugerir oportunidades de refatoração

Agente 3: Revisão de desempenho
- Operações lentas, algoritmos ineficientes
- Otimização de consultas ao banco de dados

Agregue suas descobertas e priorize por severidade.
```

**O que observar:**
1. Claude cria todos os três agentes de uma vez
2. Cada agente trabalha de forma independente
3. Os resultados voltam conforme cada um completa
4. O Claude principal agrega e prioriza as descobertas

**Economia de tempo**: Três revisões no tempo de uma!

## 🎯 Passo 3: Coordenação de Agentes

Às vezes, os agentes precisam trabalhar em tarefas relacionadas onde uma depende da outra.

### Fluxo de Trabalho Sequencial de Agentes

**Prompt para experimentar:**
```
Coordene um fluxo de trabalho em várias etapas usando agentes:

Etapa 1: Agente descobre todas as funções sem docstrings
Etapa 2: Para cada função encontrada, crie um agente para:
   - Analisar a função
   - Gerar docstring apropriada
   - Adicioná-la ao código
Etapa 3: Verificar se todas as docstrings foram adicionadas corretamente
```

**O que Claude faz:**
1. Cria agente de descoberta
2. Aguarda os resultados
3. Cria múltiplos agentes paralelos para cada função
4. Agrega os resultados
5. Valida a conclusão

**Aprendizado importante**: Agentes podem ser coordenados em fluxos de trabalho complexos!

## 🔍 Passo 4: Especialização de Agentes

Diferentes tipos de agentes se destacam em tarefas diferentes.

### Usando Agentes Especializados

O Claude Code fornece diferentes tipos de agentes:

| Tipo de Agente | Especialização | Melhor Para |
|----------------|----------------|-------------|
| **general-purpose** | Versátil, todas as ferramentas | Maioria das tarefas |
| **Explore** | Exploração somente leitura | Análise de código, busca |
| **Plan** | Planejamento arquitetural | Design de funcionalidades, planejamento de abordagem |

**Prompt para experimentar:**
```
Use o agente Plan para projetar uma abordagem para adicionar cache ao processador de dados. O plano deve incluir:
- Quais funções se beneficiam do cache
- Qual estratégia de cache usar
- Como invalidar o cache
- Estratégia de teste
```

**Depois implemente:**
```
Com base no plano, crie agentes para implementar a camada de cache:
- Agente 1: Implementar módulo de cache
- Agente 2: Integrar cache no processador de dados
- Agente 3: Adicionar testes de cache
```

## 🧪 Passo 5: Cenários Reais com Agentes

Vamos praticar com cenários realistas de desenvolvimento.

### Cenário 1: Implementação de Funcionalidade

**Tarefa**: Adicionar funcionalidade de exportação CSV com agentes.

**Prompt para experimentar:**
```
Implemente a funcionalidade de exportação CSV usando agentes:

Agente 1 (Plan): Projetar a arquitetura de exportação CSV
- Design da API
- Dependências necessárias
- Estratégia de tratamento de erros

Agente 2: Implementar lógica de exportação com base no plano
Agente 3: Escrever testes abrangentes
Agente 4: Atualizar documentação

Coordene os agentes para que cada um comece quando as dependências estiverem prontas.
```

### Cenário 2: Caça aos Bugs

**Tarefa**: Encontrar e corrigir bugs em toda a base de código.

**Prompt para experimentar:**
```
Lance uma caçada de agentes por bugs:

Agente 1: Procurar potenciais problemas de ponteiro nulo
Agente 2: Encontrar condições de corrida ou problemas de concorrência
Agente 3: Identificar casos extremos que não são tratados

Cada agente deve:
- Relatar bugs encontrados com referências arquivo:linha
- Sugerir correções
- Avaliar severidade (crítico/alto/médio/baixo)

Agregue as descobertas, elimine duplicatas e priorize.
```

### Cenário 3: Campanha de Refatoração

**Tarefa**: Refatoração em grande escala com múltiplos agentes.

**Prompt para experimentar:**
```
Coordene uma campanha de refatoração:

Agente 1: Identificar duplicação de código no projeto
Agente 2: Para cada duplicação encontrada, extrair em funções reutilizáveis
Agente 3: Atualizar todos os locais de chamada para usar funções extraídas
Agente 4: Executar suite completa de testes para verificar que nada quebrou

Relatar quaisquer problemas que surjam durante o processo.
```

## 🎨 Passo 6: Agentes com Aplicação Angular

Mude para o frontend e use agentes lá.

```bash
exit
cd ../angular-task-app
claude
```

### Tarefas Multi-Agente no Frontend

**Prompt para experimentar:**
```
Lance agentes paralelos para melhorias no frontend:

Agente 1: Auditoria de acessibilidade
- Encontrar rótulos ARIA ausentes
- Verificar navegação por teclado
- Verificar contraste de cores
- Gerar correções

Agente 2: Auditoria de desempenho
- Tamanhos grandes de bundle
- Dependências não utilizadas
- Renderizações ineficientes
- Sugerir otimizações

Agente 3: Rigor do TypeScript
- Adicionar verificação de tipo estrita
- Corrigir usos de tipo any
- Adicionar tipos de retorno ausentes

Cada agente deve fazer mudanças reais no código e testá-las.
```

## 💡 Melhores Práticas para Usar Agentes

### 1. Instruções Claras

Dê aos agentes tarefas específicas e acionáveis:

```
# ❌ Vago
Crie um agente para olhar o código

# ✅ Claro
Crie um agente para encontrar todas as funções com mais de 50 linhas e sugerir como dividi-las em funções menores e de propósito único.
```

### 2. Escopo Apropriado

Não torne os trabalhos dos agentes muito grandes ou muito pequenos:

**Muito pequeno**: "Verificar se a linha 42 tem ponto e vírgula"
- Apenas faça você mesmo!

**Muito grande**: "Reescrever toda a aplicação"
- Divida em múltiplos agentes coordenados

**Na medida certa**: "Revisar todos os endpoints da API para tratamento adequado de erros"

### 3. Paralelo Quando Possível

Se as tarefas são independentes, execute-as em paralelo:

```
# Tarefas independentes - PARALELO ✅
Agente 1: Revisar código Python
Agente 2: Revisar código Angular
Agente 3: Atualizar documentação

# Tarefas dependentes - SEQUENCIAL ✅
Agente 1: Projetar API (aguardar)
Agente 2: Implementar API com base no design (aguardar)
Agente 3: Escrever testes para a implementação
```

### 4. Agregar e Revisar

Sempre revise os resultados dos agentes:

```
Revise todas as descobertas dos agentes, elimine duplicatas e crie uma lista de ações priorizada.
```

### 5. Lidar com Falhas de Forma Elegante

Agentes podem encontrar problemas:

```
Se algum agente falhar, relate qual e por quê, depois tente novamente com instruções ajustadas.
```

## 🎯 Exercício: Orquestração Complexa de Agentes

Complete este exercício avançado por conta própria!

### Exercício: Suite Completa de Qualidade de Código

**Tarefa**: Execute uma verificação abrangente de qualidade de código em ambos os projetos.

**Sugestão de prompt:**
```
Execute uma suite completa de qualidade de código usando agentes coordenados:

Para o projeto Python (python-data-processor):
- Agente 1: Auditoria de segurança
- Agente 2: Qualidade de código (estilo pylint/flake8)
- Agente 3: Análise de cobertura de testes
- Agente 4: Completude da documentação

Para o projeto Angular (angular-task-app):
- Agente 5: Auditoria de segurança (npm audit, CORS, XSS)
- Agente 6: Qualidade de código (ESLint, TypeScript strict)
- Agente 7: Análise de cobertura de testes
- Agente 8: Auditoria de acessibilidade

Requisitos:
- Todos os agentes executam em paralelo quando possível
- Gerar um relatório unificado com todas as descobertas
- Priorizar problemas por severidade em ambos os projetos
- Criar issues do GitHub para os 5 itens críticos principais (formato markdown)
```

**O que observar:**
- 8 agentes trabalhando simultaneamente
- Análise entre projetos
- Agregação de resultados
- Lógica de priorização

## 🔍 Compreendendo a Comunicação de Agentes

### Como os Agentes Relatam de Volta

Agentes comunicam resultados através de:

1. **Atualizações de status**: "Agente iniciado", "Agente concluído"
2. **Relatórios de progresso**: O que o agente está fazendo
3. **Resultados finais**: Descobertas, mudanças feitas, recomendações
4. **Erros**: Se algo deu errado

### Revisando o Trabalho dos Agentes

Após os agentes concluírem:

```
Mostre-me um detalhamento do que cada agente encontrou e fez.
```

```
Quais descobertas de agente são mais críticas para abordar primeiro?
```

```
Existem conflitos ou contradições nas recomendações dos agentes?
```

## 🧠 Quando NÃO Usar Agentes

Agentes nem sempre são a resposta:

**Não use agentes para:**
- Tarefas simples e rápidas (apenas faça você mesmo)
- Tarefas que requerem ida e volta contínua
- Quando você precisa aprender com o processo
- Etapas altamente interdependentes que não podem ser paralelizadas

**Use agentes para:**
- Revisões ou análises demoradas
- Tarefas paralelas independentes
- Trabalho repetitivo em grande escala
- Quando você precisa de múltiplas perspectivas

## 🎓 O que Você Aprendeu

Ao completar este laboratório, você agora entende:

✅ **Fundamentos de agentes** - O que são e como funcionam

✅ **Execução paralela** - Executando múltiplas tarefas simultaneamente

✅ **Coordenação de agentes** - Fluxos de trabalho sequenciais e dependentes

✅ **Especialização** - Usando o tipo certo de agente para a tarefa

✅ **Melhores práticas** - Quando e como usar agentes de forma eficaz

✅ **Cenários do mundo real** - Aplicações práticas no desenvolvimento

## 🚀 Principais Conclusões

1. **Agentes multiplicam a produtividade** - Execução paralela é poderosa

2. **Instruções claras importam** - Tarefas específicas obtêm melhores resultados

3. **Coordenação é fundamental** - Planeje dependências cuidadosamente

4. **Sempre revise** - Agentes são poderosos mas precisam de supervisão

5. **Use com critério** - Nem toda tarefa precisa de um agente

6. **Escala importa** - Agentes brilham com projetos grandes e complexos

## 🚀 Avançado: Ferramenta Workflow (Opcional)

Para orquestração complexa com 10+ agentes ou lógica condicional, o Claude Code fornece a **ferramenta Workflow**.

### Quando Usar Workflows

**Use a ferramenta Workflow quando:**
- Você precisa de 10+ agentes com coordenação complexa
- Ramificação condicional baseada em resultados
- Quer salvar e reutilizar lógica de orquestração
- Precisa de recuperação avançada de erros

**Exemplo de script de workflow:**
```javascript
export const meta = {
  name: 'code-review',
  description: 'Multi-dimensional code review',
  phases: [
    { title: 'Review' },
    { title: 'Report' }
  ]
};

const reviews = await parallel([
  () => agent('Security review', { phase: 'Review' }),
  () => agent('Performance review', { phase: 'Review' }),
  () => agent('Quality review', { phase: 'Review' })
]);

const report = await agent(
  `Aggregate reviews: ${JSON.stringify(reviews)}`,
  { phase: 'Report' }
);

return { reviews, report };
```

**Experimente um workflow pré-construído:**
```
Execute o workflow de revisão de código de WorkflowExamples/code-review-workflow.js
```

**Saiba mais:**
- Veja o diretório `WorkflowExamples/` para workflows prontos para executar
- Leia `AdditionalLearning/Advanced-Agents-and-Workflows.md` para padrões e melhores práticas

## 📚 Recursos Adicionais

- **Documentação de Agentes**: [Guia de Sub-agentes](https://code.claude.com/docs/en/sub-agents)
- **Tipos de Agentes**: [Agentes Disponíveis](https://code.claude.com/docs/en/sub-agents#agent-types)
- **Workflows**: [Workflows Dinâmicos](https://code.claude.com/docs/en/workflows)
- **Melhores Práticas**: [Quando Usar Agentes](https://code.claude.com/docs/en/best-practices#delegation)
- **Guia Avançado**: [Agentes Avançados e Workflows](../../AdditionalLearning/Advanced-Agents-and-Workflows.md)
- **Exemplos de Workflow**: [WorkflowExamples/](../../WorkflowExamples/)

## 🔜 Próximos Passos

No [Lab 5 - Integração MCP](Lab-5-MCP-Integration.md), você aprenderá:
- O que é Model Context Protocol (MCP)
- Como conectar ferramentas e fontes de dados externas
- Configurar servidores MCP
- Integrações práticas (Slack, GitHub, bancos de dados, etc.)

---

#### Você completou com sucesso o Lab 4! Clique em [Próximo Lab →](Lab-5-MCP-Integration.md) para continuar.
