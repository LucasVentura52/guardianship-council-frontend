# Frontend Next.js

Site público e painel administrativo responsivos, construídos com Next.js, TypeScript e Tailwind CSS.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Rotas principais:

- `/`: portal público
- `/campanhas` e `/noticias`: listagens e detalhes
- `/mural` e `/contato`: formulários integrados à API
- `/admin/login`: autenticação administrativa
- `/admin/esqueci-senha`: solicitação de recuperação de senha
- `/admin/senha`: troca de senha do administrador autenticado
- `/admin`: dashboard com acessos, indicadores e gestão

As páginas públicas registram visualizações na API sem enviar IP ou informações do
navegador. O painel administrativo não entra nessa contagem.

Para produção, execute `npm run build` e `npm run start`.

## Produção

- Domínio público: `https://siteconselhotutelar.vercel.app/`
- API consumida: `https://guardianshipcouncil.x10.mx/api`
- Use `.env.production.example` como referência para o ambiente da Vercel
