/* =========================================================
   Cantin Mineiro — dados do catálogo
   Este é o único arquivo que precisa mudar para editar produtos.
   - price: número (ex.: 39.9) ou null => aparece "Consulte"
   - promo: true => entra no filtro "Mais pedidos" e ganha a etiqueta
   - Foto: assets/img/products/<id>.webp (retrato 4:5)
   - own: true => foto da própria Cantin (Instagram); senão, foto ilustrativa
   ========================================================= */
export const WHATSAPP = '5512997257559';

export const CATEGORIES = [
    { id: 'queijos', name: 'Queijos' },
    { id: 'doces', name: 'Doces mineiros' },
    { id: 'quitandas', name: 'Quitandas' },
    { id: 'cafe', name: 'Café' },
    { id: 'presentes', name: 'Kits e copos' },
];

export const PRODUCTS = [
    // Queijos
    { id: 'queijo-meia-cura', cat: 'queijos', name: 'Queijo Minas meia cura', size: 'peça', style: 'Casca fina, massa macia e sabor marcante', price: null, promo: true, own: true },
    { id: 'queijo-canastra', cat: 'queijos', name: 'Queijo Canastra', size: 'peça', style: 'Curado, da Serra da Canastra', price: null },
    { id: 'queijo-ervas', cat: 'queijos', name: 'Queijo com ervas', size: 'pedaço', style: 'Massa clara temperada com ervas finas', price: null, own: true },
    { id: 'queijo-reino', cat: 'queijos', name: 'Queijo do reino', size: 'pedaço', style: 'Casca vermelha, sabor salgadinho', price: null, own: true },
    { id: 'queijo-cheddar', cat: 'queijos', name: 'Queijo cheddar', size: 'pedaço', style: 'Alaranjado, ótimo na tábua', price: null, own: true },
    { id: 'provolone-desidratado', cat: 'queijos', name: 'Provolone desidratado', size: 'pote', style: 'Crocante por fora, irresistível por dentro', price: null, promo: true, own: true },
    { id: 'provolone-goiabada', cat: 'queijos', name: 'Provolone desidratado com goiabada', size: 'pote', style: 'O crocante do provolone com o doce da goiabada', price: null, own: true },
    // Doces mineiros
    { id: 'doce-de-leite', cat: 'doces', name: 'Doce de leite', size: 'pote', style: 'Cremoso, de colher', price: null },
    { id: 'goiabada-cascao', cat: 'doces', name: 'Goiabada cascão', size: 'barra', style: 'Pedaçuda, do jeito antigo', price: null },
    { id: 'geleia', cat: 'doces', name: 'Geleia artesanal', size: 'vidro', style: 'Pra comer com provolone e queijo', price: null, own: true },
    { id: 'pe-de-moleque', cat: 'doces', name: 'Pé de moleque', size: 'pacote', style: 'Amendoim e rapadura', price: null },
    { id: 'rapadura', cat: 'doces', name: 'Rapadura', size: 'tablete', style: 'Doce de cana de engenho', price: null },
    // Quitandas
    { id: 'pao-de-queijo', cat: 'quitandas', name: 'Pão de queijo', size: 'pacote', style: 'Congelado, é só assar', price: null },
    { id: 'biscoito-polvilho', cat: 'quitandas', name: 'Biscoito de polvilho', size: 'pacote', style: 'Sequinho, pro café da tarde', price: null },
    { id: 'broinha-fuba', cat: 'quitandas', name: 'Broinha de fubá', size: 'pacote', style: 'Receita de vó mineira', price: null },
    // Café
    { id: 'cafe-graos', cat: 'cafe', name: 'Café mineiro em grãos', size: '500 g', style: 'Torra média, pra moer na hora', price: null },
    { id: 'cafe-moido', cat: 'cafe', name: 'Café mineiro moído', size: '500 g', style: 'Moagem pra coador e cafeteira', price: null },
    // Kits e copos
    { id: 'kit-petiscos', cat: 'presentes', name: 'Caixa de petiscos', size: 'presente', style: 'Queijos, frios, castanhas e suco de uva, com laço', price: null, promo: true, own: true },
    { id: 'copo-frutas', cat: 'presentes', name: 'Copo de frutas com chocolate', size: 'copo', style: 'Morango, uva, chocolate blend e crocante', price: null, promo: true, own: true },
    { id: 'romeu-e-julieta', cat: 'presentes', name: 'Romeu e Julieta', size: 'kit', style: 'Queijo Minas com goiabada cascão', price: null },
];

