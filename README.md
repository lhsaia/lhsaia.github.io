# 💻 Portfólio Pessoal Híbrido — Bento Grid & Multilíngue

Este é o repositório do meu portfólio pessoal público, hospedado gratuitamente no GitHub Pages sob o domínio especial **[lhsaia.github.io](https://lhsaia.github.io/)**. 

O projeto foi projetado para ser leve, moderno, altamente responsivo e totalmente customizável através de arquivos de configuração.

---

## 🎨 Destaques do Design & Experiência Visual
* **Estética Bento Grid**: Organização assimétrica e simétrica premium, inspirada no design moderno da Apple e Microsoft.
* **Glassmorphism & Dark Mode**: Interface escura profunda com bordas semi-transparentes de vidro fosco, sombras dinâmicas e transições suaves.
* **Micro-animações**: Feedback tátil ao passar o mouse com efeitos de escala (`transform: scale`) e brilho de foco adaptativo de acordo com a cor primária do card (`highlightColor`).

---

## 🛠️ Recursos Técnicos de Destaque

### 1. Internacionalização Nativa (i18n) 🌍
* Suporte completo para **Português**, **Inglês** e **Espanhol**.
* Detecção automática do idioma preferencial do navegador do visitante.
* Persistência de escolha do usuário salva localmente no `localStorage`.

### 2. Carregamento Híbrido Resiliente (CORS Fallback) 🔄
* O portfólio consome os dados de forma dinâmica e assíncrona.
* **Modo Padrão**: Faz um `fetch` dinâmico do arquivo `projects.json` via requisições HTTP AJAX.
* **Modo Fallback Offline**: Caso o site seja aberto localmente direto em disco (protocolo `file://`), o navegador bloqueia requisições AJAX devido à política de CORS. O código automaticamente captura essa falha de forma transparente (`catch`) e consome os dados estáticos salvos no fallback global em `projects.js`, garantindo que o portfólio funcione offline em qualquer circunstância.

### 3. Modais Dinâmicos de Projeto com Suporte a Colaborações 👥
* Cada card do grid abre um modal detalhado com as tecnologias utilizadas (`tags`) e cores de destaque estilizadas individualmente via JavaScript.
* Suporte a parcerias de projetos com renderização inline e precisa de ícones SVG de redes sociais como **GitHub**, **LinkedIn** e **Instagram** para colaboradores.

---

## 📂 Estrutura de Arquivos
* `index.html` — Estrutura semântica e esqueleto do portfólio.
* `style.css` — Sistema de design de variáveis CSS, Bento layouts, Glassmorphism e responsividade.
* `main.js` — Lógica do seletor de idiomas, renderização do grid, animações, modais e fallback híbrido.
* `projects.json` — Fonte primária de dados e traduções dos projetos.
* `projects.js` — Fonte secundária estática de paridade para funcionamento offline (`file://`).

---

## 🚀 Como Rodar Localmente

Basta clonar o repositório e abrir o arquivo `index.html` no seu navegador favorito ou rodar um servidor de desenvolvimento simples:

```bash
# Clone o repositório
git clone https://github.com/lhsaia/lhsaia.github.io.git

# Entre na pasta
cd lhsaia.github.io

# (Opcional) Suba um servidor web simples com Python
python -m http.server 8000
```
