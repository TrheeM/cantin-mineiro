# Design — Cantin Mineiro

O armário de um empório mineiro, à luz da manhã: fotos em janelas de arco colonial (as janelas das igrejas e casarões de Minas), prateleira de madeira clara, etiqueta kraft pendurada no barbante e o caderninho pautado onde a encomenda é anotada. Paleta tirada do próprio logo (preto do "Cantin", ouro do "MINEIRO", creme do flyer). O fluxo da página segue o da Adega Milão (topo com seletor de destaques, faixa da marca, mais pedidos, montagem, catálogo em prateleiras, Insta, contato), mas a identidade é própria.

## Cor (papéis estritos)

| Token | Valor | Papel |
|---|---|---|
| `--cream` / `--cream-2` / `--linen` | `#f6efe3` / `#efe4d1` / `#e7d8bd` | Fundo da página, faixas elevadas (seção da cesta) |
| `--coffee` | `#2b1a10` | Texto e ação principal (botões café com texto creme) |
| `--muted` / `--faint` | café 74% / 56% | Níveis de texto |
| `--gold` / `--gold-soft` / `--gold-hi` | `#94681f` / `#c69a4c` / `#e2bd74` | Ouro do logo: itálicos de destaque, números, molduras dos arcos; `--gold-hi` só sobre o café |
| `--goiaba` | `#a3312a` | Só bandeirinhas "Mais pedido" / "O que começou tudo" |
| `--kraft` / `--kraft-ink` | `#d2ad7d` / `#3b2614` | Etiquetas de preço e o nome no retrato |
| `--paper` + `--rule` + `--margin` | `#fdfaf1` + azul + vermelho | Só o caderninho |
| `--ok` | `#3f7a35` | "Na cesta", "Você já perguntou" |
| Topo | `--bg-inner/mid/outer` + `--glow` | Por destaque: mel (meia cura), morango (copo), oliva (petiscos); animado pelo GSAP |
| Eventos | `#24160d` | Única seção escura (chocolate da fondue) |

## Tipo

- Display: **Fraunces** (opsz automático), 500 nos títulos, itálico 400 em ouro para a palavra-chave ("de *Minas.*", "feito com fé.", números dos passos).
- Texto/UI: **Instrument Sans** 400–700.
- Mão: **Caveat**, só no caderninho, nas etiquetas kraft ("consulte") e no nome do retrato.

## Componentes

- **Janela em arco** (`--arch: 999px 999px 4px 4px`): toda foto de produto mora num arco com aro creme de 5–10px e filete ouro. É o motivo da marca: substitui cards.
- **Prateleira**: janela → régua de madeira (gradiente + veios) → etiqueta kraft com recorte de etiqueta, furinho e barbante → nome em Fraunces, tamanho e descrição → `Tem disponível?` (pílula café) + `+` pôr na cesta (pílula tracejada; vira ✕ verde quando está na cesta).
- **Cesta**: SVG em camadas (alça e interior + pano xadrez vermelho atrás, produtos no meio, trama de vime e plaquinha "Cantin Mineiro" na frente). Até 8 produtos em posições fixas (duas fileiras).
- **Caderninho**: papel pautado com margem vermelha e espiral, letra Caveat, levemente inclinado.
- **Chips** de produto: pílula com miniatura redonda da foto; selecionado = café.
- **Botões**: pílula café (`.btn-wa`), pílula fantasma (`.btn-ghost`), pílula tracejada (`.add`). Todos `scale(.97)` ao tocar.
- Raios: 2px etiquetas, 6px campos, 12px caderno, pílulas só em botões/chips, arcos nas fotos. Nada de cards arredondados.

## Movimento

- Entrada (timeline GSAP, expo.out): título sobe com blur, a janela do topo se abre de baixo pra cima com a foto em zoom-out, grãos de café aparecem com back.out, seletor sobe com mola, selo gira.
- Troca de destaque: a nova foto abre de baixo pra cima dentro do arco (clip-path) enquanto o arco gira 14° no eixo Y e volta com back.out; fundo e brilho mudam em 1,4s.
- Cursor: janela inclina (14°/8°), grãos de café em duas profundidades seguem em paralaxe e fogem do cursor num raio de 240px.
- **Cesta (ação principal)**: cada produto cai de cima com `bounce.out` e a cesta "amassa" (scaleY .97 → elastic); ao tirar, o produto sobe e some, os outros se reacomodam; a linha do caderninho é "escrita" com clip-path em passos.
- Scroll (ScrollTrigger, uma vez): títulos com blur; prateleiras se desenham, janelas sobem, etiquetas balançam no barbante com elastic.out; arcos de destaque/história/eventos abrem de baixo pra cima; flyer da fondue cai por cima como papel solto; faixa da marca acelera com a velocidade do scroll.
- `prefers-reduced-motion`: sem entrada, revelações, flutuação, fuga, selo ou faixa; trocas instantâneas.
