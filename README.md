<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # TITANBODY ✨
  
  **O seu treinador de fisiculturismo pessoal impulsionado por Inteligência Artificial.**

  [![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Powered by Gemini](https://img.shields.io/badge/AI-Gemini-8E75B2?logo=google-bard&logoColor=white)](https://ai.google.dev/)
</div>

<br />

## 📋 Sobre o Projeto

O **TitanBody** é uma aplicação web desenvolvida para transformar sua jornada de treino. Utilizando a poderosa API do Google Gemini, o app atua como um coach inteligente, criando treinos personalizados, acompanhando seu progresso e oferecendo feedback em tempo real.

Veja mais pelo Google AI Studio: https://ai.studio/apps/drive/1e2BaynHVka28YtXLydLjegyR9xXwEZBE

## 🚀 Funcionalidades Principais

*   **🧠 AI Coach Integrado:** Receba orientações, ajustes de treino e motivação de uma IA treinada para fisiculturismo.
*   **🏋️ Treinos Dinâmicos:** Sessões interativas com cronômetro, contagem de séries e registro de carga.
*   **⚙️ Setup Personalizado:** Um assistente de configuração inicial para adaptar o app aos seus objetivos e equipamentos.
*   **📱 Design Responsivo:** Interface moderna e fluida, otimizada para qualquer dispositivo (Mobile First).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as melhores ferramentas do ecossistema moderno:

*   **Frontend Reference:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (via CDN) + [FontAwesome](https://fontawesome.com/)
*   **Roteamento:** [React Router v7](https://reactrouter.com/)
*   **Inteligência Artificial:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)

## 💻 Como Rodar Localmente

Siga os passos abaixo para executar o projeto em sua máquina:

### Pré-requisitos
*   **Node.js** (Versão 18 ou superior recomendada)
*   Uma chave de API do **Google Gemini**

### Instalação

1.  **Clone o repositório** ou navegue até a pasta do projeto.
2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração de Ambiente:**
    *   Crie ou edite o arquivo `.env.local` na raiz do projeto.
    *   Adicione sua chave da API do Gemini:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```
    > **Nota:** Certifique-se de que a chave tenha permissões adequadas.

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```

5.  **Acesse:**
    Abra seu navegador em `http://localhost:3000` (ou a porta indicada no terminal).

## 📂 Estrutura do Projeto

```
/
├── components/     # Componentes de UI reutilizáveis
├── pages/          # Páginas principais (Dashboard, Treino, etc.)
├── services/       # Lógica de serviços (Storage, API Gemini)
├── App.tsx         # Componente raiz e rotas
└── index.html      # Ponto de entrada e imports CDN
```

---

<div align="center">
  <p>Desenvolvido com 💪 e 🤖</p>
</div>

