"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6740],{26210:(e,t,a)=>{a.d(t,{PF:()=>s,PL:()=>m,Zj:()=>c,n1:()=>d});var r=a(91841);function i(e){return e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4)}function o(e){let{r:t,g:a,b:o}=(0,r.A)(e).toRgb(),n=i(t/255),l=i(a/255),s=i(o/255),d=Math.cbrt(.4122214708*n+.5363325363*l+.0514459929*s),c=Math.cbrt(.2119034982*n+.6806995451*l+.1073969566*s),g=Math.cbrt(.0883024619*n+.2817188376*l+.6299787005*s),m=1.9779984951*d-2.428592205*c+.4505937099*g,p=.0259040371*d+.7827717662*c-.808675766*g,h=Math.sqrt(m*m+p*p),f=180/Math.PI*Math.atan2(p,m);f<0&&(f+=360);let b=(100*(.2104542553*d+.793617785*c-.0040720468*g)).toFixed(4),u=Number(h.toFixed(6)),y=Number(f.toFixed(3));return 0===u?`${b}% 0 0deg`:`${b}% ${u} ${y}deg`}let n=e=>(0,r.A)(e).isDark()?"100% 0 0deg":"0% 0 0deg",l=e=>(0,r.A)(e).isDark()?"#FFFFFF":"#000000",s=e=>{let{bg:t,fg:a,primary:i}=e;return{"base-100":t,"base-200":(0,r.A)(t).darken(5).toHexString(),"base-300":(0,r.A)(t).darken(12).toHexString(),"base-content":a,neutral:(0,r.A)(t).darken(15).desaturate(20).toHexString(),"neutral-content":(0,r.A)(a).lighten(20).desaturate(20).toHexString(),primary:i,secondary:(0,r.A)(i).lighten(20).toHexString(),accent:(0,r.A)(i).analogous()[1].toHexString()}},d=e=>{let{bg:t,fg:a,primary:i}=e;return{"base-100":t,"base-200":(0,r.A)(t).lighten(5).toHexString(),"base-300":(0,r.A)(t).lighten(12).toHexString(),"base-content":a,neutral:(0,r.A)(t).lighten(15).desaturate(20).toHexString(),"neutral-content":(0,r.A)(a).darken(20).desaturate(20).toHexString(),primary:i,secondary:(0,r.A)(i).darken(20).toHexString(),accent:(0,r.A)(i).triad()[1].toHexString()}},c=[{name:"default",label:"Default",colors:{light:s({fg:"#171717",bg:"#ffffff",primary:"#0066cc"}),dark:d({fg:"#e0e0e0",bg:"#222222",primary:"#77bbee"})}},{name:"gray",label:"Gray",colors:{light:s({fg:"#222222",bg:"#e0e0e0",primary:"#4488cc"}),dark:d({fg:"#c6c6c6",bg:"#444444",primary:"#88ccee"})}},{name:"sepia",label:"Sepia",colors:{light:s({fg:"#5b4636",bg:"#f1e8d0",primary:"#008b8b"}),dark:d({fg:"#ffd595",bg:"#342e25",primary:"#48d1cc"})}},{name:"grass",label:"Grass",colors:{light:s({fg:"#232c16",bg:"#d7dbbd",primary:"#177b4d"}),dark:d({fg:"#d8deba",bg:"#333627",primary:"#a6d608"})}},{name:"cherry",label:"Cherry",colors:{light:s({fg:"#4e1609",bg:"#f0d1d5",primary:"#de3838"}),dark:d({fg:"#e5c4c8",bg:"#462f32",primary:"#ff646e"})}},{name:"sky",label:"Sky",colors:{light:s({fg:"#262d48",bg:"#cedef5",primary:"#2d53e5"}),dark:d({fg:"#babee1",bg:"#282e47",primary:"#ff646e"})}},{name:"solarized",label:"Solarized",colors:{light:s({fg:"#586e75",bg:"#fdf6e3",primary:"#268bd2"}),dark:d({fg:"#93a1a1",bg:"#002b36",primary:"#268bd2"})}},{name:"gruvbox",label:"Gruvbox",colors:{light:s({fg:"#3c3836",bg:"#fbf1c7",primary:"#076678"}),dark:d({fg:"#ebdbb2",bg:"#282828",primary:"#83a598"})}},{name:"nord",label:"Nord",colors:{light:s({fg:"#2e3440",bg:"#eceff4",primary:"#5e81ac"}),dark:d({fg:"#d8dee9",bg:"#2e3440",primary:"#88c0d0"})}},{name:"contrast",label:"Contrast",colors:{light:s({fg:"#000000",bg:"#ffffff",primary:"#4488cc"}),dark:d({fg:"#ffffff",bg:"#000000",primary:"#88ccee"})}},{name:"sunset",label:"Sunset",colors:{light:s({fg:"#423126",bg:"#fff7f0",primary:"#fe6b64"}),dark:d({fg:"#f6e1d7",bg:"#3c2b25",primary:"#ff9c94"})}}],g=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=`
    --b1: ${o(e["base-100"])};
    --b2: ${o(e["base-200"])};
    --b3: ${o(e["base-300"])};
    --bc: ${o(e["base-content"])};
    
    --p: ${o(e.primary)};
    --pc: ${n(e.primary)};
    
    --s: ${o(e.secondary)};
    --sc: ${n(e.secondary)};
    
    --a: ${o(e.accent)};
    --ac: ${n(e.accent)};
    
    --n: ${o(e.neutral)};
    --nc: ${o(e["neutral-content"])};
    
    --in: 69.37% 0.047 231deg;
    --inc: 100% 0 0deg;
    --su: 78.15% 0.12 160deg;
    --suc: 100% 0 0deg;
    --wa: 90.69% 0.123 84deg;
    --wac: 0% 0 0deg;
    --er: 70.9% 0.184 22deg;
    --erc: 100% 0 0deg;
  `,r=`
    --fallback-b1: ${e["base-100"]};
    --fallback-b2: ${e["base-200"]};
    --fallback-b3: ${e["base-300"]};
    --fallback-bc: ${e["base-content"]};

    --fallback-p: ${e.primary};
    --fallback-pc: ${l(e.primary)};

    --fallback-s: ${e.secondary};
    --fallback-sc: ${l(e.secondary)};

    --fallback-a: ${e.accent};
    --fallback-ac: ${l(e.accent)};

    --fallback-n: ${e.neutral};
    --fallback-nc: ${e["neutral-content"]};

    --fallback-in: #ff0000;
    --fallback-inc: #ffffff;
    --fallback-su: #00ff00;
    --fallback-suc: #000000;
    --fallback-wa: #ffff00;
    --fallback-wac: #000000;
    --fallback-er: #ff8000;
    --fallback-erc: #000000;
  `;return a+(t?r:"")},m=function(e,t){let a=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!e&&!t)return;let r=e?`${e.name}-light`:`${t}-light`,i=e?`${e.name}-dark`:`${t}-dark`,o=e?s(e.colors.light):(c.find(e=>e.name===t)||c[0]).colors.light,n=e?d(e.colors.dark):(c.find(e=>e.name===t)||c[0]).colors.dark,l=`
    [data-theme="${r}"] {
      ${g(o,a)}
    }
    
    [data-theme="${i}"] {
      ${g(n,a)}
    }
    
    :root {
      --${r}: 1;
      --${i}: 1;
    }
  `,m=document.createElement("style");m.id=`theme-${e?e.name:t}-styles`,m.textContent=l;let p=document.getElementById(m.id);return p&&p.remove(),document.head.appendChild(m),{light:r,dark:i}}},46740:(e,t,a)=>{a.d(t,{$f:()=>p,D1:()=>d,Hx:()=>u,Jp:()=>b,Si:()=>$,bs:()=>f,h6:()=>c,jO:()=>y,nt:()=>k,rj:()=>m,uM:()=>x,xD:()=>v});var r=a(52159),i=a(26210),o=a(15906),n=a(34279),l=a(71950);let s=()=>`
    ::selection {
      color: var(--theme-bg-color);
      background: var(--theme-fg-color);
    }
    ::-moz-selection {
      color: var(--theme-bg-color);
      background: var(--theme-fg-color);
    }
  `,d=()=>`
  .duokan-footnote-content,
  .duokan-footnote-item {
    display: block !important;
  }

  body {
    padding: 1em !important;
    overflow-wrap: break-word;
  }

  a:any-link {
    text-decoration: none;
    padding: unset;
    margin: unset;
  }

  ol {
    margin: 0;
    padding: 0;
  }

  p, li, blockquote, dd {
    margin: unset !important;
    text-indent: unset !important;
  }

  div {
    margin: unset !important;
    padding: unset !important;
  }

  dt {
    font-weight: bold;
    line-height: 1.6;
  }

  .epubtype-footnote,
  aside[epub|type~="endnote"],
  aside[epub|type~="footnote"],
  aside[epub|type~="note"],
  aside[epub|type~="rearnote"] {
    display: block;
  }
