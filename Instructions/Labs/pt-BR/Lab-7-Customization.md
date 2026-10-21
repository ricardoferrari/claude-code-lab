# Lab 6 - Personalizando o Claude Code

#### Duração: 30 minutos

## 🎯 Objetivos de Aprendizado

Ao final deste lab, você será capaz de:
- Criar e usar arquivos CLAUDE.md para instruções de projeto
- Construir skills personalizadas para fluxos de trabalho repetíveis
- Configurar hooks de automação para tarefas comuns
- Entender o sistema de memória
- Configurar o Claude Code para as necessidades da sua equipe

## 🎨 Por Que Personalizar?

Logo de início, o Claude Code é poderoso. Mas a personalização o torna **sua** ferramenta:

- **CLAUDE.md**: Ensine ao Claude as convenções do seu projeto
- **Skills**: Empacote fluxos de trabalho como comandos slash
- **Hooks**: Automatize ações (formate ao salvar, execute testes antes de commit)
- **Memory**: O Claude aprende e lembra entre sessões
- **Settings**: Ajuste fino de comportamento e permissões

## 📝 Parte 1: Arquivos CLAUDE.md

CLAUDE.md é como um "README para o Claude"—instruções que o Claude lê no início de cada sessão.

### O Que Colocar no CLAUDE.md

- **Padrões de código** - Guias de estilo, convenções de nomenclatura
- **Decisões de arquitetura** - Por que as coisas são estruturadas dessa forma
- **Bibliotecas preferidas** - O que usar (e evitar)
- **Fluxos de trabalho** - Como testar, construir, fazer deploy
- **Checklists de revisão** - O que verificar antes de fazer commit
- **Contexto do projeto** - Objetivos, restrições, normas da equipe

### Crie Seu Primeiro CLAUDE.md

Navegue até seu projeto Python:

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
claude
```

**Prompt para experimentar:**
```
Crie um arquivo CLAUDE.md para este projeto com estas instruções:

# Padrões de Código
- Use type hints para todos os parâmetros e retornos de funções
- Comprimento máximo de linha: 100 caracteres
- Use docstrings no estilo Google
- Prefira pathlib ao invés de os.path
- Use logging, não declarações print

# Testes
- Escreva testes pytest para todas as novas funções
- Busque 90%+ de cobertura
- Teste tanto o caminho feliz quanto casos extremos

# Tratamento de Erros
- Sempre valide parâmetros de entrada
- Lance ValueError com mensagens descritivas
- Registre erros antes de lançá-los

# Antes de Fazer Commit
- Execute pytest
- Execute mypy para verificação de tipos
- Execute black para formatação
- Garanta que nenhuma declaração print() permaneça
```

### Teste Seu CLAUDE.md

Reinicie o Claude para carregar o arquivo:

```bash
exit
claude
```

Agora peça ao Claude para adicionar uma nova função:

```
Adicione uma função para processar dados JSON. Ela deve validar a entrada e transformá-la para nosso formato padrão.
```

**Observe**: O Claude segue automaticamente os padrões do CLAUDE.md!
- Type hints incluídos
- Docstring no estilo Google
- Validação de entrada
- Logging apropriado

### CLAUDE.md Avançado

Adicione contexto e restrições:

```
Adicione estas seções ao CLAUDE.md:

# Contexto do Projeto
Este é um pipeline de processamento de dados para analytics. Performance é crítica—processamos milhões de registros. Prefira streaming ao invés de carregar datasets inteiros na memória.

# Dependências
- pandas: Manipulação de dados (já incluído)
- sqlalchemy: Banco de dados (já incluído)
- NÃO adicione novas dependências pesadas sem discussão

# Arquitetura
- data_processor.py: Lógica principal de processamento
- validators.py: Validação de entrada
- database.py: Operações de DB
- Use injeção de dependência, não estado global
```

## 🚀 Parte 2: Skills Personalizadas

Skills são fluxos de trabalho reutilizáveis empacotados como comandos slash. Como `/test` ou `/review`.

### Entendendo Skills

**Skills são armazenadas em:** `.claude/skills/`

**Estrutura de skill:**
```markdown
---
name: test
description: Executar testes e reportar resultados
---

# Instruções para o Claude

1. Execute a suíte completa de testes
2. Se algum teste falhar, analise o porquê
3. Mostre relatório de cobertura
4. Sugira testes para código não coberto
```

### Crie Sua Primeira Skill

**Prompt para experimentar:**
```
Crie uma skill personalizada chamada '/review-pr' que:
1. Mostre o git diff atual
2. Revise as mudanças para:
   - Problemas de qualidade de código
   - Testes faltando
   - Preocupações de segurança
   - Necessidades de documentação
