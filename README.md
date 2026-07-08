# Agência B

Plataforma interna de gestão de redes sociais da Agência B — calendário de
conteúdo, workflow de aprovação, lembretes de publicação, relatórios de
performance, geração de legendas por IA e módulo de anúncios (Meta Ads).

Uso exclusivo da equipe da agência (sem portal de cliente).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + TypeScript + Tailwind
- [Supabase](https://supabase.com) (Postgres + Auth)
- [Anthropic API](https://platform.claude.com) (geração de legendas e insights)
- Deploy: [Vercel](https://vercel.com)

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # preencher com as credenciais do Supabase e da Anthropic
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Banco de dados

O schema fica em `supabase/migrations/`. Para aplicar num projeto Supabase
novo, cole o conteúdo do arquivo de migration mais recente no SQL Editor do
painel do Supabase (Project → SQL Editor).

## Documentação

- [`docs/APP_REVIEW.md`](./docs/APP_REVIEW.md) — o que falta aprovar em cada
  rede social (Meta, TikTok, LinkedIn, YouTube) para sair do modo de dados de
  teste e usar a API real.
- [`docs/TREINAMENTO.md`](./docs/TREINAMENTO.md) — guia de uso da plataforma
  em linguagem simples, para o dia a dia da agência.

## Nota sobre o Next.js 16

Este projeto usa Next.js 16, que trouxe mudanças que quebram compatibilidade
com versões anteriores (por exemplo, `middleware.ts` virou `proxy.ts`). Antes
de assumir uma convenção do App Router, confira `node_modules/next/dist/docs/`
— ver `AGENTS.md`.
