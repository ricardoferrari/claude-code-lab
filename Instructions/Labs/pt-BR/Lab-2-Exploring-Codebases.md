# Lab 2 - Explorando Bases de Código com Claude Code

#### Duração: 30 minutos

## 🎯 Objetivos de Aprendizagem

Ao final deste laboratório, você será capaz de:
- Dominar as ferramentas principais de exploração: Read, Grep e Glob
- Navegar e compreender eficientemente bases de código desconhecidas
- Identificar dependências, estrutura e arquitetura do projeto
- Aprender estratégias para integração em novos projetos
- Entender como fazer perguntas eficazes sobre código

## 🍎 Cenário: Seu Primeiro Dia na DataFlow Analytics

Bem-vindo ao seu primeiro dia como desenvolvedor na **DataFlow Analytics**! Seu gerente acabou de dar acesso a dois repositórios:

1. **Python Data Processor** - Um serviço backend para transformação de dados
2. **Angular Task App** - Um dashboard frontend para gerenciar tarefas de dados

Como qualquer novo membro da equipe, você precisa entender rapidamente:
- O que essas aplicações fazem?
- Como o código está organizado?
- Quais tecnologias e frameworks são usados?
- Como fazer build, executar e testar?

Em vez de passar dias lendo documentação e código, você usará o Claude Code para acelerar sua integração.

## 🔧 Passo 1: Entenda as Ferramentas

O Claude Code fornece várias ferramentas poderosas para exploração de código. Vamos entender o que cada uma faz:

### Ferramentas Principais de Exploração

| Ferramenta | Propósito | Melhor Para | Exemplo |
|------|---------|----------|---------|
| **Read** | Ler conteúdo de arquivos com números de linha | Ler arquivos específicos, visualizar estrutura de código | "Leia o arquivo principal da aplicação" |
| **Grep** | Buscar padrões em arquivos | Encontrar definições de função, imports, uso de strings | "Encontre todas as funções que lidam com entrada de usuário" |
| **Glob** | Encontrar arquivos correspondentes a padrões | Descobrir estrutura do projeto, encontrar tipos de arquivo | "Liste todos os arquivos de componentes TypeScript" |
| **Bash** | Executar comandos shell | Executar builds, verificar dependências, operações git | "Mostre-me o histórico do git" |

### Quando Usar Cada Ferramenta

**Use Read quando:**
- Você precisa ver o conteúdo de um arquivo específico
- Você quer entender um módulo específico
- Você precisa de análise linha por linha

**Use Grep quando:**
- Buscar nomes de função em toda a base de código
- Encontrar onde uma variável ou classe é usada
- Identificar padrões (tratamento de erros, chamadas de API, etc.)

**Use Glob quando:**
- Você quer encontrar arquivos por nome ou extensão
- Mapear a estrutura do projeto
- Descobrir arquivos de teste, configurações ou documentação

**Use Bash quando:**
- Você precisa executar comandos (npm install, pytest, etc.)
- Verificar histórico ou status do git
- Investigar dependências ou ambiente

## 📂 Passo 2: Explore o Python Data Processor

Vamos começar entendendo o serviço backend Python.

### Inicialize a Sessão

1. Abra um terminal e navegue até o projeto Python:
   ```bash
   cd hol-claude-code-lab/SampleApps/python-data-processor
   ```

2. Inicie o Claude Code:
   ```bash
   claude
   ```

### Tarefa 1: Visão Geral de Alto Nível

Comece pedindo ao Claude uma visão geral do projeto. Experimente esses prompts:

```
Qual é o propósito principal desta aplicação Python? Analise o código e me dê um resumo de alto nível.
```

**Comportamento Esperado:**
- O Claude usará `Glob` para descobrir arquivos
- Usar `Read` para examinar arquivos-chave
- Fornecer um resumo do propósito da aplicação

**Perguntas de acompanhamento para experimentar:**
```
Quais são as principais funcionalidades que esta aplicação fornece?
```

```
Qual é o ponto de entrada desta aplicação?
```

