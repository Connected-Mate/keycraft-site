# Keycraft — site de présentation

Site statique français, construit avec Vite. Aucun service distant n’est appelé par l’interface : dépendances Three.js, fontes et images sont regroupées dans le build.

## Développement

```
npm ci
npm run dev
npm run build
npm run preview
```

Le build `dist/` est portable sous un préfixe GitHub Pages grâce à `base: './'`. Le dépôt prévu est `Connected-Mate/keycraft-site`.

## Publication

Les seules valeurs de distribution variables sont dans `src/site-config.js`. Tant que `appStoreURL` est vide, la page indique honnêtement « Bientôt sur l’App Store ». Activer le lien vérifié uniquement après approbation et disponibilité publique sur l’App Store. La simple création de la fiche ou un upload TestFlight ne suffit pas. Aucun prix n’est annoncé. Le premier lancement vise l’iPhone sous iOS 17+ ; aucune compatibilité iPad n’est annoncée.

Ne pas copier les builds natifs, enregistrements de l’iPhone ou captures de notifications privées dans ce dépôt. Les images présentes proviennent exclusivement des aperçus propres du catalogue natif, des modèles Blender et de l’icône.

## Scène et accessibilité

Le héros affiche des géométries 3D de touches avec éclairage PBR Three.js, ombres et trois matières. Les effets de cette scène sont une illustration web, pas le moteur de l’extension. La collection utilise les 13 aperçus natifs et une démo de saisie éphémère. Les actions de la démo sont volontairement simplifiées, comme indiqué à l’écran.

La scène est limitée à 30 images/s, au ratio de pixels 1,75 et se met en pause hors écran, onglet masqué ou préférence de mouvement réduit. Boutons de rotation et pause disponibles au clavier. Si WebGL est indisponible, les mêmes matières restent consultables via leurs images. `?no3d=1` permet de vérifier ce mode. Les fontes sont embarquées. Aucun cookie, stockage local, réseau analytique ni donnée de frappe envoyée.

Contact public vérifié : alex.connectedmate@gmail.com. Éditeur : Alexandre Cormeraie · Connected Mate.
