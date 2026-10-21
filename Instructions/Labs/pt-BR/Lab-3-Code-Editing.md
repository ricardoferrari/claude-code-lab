# Lab 3 - Edição de Código e Testes

#### Duração: 30 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste lab, você será capaz de:
- Dominar as ferramentas Edit e Write para modificações de código
- Gerar testes unitários abrangentes com assistência de IA
- Refatorar código mantendo a funcionalidade
- Compreender as melhores práticas para desenvolvimento assistido por IA
- Aprender a iterar e melhorar código gerado por IA

## 🍎 Cenário: Melhorando a Qualidade do Código na DataFlow Analytics

Seu gerente na DataFlow Analytics identificou várias áreas que precisam de atenção:

1. **Cobertura de testes ausente** - Funções críticas não possuem testes unitários
2. **Melhorias no código** - Algumas funções precisam de refatoração para melhor legibilidade
3. **Correção de bugs** - Alguns casos extremos não são tratados adequadamente
4. **Novas funcionalidades** - Adicionar validação e tratamento de erros

Sua tarefa é usar o Claude Code para resolver eficientemente esses problemas mantendo a qualidade do código.

## 🔍 Passo 1: Entendendo Edit vs Write

Antes de começar, vamos entender quando usar cada ferramenta:

### Ferramenta Edit
- **Propósito**: Fazer alterações precisas em arquivos existentes
- **Melhor para**: Modificar código existente, refatoração, correção de bugs
- **Como funciona**: Encontra texto exato e o substitui
- **Segurança**: Preserva código ao redor, alterações cirúrgicas

### Ferramenta Write
- **Propósito**: Criar novos arquivos do zero
- **Melhor para**: Novos arquivos, reescritas completas, conteúdo gerado
- **Como funciona**: Escreve o conteúdo completo do arquivo
- **Segurança**: Requer confirmação antes de sobrescrever arquivos existentes

**Regra Geral**: Sempre prefira Edit para arquivos existentes, Write para novos arquivos.

## 📝 Passo 2: Sua Primeira Edição de Código

Vamos começar com um exemplo simples para entender o fluxo de trabalho do Edit.

### Navegue até o Projeto Python

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

### Tarefa: Adicionar uma Docstring

Vamos adicionar documentação a uma função que está sem ela.

**Prompt para experimentar:**
```
Encontre o arquivo data_processor.py e adicione uma docstring abrangente à função principal de processamento se ela estiver faltando. A docstring deve incluir:
- Descrição da função
- Parâmetros com tipos
- Valor de retorno
- Exemplo de uso
```

**O que observar:**
1. Claude usa `Read` para examinar o arquivo
2. Claude usa `Edit` para fazer a alteração
3. A edição mostra exatamente o que foi alterado (antigo → novo)
4. Você pode revisar antes de aceitar

### Tarefa: Corrigir um Bug

Agora vamos corrigir um problema real no código.

**Prompt para experimentar:**
```
Revise o arquivo data_processor.py em busca de casos extremos no tratamento de erros. Se uma função não tratar entrada vazia adequadamente, adicione validação e tratamento de erros apropriados.
```

**Fluxo de trabalho esperado:**
1. Claude lê e analisa o código
2. Identifica o problema
3. Propõe uma correção usando Edit
4. Explica o raciocínio

## 🧪 Passo 3: Gerando Testes Unitários

A geração de testes é uma das capacidades mais poderosas do Claude Code. Vamos adicionar cobertura de testes abrangente.

### Estabeleça a Cobertura Base

Primeiro, vamos ver quais testes já existem:

```
Mostre-me todos os arquivos de teste neste projeto e execute os testes existentes.
```

Claude deve:
- Usar Glob para encontrar arquivos de teste (test_*.py ou *_test.py)
- Usar Read para examiná-los
- Usar Bash para executar `pytest` ou `python -m unittest`

### Gerar Testes para Código Sem Cobertura

Agora vamos adicionar testes:

