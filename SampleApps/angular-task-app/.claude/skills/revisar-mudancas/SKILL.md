---
name: revisar-mudancas
description: Revisa as mudanças não commitadas (git diff) e aponta riscos. Use quando o usuário pedir para revisar, resumir ou validar o que mudou.
context: fork
model: sonnet
disable-model-invocation: true
---

## Mudanças atuais

!`git diff HEAD`

## Instruções

1. Resuma as mudanças acima em até 3 tópicos.
2. Liste os riscos: falta de tratamento de erro, valores fixos no código, testes que precisam de atualização.
3. Se não houver diff, diga que não há mudanças.