### Tarefa 2: Analise a Estrutura do Projeto

Agora vamos entender como o código está organizado:

```
Analise a estrutura do projeto. Explique o propósito de cada diretório e os principais arquivos que eu deveria conhecer.
```

**Procure o Claude identificar:**
- Diretórios de código-fonte
- Diretórios de teste
- Arquivos de configuração
- Documentação

**Dica Profissional:** Você também pode fazer perguntas específicas:
```
Onde estão localizadas as funções de processamento de dados?
```

```
Mostre-me a estrutura de pastas do projeto como uma árvore.
```

### Tarefa 3: Identifique Dependências

Entender dependências é crucial:

```
Quais bibliotecas externas e dependências este projeto usa? Explique o que cada dependência principal faz e por que pode ser usada.
```

**Ferramentas esperadas que o Claude usará:**
- Read em `requirements.txt` ou `pyproject.toml`
- Possivelmente Grep para declarações de import

**Perguntas de acompanhamento:**
```
Existem vulnerabilidades de segurança nas dependências que eu deveria conhecer?
```

```
Qual versão do Python este projeto requer?
```

### Tarefa 4: Entenda o Processo de Build e Execução

```
Como eu configuro, instalo dependências e executo este projeto localmente? Me dê instruções passo a passo.
```

**O que observar:**
- O Claude lê arquivos de configuração (requirements.txt, README.md)
- Identifica comandos de instalação
- Fornece passos claros e acionáveis

**Experimente você mesmo:**
Siga as instruções do Claude para realmente executar o projeto!

<details>
  <summary>💡 Dica: Configuração Típica de Python</summary>
  
  ```bash
  # Criar ambiente virtual
  python -m venv venv
  
  # Ativar
  source venv/bin/activate  # macOS/Linux
  # OU
  venv\Scripts\activate  # Windows
  
  # Instalar dependências
  pip install -r requirements.txt
  
  # Executar a aplicação
  python main.py
  ```
  
</details>

### Tarefa 5: Encontre Funcionalidades Específicas

Vamos praticar buscas direcionadas:

**Exemplos de prompts:**
```
Encontre todas as funções que processam dados CSV. Mostre-me onde estão definidas e o que fazem.
```

```
Onde o tratamento de erros está implementado? Mostre-me exemplos.
```

```
Encontre todo o código relacionado a banco de dados neste projeto.
```

**Observe:**
- O Claude usa `Grep` para buscar padrões
- Fornece caminhos de arquivo e números de linha
- Frequentemente mostra trechos de código relevantes

## 🎨 Passo 3: Explore o Angular Task App

Agora vamos mudar para a aplicação frontend.

### Navegue até o Projeto Angular

Saia da sua sessão atual do Claude (digite `exit`) e navegue até o app Angular:

```bash
cd ../angular-task-app
claude
```

### Tarefa 1: Entenda a Arquitetura Frontend

```
Esta é uma aplicação Angular. Explique a estrutura do projeto, principais componentes e como o app está organizado.
```

**O Claude deve identificar:**
- Pastas específicas do Angular (components, services, modules)
- Configuração de roteamento
- Abordagem de gerenciamento de estado
- Hierarquia de componentes

### Tarefa 2: Analise os Componentes

```
Liste todos os componentes Angular neste projeto. Para cada componente, explique brevemente seu propósito.
```

**Acompanhamento:**
```
Mostre-me o componente principal do app e explique como funciona.
```

```
Quais componentes lidam com interações de usuário?
```

### Tarefa 3: Entenda Serviços e Fluxo de Dados

```
Quais serviços estão definidos nesta aplicação? Como os dados fluem entre componentes e serviços?
```

**Procure por:**
- Serviços HTTP para chamadas de API
- Serviços de gerenciamento de estado
- Serviços utilitários

```
Como este frontend se comunica com APIs backend?
```

### Tarefa 4: Identifique a Stack de Tecnologia

```
Quais tecnologias, frameworks e bibliotecas este app Angular usa? Inclua coisas como bibliotecas de UI, roteamento e frameworks de teste.
```