**Prompt para experimentar:**
```
Analise a cobertura de testes para data_processor.py. Então gere testes unitários abrangentes cobrindo:
- Cenários de caminho feliz
- Casos extremos (entrada vazia, dados inválidos)
- Condições de erro
- Condições de fronteira

Use o framework pytest e siga as melhores práticas.
```

**O que Claude fará:**
1. Ler o arquivo fonte para entender a funcionalidade
2. Ler testes existentes para entender os padrões
3. Criar novo arquivo de teste ou estender existente usando Write/Edit
4. Gerar casos de teste cobrindo diferentes cenários

### Revisar Testes Gerados

Sempre revise os testes gerados por IA! Pergunte:

```
Explique os casos de teste que você criou. Quais cenários cada teste cobre?
```

### Executar os Testes

Verifique se os testes funcionam:

```
Execute os novos testes e verifique se eles passam. Se algum falhar, depure e corrija-os.
```

**Aprendizado chave**: Claude pode executar testes, analisar falhas e corrigir problemas autonomamente!

## 🔨 Passo 4: Refatorando Código

Refatoração melhora a estrutura do código sem alterar o comportamento. Vamos praticar!

### Identificar Oportunidades de Refatoração

```
Revise data_processor.py e identifique funções que poderiam ser refatoradas para melhor:
- Legibilidade
- Manutenibilidade
- Desempenho
- Separação de responsabilidades

Sugira melhorias específicas.
```

### Aplicar Refatoração

Escolha uma sugestão e aplique-a:

**Prompt de exemplo:**
```
A função process_data está fazendo muitas coisas. Refatore-a:
1. Extraindo lógica de validação em uma função validate_data separada
2. Extraindo lógica de transformação em uma função transform_data
3. Mantendo a função principal como coordenadora

Garanta que todos os testes ainda passem após a refatoração.
```

**O que torna este prompt eficaz:**
- Específico sobre o que mudar
- Claro sobre a estrutura desejada
- Inclui requisito de validação

### Verificar Refatoração

Após refatorar:
```
Execute todos os testes para garantir que a refatoração não quebrou a funcionalidade. Mostre-me os resultados dos testes.
```

## 🎨 Passo 5: Trabalhando com a Aplicação Angular

Agora vamos aplicar essas habilidades ao código frontend.

### Mudar para o Projeto Angular

```bash
exit  # Sair da sessão atual
cd ../angular-task-app
claude
```

### Tarefa: Adicionar um Novo Método ao Componente

**Prompt para experimentar:**
```
No componente task-list, adicione um método chamado filterCompletedTasks que filtra a lista de tarefas para mostrar apenas as tarefas concluídas. Inclua:
- Tipagem TypeScript adequada
- Comentários JSDoc
- Tratamento de erros para listas de tarefas vazias/nulas
```

**Observe:**
- Claude lê o arquivo do componente
- Usa Edit para adicionar o método
- Mantém o estilo de código existente
- Adiciona tipagem adequada

### Tarefa: Gerar Testes de Componente

Testes de Angular são mais complexos, mas Claude os manipula:

```
Gere testes unitários abrangentes para o componente task-list. Cubra:
- Inicialização do componente
- Funcionalidade dos métodos (incluindo o novo método filterCompletedTasks)
- Bindings de Input/Output
- Renderização do template
- Cenários de erro

Use Jasmine e siga as melhores práticas de teste Angular.
```

**O que procurar:**
- Configuração adequada do TestBed
- Serviços mock quando necessário
- Testes para estado do componente e atualizações do DOM

### Tarefa: Adicionar Validação de Formulário

```
No formulário de criação de tarefa, adicione validação do lado do cliente:
- Título da tarefa: obrigatório, mín 3 caracteres, máx 100 caracteres
- Descrição da tarefa: opcional, máx 500 caracteres
- Data de vencimento: obrigatória, deve ser no futuro

Adicione mensagens de erro apropriadas que sejam exibidas no template.
```

**Claude deve:**
1. Editar o arquivo TypeScript do componente para adicionar validadores
2. Editar o template HTML para adicionar mensagens de erro
3. Possivelmente editar estilos para exibição de erros
4. Adicionar testes para lógica de validação

## 🔬 Passo 6: Técnicas Avançadas de Edição