3. Execute testes para verificar que nada quebrou
4. Forneça um resumo com aprovação/reprovação

Salve como uma skill que eu possa reutilizar.
```

O Claude criará `.claude/skills/review-pr.md`

### Use Sua Skill

Reinicie o Claude, então:

```bash
/review-pr
```

**A skill executa automaticamente!** O Claude segue as instruções que você definiu.

### Crie Mais Skills Úteis

**Skill: Verificação de Deploy**

```
Crie uma skill '/deploy-check' que verifica:
- Todos os testes passam
- Sem comentários TODO ou FIXME
- Número de versão foi incrementado
- CHANGELOG atualizado
- Sem declarações console.log ou print()
- Dependências estão atualizadas
```

**Skill: Nova Feature**

```
Crie uma skill '/new-feature' que guia através de:
1. Perguntar qual feature construir
2. Criar um plano
3. Implementar com testes
4. Atualizar documentação
5. Criar uma branch git e commit
```

**Skill: Correção de Bug**

```
Crie uma skill '/fix-bug' que:
1. Pergunta pela descrição do bug ou mensagem de erro
2. Busca na codebase por código relacionado
3. Identifica a causa raiz
4. Corrige o bug
5. Adiciona teste para prevenir regressão
6. Cria um commit
```

## ⚡ Parte 3: Hooks de Automação

Hooks executam automaticamente quando certos eventos acontecem.

### Tipos de Hooks

| Hook | Quando Executa | Usos Comuns |
|------|---------------|-------------|
| `beforeToolCall` | Antes de qualquer ferramenta | Backup, logging |
| `afterToolCall` | Depois de qualquer ferramenta | Limpeza, validação |
| `beforeEdit` | Antes de editar um arquivo | Backup |
| `afterEdit` | Depois de editar um arquivo | Formatar, lint |
| `beforeBash` | Antes de comando shell | Verificações de segurança |
| `afterBash` | Depois de comando shell | Log de output |

### Configure Hooks

Hooks ficam em `settings.json`. Vamos configurar alguns:

**Prompt para experimentar:**
```
Configure estes hooks de automação em .claude/settings.json:

1. Depois de editar qualquer arquivo Python, execute o formatador black
2. Depois de editar qualquer arquivo TypeScript, execute prettier  
3. Antes de qualquer git commit, execute a suíte de testes
4. Depois de ler qualquer arquivo, registre o nome do arquivo e timestamp em .claude/access.log
```

Exemplo de configuração:

```json
{
  "hooks": {
    "afterEdit": {
      "**/*.py": "black {file}",
      "**/*.ts": "prettier --write {file}"
    },
    "beforeBash": {
      "git commit": "pytest && echo 'Testes passaram'"
    }
  }
}
```

### Teste Seus Hooks

Faça uma edição:

```
Adicione um comentário ao data_processor.py
```

**Observe**: O formatador Black executa automaticamente após a edição!

### Exemplos de Hooks Avançados

**Auto-gerar stubs de tipo:**
```json
{
  "hooks": {
    "afterEdit": {
      "**/*.py": "mypy --install-types --non-interactive {file}"
    }
  }
}
```

**Verificação de segurança antes de comandos destrutivos:**
```json
{
  "hooks": {
    "beforeBash": {
      "rm -rf*": "echo 'Prevenido comando rm -rf potencialmente perigoso'"
    }
  }
}
```

## 🧠 Parte 4: Sistema de Memória

O Claude Code tem um sistema de memória integrado que aprende entre sessões.

### Memória Automática

O Claude salva automaticamente memórias em `~/.claude/projects/SEU_PROJETO/memory/`

**Tipos de memória:**
- **user**: Info sobre você (papel, preferências)
- **feedback**: Como você gosta que o Claude trabalhe
- **project**: Objetivos, restrições, trabalho em andamento
- **reference**: Onde encontrar coisas

### Visualize Suas Memórias

**Prompt para experimentar:**
```
Mostre-me o que você aprendeu sobre este projeto e como eu gosto de trabalhar.
```

**Prompt para experimentar:**
```
Liste todas as memórias que você salvou sobre este projeto.
```

### Salve Memórias Manualmente

**Prompt para experimentar:**
```
Lembre-se: Eu prefiro mensagens de erro detalhadas ao invés de genéricas. Quando algo falhar, sempre mostre o traceback completo e sugira correções específicas.
```

O Claude salva isso como uma memória de feedback!

**Prompt para experimentar:**
```
Lembre-se: O módulo data_processor é o núcleo do sistema. Mudanças aqui requerem testes extra cuidadosos e uma revisão do líder da equipe antes de fazer merge.
```

O Claude salva isso como contexto do projeto!

### Usando Memórias

Em sessões futuras:

```
Com base no que você sabe sobre minhas preferências, revise este tratamento de erros.
```

O Claude lembrará sua preferência por mensagens de erro detalhadas!

### Gerenciando Memórias

**Atualizar uma memória:**
```
Na verdade, mudei de ideia sobre mensagens de erro. Erros breves e acionáveis são melhores que tracebacks completos.
```

**Remover uma memória:**
```
Esqueça a restrição sobre revisões do líder da equipe para data_processor. Simplificamos o processo.
```

## 🎯 Parte 5: Configurações e Settings

Ajuste fino do comportamento do Claude Code com settings.

### Hierarquia de Settings

1. **User settings**: `~/.claude/settings.json` - Padrões globais
2. **Project settings**: `.claude/settings.json` - Específico do projeto
3. **Runtime**: Flags de linha de comando sobrescrevem ambos

### Configurações Principais

Abra suas configurações:

```bash
code ~/.claude/settings.json
```

**Prompt para experimentar:**
```
Ajude-me a configurar estas settings:

1. Definir modelo padrão como Claude Opus para tarefas complexas
2. Definir auto-update para canal stable (não latest)
3. Configurar modo de permissão para 'ask' para edições de arquivo
4. Definir alerta de uso máximo de tokens de sessão
5. Configurar opções de formatação do prettier
```

Exemplo de `settings.json`:

```json
{
  "model": "claude-opus-5-5",
  "autoUpdatesChannel": "stable",
  "permissions": {
    "mode": "ask",
    "allowed": [
      "read:**/*",
      "glob:**/*",
      "grep:**/*"
    ]
  },
  "hooks": {
    "afterEdit": {
      "**/*.{js,ts,tsx}": "prettier --write {file}"
    }
  },
  "env": {
    "PYTHONPATH": "./src"
  }
}
```

### Settings Específicas do Projeto

Para configurações compartilhadas pela equipe:

```bash
cd hol-claude-code-lab/SampleApps/python-data-processor
```

**Prompt para experimentar:**
```
Crie configurações de projeto em .claude/settings.json que todos os membros da equipe devem usar:

- Requer permissão explícita para escritas de arquivo
- Auto-executa black e mypy após edições Python
- Define PYTHONPATH para ./src
- Configura comando de teste: pytest -v --cov
```

Faça commit deste arquivo para que a equipe compartilhe as configurações!

## 🎯 Exercício: Construa Sua Configuração Ideal

Agora crie uma pilha completa de personalização!

### Exercício: Configuração Completa do Projeto

**Sugestão de prompt:**
```
Configure um ambiente completamente personalizado para este projeto:

1. CLAUDE.md com:
   - Padrões de código para Python e TypeScript
   - Requisitos de testes
   - Checklist de revisão
   - Processo de deployment
   - Armadilhas comuns e como evitá-las

2. Skills:
   - /quick-test: Execute testes apenas para arquivos alterados
   - /full-review: Fluxo completo de revisão de código
   - /prepare-pr: Prepare código para pull request
   - /deploy-staging: Deploy para ambiente de staging

3. Hooks:
   - Auto-formatar ao salvar arquivo
   - Execute testes afetados após edições
   - Previna commits com testes falhando
   - Registre todos os comandos bash em audit.log

4. Memory:
   - Salve decisões de arquitetura do projeto
   - Salve minhas preferências de código
   - Documente plano de refatoração em andamento

Guie-me através da criação de cada peça e testando-a.
```

## 💡 Melhores Práticas para Personalização

### 1. Comece Simples

Não personalize tudo de uma vez:
1. Comece com o básico do CLAUDE.md
2. Adicione uma skill útil
3. Adicione hooks conforme necessidades surgirem
4. Deixe a memória se construir naturalmente

### 2. Documente para a Equipe

Se compartilhar configs:
```
Crie um arquivo CUSTOMIZATION.md documentando:
- O que foi personalizado e por quê
- Como usar skills personalizadas
- Quais hooks estão ativos
- Como modificar settings
```

### 3. Controle de Versão

**Faça commit de:**
- `.claude/settings.json` (configurações do projeto)
- `CLAUDE.md`
- `.claude/skills/`

**Não faça commit de:**
- `~/.claude/` (configurações de usuário)
- Chaves de API ou tokens
- Preferências pessoais

### 4. Teste Personalizações

Depois de adicionar hooks ou skills:
```
Teste minha nova configuração executando um fluxo de trabalho de desenvolvimento típico.
```

### 5. Itere Baseado no Uso

Ajuste conforme aprende o que é útil:
```
O hook de auto-formatação está disparando com muita frequência. Ajuste-o para executar apenas para arquivos que eu editei explicitamente, não arquivos que o Claude lê.
```

## 🔧 Personalização Avançada

### Lógica Condicional no CLAUDE.md

```markdown
# CLAUDE.md

