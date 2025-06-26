import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: shadow,
});
// Problème spécifique à leaflet. Cette dépendance utilise des fichiers statiques
// qui ne sont pas importés. Donc ça fonctionne bien en dévelopement mais,
// après build, non.