# Validation — 20 octobre 2026

## Build et déploiement

- `npm run build` : réussi. Le seul avertissement est la scène Three.js différée (550 Ko minifiés, 138 Ko gzip). Le code principal est 10,4 Ko minifié / 4,3 Ko gzip. La scène ne se charge pas sur les pages d’assistance/confidentialité.
- `npm install` : 0 vulnérabilité rapportée pour les 19 paquets installés.
- Build testé sous **/keycraft-site/** via serveur HTTP local, pas uniquement à la racine Vite. Liens, images et modules fonctionnent avec le préfixe prévu.
- Aucun appel à une police externe ou à un service analytique. Dépendances MIT/OFL et notices conservées dans `public/licenses/`.
- Actions GitHub officielles vérifiées via leurs dernières releases : checkout7.0.1, setup-node7.1.0, configure-pages6.0.0, upload-pages-artifact5.0.0, deploy-pages5.0.1. Workflow utilise ces versions majeures.

## Browser Hub

Session `keycraft-site-20261020`, Chromium. Captures réelles du navigateur local dans `proof/` (hors dépôt). Tests à1440×1000,393×852 et320×800 ; le profil393px est une émulation Chromium, pas un iPhone physique ni Safari.

- Héros WebGL initialisé, 3 matières sélectionnables, bouton pause : `aria-pressed=true`, libellé « Reprendre le mouvement 3D ».
- 13 thèmes : chaque sélection met à jour le thème, les descriptions et l’aperçu ; les13images sont décodées à640px. Saisie « a » vérifiée après chaque sélection.
- Séquence lettres, suppression, chiffres, retour aux lettres, majuscule, espace et nouvelle ligne : résultat exact `q7A \ne`.
- Suppression d’un emoji familial composé : `A👨‍👩‍👧‍👦` devient `A`.
- Remplacement de sélection : `hello` avec positions1…4 puis « a » devient `hao`.
- Pas de débordement horizontal aux3largeurs testées. La rangée des thèmes a son défilement interne.
- Variante sansWebGL (`?no3d=1`) : rendu de secours réel, passagePearl→Glass charge `glass.webp`, contrôles3Dmasqués.
- Réduction des mouvements : préférence système câblée via`matchMedia`, CSS`prefers-reduced-motion`. Branche vérifiée avec le commutateur de diagnostic `?reduce-motion=1` : pause3Dactive, animationsCSS à0,01ms. Ce test ne constitue pas un test de réglage système iOS.
- Pageassistance :10questions accessibles sous`details/summary`, adresse publique, instructions réelles. Pageconfidentialité : aucune scène3Dchargée ni ressource de domaine externe. PremierTab atteint le lien d’évitement avec focus visible.

## Audit et limites

Accessibilité3/4, performance3/4, responsive3/4, cohérence4/4, composition4/4 — 17/20. Aucun problème bloquant observé. Les touches de la démo sont naturellement compactes surmobile ; le champ texte au-dessus offre la même saisie avec le clavier du système. Tous les autres contrôles importants ont une cible44px. La légende précise que le rendu et les effets web sont simplifiés.

Pas de benchmark de fluidité matériel, pas de testSafari physique. La cadence30fps et le ratio1,75 sont des plafonds configurés. Les animations s’arrêtent hors écran et dans un onglet masqué. Les images livrées sont optimiséesWebP ; aucune capture privée d’iPhone n’est présente. Les fichiersoriginaux, capturesQA etnode_modules sont exclus deGit et du buildpublic.

Les tarifs ne sont pas annoncés. La ficheAppStore6824853207 est connue mais non publique : lien conservé inactif dans la configuration. Le site affiche « Bientôt sur l’AppStore » jusqu’à confirmation de publication.

## Assistance et confidentialité en anglais

Les deux pages `en/support.html` et `en/privacy.html` ont été ajoutées par l’agent de préparation Store, intégrées comme entrées Vite et vérifiées dans le build final à cinq pages. Liens de langue réciproques ; lang=en ; tous les liens et ressources locaux retournent HTTP200 sous `/keycraft-site/en/`. Pages lisibles aux largeurs393 et320px, sans débordement. Capture `proof/support-english-mobile.png`. Le titre marketing reste français ; les pages de support répondent à la langue principale anglaise du Store.

L’OpenGraph `public/assets/social.png` existe (221Ko), se charge en HTTP200 et contient uniquement une capture propre du héros du site. Le build public complet fait environ1,6Mo, tous thèmes inclus.

## Publication publique vérifiée

Le 20 octobre 2026, le workflow Pages [39397305628](https://github.com/Connected-Mate/keycraft-site/actions/runs/39397305628) a déployé avec succès le commit `fa89294`. HTTPS est imposé. Après la propagation initiale, l’URL publique sans paramètre a été vérifiée : https://connected-mate.github.io/keycraft-site/.

Dans une nouvelle session Browser Hub, les cinq pages publiques (`/`, `privacy.html`, `support.html`, `en/privacy.html`, `en/support.html`) retournent HTTP200 et les titres/langues attendus. Le héros WebGL est initialisé ; les boutons Glass, rotation et pause répondent. Les treize aperçus publics se décodent correctement et la saisie « a » fonctionne dans chacun. Aucun domaine externe n’est sollicité par les ressources de la page. À393px, aucun débordement ni image cassée. Les dix questions du support anglais s’ouvrent et se ferment normalement.

Preuves locales exclues du dépôt : `proof/public-desktop.png`, `proof/public-mobile-collection.png`, `proof/public-en-support.png`. Cette vérification publique utilise Chromium, avec un profil mobile émulé ; elle ne constitue pas un test Safari sur appareil physique.

Une correction documentaire distingue maintenant les designs ayant un bouton d’action nommé des autres designs. Le statut de l’App Store reste « Bientôt sur l’App Store » : un site publié ne signifie pas que l’application est déjà disponible.