**Perguntas de acompanhamento se necessário:**
```
Qual versão do Angular este projeto está usando?
```

```
Qual biblioteca de componentes de UI ou framework CSS está sendo usado?
```

### Tarefa 5: Estratégia de Testes

```
Como esta aplicação Angular é testada? Quais frameworks e estratégias de teste estão em vigor?
```

**Procure por:**
- Testes unitários (arquivos *.spec.ts)
- Testes E2E
- Frameworks de teste (Jasmine, Karma, Jest, Cypress)

## 🔍 Passo 4: Análise Entre Projetos

Agora vamos analisar como essas duas aplicações trabalham juntas.

### Compare e Conecte

Peça ao Claude para analisar o relacionamento:

```
Eu tenho dois projetos: python-data-processor (backend) e angular-task-app (frontend). Como eles se integram? Qual é o contrato de API entre eles?
```

**Técnicas que o Claude pode usar:**
- Grep para definições de endpoints de API em Python
- Grep para chamadas HTTP em serviços Angular
- Comparar estruturas de dados

```
Existem incompatibilidades ou problemas potenciais em como o frontend e backend se comunicam?
```

## 💡 Passo 5: Técnicas Avançadas de Exploração

### Busca de Padrões em Múltiplos Arquivos

Experimente buscas mais complexas:

```
Encontre todos os comentários TODO em ambos os projetos. Liste-os por prioridade se alguma indicação for dada.
```

```
Busque por todo código relacionado a autenticação ou segurança em ambas as aplicações.
```

```
Encontre todos os padrões de tratamento de erros. Eles são consistentes em toda a base de código?
```

### Descoberta de Documentação

```
Encontre todos os arquivos de documentação (README, CONTRIBUTING, documentação de API, etc.) em ambos os projetos. Resuma as informações-chave de cada um.
```

### Avaliação de Qualidade de Código

```
Revise ambos os projetos quanto a problemas de qualidade de código. Procure por:
- Imports ou variáveis não usadas
- Funções muito longas ou complexas
- Tratamento de erros faltando
- Estilos de codificação inconsistentes
```

## 🎯 Exercício: Exploração Independente

Agora pratique suas habilidades! Complete estes exercícios por conta própria:

### Exercício 1: Auditoria de Dependências
**Tarefa:** Crie uma lista completa de todas as dependências (pacotes Python e npm) em ambos os projetos. Para cada dependência:
- Declare seu propósito
- Identifique se há uma versão mais nova disponível
- Anote quaisquer preocupações de segurança

**Prompt para experimentar:**
```
Audite todas as dependências nos projetos Python e Angular. Crie um relatório mostrando cada dependência, seu propósito, versão atual e quaisquer recomendações para atualizações.
```

### Exercício 2: Análise de Cobertura de Testes
**Tarefa:** Analise a cobertura de testes em ambos os projetos.

**Prompt para experimentar:**
```
Analise a cobertura de testes em ambos os projetos. Quais arquivos ou módulos não têm testes? O que seriam bons candidatos para adicionar mais testes?
```

### Exercício 3: Diagrama de Arquitetura
**Tarefa:** Peça ao Claude para ajudá-lo a entender a arquitetura geral.

**Prompt para experimentar:**
```
Descreva a arquitetura geral do sistema mostrando como o backend Python e o frontend Angular trabalham juntos. Inclua:
- Principais componentes em cada projeto
- Como eles se comunicam
- Fluxo de dados
- Pontos-chave de integração
```

### Exercício 4: Guia de Integração de Desenvolvedores
**Tarefa:** Crie documentação abrangente de integração.

**Prompt para experimentar:**
```
Crie um guia de integração para desenvolvedores novos nestes projetos. Inclua:
- Pré-requisitos e instruções de configuração
- Como executar ambas as aplicações
- Como executar os testes
- Fluxos de trabalho comuns de desenvolvimento
- Dicas de resolução de problemas
```

## 💡 Dicas para Exploração Eficaz de Código