`,c=(e,t,a)=>`
    a:empty {
      background-color: transparent;
      mix-blend-mode: multiply;
    }
    a img {
      mix-blend-mode: multiply;
    }
    div[data-dict-kind="mdict"] .entry_name {
      font-size: 1.2em;
      margin-block-start: 0.5em;
      margin-block-end: 0.5em;
    }
    div[data-dict-kind="mdict"] .juan_drop {
      ${a?`background-color: color-mix(in srgb, ${e} 80%, #000);`:""}
    }
  `,g=e=>`
  .translation-source {
  }
  .translation-target {
  }
  .translation-target.hidden {
    display: none !important;
  }
  .translation-target-block {
    display: block !important;
    ${e?"margin: 0.5em 0 !important;":""}
  }
  .translation-target-toc {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,m=()=>{let e="auto",t="default",a=!1,r=[];t=localStorage.getItem("themeColor")||"default",e=localStorage.getItem("themeMode")||"auto",a="true"===localStorage.getItem("systemIsDarkMode"),r=JSON.parse(localStorage.getItem("customThemes")||"[]");let o="dark"===e||"auto"===e&&a,n=i.Zj.find(e=>e.name===t);if(!n){let e=r.find(e=>e.name===t);e&&(n={name:e.name,label:e.label,colors:{light:(0,i.PF)(e.colors.light),dark:(0,i.n1)(e.colors.dark)}})}n||(n=i.Zj[0]);let l=o?n.colors.dark:n.colors.light;return{bg:l["base-100"],fg:l["base-content"],primary:l.primary,palette:l,isDarkMode:o}},p=function(e,t){var a,i,o,d,c,p,f,b,u;let y,$,k,x,v,w,z,E,S,A,N,L,C,j,F,I,H,M,T,D,q=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];t||(t=m());let _=(y=e.marginTopPx,$=e.marginRightPx,k=e.marginBottomPx,x=e.marginLeftPx,v=e.writingMode,w=e.vertical,`
  @namespace epub "http://www.idpf.org/2007/ops";
  html {
    --margin-top: ${y}px;
    --margin-right: ${$}px;
    --margin-bottom: ${k}px;
    --margin-left: ${x}px;
  }
  html, body {
    ${"auto"===v?"":`writing-mode: ${v} !important;`}
    max-height: unset;
    -webkit-touch-callout: none;
    -webkit-user-select: text;
  }
  body {
    overflow: unset;
    zoom: 1;
    padding: unset;
    margin: unset;
  }
  svg:where(:not([width])), img:where(:not([width])) {
    width: auto;
  }
  svg:where(:not([height])), img:where(:not([height])) {
    height: auto;
  }
  figure > div:has(img) {
    height: auto !important;
  }
  /* enlarge the clickable area of links */
  a {
    position: relative !important;
  }
  a::before {
    content: '';
    position: absolute;
    inset: -10px;
  }

  .${l.nK} {
    display: block;
    overflow: auto;
    max-width: 100%;
    touch-action: pan-x pan-y;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  .${l.NN} {
    overflow: visible;
  }
  .${l.nK} > table {
    display: table !important;
    max-width: 100%;
  }
  pre, code, math {
    white-space: pre-wrap !important;
    scrollbar-width: none;
  }
  math {
    overflow: auto;
  }
  table, math {
    max-width: calc(var(--available-width) * 1px);
    max-height: calc(var(--available-height) * 1px);
  }

  .epubtype-footnote,
  aside[epub|type~="endnote"],
  aside[epub|type~="footnote"],
  aside[epub|type~="note"],
  aside[epub|type~="rearnote"] {
    display: none;
  }

  /* Now begins really dirty hacks to fix some badly designed epubs */
  body {
    line-height: unset;
  }

  .duokan-footnote-content,
  .duokan-footnote-item {
    display: none;
  }

  .duokan-image-gallery-cell {
    height: calc(var(--available-height) * 1px);
  }

  .duokan-image-gallery-cell img {
    height: 90%;
  }

  div:has(> img, > svg) {
    max-width: 100% !important;
  }

  body.paginated-mode td:has(img), body.paginated-mode td :has(img) {
    max-height: calc(var(--available-height) * 0.8 * 1px);
  }

  figure.code {
    overflow: unset !important;
  }

  /* some epubs set insane inline-block for p */
  p {
    display: block;
  }

  /* inline images without dimension */
  .ie6 img {
    width: unset;
    height: unset;
  }
  sup img {
    height: 1em;
  }
  img.has-text-siblings {
    ${w?"width: 1em;":"height: 1em;"}
    vertical-align: baseline;
  }
  :is(div) > img.has-text-siblings[style*="object-fit"] {
    display: block;
    height: auto;
    vertical-align: unset;
  }
  .duokan-footnote img:not([class]) {
    width: 0.8em;
    height: 0.8em;
  }
  div:has(img.singlepage) {
    position: relative;
    width: auto;
    height: auto;
  }
  /* some mobi */
  p[width][height] > img:only-child { 
    width: unset !important;
    height: unset !important;
  }

  /* page break */
  body.paginated-mode div[style*="page-break-after: always"],
  body.paginated-mode div[style*="page-break-after:always"],
  body.paginated-mode p[style*="page-break-after: always"],
  body.paginated-mode p[style*="page-break-after:always"] {
    margin-bottom: calc(var(--available-height) * 1px);
  }

  .br {
    display: flow-root;
  }

  .h5_mainbody {
    overflow: unset !important;
  }
`),O=e.useBookLayout?"":(z=e.overrideLayout,E=e.paragraphMargin,S=e.lineHeight,A=e.wordSpacing,N=e.letterSpacing,L=e.textIndent,C=e.fullJustification,j=e.hyphenation,F=e.vertical,`
  html {
    --default-text-align: ${C?"justify":"start"};
    hanging-punctuation: allow-end last;
    orphans: 2;
    widows: 2;
  }
  html, body {
    text-align: var(--default-text-align);
  }
  [align="left"] { text-align: left; }
  [align="right"] { text-align: right; }
  [align="center"] { text-align: center; }
  [align="justify"] { text-align: justify; }
  :is(hgroup, header) p {
      text-align: unset;
      hyphens: unset;
  }
  p, blockquote, dd, div:not(:has(*:not(b, a, em, i, strong, u, span))) {
    line-height: ${S} ${z?"!important":""};
    word-spacing: ${A}px ${z?"!important":""};
    letter-spacing: ${N}px ${z?"!important":""};
    text-indent: ${L}em ${z?"!important":""};
    -webkit-hyphens: ${j?"auto":"manual"};
    hyphens: ${j?"auto":"manual"};
    -webkit-hyphenate-limit-before: 3;
    -webkit-hyphenate-limit-after: 2;
    -webkit-hyphenate-limit-lines: 2;
    hanging-punctuation: allow-end last;
    widows: 2;
  }
  li {
    line-height: ${S} ${z?"!important":""};
    -webkit-hyphens: ${j?"auto":"manual"};
    hyphens: ${j?"auto":"manual"};
  }
  p.aligned-center, blockquote.aligned-center,
  dd.aligned-center, div.aligned-center {
    text-align: center ${z?"!important":""};
  }
  p.aligned-left, blockquote.aligned-left,
  dd.aligned-left, div.aligned-left {
    ${C&&z?"text-align: justify !important;":""}
  }
  p.aligned-right, blockquote.aligned-right,
  dd.aligned-right, div.aligned-right {
    text-align: right ${z?"!important":""};
  }
  p.aligned-justify, blockquote.aligned-justify,
  dd.aligned-justify, div.aligned-justify {
    ${!C&&z?"text-align: initial !important;":""};
  }
  p:has(> img:only-child), p:has(> span:only-child > img:only-child),
  p:has(> img:not(.has-text-siblings)),
  p:has(> a:first-child + img:last-child) {
    text-indent: initial !important;
  }
  blockquote[align="center"], div[align="center"],
  p[align="center"], dd[align="center"],
  p.aligned-center, blockquote.aligned-center,
  dd.aligned-center, div.aligned-center,
  li p, ol p, ul p, td p {
    text-indent: initial !important;
  }
  p {
    ${F?`margin-left: ${E}em ${z?"!important":""};`:""}
    ${F?`margin-right: ${E}em ${z?"!important":""};`:""}
    ${F?`margin-top: unset ${z?"!important":""};`:""}
    ${F?`margin-bottom: unset ${z?"!important":""};`:""}
    ${!F?`margin-top: ${E}em ${z?"!important":""};`:""}
    ${!F?`margin-bottom: ${E}em ${z?"!important":""};`:""}
    ${!F?`margin-left: unset ${z?"!important":""};`:""}
    ${!F?`margin-right: unset ${z?"!important":""};`:""}
  }
  div {
    ${F&&z?`margin-left: ${E}em !important;`:""}
    ${F&&z?`margin-right: ${E}em !important;`:""}
    ${!F&&z?`margin-top: ${E}em !important;`:""}
    ${!F&&z?`margin-bottom: ${E}em !important;`:""}
  }
  p > font:only-child { 
    display: flow-root; 
  }

  :lang(zh), :lang(ja), :lang(ko) {
    widows: 1;
    orphans: 1;
  }

  /* workaround for some badly designed epubs */
  div.left *, p.left * { text-align: left; }
  div.right *, p.right * { text-align: right; }
  div.center *, p.center * { text-align: center; }
  div.justify *, p.justify * { text-align: justify; }

  img.pi {
    ${F?"transform: rotate(90deg);":""}
    ${F?"transform-origin: center;":""}
    ${F?"height: 2em;":""}
    ${F?`width: ${S}em;`:""}
    ${F?"vertical-align: unset;":""}
  }

  .nonindent, .noindent {
    text-indent: unset !important;
  }
`),B=["ios","android"].includes((0,n.Ox)()),P=(e.zoomLevel||100)/100,R=(a=e.serifFont,i=e.sansSerifFont,o=e.monospaceFont,d=e.defaultFont,c=e.defaultCJKFont,p=e.defaultFontSize*(B?1.25:1)*P,f=e.minimumFontSize,b=e.fontWeight,u=e.overrideFont,I=["Georgia","Times New Roman"],H=[a,...c!==a?[c]:[],...r.H0.filter(e=>e!==a&&e!==c&&!I.includes(e)),...r.az.filter(e=>e!==a&&e!==c),...I.filter(e=>r.H0.includes(e)&&!I.includes(c)),...r.o6],M=[i,...c!==i?[c]:[],...r.Z4.filter(e=>e!==i&&e!==c),...r.Yk.filter(e=>e!==i&&e!==c),...r.o6],T=[o,...r.nh.filter(e=>e!==o)],D="serif"===d.toLowerCase()?"--serif":"--sans-serif",`
    html {
      --serif: ${H.map(e=>`"${e}"`).join(", ")}, serif;
      --sans-serif: ${M.map(e=>`"${e}"`).join(", ")}, sans-serif;
      --monospace: ${T.map(e=>`"${e}"`).join(", ")}, monospace;
      --font-size: ${p}px;
      --min-font-size: ${f}px;
      --font-weight: ${b};
    }
    html, body {
      font-size: ${p}px !important;
      font-weight: ${b};
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    }
    /* lower specificity than ebook built-in font styles */
    html {
      font-family: var(${D}) ${u?"!important":""};
    }
    /* higher specificity than ebook built-in font styles */
    html body {
      ${u?`font-family: var(${D}) !important;`:""}
    }
    font[size="1"] {
      font-size: ${f}px;
    }
    font[size="2"] {
      font-size: ${1.5*f}px;
    }
    font[size="3"] {
      font-size: ${p}px;
    }
    font[size="4"] {
      font-size: ${1.2*p}px;
    }
    font[size="5"] {
      font-size: ${1.5*p}px;
    }
    font[size="6"] {
      font-size: ${2*p}px;
    }
    font[size="7"] {
      font-size: ${3*p}px;
    }
    /* hardcoded inline font size */
    [style*="font-size: 16px"], [style*="font-size:16px"] {
      font-size: 1rem !important;
    }
    pre, code, kbd {
      font-family: var(--monospace);
    }
    body *:not(pre, code, kbd, .code):not(pre *, code *, kbd *, .code *) {
      ${u?"font-family: revert !important;":""}
    }
  `),W=h(q),G=((e,t,a,r,i)=>{let{bg:o,fg:n,primary:l,isDarkMode:d}=a,c=!!r&&"none"!==r;return`
    html {
      --bg-texture-id: ${r};
      --theme-bg-color: ${o};
      --theme-fg-color: ${n};
      --theme-primary-color: ${l};
      --override-color: ${e};
      color-scheme: ${d?"dark":"light"};
    }
    html, body {
      color: ${n};
    }
    ${i?s():""}
    html[has-background], body[has-background] {
      --background-set: var(--theme-bg-color);
    }
    html {
      background-color: var(--theme-bg-color, transparent);
      background: var(--background-set, none);
    }
    body {
      ${i?`background-color: ${o} !important;`:""}
    }
    section, aside, blockquote, article, nav, header, footer, main, figure,
    div, p, font, h1, h2, h3, h4, h5, h6, li, span {
      ${e&&!c?`background-color: ${o} !important;`:""}
      ${e&&!c?`color: ${n} !important;`:""}
      ${e&&!c?`border-color: ${n} !important;`:""}
    }
    pre, span { /* inline code blocks */
      ${e?`background-color: ${o} !important;`:""}
    }
    a:any-link {
      ${e?`color: ${l} !important;`:d?"color: lightblue;":""}
      text-decoration: ${i?"underline":"none"};
    }
    body.pbg {
      ${d?`background-color: ${o} !important;`:""}
    }
    img {
      ${d&&t?"filter: invert(100%);":""}
      ${!d&&e?"mix-blend-mode: multiply;":""}
    }
    svg, img {
      ${e?"background-color: transparent !important;":""};
    }
    /* horizontal rule #1649 */
    *:has(> hr.background-img):not(body) {
      background-color: ${o};
    }
    hr.background-img {
      mix-blend-mode: multiply;
    }
    p[width][height] > img:only-child {
      mix-blend-mode: multiply;
    }
    /* inline images */
    *:has(> img.has-text-siblings):not(body) {
      ${e?`background-color: ${o};`:""}
    }
    p img.has-text-siblings, span img.has-text-siblings, sup img.has-text-siblings {
      mix-blend-mode: ${d?"screen":"multiply"};
    }
    table:has(> colgroup) {
      table-layout: fixed;
    }
    td, th {
      word-break: break-word;
      overflow-wrap: anywhere;
    }
    /* code */
    body.theme-dark code {
      ${d?`color: ${n}cc;`:""}
      ${d?`background: color-mix(in srgb, ${o} 90%, #000);`:""}
      ${d?`background-color: color-mix(in srgb, ${o} 90%, #000);`:""}
    }
    blockquote {
      ${d?`background: color-mix(in srgb, ${o} 80%, #000);`:""}
    }
    /* Only tint table descendants when the user has opted into color override.
       By default, leave them transparent so a plain table (and the invisible
       spacer cells some books use for vertical layout) keeps the page
       background instead of a different shade. Illegible light/zebra table
       backgrounds are handled separately by the dark-mode light-background
       rewriters (getDarkModeLightBackgroundOverrides / transformStylesheet).
       See #4419 (and #2377, which this gate originally fixed). */
    blockquote, table * {
      ${d&&e?`background: color-mix(in srgb, ${o} 80%, #000);`:""}
      ${d&&e?`background-color: color-mix(in srgb, ${o} 80%, #000);`:""}
    }
    /* override inline hardcoded text color */
    font[color="#000000"], font[color="#000"], font[color="black"],
    font[color="rgb(0,0,0)"], font[color="rgb(0, 0, 0)"],
    *[style*="color: rgb(0,0,0)"], *[style*="color: rgb(0, 0, 0)"],
    *[style*="color: #000"], *[style*="color: #000000"], *[style*="color: black"],
    *[style*="color:rgb(0,0,0)"], *[style*="color:rgb(0, 0, 0)"],
    *[style*="color:#000"], *[style*="color:#000000"], *[style*="color:black"] {
      color: ${n} !important;
    }
    ${d&&!e?`
    /* Callout boxes often use inline white/light backgrounds while html/body set dark fg. */
    *[style*="background-color: #fff"], *[style*="background-color:#fff"],
    *[style*="background-color: #ffffff"], *[style*="background-color:#ffffff"],
    *[style*="background-color: white"], *[style*="background-color:white"],
    *[style*="background: #fff"], *[style*="background:#fff"],
    *[style*="background: #ffffff"], *[style*="background:#ffffff"],
    *[style*="background: white"], *[style*="background:white"],
    *[style*="background-color: rgb(255"], *[style*="background-color:rgb(255"],
    *[style*="background: rgb(255"], *[style*="background:rgb(255"] {
      background-color: ${o} !important;
    }
    body.theme-dark {
      background-color: ${o} !important;
    }
`:""}
    /* for the Gutenberg eBooks */
    #pg-header * {
      color: inherit !important;
    }
    .x-ebookmaker, .x-ebookmaker-cover, .x-ebookmaker-coverpage {
      background-color: unset !important;
    }
    /* for the Feedbooks eBooks */
    .chapterHeader, .chapterHeader * {
      border-color: unset;
      background-color: ${o} !important;
    }
    .calibre {
      color: unset;
      background-color: unset;
    }
  `})(e.overrideColor,e.invertImgColorInDark,t,e.backgroundTextureId,e.isEink),X=g(e.showTranslateSource),J=`
  /* Warichu (割注/夹注) — double-line inline annotation */
  .warichu-pending {
    display: inline;
    font-size: 0.5em;
    line-height: 1.1;
  }
  .warichu-chunk {
    display: inline-block;
    line-height: 1.1;
    font-size: 0.5em;
    text-indent: 0;
    vertical-align: middle !important;
    width: 1lh !important;
    text-align: center !important;
  }
  .warichu-chunk .warichu-line {
    display: inline;
  }
  .warichu-open,
  .warichu-close {
    display: inline;
    font-size: 0.5em;
    vertical-align: middle;
    line-height: 1.1;
  }
`,K=`
  rt {
    user-select: none;
    -webkit-user-select: none;
  }
  rp {
    display: none !important;
  }
`,Y=e.userStylesheet;return`${W}
${_}
${O}
${R}
${G}
${X}
${J}
${K}
${Y}`},h=e=>e.filter(e=>!!e.blobUrl).map(e=>{try{return(0,o.pD)(e)}catch{return""}}).join("\n"),f=e=>{let t="translation-style",a=document.getElementById(t);a&&a.remove();let r=document.createElement("style");r.id=t,r.textContent=g(e.showTranslateSource),document.head.appendChild(r)},b=(e,t,a,r)=>{let i=["ios","android"].includes((0,n.Ox)())?1.25:1,o=!e.includes("{"),l=/([^{]+)({[^}]+})/g;e=(e=e.replace(l,(e,t,a)=>{let r=/text-align\s*:\s*center\s*[;$]/.test(a),i=/text-indent\s*:\s*0(?:\.0+)?(?:px|em|rem|%)?\s*[;$]/.test(a);return r&&i?t+(a=(a=a.replace(/(text-align\s*:\s*center)(\s*;|\s*$)/g,"$1 !important$2")).replace(/(text-indent\s*:\s*0(?:\.0+)?(?:px|em|rem|%)?)(\s*;|\s*$)/g,"$1 !important$2")):e})).replace(l,(e,t,a)=>/white-space\s*:\s*nowrap\s*[;$]/.test(a)?(/overflow\s*:/.test(a)||(a=a.replace(/}$/," overflow: clip !important; }")),t+a):e),o?/page-break-after\s*:\s*always\s*[;]?/.test(e)&&!/margin-bottom\s*:/.test(e)&&(e=e.replace(/;?\s*$/,"")+"; margin-bottom: calc(var(--available-height) * 1px)"):e=e.replace(l,(e,t,a)=>/page-break-after\s*:\s*always\s*[;$]/.test(a)?(/margin-bottom\s*:/.test(a)||(a=a.replace(/}$/," margin-bottom: calc(var(--available-height) * 1px); }")),t+a):e),e=(e=(e=(e=e.replace(l,(e,t,a)=>{if(r)return t+a;let i=[],o=!1;for(let e of["top","bottom","left","right"]){let t=RegExp(`duokan-bleed\\s*:\\s*[^;]*${e}[^;]*;`),r=RegExp(`margin-${e}\\s*:`);t.test(a)&&!r.test(a)&&(o=!0,i.push(e),a=a.replace(/}$/,` margin-${e}: calc(-1 * var(--page-margin-${e})) !important; }`))}return o&&(/position\s*:/.test(a)||(a=a.replace(/}$/," position: relative !important; }")),/overflow\s*:/.test(a)||(a=a.replace(/}$/," overflow: hidden !important; }")),/display\s*:/.test(a)||(a=a.replace(/}$/," display: flow-root !important; }")),i.includes("left")&&i.includes("right")&&(a=a.replace(/}$/," width: calc(var(--full-width) * 1px) !important; }").replace(/}$/," min-width: calc(var(--full-width) * 1px) !important; }").replace(/}$/," max-width: calc(var(--full-width) * 1px) !important; }")),i.includes("top")&&i.includes("bottom")&&(a=a.replace(/}$/," height: calc(var(--full-height) * 1px) !important; }").replace(/}$/," min-height: calc(var(--full-height) * 1px) !important; }").replace(/}$/," max-height: calc(var(--full-height) * 1px) !important; }"))),t+a})).replace(l,(e,t,a)=>{if(/\bbody\b/i.test(t)){let e=/font-family\s*:\s*serif\s*(?:;|\}|$)/.test(a),t=/font-family\s*:\s*sans-serif\s*(?:;|\}|$)/.test(a);e&&(a=a.replace(/font-family\s*:\s*serif\s*(;|\}|$)/gi,"font-family: unset$1")),t&&(a=a.replace(/font-family\s*:\s*sans-serif\s*(;|\}|$)/gi,"font-family: unset$1"))}return t+a})).replace(l,(e,a,r)=>{let i=/(?:^|[^a-z-])width\s*:\s*(\d+(?:\.\d+)?)px/.exec(r);return(i?parseFloat(i[1]??"0"):0)>t&&!/max-width\s*:/.test(r)?a+(r=r.replace(/}$/," width: 100%; max-width: calc(var(--available-width) * 1px); box-sizing: border-box; }")):e})).replace(/font-size\s*:\s*xx-small/gi,"font-size: 0.6rem").replace(/font-size\s*:\s*x-small/gi,"font-size: 0.75rem").replace(/font-size\s*:\s*small/gi,"font-size: 0.875rem").replace(/font-size\s*:\s*medium/gi,"font-size: 1rem").replace(/font-size\s*:\s*large/gi,"font-size: 1.2rem").replace(/font-size\s*:\s*x-large/gi,"font-size: 1.5rem").replace(/font-size\s*:\s*xx-large/gi,"font-size: 2rem").replace(/font-size\s*:\s*xxx-large/gi,"font-size: 3rem").replace(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi,(e,t)=>{let a=parseFloat(t)/i/16;return`font-size: ${a}rem`}).replace(/font-size\s*:\s*(\d+(?:\.\d+)?)pt/gi,(e,t)=>{let a=parseFloat(t)/i/12;return`font-size: ${a}rem`}).replace(/font-size\s*:\s*(\d*\.?\d+)(px|rem|em|%)?/gi,function(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"px";return`font-size: max(${t}${a}, var(--min-font-size, 8px))`}).replace(/backdrop-filter\s*:\s*brightness\(100%\)\s*[;]?/gi,"").replace(/(\d*\.?\d+)vw/gi,(e,a)=>parseFloat(a)*t/100+"px").replace(/(\d*\.?\d+)vh/gi,(e,t)=>parseFloat(t)*a/100+"px").replace(/([\s;])-webkit-user-select\s*:\s*none/gi,"$1-webkit-user-select: unset").replace(/([\s;])-moz-user-select\s*:\s*none/gi,"$1-moz-user-select: unset").replace(/([\s;])-ms-user-select\s*:\s*none/gi,"$1-ms-user-select: unset").replace(/([\s;])-o-user-select\s*:\s*none/gi,"$1-o-user-select: unset").replace(/([\s;])user-select\s*:\s*none/gi,"$1user-select: unset").replace(/(font-family\s*:[^;]*?)\bsans-serif\b/gi,"$1READEST_SS_PLACEHOLDER").replace(/(font-family\s*:[^;]*?)\bserif\b(?!-)/gi,"$1var(--serif, serif)").replace(/READEST_SS_PLACEHOLDER/g,"var(--sans-serif, sans-serif)").replace(/(font-family\s*:[^;]*?)\bmonospace\b/gi,"$1var(--monospace, monospace)").replace(/([\s;])font-weight\s*:\s*normal/gi,"$1font-weight: var(--font-weight)").replace(/([\s;])color\s*:\s*black/gi,"$1color: var(--theme-fg-color)").replace(/([\s;])color\s*:\s*#000000/gi,"$1color: var(--theme-fg-color)").replace(/([\s;])color\s*:\s*#000/gi,"$1color: var(--theme-fg-color)").replace(/([\s;])color\s*:\s*rgb\(0,\s*0,\s*0\)/gi,"$1color: var(--theme-fg-color)");let{isDarkMode:s,bg:d}=m();return s&&(e=e.replace(l,(e,t,a)=>{let r=a.replace(/background(-color)?\s*:\s*([^;!}]+)(\s*!important)?(?=\s*[;!}])/gi,(e,t,a,r)=>(e=>{let t=e.trim().toLowerCase();if("white"===t)return!0;let a=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(a){let e=a[1],t=3===e.length?e.split("").map(e=>e+e).join(""):e;return(.299*parseInt(t.slice(0,2),16)+.587*parseInt(t.slice(2,4),16)+.114*parseInt(t.slice(4,6),16))/255>.85}let r=t.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);return r?.[1]!=null&&null!=r[2]&&null!=r[3]&&(.299*parseInt(r[1],10)+.587*parseInt(r[2],10)+.114*parseInt(r[3],10))/255>.85})(a.trim().split(/\s+/)[0]??"")?`background-color: ${d}${r??""}`:e);return r===a?e:t+r})),e},u=(e,t)=>{e.body.classList.remove("theme-light","theme-dark"),e.body.classList.add(t?"theme-dark":"theme-light")},y=(e,t)=>{e.body.classList.remove("scroll-mode","paginated-mode"),e.body.classList.add(t?"scroll-mode":"paginated-mode")},$=(e,t)=>{let a="scrollbar-hide-style",r=e.getElementById(a);t?(r||((r=e.createElement("style")).id=a,e.head.appendChild(r)),r.textContent="foliate-view::part(container) { scrollbar-width: none; }"):r&&(r.textContent="foliate-view::part(container) { scrollbar-width: thin; }")},k=e=>{e.querySelectorAll("img").forEach(e=>{let t=e.getAttribute("width");if(t&&(t.endsWith("%")||t.endsWith("vw"))){let a=parseFloat(t);isNaN(a)||(e.style.width=`${a/100*window.innerWidth}px`,e.removeAttribute("width"))}let a=e.getAttribute("height");if(a&&(a.endsWith("%")||a.endsWith("vh"))){let t=parseFloat(a);isNaN(t)||(e.style.height=`${t/100*window.innerHeight}px`,e.removeAttribute("height"))}let r=e.parentNode;if(!r||r.nodeType!==Node.ELEMENT_NODE)return;let i=Array.from(r.childNodes).some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent?.trim()),o=Array.from(r.childNodes).every(e=>e.nodeType!==Node.ELEMENT_NODE||"BR"!==e.tagName);i&&o&&e.classList.add("has-text-siblings")}),e.querySelectorAll("hr").forEach(e=>{let t=window.getComputedStyle(e);t.backgroundImage&&"none"!==t.backgroundImage&&e.classList.add("background-img")})},x=e=>{e.querySelectorAll("div, p, blockquote, dd").forEach(e=>{let t=window.getComputedStyle(e);"center"===t.textAlign?e.classList.add("aligned-center"):"left"===t.textAlign?e.classList.add("aligned-left"):"right"===t.textAlign?e.classList.add("aligned-right"):"justify"===t.textAlign&&e.classList.add("aligned-justify")})},v=(e,t,a)=>{a||(a=m());let{bg:r,fg:i,primary:o,isDarkMode:n}=a,l=t.isEink,d=t.overrideColor,c=t.invertImgColorInDark,g="fixed-layout-styles",p=e.getElementById(g);p&&p.remove(),(p=e.createElement("style")).id=g,p.textContent=`
    html {
      --theme-bg-color: ${r};
      --theme-fg-color: ${i};
      --theme-primary-color: ${o};
      color-scheme: ${n?"dark":"light"};
    }
    body {
      position: relative;
      background-color: var(--theme-bg-color);
    }
    ${l?s():""}
    #canvas {
      display: inline-block;
      width: fit-content;
      height: fit-content;
      background-color: var(--theme-bg-color);
    }
    img, canvas {
      ${n&&c?"filter: invert(100%);":""}
      ${d?`mix-blend-mode: ${n?"#000000"===r?"luminosity":"overlay":"multiply"};`:""}
    }
    img.singlePage {
      position: relative;
    }
  `,e.head.appendChild(p)}},71950:(e,t,a)=>{a.d(t,{BH:()=>g,FE:()=>c,NN:()=>i,nK:()=>r});let r="scroll-wrapper",i="scroll-wrapper-fit",o=`.${r}`,n="data-readest-scroll-wrapper-touch-scroll",l=e=>e.scrollWidth-e.clientWidth>4,s=e=>e.scrollHeight-e.clientHeight>4,d=e=>{if(!e||!("closest"in e))return null;let t=e.closest(o);for(;t;){if(l(t)||s(t))return t;t=t.parentElement?.closest(o)??null}return null},c=e=>{let t=e.documentElement;if("true"===t.getAttribute(n))return;t.setAttribute(n,"true");let a=0,r=0,i=null,o=()=>{i=null},c={capture:!0,passive:!1};e.addEventListener("touchstart",e=>{if(!(i=d(e.target)))return;let t=e.changedTouches[0];t&&(a=t.screenX,r=t.screenY)},c),e.addEventListener("touchmove",e=>{var t;if(!i||!i.contains(e.target))return;let o=e.changedTouches[0];if(!o)return;let n=o.screenX-a,d=o.screenY-r;t=i,(Math.abs(n)>Math.abs(d)?Math.abs(n)>=8&&l(t):Math.abs(d)>=8&&s(t))&&e.stopImmediatePropagation()},c),e.addEventListener("touchend",o,c),e.addEventListener("touchcancel",o,c),e.addEventListener("wheel",e=>{let t=d(e.target);t&&(Math.abs(e.deltaX)>Math.abs(e.deltaY)?l(t):s(t))&&e.stopImmediatePropagation()},{capture:!0,passive:!0})},g=e=>{let t=e.defaultView,a=a=>{let i=a.parentElement;if(!i||i.classList.contains(r))return;let o=e.createElement("div");o.className=r,o.setAttribute("cfi-skip",""),i.insertBefore(o,a),o.appendChild(a),m(o,t)};e.querySelectorAll("table").forEach(a),e.querySelectorAll("math").forEach(e=>{(e=>{if("block"===e.getAttribute("display"))return!0;let t=e.parentElement;if(!t)return!1;for(let a of t.childNodes)if(a!==e&&(a.nodeType===Node.ELEMENT_NODE||a.nodeType===Node.TEXT_NODE&&a.textContent?.trim()))return!1;return!0})(e)&&a(e)})},m=(e,t)=>{if(!t?.ResizeObserver)return;let a=new t.ResizeObserver(()=>{if(!(e.clientWidth<=0)){let t;t=e.scrollWidth-e.clientWidth<=4,e.classList.toggle(i,t),a.disconnect()}});a.observe(e)}}}]);