### Edições em Múltiplos Arquivos

Claude pode editar múltiplos arquivos relacionados:

```
Adicione uma nova funcionalidade: prioridades de tarefas (baixa, média, alta). Isso requer:
1. Atualizar a interface Task para incluir prioridade
2. Atualizar o formulário de criação de tarefa para incluir seleção de prioridade
3. Atualizar a exibição da lista de tarefas para mostrar prioridade com codificação por cores
4. Adicionar filtragem por prioridade
5. Gerar testes para a nova funcionalidade
```

**Observe como Claude:**
- Planeja as alterações em múltiplos arquivos
- Faz edições coordenadas
- Mantém consistência
- Testa as alterações

### Melhoria Iterativa

Se a primeira tentativa não for perfeita:

```
As cores de prioridade são difíceis de ver. Use cores mais distintas:
- Prioridade baixa: verde
- Prioridade média: laranja
- Prioridade alta: vermelho

Também adicione um ícone antes de cada tarefa mostrando a prioridade.
```

**Insight chave**: Você pode iterar até que o resultado seja exatamente o que você deseja!

## 💡 Passo 7: Melhores Práticas para Edição de Código

### 1. Sempre Revise as Alterações

Nunca aceite edições de IA cegamente:
- Revise o diff cuidadosamente
- Entenda o que mudou e por quê
- Procure modificações não intencionais
- Verifique se casos extremos são tratados

### 2. Forneça Contexto

Ajude Claude a fazer melhores edições:
```
# ❌ Menos eficaz
Adicione validação ao formulário

# ✅ Mais eficaz
Adicione validação ao formulário de criação de tarefa em task-create.component.ts.
Valide que o título é obrigatório e tem entre 3-100 caracteres.
Mostre mensagens de erro abaixo do campo de entrada.
```

### 3. Teste Após Editar

Sempre verifique se as alterações funcionam:
```
Após fazer essas alterações, execute os testes e inicie o servidor de desenvolvimento para verificar se tudo funciona corretamente.
```

### 4. Itere e Refine

Não espere perfeição imediatamente:
1. Comece com uma versão funcional
2. Teste-a
3. Refine com base em problemas
4. Repita até ficar satisfeito

### 5. Mantenha o Estilo do Código

Claude geralmente corresponde ao estilo existente, mas verifique:
```
Garanta que o novo código segue o estilo e convenções de código existentes neste arquivo.
```

## 🎯 Exercício: Prática Independente

Agora complete estes exercícios por conta própria!

### Exercício 1: Adicionar Log de Erros

**Tarefa**: Adicione log de erros abrangente em todo o processador de dados Python.

**Sugestão de prompt:**
```
Adicione log de erros apropriado usando o módulo logging do Python ao data_processor.py:
1. Configure o logging no nível do módulo
2. Adicione logs de erro para tratamento de exceções
3. Adicione logs de info para etapas principais de processamento
4. Adicione logs de debug para rastreamento detalhado de fluxo
5. Garanta que os testes ainda passam
```

### Exercício 2: Adicionar Estados de Carregamento

**Tarefa**: Adicione indicadores de carregamento ao app Angular quando dados estiverem sendo buscados.

**Sugestão de prompt:**
```
No componente task-list:
1. Adicione uma propriedade de estado de carregamento
2. Configure-a como true ao buscar tarefas da API
3. Configure-a como false quando os dados chegarem ou em erro
4. Atualize o template para mostrar um spinner de carregamento quando loading for true
5. Adicione testes para gerenciamento de estado de carregamento
```

### Exercício 3: Implementar Validação de Entrada

**Tarefa**: Adicione validação a todas as funções de processamento de dados em Python.

**Sugestão de prompt:**
```
Revise todas as funções públicas em data_processor.py e adicione validação de entrada:
- Verificação de tipo
- Verificações de nulo/vazio
- Validação de intervalo quando apropriado
- Lance ValueError com mensagens descritivas para entrada inválida
- Adicione testes para lógica de validação
```

### Exercício 4: Refatorar para Testabilidade

