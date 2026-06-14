# Frontend Next.js

Site público e painel administrativo responsivos, construídos com Next.js, TypeScript e Tailwind CSS.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Rotas principais:

- `/`: portal público
- `/campanhas` e `/noticias`: listagens e detalhes
- `/mural` e `/contato`: formulários integrados à API
- `/admin/login`: autenticação administrativa
- `/admin`: dashboard e gestão

Para produção, execute `npm run build` e `npm run start`.
