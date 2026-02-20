# 🔒 Configuração de Ambiente - Segurança da API

## Visão Geral

Este projeto utiliza variáveis de ambiente para proteger a URL da API. A URL não é mais hardcoded no código, garantindo maior segurança.

## 📋 Arquivos de Configuração

### Produção
O repositório Git inclui estes arquivos de exemplo:

- **`.env.example`** - Template com valores padrão para documentação
- **`.env.production`** - Configuração para produção (NÃO commitar este arquivo)
- **`.env.local`** - Configuração para desenvolvimento local (NÃO commitar este arquivo)

## ⚙️ Como Configurar

### Para Desenvolvimento Local

1. Copie o arquivo `.env.example` ou crie um `.env.local`:
```bash
cp .env.example .env.local
```

2. Edite o `.env.local` com a URL da sua API local:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Para Produção

1. Crie um arquivo `.env.production` na raiz do projeto:
```bash
touch .env.production
```

2. Configure a URL de produção:
```env
NEXT_PUBLIC_API_URL=https://sua-api-producao.com/api
```

3. **⚠️ IMPORTANTE**: Adicione `.env.production` ao `.gitignore` para não expor a URL em público.

## 🔧 Client API Centralizado

O projeto utiliza um cliente HTTP centralizado em `src/services/api.ts` que:

- ✅ Encapsula todas as chamadas HTTP
- ✅ Usa variáveis de ambiente automaticamente
- ✅ Implementa timeout de 30 segundos
- ✅ Trata erros de forma consistente
- ✅ Suporta GET, POST, PUT, DELETE

### Exemplo de Uso

```typescript
import { api } from '@/services/api';

// GET
const pacientes = await api.get<Paciente[]>('/pacientes');

// POST
const agendamento = await api.post<Agendamento>('/agendamentos', dados);

// PUT
const atualizado = await api.put<Paciente>('/pacientes', dados);

// DELETE
await api.delete('/agendamentos/123', dados);
```

## 📦 Deploy

### No Railway, Vercel ou Similar
Defina a variável de ambiente `NEXT_PUBLIC_API_URL` no painel de configurações:

```
NEXT_PUBLIC_API_URL=https://sua-api.com/api
```

### Com azd (Azure Developer CLI)
Configure no arquivo `azure.yaml` ou no painel Azure:

```yaml
env:
  - name: NEXT_PUBLIC_API_URL
    value: https://seu-recurso.azureapp.net/api
```

## 🔐 Segurança

- ✅ URLs não aparecem em logs do Git
- ✅ URLs não são versionadas no repositório
- ✅ Cada ambiente pode ter sua própria URL
- ✅ Fácil alteração sem recompilar código

## 📚 Variáveis Disponíveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL base da API | `http://localhost:8080/api` |

> **Nota**: O prefixo `NEXT_PUBLIC_` significa que a variável é acessível no navegador. Apenas use para valores que não sejam sensíveis.

## ✅ Checklist de Segurança

- [ ] `.env.local` foi criado e configurado
- [ ] `.env.production` NÃO foi commitado
- [ ] `.gitignore` contém `*.env.local` e `*.env.production`
- [ ] URL de produção está corretamente configurada no deploy
- [ ] Nunca hardcode URLs novamente no código

---

**Última atualização**: 20 de fevereiro de 2026
