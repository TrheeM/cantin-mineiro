# Cantin Mineiro — catálogo online

Site-catálogo do Empório Cantin Mineiro (Lorena/SP): queijos, doces mineiros, quitandas, café e eventos. Cada produto tem o botão **Tem disponível?**, que abre o WhatsApp (12) 99725-7559 com a pergunta pronta, e o botão **Pôr na cesta**. A ação principal é **Monte sua cesta**: os produtos escolhidos caem dentro da cesta, ficam anotados no caderninho e vão juntos para o WhatsApp.

## Editar produtos e preços

Tudo fica em [`assets/js/data.js`](assets/js/data.js):

- `price: 39.9` mostra o preço na etiqueta kraft; `price: null` mostra "consulte".
- `promo: true` coloca o produto no filtro **Mais pedidos**.
- `own: true` marca a foto como "foto nossa" (veio do Instagram da Cantin).
- Foto: `assets/img/products/<id>.webp`, retrato 4:5 (640 × 800).
- Destaques do topo: lista `HERO` (tom do fundo e brilho).
- Cesta: `CESTA` (ocasiões, grupos e limite de 8 itens).
- Eventos: `EVENTOS` (tipos e serviços do orçamento).

## Rodar localmente

```sh
python3 -m http.server 4321
# abra http://localhost:4321
```

Precisa de servidor (módulos ES não abrem via `file://`).

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Marcação, CSP e SEO |
| `assets/css/main.css` | Estilos (design system em `DESIGN.md`) |
| `assets/js/data.js` | Produtos, destaques, cesta, eventos e créditos |
| `assets/js/main.js` | Topo, armário, cesta, orçamento, WhatsApp e animações |
| `assets/fonts/` | Fraunces, Instrument Sans e Caveat (woff2, SIL OFL) |
| `assets/vendor/` | GSAP 3.12.5 + ScrollTrigger servidos pelo próprio site |

## Segurança e desempenho

- Content-Security-Policy sem scripts nem estilos inline; zero requisições a terceiros.
- Links externos com `rel="noopener noreferrer"`; mensagens do WhatsApp com `encodeURIComponent`.
- A cesta e o "você já perguntou" ficam só no navegador do visitante (`localStorage`).
- Fotos em WebP com `loading="lazy"`; respeita `prefers-reduced-motion`.

## Fotos

- Próprias (Instagram @emporiocafeteria_cantinmineiro e @cantinmineiro__eventos): meia cura, trio de queijos, provolone desidratado, geleia, caixa de petiscos, copo de frutas, Estação Fondue, foto do casal.
- Ilustrativas (Wikimedia Commons, créditos no rodapé do site e em `data.js`): Canastra, doce de leite, goiabada, Romeu e Julieta, café, pão de queijo, biscoito de polvilho, broinha, pé de moleque, rapadura. Troque pelas fotos da Cantin assim que tiver.