/* Destaques do topo: tom do fundo e brilho atrás da foto */
export const HERO = [
    { id: 'queijo-meia-cura', short: 'Meia cura', lg: true, theme: ['#fbf1dc', '#efdcb6', '#e2c79a'], glow: 'rgba(214, 160, 70, .55)' },
    { id: 'copo-frutas', short: 'Copo de frutas', theme: ['#fcebe4', '#f1cfc3', '#e2ad9d'], glow: 'rgba(214, 72, 72, .38)' },
    { id: 'kit-petiscos', short: 'Petiscos', theme: ['#f3f0dc', '#e2dcb8', '#cfc493'], glow: 'rgba(140, 150, 60, .4)' },
];

export const OFFERS = ['queijo-meia-cura', 'provolone-desidratado', 'copo-frutas', 'kit-petiscos'];

/* Monte sua cesta: grupos de produtos que caem na cesta (ids do PRODUCTS) */
export const CESTA = {
    max: 8,
    ocasioes: ['Presente', 'Café da manhã', 'Pra casa', 'Corporativo'],
    grupos: [
        { id: 'queijos', name: 'Queijos', items: ['queijo-meia-cura', 'queijo-canastra', 'queijo-ervas', 'queijo-reino', 'queijo-cheddar', 'provolone-desidratado', 'provolone-goiabada'] },
        { id: 'doces', name: 'Doces e quitandas', items: ['doce-de-leite', 'goiabada-cascao', 'geleia', 'pe-de-moleque', 'rapadura', 'pao-de-queijo', 'biscoito-polvilho', 'broinha-fuba'] },
        { id: 'cafe', name: 'Café', items: ['cafe-graos', 'cafe-moido'] },
    ],
};

export const EVENTOS = {
    tipos: ['Aniversário', 'Casamento', 'Corporativo', 'Chá ou batizado', 'Outro'],
    servicos: ['Estação Fondue', 'Mesa de frios', 'Copos de frutas com chocolate', 'Caixas de petiscos'],
};

/* Fotos ilustrativas (Wikimedia Commons): crédito exigido pela licença */
export const CREDITS = [
    { id: 'queijo-canastra', author: 'Marcelo Costa', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Queijo_canastra,_Minas_Gerais.jpg' },
    { id: 'doce-de-leite', author: 'audinou', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:DulceDeLeche.jpg' },
    { id: 'goiabada-cascao', author: 'Voton', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Goiabada_slice.jpg' },
    { id: 'romeu-e-julieta', author: 'Cataleirxs', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Queijo_minas_e_goiabada.jpg' },
    { id: 'cafe-graos', author: 'Alorin', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Roasted_coffee_beans_in_white_bowl.png' },
    { id: 'cafe-moido', author: 'Alorin', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Coarsely_grounded_coffee_beans_in_white_bowl_with_intact_roasted_bean.png' },
    { id: 'pao-de-queijo', author: 'Joy', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:P%C3%A3o_de_Queijo_(Brazilian_Cheese_Bread).jpg' },
    { id: 'biscoito-polvilho', author: 'Alex Braha Stoll', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Biscoito_de_Polvilho.jpg' },
    { id: 'broinha-fuba', author: 'Melsj', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Broinha_de_fub%C3%A1.jpg' },
    { id: 'pe-de-moleque', author: 'Meksyk', license: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:Pe_de_moleque.jpg' },
    { id: 'rapadura', author: 'Jdvillalobos / Fritzs', license: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:Panela-2.jpg' },
];