# Ao trabalhar em backend (arquivos Python)
- Foque em performance e eficiência de banco de dados
- Sempre adicione logging abrangente

# Ao trabalhar em frontend (arquivos TypeScript)
- Foque em experiência do usuário e acessibilidade
- Mantenha o tamanho do bundle em mente
- Teste em múltiplos tamanhos de tela
```

### Composição de Skills

Skills podem chamar outras skills:

```markdown
---
name: full-cycle
description: Ciclo completo de desenvolvimento de feature
---

1. Execute /new-feature para implementar
2. Execute /full-review para verificar qualidade
3. Execute /prepare-pr para preparar para revisão
```

### Settings Específicas de Ambiente

Diferentes configurações para dev vs prod:

```json
{
  "environments": {
    "development": {
      "permissions": "allow-all",
      "hooks": { "afterEdit": "..." }
    },
    "production": {
      "permissions": "ask",
      "hooks": { "beforeBash": "..." }
    }
  }
}
```

## 🎓 O Que Você Aprendeu

Ao completar este lab, você agora entende:

✅ **CLAUDE.md** - Instruções de projeto que o Claude sempre segue

✅ **Skills Personalizadas** - Fluxos de trabalho reutilizáveis como comandos slash

✅ **Hooks de Automação** - Ações que executam automaticamente

✅ **Sistema de Memória** - Aprendizado persistente entre sessões

✅ **Settings** - Ajuste fino de comportamento e permissões

✅ **Compartilhamento em Equipe** - Configurações que funcionam para todos

## 🚀 Principais Aprendizados

1. **Personalização é poderosa** - Faça o Claude trabalhar do seu jeito

2. **CLAUDE.md é essencial** - Todo projeto deveria ter um

3. **Skills economizam tempo** - Empacote fluxos de trabalho comuns

4. **Hooks automatizam trabalho repetitivo** - Formate, lint, teste automaticamente

5. **Memória se constrói com o tempo** - O Claude melhora conforme vocês trabalham juntos

6. **Compartilhe com a equipe** - Ferramentas consistentes para todos

## 📚 Recursos Adicionais

- **Guia CLAUDE.md**: [Memory and Instructions](https://code.claude.com/docs/en/memory)
- **Documentação de Skills**: [Custom Skills](https://code.claude.com/docs/en/skills)
- **Referência de Hooks**: [Automation Hooks](https://code.claude.com/docs/en/hooks)
- **Referência de Settings**: [Configuration](https://code.claude.com/docs/en/settings)

## 🎉 Parabéns!

Você completou todos os 6 labs do Claude Code Hands-On Lab!

### O Que Você Dominou

Ao longo destes labs, você aprendeu:

1. **Lab 1**: Instalação, configuração e básicos
2. **Lab 2**: Exploração de código com Read, Grep, Glob
3. **Lab 3**: Edição de código, testes e refatoração
4. **Lab 4**: Trabalhando com múltiplos agentes
5. **Lab 5**: Integração MCP com serviços externos
6. **Lab 6**: Personalização para seu fluxo de trabalho

### Você Está Agora Pronto Para

- ✅ Usar o Claude Code efetivamente em projetos reais
- ✅ Navegar e entender qualquer codebase rapidamente
- ✅ Escrever e manter código de alta qualidade com assistência de IA
- ✅ Orquestrar fluxos de trabalho complexos com múltiplos agentes
- ✅ Integrar ferramentas e serviços externos via MCP
- ✅ Personalizar o Claude Code para as necessidades da sua equipe

### Próximos Passos

**Aplique suas habilidades:**
- Use o Claude Code em seu trabalho diário
- Compartilhe conhecimento com sua equipe
- Construa integrações personalizadas para seu fluxo de trabalho
- Contribua para a comunidade

**Continue aprendendo:**
- [Claude Academy](https://academy.claude.com/)
- [Claude Code Blog](https://claude.com/blog)
- [API Documentation](https://docs.anthropic.com/)
- [Community Examples](https://github.com/topics/claude-code)

**Mantenha-se atualizado:**
- Siga [@AnthropicAI](https://twitter.com/AnthropicAI)
- Assine a newsletter da Anthropic
- Consulte os docs para novas funcionalidades

## 📝 Feedback

Adoraríamos ouvir sobre sua experiência:
- O que funcionou bem?
- O que foi desafiador?
- O que você gostaria de ver em labs futuros?

Compartilhe seu feedback e ajude a tornar este lab melhor para outros!

---

#### 🎉 Você completou com sucesso o Claude Code Hands-On Lab! Feliz codificação com o Claude!
