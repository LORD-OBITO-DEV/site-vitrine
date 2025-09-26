# BLACK HAT VPS - site principal (boilerplate)

## But
Ce repo est une base pour transformer le site vitrine en site principal / panel public.
Il contient auth simple, dashboard, page pub Adsterra et endpoints pour gérer points et achat.

## Installation (local)
1. Copier `.env.example` → `.env` et remplir les variables (MONGO_URI, SESSION_SECRET, PTERO_API_KEY si besoin)
2. `npm install`
3. `npm run dev`
4. Ouvrir http://localhost:3000

## Déployer
- Render: utiliser un Web Service (Node) et définir les variables d'env dans render.
- VPS: installer Node.js, `git clone`, `npm install`, configurer process manager (pm2) et reverse proxy (nginx) avec SSL.

## Adsterra / pubs
- Insère ton script Adsterra dans `views/show-ad.ejs` (déjà présent).
- Le flux reward: l'utilisateur ouvre `/show-ad`, laisse 30s → frontend appelle `/api/reward` pour créditer +2 points.
- Pour fiabiliser: on peut utiliser callbacks/verification côté serveur si Adsterra fournit events.

## Pterodactyl integration
- Variables `PTERO_API_URL` et `PTERO_API_KEY` sont utilisées dans `routes/dashboard.js` pour la création de serveur.
- **Important**: ne jamais exposer `PTERO_API_KEY` au client. Les appels doivent être faits serveur->Pterodactyl.

## Sécurité & améliorations à prévoir
- Vérifier rate-limits (éviter farming points). Ajouter limite par IP / per-user.
- Ajouter vérification réelle que l'annonce a été vue (via provider callback) si disponible.
- Ajouter email verification, reset password, CSRF, HTTPS, helmet, etc.