### Comece Amplo, Depois Aprofunde
1. Comece com perguntas de alto nível sobre o projeto
2. Aprofunde-se em áreas específicas
3. Faça referências cruzadas das informações conforme avança

### Faça Perguntas de Acompanhamento
Não pare na primeira resposta:
- "Você pode explicar essa função em mais detalhes?"
- "Onde isso é usado em outros lugares?"
- "O que aconteceria se isso falhar?"

### Combine Múltiplas Ferramentas
O Claude frequentemente usa múltiplas ferramentas juntas:
- Glob para encontrar arquivos → Read para examiná-los → Grep para buscar padrões

### Seja Específico Quando Necessário
Perguntas gerais obtêm respostas gerais. Perguntas específicas obtêm respostas específicas:
- ❌ "Me conte sobre o código"
- ✅ "Explique como a função de validação de dados em validator.py funciona e mostre-me onde ela é chamada"

### Verifique Informações Críticas
Para instruções de build ou passos de configuração críticos:
- Realmente experimente os passos que o Claude sugere
- Relate de volta se algo não funcionar
- O Claude pode ajudar a solucionar problemas

## 🧪 Entendendo a Saída das Ferramentas

Quando o Claude usa ferramentas, preste atenção em:

### Saída do Read
```
Reading file: src/data_processor.py (lines 1-150)
```
- Mostra qual arquivo está sendo lido
- Pode mostrar intervalos de linha
- O conteúdo aparece com números de linha

### Saída do Grep
```
Searching for: "def process_data"
Found in: src/processor.py:45
```
- Mostra o padrão de busca
- Lista arquivos e números de linha
- Às vezes mostra contexto

### Saída do Glob
```
Finding files matching: **/*.test.ts
Found: 
  - src/app/components/task-list/task-list.component.spec.ts
  - src/app/services/api.service.spec.ts
```
- Mostra o padrão usado
- Lista arquivos correspondentes

## 🎓 Melhores Práticas Aprendidas

A esta altura, você deve entender:

✅ **Diferentes ferramentas para diferentes tarefas** - Use a ferramenta certa para o trabalho

✅ **Descoberta progressiva** - Comece amplo, depois estreite

✅ **Contexto importa** - Faça perguntas de acompanhamento para construir compreensão

✅ **Verifique informações importantes** - Realmente teste instruções de build

✅ **Aprenda pelo exemplo** - Observe como o Claude usa ferramentas para resolver problemas

## 🚀 O Que Você Alcançou

Parabéns! Você completou com sucesso:
- ✅ Dominou as ferramentas principais de exploração (Read, Grep, Glob, Bash)
- ✅ Explorou bases de código Python e Angular
- ✅ Entendeu estrutura do projeto, dependências e arquitetura
- ✅ Aprendeu como fazer perguntas eficazes
- ✅ Praticou integração em projetos desconhecidos rapidamente

### Principais Conclusões
- O Claude Code pode acelerar dramaticamente a exploração de código
- A ferramenta certa torna a tarefa muito mais fácil
- Começar com perguntas de alto nível e aprofundar é eficaz
- Sempre verifique informações críticas (passos de build, dependências)
- Perguntas de acompanhamento aprofundam a compreensão

## 📚 Recursos Adicionais

- **Referência de Ferramentas**: [Claude Code Tools](https://code.claude.com/docs/en/tools-reference)
- **Melhores Práticas**: [Prompting Eficaz](https://code.claude.com/docs/en/best-practices)
- **Fluxos de Trabalho Comuns**: [Padrões de Exploração de Código](https://code.claude.com/docs/en/common-workflows)

## 🔜 Próximos Passos

No [Lab 3 - Edição de Código e Testes](Lab-3-Code-Editing.md), você aprenderá:
- Como editar código com as ferramentas Edit e Write
- Gerar testes unitários abrangentes
- Refatorar e melhorar código existente
- Melhores práticas para desenvolvimento assistido por IA

---

#### Você completou com sucesso o Lab 2! Clique em [Próximo Lab →](Lab-3-Code-Editing.md) para continuar.