**Tarefa**: Refatore uma função complexa para torná-la mais testável.

**Sugestão de prompt:**
```
A função process_csv_data em data_processor.py é complexa e difícil de testar.
Refatore-a:
1. Extraindo funções menores de propósito único
2. Tornando dependências injetáveis
3. Reduzindo efeitos colaterais
4. Atualizando testes existentes
5. Adicionando novos testes para as funções extraídas
```

## 🧪 Exercício: Desenvolvimento Orientado a Testes (TDD)

Tente escrever testes ANTES da implementação:

```
Usando TDD, adicione uma nova funcionalidade para validar endereços de email no processador de dados:
1. Primeiro, escreva testes que falham para uma função email_validator
2. Então implemente a função para fazer os testes passarem
3. Refatore para clareza
4. Garanta que todos os testes passam
```

## 🔍 Entendendo o Comportamento da Ferramenta Edit

### Como Edit Funciona

A ferramenta Edit:
1. Busca por correspondência exata de texto no arquivo
2. Substitui com novo texto
3. Falha se o texto não for encontrado ou não for único
4. Mostra um diff claro das alterações

### Problemas Comuns do Edit

**Problema: "Texto não encontrado"**
- O texto antigo não corresponde exatamente ao que está no arquivo
- Solução: Claude irá reler o arquivo e tentar novamente

**Problema: "Texto não único"**
- Múltiplos locais têm o mesmo texto
- Solução: Claude fornece mais contexto para torná-lo único

**Problema: Alterações não aplicadas**
- Arquivo pode ter sido modificado em outro lugar
- Solução: Claude relê e tenta novamente

## 📊 Rastreando Suas Alterações

Boas práticas durante a edição:

### Use Git

```
Mostre-me o status atual do git e o diff para ver todas as alterações feitas.
```

### Faça Commits Regularmente

```
Crie um commit com essas alterações. Escreva uma mensagem de commit descritiva explicando o que foi adicionado e por quê.
```

### Crie Branches para Funcionalidades

```
Crie uma nova branch chamada 'feature/task-priorities' e mude para ela antes de fazer essas alterações.
```

## 🎓 O Que Você Aprendeu

Ao completar este lab, você agora entende:

✅ **Edit vs Write** - Quando usar cada ferramenta

✅ **Geração de testes** - Criando suítes de teste abrangentes com IA

✅ **Refatoração** - Melhorando a estrutura do código com segurança

✅ **Alterações em múltiplos arquivos** - Coordenando edições em arquivos relacionados

✅ **Desenvolvimento iterativo** - Refinando código gerado por IA

✅ **Melhores práticas** - Revisando, testando e mantendo qualidade

## 🚀 Principais Conclusões

1. **Edit é cirúrgico, Write é completo** - Use a ferramenta certa para o trabalho

2. **Sempre revise alterações de IA** - Confie, mas verifique

3. **Testes são sua rede de segurança** - Gere-os cedo e execute-os frequentemente

4. **Itere para a perfeição** - A primeira versão raramente é a versão final

5. **Contexto produz código melhor** - Prompts específicos obtêm resultados específicos

6. **Claude lida com complexidade** - Alterações em múltiplos arquivos, refatoração, testes, tudo funciona

## 📚 Recursos Adicionais

- **Documentação da Ferramenta Edit**: [Referência da Ferramenta Edit](https://code.claude.com/docs/en/tools-reference#edit)
- **Melhores Práticas de Teste**: [Escrevendo Testes](https://code.claude.com/docs/en/common-workflows#write-tests)
- **Padrões de Refatoração**: [Qualidade de Código](https://code.claude.com/docs/en/best-practices)

## 🔜 Próximos Passos

No [Lab 4 - Trabalhando com Agentes](Lab-4-Working-With-Agents.md), você aprenderá:
- Como criar e coordenar múltiplos subagentes
- Execução paralela para tarefas complexas
- Comunicação de agentes e agregação de resultados
- Quando usar agentes vs. fazer você mesmo

---

#### Você completou com sucesso o Lab 3! Clique em [Próximo Lab →](Lab-4-Working-With-Agents.md) para continuar.
