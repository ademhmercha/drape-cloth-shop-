require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const s = (stock) => stock;
const sizes = {
  women: (s1,s2,s3,s4) => [{ size:'XS', stock:s1 },{ size:'S', stock:s2 },{ size:'M', stock:s3 },{ size:'L', stock:s4 }],
  men: (s1,s2,s3,s4) => [{ size:'S', stock:s1 },{ size:'M', stock:s2 },{ size:'L', stock:s3 },{ size:'XL', stock:s4 }],
  kids: () => [{ size:'4A', stock:8 },{ size:'6A', stock:10 },{ size:'8A', stock:7 },{ size:'10A', stock:5 }],
  acc: () => [{ size:'Unique', stock:20 }],
  shoes: (start) => [{ size:'38', stock:4 },{ size:'39', stock:6 },{ size:'40', stock:8 },{ size:'41', stock:7 },{ size:'42', stock:5 }]
};
const C = {
  noir: { name:'Noir', hex:'#1C1C1C' },
  blanc: { name:'Blanc', hex:'#FFFFFF' },
  beige: { name:'Beige', hex:'#E8DCC8' },
  camel: { name:'Camel', hex:'#C19A6B' },
  or: { name:'Or', hex:'#C9A84C' },
  rouge: { name:'Rouge', hex:'#CB4154' },
  bordeaux: { name:'Bordeaux', hex:'#7B1D1D' },
  bleu: { name:'Bleu', hex:'#2563EB' },
  marine: { name:'Bleu Marine', hex:'#1B3A6B' },
  gris: { name:'Gris', hex:'#BDBDBD' },
  anthracite: { name:'Anthracite', hex:'#3D3D3D' },
  creme: { name:'Crème', hex:'#FAF9F6' },
  rose: { name:'Rose Poudré', hex:'#F2A8B8' },
  lavande: { name:'Lavande', hex:'#C4AEDC' },
  terracotta: { name:'Terracotta', hex:'#CB6843' },
  kaki: { name:'Kaki', hex:'#6B7A3D' },
  sable: { name:'Sable', hex:'#C9A98A' },
  ivoire: { name:'Ivoire', hex:'#FFFFF0' }
};

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`;

const products = [
  // ═══════════════════════ FEMMES (25) ═══════════════════════
  {
    name: 'Robe Midi Ivoire Éditorial', description: 'Robe midi en soie lavée avec des détails plissés subtils. Une pièce intemporelle pour la femme moderne.',
    price: 345, category: 'women', sizes: sizes.women(5,10,8,3),
    colors: [C.ivoire, C.sable], images: [img('1539008835657-9e8e9680c956')], brand: 'DRAPE', tags: ['robe','midi','soie','élégant'], isFeatured: true
  },
  {
    name: 'Manteau Camel Long', description: 'Manteau en laine camel brossée, coupe longue et droite. La pièce signature de la saison.',
    price: 520, category: 'women', sizes: sizes.women(4,7,5,2),
    colors: [C.camel, C.noir], images: [img('1548624313-0396c75e4b1a')], brand: 'DRAPE', tags: ['manteau','camel','hiver','long'], isFeatured: true
  },
  {
    name: 'Jupe Plissée Soleil', description: 'Jupe midi plissée en crêpe léger. Taille élastique pour un confort optimal et un tombé parfait.',
    price: 175, category: 'women', sizes: sizes.women(6,9,7,4),
    colors: [C.or, C.terracotta], images: [img('1583496661160-fb5886a0aaaa')], brand: 'DRAPE', tags: ['jupe','plissée','été','légère'], isFeatured: false
  },
  {
    name: 'Pull Cachemire Côtelé', description: 'Pull en cachemire pur côtelé, col roulé. Le luxe ultime pour les jours frais.',
    price: 420, category: 'women', sizes: sizes.women(4,8,6,3),
    colors: [C.creme, C.camel, C.noir], images: [img('1576566588028-4147f3842f27')], brand: 'DRAPE', tags: ['pull','cachemire','hiver','luxe'], isFeatured: true
  },
  {
    name: 'Blazer Ivoire Oversize', description: 'Blazer oversize en crêpe stretch. Coupe architecturale pour une allure affirmée.',
    price: 295, category: 'women', sizes: sizes.women(5,8,9,4),
    colors: [C.ivoire, C.gris], images: [img('1585487000160-6ebcfceb0d03')], brand: 'DRAPE', tags: ['blazer','oversize','élégant'], isFeatured: false
  },
  {
    name: 'Robe Longue Satin Noir', description: 'Robe longue en satin fluide avec fente latérale. Pour les soirées mémorables.',
    price: 480, category: 'women', sizes: sizes.women(3,6,8,4),
    colors: [C.noir, C.rouge], images: [img('1566479179817-1e5e2b68a75b')], brand: 'DRAPE', tags: ['robe','satin','soirée','long'], isFeatured: true
  },
  {
    name: 'Chemisier Lin Drapé', description: 'Chemisier en lin naturel avec col noué. Légèreté et sophistication pour les journées chaudes.',
    price: 145, category: 'women', sizes: sizes.women(6,10,8,5),
    colors: [C.blanc, C.beige], images: [img('1564257631407-4deb1f99d992')], brand: 'DRAPE', tags: ['chemisier','lin','été','drapé'], isFeatured: false
  },
  {
    name: 'Pantalon Wide Leg Crème', description: 'Pantalon à jambe large taille haute en tissu fluide. L\'équilibre parfait entre confort et élégance.',
    price: 225, category: 'women', sizes: sizes.women(5,8,7,4),
    colors: [C.creme, C.beige], images: [img('1595777457583-95e059d581b8')], brand: 'DRAPE', tags: ['pantalon','wide-leg','élégant'], isFeatured: false
  },
  {
    name: 'Veste Structurée Kaki', description: 'Veste à épaules structurées en sergé de coton. Le statement piece de la saison.',
    price: 310, category: 'women', sizes: sizes.women(4,7,8,4),
    colors: [C.kaki, C.noir], images: [img('1539533113208-f6df8cc8b543')], brand: 'DRAPE', tags: ['veste','structuré','kaki'], isFeatured: false
  },
  {
    name: 'Robe Wrap Terracotta', description: 'Robe portefeuille en viscose fleurie. Coupe universelle qui sublime toutes les silhouettes.',
    price: 195, category: 'women', sizes: sizes.women(5,9,8,4),
    colors: [C.terracotta, C.rouge], images: [img('1515886657613-9f3515b0c78f')], brand: 'DRAPE', tags: ['robe','wrap','floral','été'], isFeatured: false
  },
  {
    name: 'Cardigan Cachemire Ouvert', description: 'Cardigan long en cachemire mélangé, sans boutons. À porter sur tout, partout.',
    price: 285, category: 'women', sizes: sizes.women(5,8,7,3),
    colors: [C.beige, C.gris, C.camel], images: [img('1551803091-e20673f15770')], brand: 'DRAPE', tags: ['cardigan','cachemire','basique'], isFeatured: false
  },
  {
    name: 'Top Asymétrique Soie', description: 'Top asymétrique en soie lavée avec détail drapé sur l\'épaule. Minimalisme luxueux.',
    price: 165, category: 'women', sizes: sizes.women(6,10,9,5),
    colors: [C.blanc, C.noir, C.bordeaux], images: [img('1509631179647-0177331693ae')], brand: 'DRAPE', tags: ['top','soie','asymétrique'], isFeatured: false
  },
  {
    name: 'Trench-Coat Sable', description: 'Trench classique en gabardine de coton. Imperméable et intemporel.',
    price: 590, category: 'women', sizes: sizes.women(3,6,7,4),
    colors: [C.sable, C.beige], images: [img('1591369822096-ffd140ec948f')], brand: 'DRAPE', tags: ['trench','manteau','imperméable'], isFeatured: true
  },
  {
    name: 'Robe Mini Velours Bordeaux', description: 'Mini robe en velours avec col bénitier. L\'élégance assumée pour les soirées d\'hiver.',
    price: 255, category: 'women', sizes: sizes.women(4,7,6,3),
    colors: [C.bordeaux, C.noir], images: [img('1496747611176-843222e1e57c')], brand: 'DRAPE', tags: ['robe','velours','bordeaux','soirée'], isFeatured: false
  },
  {
    name: 'Jupe Crayon Cuir Noir', description: 'Jupe crayon en cuir végétalien. Coupe droite au genou, fermeture zip dos.',
    price: 245, category: 'women', sizes: sizes.women(5,8,7,4),
    colors: [C.noir, C.bordeaux], images: [img('1583496661160-fb5886a0aaaa')], brand: 'DRAPE', tags: ['jupe','cuir','crayon','noir'], isFeatured: false
  },
  {
    name: 'Combinaison Large Lin', description: 'Combinaison pantalon en lin froissé avec ceinture à nouer. Légèreté estivale.',
    price: 275, category: 'women', sizes: sizes.women(4,7,8,5),
    colors: [C.beige, C.blanc, C.kaki], images: [img('1564257631407-4deb1f99d992')], brand: 'DRAPE', tags: ['combinaison','lin','été'], isFeatured: false
  },
  {
    name: 'Manteau Court Laine Rose', description: 'Manteau court en laine bouillie rose poudré. Chaud et féminin.',
    price: 395, category: 'women', sizes: sizes.women(5,8,6,3),
    colors: [C.rose, C.creme], images: [img('1548624313-0396c75e4b1a')], brand: 'DRAPE', tags: ['manteau','laine','rose','court'], isFeatured: false
  },
  {
    name: 'Pull Mohair Lavande', description: 'Pull en mohair soyeux, légèrement transparent. Douceur extrême.',
    price: 195, category: 'women', sizes: sizes.women(6,10,8,5),
    colors: [C.lavande, C.rose, C.blanc], images: [img('1576566588028-4147f3842f27')], brand: 'DRAPE', tags: ['pull','mohair','doux'], isFeatured: false
  },
  {
    name: 'Robe Chemise Rayures', description: 'Robe chemise en coton rayé, boutonnée devant. Désinvolture chic.',
    price: 185, category: 'women', sizes: sizes.women(5,9,8,4),
    colors: [C.blanc, C.bleu], images: [img('1539008835657-9e8e9680c956')], brand: 'DRAPE', tags: ['robe','chemise','rayures','coton'], isFeatured: false
  },
  {
    name: 'Pantalon Tailleur Bordeaux', description: 'Pantalon tailleur à plis en crêpe bordeaux. Fort caractère.',
    price: 215, category: 'women', sizes: sizes.women(5,8,7,4),
    colors: [C.bordeaux, C.noir], images: [img('1595777457583-95e059d581b8')], brand: 'DRAPE', tags: ['pantalon','tailleur','bordeaux'], isFeatured: false
  },
  {
    name: 'Blouse Transparente Dorée', description: 'Blouse en organza tissé de fils dorés. Luxe et légèreté.',
    price: 175, category: 'women', sizes: sizes.women(6,10,9,5),
    colors: [C.or, C.beige], images: [img('1585487000160-6ebcfceb0d03')], brand: 'DRAPE', tags: ['blouse','organza','doré','transparent'], isFeatured: false
  },
  {
    name: 'Robe Longue Bohème', description: 'Robe longue en gaze de coton avec broderies ethniques. Voyage et élégance.',
    price: 295, category: 'women', sizes: sizes.women(4,8,7,4),
    colors: [C.sable, C.terracotta], images: [img('1515886657613-9f3515b0c78f')], brand: 'DRAPE', tags: ['robe','bohème','broderie','long'], isFeatured: false
  },
  {
    name: 'Veste Tweed Multicolore', description: 'Veste en tweed fantaisie avec liserés colorés. Tradition réinventée.',
    price: 445, category: 'women', sizes: sizes.women(4,7,6,3),
    colors: [C.beige, C.camel], images: [img('1539533113208-f6df8cc8b543')], brand: 'DRAPE', tags: ['veste','tweed','classique'], isFeatured: false
  },
  {
    name: 'Legging Cuir Mat', description: 'Legging en similicuir mat stretch. Confort total, allure rock.',
    price: 145, category: 'women', sizes: sizes.women(6,10,8,5),
    colors: [C.noir, C.bordeaux], images: [img('1595777457583-95e059d581b8')], brand: 'DRAPE', tags: ['legging','cuir','stretch'], isFeatured: false
  },
  {
    name: 'Débardeur Soie Nude', description: 'Débardeur en soie avec bretelles fines. La base de tout dressing élégant.',
    price: 125, category: 'women', sizes: sizes.women(7,12,10,6),
    colors: [C.sable, C.blanc, C.noir], images: [img('1509631179647-0177331693ae')], brand: 'DRAPE', tags: ['débardeur','soie','nude','basique'], isFeatured: false
  },

  // ═══════════════════════ HOMMES (25) ═══════════════════════
  {
    name: 'Blazer Charbon Structuré', description: 'Un blazer tailleur en laine mélangée avec une silhouette épurée. Parfait pour les occasions formelles comme décontractées.',
    price: 289, category: 'men', sizes: sizes.men(8,12,6,4),
    colors: [C.anthracite, C.gris], images: [img('1594938298603-c8148c4bbc7e')], brand: 'DRAPE', tags: ['blazer','formel','laine','structuré'], isFeatured: true
  },
  {
    name: 'Pantalon Tailleur Anthracite', description: 'Pantalon à plis à taille haute en tissu technique léger. Coupe ample et fluide.',
    price: 195, category: 'men', sizes: sizes.men(6,9,8,5),
    colors: [C.anthracite, C.beige], images: [img('1473966968600-fa801b869a1a')], brand: 'DRAPE', tags: ['pantalon','tailleur','formel'], isFeatured: false
  },
  {
    name: 'Chemise Lin Blanc Optique', description: 'Chemise oversize en lin lavé à col ouvert. L\'essentiel du vestiaire minimaliste.',
    price: 165, category: 'men', sizes: sizes.men(12,15,10,7),
    colors: [C.blanc, C.bleu], images: [img('1598033129183-c4f50c736f10')], brand: 'DRAPE', tags: ['chemise','lin','minimaliste','été'], isFeatured: false
  },
  {
    name: 'Sneakers Cuir Blanc Signature', description: 'Sneakers minimalistes en cuir pleine fleur avec semelle légère. Le luxe discret au quotidien.',
    price: 280, category: 'men', sizes: sizes.shoes(40),
    colors: [C.blanc, C.beige], images: [img('1542291026-7eec264c27ff')], brand: 'DRAPE', tags: ['sneakers','cuir','blanc','casual'], isFeatured: false
  },
  {
    name: 'Costume Deux Pièces Navy', description: 'Costume en laine fine bleu marine. Coupe slim moderne, doublure en soie.',
    price: 685, category: 'men', sizes: sizes.men(5,10,8,5),
    colors: [C.marine, C.anthracite], images: [img('1617127365659-c47fa864d8bc')], brand: 'DRAPE', tags: ['costume','formel','marine','luxe'], isFeatured: true
  },
  {
    name: 'Pardessus Laine Camel', description: 'Pardessus en laine camel brossée. L\'élégance masculine intemporelle.',
    price: 795, category: 'men', sizes: sizes.men(4,8,7,5),
    colors: [C.camel, C.noir], images: [img('1543163521-1bf539c55dd2')], brand: 'DRAPE', tags: ['pardessus','manteau','camel','luxe'], isFeatured: true
  },
  {
    name: 'T-Shirt Pima Cotton', description: 'T-shirt en coton Pima peigné 200g. Toucher exceptionnel, coupe parfaite.',
    price: 85, category: 'men', sizes: sizes.men(15,20,18,12),
    colors: [C.blanc, C.noir, C.gris, C.beige], images: [img('1489987707025-afc232f7ea0f')], brand: 'DRAPE', tags: ['t-shirt','coton','basique','quotidien'], isFeatured: false
  },
  {
    name: 'Polo Lin Chambray', description: 'Polo en mélange lin-coton, col boutonné. Entre sport et élégance.',
    price: 145, category: 'men', sizes: sizes.men(10,14,12,8),
    colors: [C.bleu, C.blanc, C.beige], images: [img('1620012253295-c15cc3e65df4')], brand: 'DRAPE', tags: ['polo','lin','été','casual'], isFeatured: false
  },
  {
    name: 'Jean Brut Selvedge', description: 'Jean en denim japonais selvedge non lavé. S\'adapte à votre morphologie avec le temps.',
    price: 245, category: 'men', sizes: [{ size:'30', stock:5 },{ size:'32', stock:8 },{ size:'34', stock:7 },{ size:'36', stock:4 }],
    colors: [C.marine, C.anthracite], images: [img('1506629082955-511b1aa562c8')], brand: 'DRAPE', tags: ['jean','denim','selvedge','japonais'], isFeatured: false
  },
  {
    name: 'Chemise Oxford Bleu', description: 'Chemise Oxford en coton 100% avec col button-down. Le classique revisité.',
    price: 155, category: 'men', sizes: sizes.men(8,12,10,7),
    colors: [C.bleu, C.blanc], images: [img('1598033129183-c4f50c736f10')], brand: 'DRAPE', tags: ['chemise','oxford','classique'], isFeatured: false
  },
  {
    name: 'Veste Bomber Cuir Noir', description: 'Bomber en cuir grainé avec doublure satin. La pièce rock de la collection.',
    price: 495, category: 'men', sizes: sizes.men(5,8,7,5),
    colors: [C.noir, C.anthracite], images: [img('1594938298603-c8148c4bbc7e')], brand: 'DRAPE', tags: ['bomber','cuir','rock','veste'], isFeatured: false
  },
  {
    name: 'Pull Col V Cachemire', description: 'Pull col V en cachemire grade A. Douceur absolue pour l\'hiver.',
    price: 365, category: 'men', sizes: sizes.men(6,10,9,6),
    colors: [C.gris, C.marine, C.beige], images: [img('1543163521-1bf539c55dd2')], brand: 'DRAPE', tags: ['pull','cachemire','col-v','luxe'], isFeatured: false
  },
  {
    name: 'Short Lin Naturel', description: 'Short en lin naturel avec cordon de serrage. Vacances et confort.',
    price: 95, category: 'men', sizes: sizes.men(10,14,12,8),
    colors: [C.beige, C.blanc, C.kaki], images: [img('1506629082955-511b1aa562c8')], brand: 'DRAPE', tags: ['short','lin','été','vacances'], isFeatured: false
  },
  {
    name: 'Manteau Droit Gris', description: 'Manteau droit en lainage gris chiné. Sobre et élégant pour tous les jours.',
    price: 545, category: 'men', sizes: sizes.men(4,8,7,5),
    colors: [C.gris, C.anthracite], images: [img('1543163521-1bf539c55dd2')], brand: 'DRAPE', tags: ['manteau','gris','hiver','classique'], isFeatured: false
  },
  {
    name: 'Veste Velours Côtelé', description: 'Veste en velours côtelé fin avec poches plaquées. Automne en toute élégance.',
    price: 275, category: 'men', sizes: sizes.men(5,9,8,5),
    colors: [C.bordeaux, C.kaki, C.marine], images: [img('1617127365659-c47fa864d8bc')], brand: 'DRAPE', tags: ['veste','velours','automne'], isFeatured: false
  },
  {
    name: 'Pantalon Chino Slim', description: 'Chino slim en coton stretch sergé. Du bureau aux loisirs en un clin d\'œil.',
    price: 145, category: 'men', sizes: sizes.men(7,11,10,7),
    colors: [C.beige, C.kaki, C.marine], images: [img('1473966968600-fa801b869a1a')], brand: 'DRAPE', tags: ['chino','slim','polyvalent'], isFeatured: false
  },
  {
    name: 'Mocassins Cuir Sable', description: 'Mocassins en cuir pleine fleur avec semelle cuir. Artisanat et raffinement.',
    price: 320, category: 'men', sizes: sizes.shoes(40),
    colors: [C.sable, C.camel, C.noir], images: [img('1542291026-7eec264c27ff')], brand: 'DRAPE', tags: ['mocassins','cuir','sable','artisanat'], isFeatured: false
  },
  {
    name: 'Sweat Zip Coton Épais', description: 'Sweatshirt zippé en coton gaufré 350g. Épaisseur luxueuse pour les jours frais.',
    price: 185, category: 'men', sizes: sizes.men(8,12,10,7),
    colors: [C.gris, C.noir, C.marine], images: [img('1489987707025-afc232f7ea0f')], brand: 'DRAPE', tags: ['sweat','coton','zip','confort'], isFeatured: false
  },
  {
    name: 'Chemise Flanelle Carreaux', description: 'Chemise en flanelle de coton à carreaux. Le classique workwear revisité.',
    price: 145, category: 'men', sizes: sizes.men(8,12,10,6),
    colors: [C.rouge, C.marine], images: [img('1620012253295-c15cc3e65df4')], brand: 'DRAPE', tags: ['chemise','flanelle','carreaux'], isFeatured: false
  },
  {
    name: 'Caban Marine Laine', description: 'Caban en laine double face bleu marine avec boutons dorés. Marin et élégant.',
    price: 495, category: 'men', sizes: sizes.men(5,8,7,5),
    colors: [C.marine, C.noir], images: [img('1543163521-1bf539c55dd2')], brand: 'DRAPE', tags: ['caban','marine','laine','classique'], isFeatured: false
  },
  {
    name: 'Pantalon Jogging Luxe', description: 'Jogging en jersey de coton premium avec bandes latérales en soie. Sport couture.',
    price: 165, category: 'men', sizes: sizes.men(8,12,10,7),
    colors: [C.noir, C.gris], images: [img('1506629082955-511b1aa562c8')], brand: 'DRAPE', tags: ['jogging','sport','luxe','confort'], isFeatured: false
  },
  {
    name: 'Pochette Cuir Bordeaux', description: 'Pochette document en cuir lisse avec fermeture glissière cachée.',
    price: 145, category: 'men', sizes: [{ size:'Unique', stock:15 }],
    colors: [C.bordeaux, C.noir], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['pochette','cuir','document'], isFeatured: false
  },
  {
    name: 'Derby Cuir Brun', description: 'Derby à lacets en cuir veau brun. Fabrication Goodyear welt.',
    price: 395, category: 'men', sizes: sizes.shoes(40),
    colors: [C.camel, C.noir], images: [img('1542291026-7eec264c27ff')], brand: 'DRAPE', tags: ['derby','cuir','goodyear','chaussures'], isFeatured: false
  },
  {
    name: 'Parka Techno Kaki', description: 'Parka imperméable en tissu technique avec hood amovible. Fonctionnel et élégant.',
    price: 445, category: 'men', sizes: sizes.men(5,9,8,5),
    colors: [C.kaki, C.noir], images: [img('1594938298603-c8148c4bbc7e')], brand: 'DRAPE', tags: ['parka','imperméable','technique'], isFeatured: false
  },
  {
    name: 'Ceinture Cuir Tressé', description: 'Ceinture en cuir tressé avec boucle laiton brossé. Détail artisanal.',
    price: 110, category: 'men', sizes: [{ size:'85cm', stock:8 },{ size:'90cm', stock:10 },{ size:'95cm', stock:8 },{ size:'100cm', stock:5 }],
    colors: [C.camel, C.noir], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['ceinture','cuir','tressé'], isFeatured: false
  },

  // ═══════════════════════ ENFANTS (20) ═══════════════════════
  {
    name: 'Veste Enfant Laine Douce', description: 'Veste en laine douce avec doublure en satin pour les petits explorateurs.',
    price: 145, category: 'kids', sizes: sizes.kids(),
    colors: [C.marine, C.bordeaux], images: [img('1519238263530-99bdd11df2ea')], brand: 'DRAPE Kids', tags: ['enfant','veste','laine'], isFeatured: false
  },
  {
    name: 'Robe Petite Fille Brodée', description: 'Robe en coton doux avec broderies florales délicates. Pour les petites princesses de 2 à 10 ans.',
    price: 95, category: 'kids', sizes: sizes.kids(),
    colors: [C.rose, C.lavande], images: [img('1518831959646-742c3a14ebf7')], brand: 'DRAPE Kids', tags: ['robe','enfant','broderie'], isFeatured: false
  },
  {
    name: 'Ensemble Pantalon Garçon', description: 'Ensemble 2 pièces chemise et pantalon pour garçon. Tenue soignée pour les occasions.',
    price: 125, category: 'kids', sizes: sizes.kids(),
    colors: [C.marine, C.blanc], images: [img('1471286174890-9c112ffca5b4')], brand: 'DRAPE Kids', tags: ['enfant','ensemble','garçon','formel'], isFeatured: false
  },
  {
    name: 'Manteau Enfant Camel', description: 'Mini manteau en laine camel avec boutons nacrés. Élégance dès le plus jeune âge.',
    price: 165, category: 'kids', sizes: sizes.kids(),
    colors: [C.camel, C.beige], images: [img('1519238263530-99bdd11df2ea')], brand: 'DRAPE Kids', tags: ['enfant','manteau','camel'], isFeatured: false
  },
  {
    name: 'Robe Princesse Tulle', description: 'Robe de fête en tulle avec corsage brodé. Pour les grandes occasions.',
    price: 145, category: 'kids', sizes: sizes.kids(),
    colors: [C.rose, C.blanc, C.lavande], images: [img('1518831959646-742c3a14ebf7')], brand: 'DRAPE Kids', tags: ['robe','fête','tulle','princesse'], isFeatured: false
  },
  {
    name: 'Jean Slim Enfant', description: 'Jean slim en denim extensible avec genoux renforcés. Confort et durabilité.',
    price: 75, category: 'kids', sizes: sizes.kids(),
    colors: [C.marine, C.anthracite], images: [img('1471286174890-9c112ffca5b4')], brand: 'DRAPE Kids', tags: ['enfant','jean','denim','quotidien'], isFeatured: false
  },
  {
    name: 'Pull Enfant Rayé', description: 'Pull en laine mérinos rayé avec col bateau. Douillet et coloré.',
    price: 85, category: 'kids', sizes: sizes.kids(),
    colors: [C.marine, C.rouge], images: [img('1519457431-44ccd64a579b')], brand: 'DRAPE Kids', tags: ['enfant','pull','rayé','laine'], isFeatured: false
  },
  {
    name: 'Pyjama Coton Bio', description: 'Pyjama 2 pièces en coton biologique certifié. Doux pour la peau et l\'environnement.',
    price: 65, category: 'kids', sizes: sizes.kids(),
    colors: [C.bleu, C.rose], images: [img('1519238263530-99bdd11df2ea')], brand: 'DRAPE Kids', tags: ['pyjama','coton-bio','nuit'], isFeatured: false
  },
  {
    name: 'Blouson Softshell Enfant', description: 'Blouson en softshell imperméable léger. Protection totale pour les aventures.',
    price: 115, category: 'kids', sizes: sizes.kids(),
    colors: [C.kaki, C.marine, C.rouge], images: [img('1471286174890-9c112ffca5b4')], brand: 'DRAPE Kids', tags: ['enfant','blouson','imperméable','sport'], isFeatured: false
  },
  {
    name: 'Robe Ethnique Petite Fille', description: 'Robe en coton avec motifs ethniques brodés à la main. Originalité et authenticité.',
    price: 105, category: 'kids', sizes: sizes.kids(),
    colors: [C.terracotta, C.or], images: [img('1518831959646-742c3a14ebf7')], brand: 'DRAPE Kids', tags: ['robe','ethnique','broderie','artisanal'], isFeatured: false
  },
  {
    name: 'Salopette Denim Bébé', description: 'Salopette en denim doux pour les tout-petits. Pratique avec les boutons-pression.',
    price: 55, category: 'kids', sizes: [{ size:'6M', stock:10 },{ size:'12M', stock:8 },{ size:'18M', stock:7 },{ size:'2A', stock:5 }],
    colors: [C.marine, C.beige], images: [img('1519457431-44ccd64a579b')], brand: 'DRAPE Kids', tags: ['salopette','denim','bébé'], isFeatured: false
  },
  {
    name: 'Costume Mini Homme', description: 'Mini costume 3 pièces pour garçon. Identique aux adultes, en miniature.',
    price: 195, category: 'kids', sizes: sizes.kids(),
    colors: [C.marine, C.anthracite], images: [img('1471286174890-9c112ffca5b4')], brand: 'DRAPE Kids', tags: ['costume','garçon','formel','mariage'], isFeatured: false
  },
  {
    name: 'Sweat Capuche Uni', description: 'Sweat à capuche en molleton doux. Le basique indémodable du vestiaire enfant.',
    price: 65, category: 'kids', sizes: sizes.kids(),
    colors: [C.gris, C.rose, C.marine], images: [img('1519238263530-99bdd11df2ea')], brand: 'DRAPE Kids', tags: ['sweat','capuche','basique'], isFeatured: false
  },
  {
    name: 'Robe Bal de Fin d\'Année', description: 'Robe élégante pour les cérémonies de fin d\'année. Satin brillant et tulle.',
    price: 155, category: 'kids', sizes: sizes.kids(),
    colors: [C.or, C.blanc, C.rose], images: [img('1518831959646-742c3a14ebf7')], brand: 'DRAPE Kids', tags: ['robe','cérémonie','satin','fête'], isFeatured: false
  },
  {
    name: 'Pantalon Lin Enfant', description: 'Pantalon large en lin pour enfant. Légèreté et confort pour l\'été.',
    price: 65, category: 'kids', sizes: sizes.kids(),
    colors: [C.beige, C.blanc], images: [img('1519457431-44ccd64a579b')], brand: 'DRAPE Kids', tags: ['enfant','pantalon','lin','été'], isFeatured: false
  },
  {
    name: 'T-Shirt Coton Imprimé', description: 'T-shirt en coton peigné avec imprimé DRAPE exclusif. 100% made with love.',
    price: 35, category: 'kids', sizes: sizes.kids(),
    colors: [C.blanc, C.beige, C.gris], images: [img('1471286174890-9c112ffca5b4')], brand: 'DRAPE Kids', tags: ['t-shirt','imprimé','coton','basique'], isFeatured: false
  },
  {
    name: 'Doudoune Légère Enfant', description: 'Doudoune légère sans manches en duvet synthétique. Chaude et légère.',
    price: 95, category: 'kids', sizes: sizes.kids(),
    colors: [C.marine, C.kaki, C.rouge], images: [img('1519238263530-99bdd11df2ea')], brand: 'DRAPE Kids', tags: ['doudoune','hiver','léger','chaud'], isFeatured: false
  },
  {
    name: 'Robe Velours Noël', description: 'Robe en velours rouge avec col Claudine blanc. Pour briller les soirs de fête.',
    price: 115, category: 'kids', sizes: sizes.kids(),
    colors: [C.rouge, C.bordeaux], images: [img('1518831959646-742c3a14ebf7')], brand: 'DRAPE Kids', tags: ['robe','velours','noël','fête'], isFeatured: false
  },
  {
    name: 'Baskets Cuir Enfant', description: 'Petites baskets en cuir blanc avec semelle souple. Idéales pour les premiers pas.',
    price: 85, category: 'kids', sizes: [{ size:'22', stock:8 },{ size:'24', stock:10 },{ size:'26', stock:9 },{ size:'28', stock:7 },{ size:'30', stock:5 }],
    colors: [C.blanc, C.beige], images: [img('1542291026-7eec264c27ff')], brand: 'DRAPE Kids', tags: ['baskets','cuir','enfant','blanc'], isFeatured: false
  },
  {
    name: 'Ensemble Bambin Luxe', description: 'Set body + pantalon en coton pima premium. La douceur des débuts.',
    price: 85, category: 'kids', sizes: [{ size:'0-3M', stock:12 },{ size:'3-6M', stock:10 },{ size:'6-9M', stock:8 },{ size:'9-12M', stock:6 }],
    colors: [C.blanc, C.beige, C.gris], images: [img('1519457431-44ccd64a579b')], brand: 'DRAPE Kids', tags: ['bébé','body','coton','luxe'], isFeatured: false
  },

  // ═══════════════════════ ACCESSOIRES (30) ═══════════════════════
  {
    name: 'Sac Cuir Grain Or', description: 'Sac à main en cuir grainé avec fermoir doré et bandoulière amovible.',
    price: 390, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.noir], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['sac','cuir','doré'], isFeatured: true
  },
  {
    name: 'Ceinture Cuir Dorée', description: 'Ceinture en cuir lisse avec boucle rectangulaire plaquée or.',
    price: 120, category: 'accessories', sizes: [{ size:'S', stock:10 },{ size:'M', stock:12 },{ size:'L', stock:8 }],
    colors: [C.camel, C.noir], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['ceinture','cuir','doré'], isFeatured: false
  },
  {
    name: 'Foulard Soie Imprimé', description: 'Foulard carré en soie twill 90×90 avec imprimé exclusif. Art porté.',
    price: 185, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.rouge, C.bleu], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['foulard','soie','imprimé','carré'], isFeatured: true
  },
  {
    name: 'Lunettes Soleil Cat-Eye', description: 'Lunettes de soleil cat-eye en acétate avec verres polarisés. Icon.',
    price: 245, category: 'accessories', sizes: sizes.acc(),
    colors: [C.noir, C.bordeaux, C.camel], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['lunettes','soleil','cat-eye','polarisé'], isFeatured: false
  },
  {
    name: 'Sac Tote Cuir Naturel', description: 'Tote bag en cuir végétal naturel. Grand format pour tous vos essentiels.',
    price: 275, category: 'accessories', sizes: sizes.acc(),
    colors: [C.sable, C.camel], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['tote','cuir','naturel','grand'], isFeatured: false
  },
  {
    name: 'Montre Dorée Minimaliste', description: 'Montre à quartz avec boîtier doré 36mm et bracelet cuir. Élégance épurée.',
    price: 445, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.sable], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['montre','dorée','minimaliste','quartz'], isFeatured: false
  },
  {
    name: 'Chapeau Canotier Paille', description: 'Chapeau canotier en paille tressée avec ruban en soie. L\'été en tête.',
    price: 95, category: 'accessories', sizes: sizes.acc(),
    colors: [C.sable, C.beige], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['chapeau','paille','été','canotier'], isFeatured: false
  },
  {
    name: 'Portefeuille Cuir Long', description: 'Portefeuille long en cuir pleine fleur. 12 emplacements cartes, 2 billets.',
    price: 155, category: 'accessories', sizes: sizes.acc(),
    colors: [C.noir, C.camel, C.bordeaux], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['portefeuille','cuir','long'], isFeatured: false
  },
  {
    name: 'Sac Clutch Dorée', description: 'Clutch en satin tissé or pour les soirées. Fermeture magnétique discrète.',
    price: 145, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.beige], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['clutch','soirée','dorée','satin'], isFeatured: false
  },
  {
    name: 'Ceinture Tissée Multicolore', description: 'Ceinture en tissu tissé artisanalement avec motifs géométriques berbères.',
    price: 85, category: 'accessories', sizes: [{ size:'S/M', stock:15 },{ size:'L/XL', stock:12 }],
    colors: [C.or, C.rouge, C.beige], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['ceinture','tissé','artisanal','berbère'], isFeatured: false
  },
  {
    name: 'Bandeau Soie Crème', description: 'Bandeau cheveux en soie crème. Multi-usage : cheveux, poignets, sac.',
    price: 65, category: 'accessories', sizes: sizes.acc(),
    colors: [C.creme, C.beige, C.noir], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['bandeau','soie','cheveux','multiuse'], isFeatured: false
  },
  {
    name: 'Sac Bucket Cuir Blanc', description: 'Sac seau en cuir lisse blanc avec cordon de serrage doré.',
    price: 325, category: 'accessories', sizes: sizes.acc(),
    colors: [C.blanc, C.beige], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['sac','bucket','cuir','blanc'], isFeatured: false
  },
  {
    name: 'Bijoux Set Doré 3 Pièces', description: 'Set bague+bracelet+boucles d\'oreilles en laiton doré 18k. Minimalisme précieux.',
    price: 145, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.gris], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['bijoux','doré','set','minimaliste'], isFeatured: false
  },
  {
    name: 'Écharpe Cachemire Naturel', description: 'Écharpe en cachemire 100% naturel, 200×70cm. Chaleur luxueuse.',
    price: 235, category: 'accessories', sizes: sizes.acc(),
    colors: [C.beige, C.gris, C.camel], images: [img('1576566588028-4147f3842f27')], brand: 'DRAPE', tags: ['écharpe','cachemire','naturel','luxe'], isFeatured: false
  },
  {
    name: 'Sac Mini Crossbody Noir', description: 'Petit sac bandoulière en cuir lisse. Format compact pour les essentiels.',
    price: 195, category: 'accessories', sizes: sizes.acc(),
    colors: [C.noir, C.bordeaux], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['sac','crossbody','mini','compact'], isFeatured: false
  },
  {
    name: 'Lunettes Rondes Dorées', description: 'Lunettes rondes en métal doré. Verres anti-lumière bleue ou solaires.',
    price: 195, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.anthracite], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['lunettes','rondes','dorées'], isFeatured: false
  },
  {
    name: 'Porte-Monnaie Cuir Mini', description: 'Porte-monnaie en cuir avec fermeture baisser. Minimaliste et fonctionnel.',
    price: 75, category: 'accessories', sizes: sizes.acc(),
    colors: [C.camel, C.noir, C.rouge], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['porte-monnaie','cuir','mini'], isFeatured: false
  },
  {
    name: 'Chapeau Fédora Feutre', description: 'Fédora en feutre de laine avec ruban en cuir. Automne-hiver.',
    price: 145, category: 'accessories', sizes: sizes.acc(),
    colors: [C.anthracite, C.camel, C.beige], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['fédora','chapeau','feutre','automne'], isFeatured: false
  },
  {
    name: 'Sac Week-End Cuir', description: 'Grand sac de voyage en cuir tannage végétal. Cabine aircraft-friendly.',
    price: 585, category: 'accessories', sizes: sizes.acc(),
    colors: [C.camel, C.noir], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['sac','voyage','week-end','cuir'], isFeatured: false
  },
  {
    name: 'Broche Émail Fleurie', description: 'Broche en métal émaillé avec motif floral. La touche poétique sur un vêtement sobre.',
    price: 55, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.rose], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['broche','émail','floral','bijou'], isFeatured: false
  },
  {
    name: 'Gants Cuir Doublés', description: 'Gants en cuir nappa doublés cachemire. Luxe et protection contre le froid.',
    price: 165, category: 'accessories', sizes: [{ size:'S', stock:8 },{ size:'M', stock:10 },{ size:'L', stock:7 }],
    colors: [C.noir, C.camel, C.gris], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['gants','cuir','cachemire','hiver'], isFeatured: false
  },
  {
    name: 'Ceinture Corset Large', description: 'Ceinture corset large en simili cuir. Transforme n\'importe quelle tenue.',
    price: 95, category: 'accessories', sizes: [{ size:'XS/S', stock:10 },{ size:'M/L', stock:12 }],
    colors: [C.noir, C.camel, C.rouge], images: [img('1553062407-98eeb64c6a62')], brand: 'DRAPE', tags: ['ceinture','corset','large'], isFeatured: false
  },
  {
    name: 'Sac Bambou Artisanal', description: 'Sac en bambou naturel tissé à la main. Pièce unique de savoir-faire.',
    price: 175, category: 'accessories', sizes: sizes.acc(),
    colors: [C.sable, C.camel], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['sac','bambou','artisanal','naturel'], isFeatured: false
  },
  {
    name: 'Coffret Bijoux DRAPE', description: 'Coffret cadeau avec collier + boucles d\'oreilles en argent 925 doré.',
    price: 285, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.gris], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['bijoux','coffret','cadeau','argent'], isFeatured: true
  },
  {
    name: 'Pochette Soirée Brodée', description: 'Pochette du soir en velours brodé de perles. Artisanat tunisien revisité.',
    price: 195, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or, C.bordeaux, C.noir], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['pochette','soirée','brodé','perles'], isFeatured: false
  },
  {
    name: 'Turban Jersey Doux', description: 'Turban en jersey doux pour tous les jours. Style et protection pour les cheveux.',
    price: 45, category: 'accessories', sizes: sizes.acc(),
    colors: [C.noir, C.camel, C.beige, C.terracotta], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['turban','jersey','cheveux','quotidien'], isFeatured: false
  },
  {
    name: 'Sac Cabas Toile Jacquard', description: 'Grand cabas en toile jacquard avec anses en cuir. Art du quotidien.',
    price: 225, category: 'accessories', sizes: sizes.acc(),
    colors: [C.beige, C.marine], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['cabas','jacquard','grand','quotidien'], isFeatured: false
  },
  {
    name: 'Pendentif DRAPE Signature', description: 'Pendentif en or 18k avec diamant 0.1ct. La signature DRAPE en bijou.',
    price: 695, category: 'accessories', sizes: sizes.acc(),
    colors: [C.or], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['pendentif','or','diamant','luxe'], isFeatured: true
  },
  {
    name: 'Sac Saddle Camel', description: 'Sac sellier en cuir camel avec harnais en métal doré. Heritage craftsmanship.',
    price: 465, category: 'accessories', sizes: sizes.acc(),
    colors: [C.camel, C.sable], images: [img('1584917865442-de89df76afd3')], brand: 'DRAPE', tags: ['sac','sellier','camel','heritage'], isFeatured: false
  },
  {
    name: 'Chapka Cachemire Naturel', description: 'Chapka en cachemire et renard synthétique. Chaleur extrême pour l\'hiver.',
    price: 125, category: 'accessories', sizes: sizes.acc(),
    colors: [C.camel, C.gris, C.noir], images: [img('1523779917675-b6ed3a42a561')], brand: 'DRAPE', tags: ['chapka','cachemire','hiver','chaud'], isFeatured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    const admin = await User.create({
      name: 'Admin DRAPE', email: 'admin@drape.tn', password: 'Admin123!', phone: '21650000000', role: 'admin'
    });
    const client1 = await User.create({
      name: 'Sarra Ben Ali', email: 'sarra@example.com', password: 'Client123!', phone: '21650000001', role: 'client',
      address: { street: 'Rue de la Liberté', city: 'Tunis', postalCode: '1001', country: 'Tunisia' }
    });
    const client2 = await User.create({
      name: 'Youssef Trabelsi', email: 'youssef@example.com', password: 'Client123!', phone: '21650000002', role: 'client',
      address: { street: 'Avenue Habib Bourguiba', city: 'Sousse', postalCode: '4000', country: 'Tunisia' }
    });
    console.log('👥 Users created');

    const created = await Product.insertMany(products);
    console.log(`👗 ${created.length} products created`);

    const order1 = await Order.create({
      user: client1._id,
      items: [
        { product: created[0]._id, size: 'M', color: 'Ivoire', quantity: 1, price: created[0].price },
        { product: created[30]._id, size: 'Unique', color: 'Or', quantity: 1, price: created[30].price }
      ],
      totalAmount: created[0].price + created[30].price + 8,
      shippingFee: 8,
      status: 'pending',
      shippingAddress: { street: 'Rue de la Liberté', city: 'Tunis', postalCode: '1001', country: 'Tunisia' }
    });
    const order2 = await Order.create({
      user: client1._id,
      items: [{ product: created[1]._id, size: 'S', color: 'Camel', quantity: 1, price: created[1].price }],
      totalAmount: created[1].price + 8,
      shippingFee: 8,
      status: 'confirmed', confirmedAt: new Date(),
      shippingAddress: { street: 'Rue de la Liberté', city: 'Tunis', postalCode: '1001', country: 'Tunisia' }
    });
    const order3 = await Order.create({
      user: client2._id,
      items: [{ product: created[3]._id, size: 'M', color: 'Camel', quantity: 1, price: created[3].price }],
      totalAmount: created[3].price + 8,
      shippingFee: 8,
      status: 'delivered',
      shippingAddress: { street: 'Avenue Habib Bourguiba', city: 'Sousse', postalCode: '4000', country: 'Tunisia' }
    });
    console.log('📦 Orders created');

    await Notification.insertMany([
      { user: client1._id, message: 'Bienvenue chez DRAPE ! Découvrez notre nouvelle collection.', type: 'promo' },
      { user: client1._id, message: `Votre commande #${order1._id.toString().slice(-6).toUpperCase()} a été reçue.`, type: 'order_update' },
      { user: client1._id, message: `Votre commande #${order2._id.toString().slice(-6).toUpperCase()} est confirmée.`, type: 'order_update', isRead: true },
      { user: client2._id, message: 'Bienvenue chez DRAPE ! 10% sur votre première commande avec le code BIENVENUE10.', type: 'promo' },
      { user: client2._id, message: `Votre commande #${order3._id.toString().slice(-6).toUpperCase()} a été livrée.`, type: 'order_update', isRead: true }
    ]);
    console.log('🔔 Notifications created');

    console.log('\n✨ Seed complete! 100 products created.\n');
    console.log('Admin:   admin@drape.tn / Admin123!');
    console.log('Client1: sarra@example.com / Client123!');
    console.log('Client2: youssef@example.com / Client123!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
