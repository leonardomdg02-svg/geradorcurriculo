# Gerador de Currículos em PDF

Sistema completo e responsivo para geração de currículos profissionais em PDF com formulário interativo multi-step, preview em tempo real e persistência de dados local.

## Quick Start

Execute os comandos abaixo para rodar o projeto localmente em menos de 1 minuto:

```bash
# 1. Instale as dependências (Express)
npm install

# 2. Inicie o servidor web local
npm start
```
Após executar, acesse [http://localhost:3000](http://localhost:3000) em seu navegador.

## Features

- **Formulário Multi-step**: Preenchimento guiado em 5 etapas (Dados Pessoais, Objetivo, Formação, Experiência e Habilidades) com validação de dados.
- **Rascunho Automático**: Seus dados são salvos no `localStorage` do navegador, evitando perda de progresso se a página for atualizada.
- **Geração de PDF Programática**: Criação do currículo no formato A4 com margens perfeitas utilizando `jsPDF` e `jspdf-autotable`.
- **Múltiplos Templates**: Opção de escolha entre 3 templates visuais (Clássico, Moderno, Minimalista).
- **Upload de Foto**: Integração de foto de perfil com trava de segurança de tamanho.
- **UI/UX Premium**: Design responsivo com Tema Escuro (Dark Mode) nativo e preview em tempo real.

## Configuration

| Variável | Descrição | Padrão |
|----------|-------------|---------|
| PORT | Porta do servidor Node.js | 3000 |

*Para alterar a porta, execute: `PORT=8080 npm start`*

## Estrutura de Arquivos

- `index.html`: Estrutura principal, formulário 5-steps e interface.
- `style.css`: UI/UX, variáveis, responsividade e Dark Mode.
- `app.js`: Lógica core, controle de etapas, manipulação do DOM e exportação para PDF.
- `server.js`: Backend simplificado Node.js/Express para servir a aplicação.
- `package.json`: Configurações e scripts do projeto.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Backend:** Node.js, Express
- **Geradores:** [jsPDF](https://github.com/parallax/jsPDF) e [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)

## Solução de Problemas

- **Porta Ocupada:** Se o servidor não iniciar, verifique se a porta 3000 está em uso ou inicie com outra porta através das variáveis de ambiente.
- **PDF não gera (Erro):** Verifique sua conexão com a internet, pois as bibliotecas geradoras (jsPDF) são importadas via CDN (`cdnjs`).

## Licença

Este projeto está licenciado sob a Licença MIT.
