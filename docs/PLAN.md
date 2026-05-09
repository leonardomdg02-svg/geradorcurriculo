# Plano de Desenvolvimento: Gerador de Currículos em PDF

## 1. Visão Geral
Este plano detalha a arquitetura e os passos de implementação para o Gerador de Currículos em PDF, seguindo os rigorosos requisitos de stack (Vanilla JS, CSS3, HTML5, Node.js + Express) e as especificações de interface e funcionalidades.

## 2. Estrutura do Projeto
```
/gerador-curriculo
  ├── index.html
  ├── style.css
  ├── app.js
  ├── server.js
  ├── package.json
  └── README.md
```

## 3. Fases de Implementação

### Fase 1: Configuração Inicial e Backend (Node.js)
- **Objetivo:** Criar o ambiente base.
- **Ações:**
  1. Criar `package.json` com o script de start.
  2. Implementar `server.js` utilizando Express para servir a pasta raiz na porta 3000 (ou configurável via ambiente), e registrar logs simples.
  3. Criar o esqueleto do `index.html`.

### Fase 2: Interface (HTML + CSS)
- **Objetivo:** Construir o formulário multi-step e o layout.
- **Ações:**
  1. Estruturar os 5 passos do formulário no `index.html`.
  2. Implementar a barra de progresso visual.
  3. Configurar os containers side-by-side (Desktop) e modal (Mobile) para o Preview.
  4. Escrever o `style.css` com design responsivo (Mobile-first), paleta de cores especificada, transições suaves, spinner CSS e toggle Dark Mode.
  5. Adicionar a seção de seleção dos 3 templates (Clássico, Moderno, Criativo).

### Fase 3: Lógica e Validações (JavaScript - app.js)
- **Objetivo:** Controlar o fluxo do usuário e dados.
- **Ações:**
  1. Implementar navegação entre os passos com validação inline obrigatória.
  2. Criar a lógica dinâmica para adicionar/remover Formação e Experiência.
  3. Desenvolver o input de Habilidades (chips visuais).
  4. Adicionar tratamento de imagem (FileReader) para converter a foto em Base64.
  5. Sincronizar os dados do formulário com a área de Preview em tempo real.

### Fase 4: Persistência (localStorage)
- **Objetivo:** Evitar perda de dados.
- **Ações:**
  1. Salvar o estado do formulário (`curriculo_rascunho`) a cada avanço de etapa.
  2. Implementar trava de limite (4MB) ao salvar a imagem em Base64.
  3. Criar banner de restauração ao carregar a página se houver rascunho salvo.

### Fase 5: Geração de PDF (jsPDF)
- **Objetivo:** Exportar o currículo finalizado.
- **Ações:**
  1. Mapear os 3 templates visualmente para comandos programáticos do jsPDF (sem html2canvas para renderização de texto).
  2. Utilizar `jspdf-autotable` para listar formações, experiências e habilidades de forma estruturada.
  3. Inserir a imagem em Base64 no PDF.
  4. Gerenciar múltiplas páginas caso o conteúdo exceda o tamanho A4.
  5. Salvar o arquivo com a nomenclatura `curriculo_[nome-do-usuario]_[data].pdf`.

### Fase 6: Documentação e Polimento
- **Objetivo:** Entrega final e validações.
- **Ações:**
  1. Escrever o `README.md` completo contemplando os 12 itens exigidos.
  2. Revisar o código garantindo `use strict`, funções pequenas (< 30 linhas), e ausência de `var`.
  3. Testar localmente.
