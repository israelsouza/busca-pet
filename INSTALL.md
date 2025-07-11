# Guia de Instalação e Configuração - Busca Pet

Este guia contém todas as instruções necessárias para configurar e executar os ambientes de frontend e backend do projeto Busca Pet.

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

- **Node.js**: Versão 22.x ou superior (testado com a versão 22.11.0).
- **Git**: Para clonar o repositório.
- **Oracle Database 21c Express Edition**: O banco de dados utilizado pela aplicação.

---

## 1. Clonar o Repositório

Abra seu terminal, navegue até o diretório onde deseja salvar o projeto e execute o comando:

```bash
git clone https://github.com/israelsouza/busca-pet
cd busca-pet
```

---

## 2. Configuração do Backend

Siga os passos abaixo para deixar o servidor pronto para uso.

### a. Instalar Dependências

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale os pacotes necessários:
    ```bash
    npm install
    ```

### b. Configurar Variáveis de Ambiente

1.  Na pasta `backend`, crie um arquivo chamado `.env`.
2.  Copie o conteúdo abaixo para o seu arquivo `.env` e substitua os valores pelos seus dados.

    ```env
    # Credenciais do Banco de Dados Oracle
    DB_USER=seu_usuario_oracle
    DB_PASSWORD=sua_senha_oracle
    DB_CONNECT_STRING=localhost/XEPDB1

    # Configuração do Nodemailer (para recuperação de senha via e-mail)
    # Pode variar dependendo do seu provedor de e-mail
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=465
    EMAIL_USER=seu_email@exemplo.com
    EMAIL_PASS=sua_senha_de_app_ou_normal

    # Chave secreta para gerar os tokens de autenticação (JWT)
    JWT_SECRET=sua_chave_secreta_aqui

    # Porta em que o servidor irá rodar
    PORT=3001
    ```

    > **⚠️ Importante:** O arquivo `.env` contém informações sensíveis e não deve ser enviado para o repositório. Ele já está no `.gitignore` para prevenir commits acidentais.

### c. Configurar o Banco de Dados

Execute o script `backend/model/db.sql` em sua instância do Oracle Database. Isso criará todas as tabelas e estruturas necessárias para a aplicação funcionar. Você pode usar uma ferramenta visual como o DBeaver ou SQL Developer, ou a linha de comando (`sqlplus`).

### d. Rodar os Testes (Opcional, mas recomendado)

Para garantir que tudo está configurado corretamente, rode a suíte de testes automatizados:

```bash
npm test
```

### e. Iniciar o Servidor

Com tudo configurado, inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O backend estará disponível em `http://localhost:3000` (para mudar, redefina no arquivo `server.js`).

---

## 3. Configuração do Frontend

### a. Instalar Dependências

1.  A partir da raiz do projeto, navegue até a pasta do frontend:
    ```bash
    cd frontend/busca-pet
    ```
2.  Instale os pacotes necessários:
    ```bash
    npm install
    ```

### b. Iniciar a Aplicação

1.  Execute o comando para iniciar o servidor de desenvolvimento do Vite:
    ```bash
    npm run dev
    ```

A aplicação frontend estará acessível em `http://localhost:5173` (ou em outra porta, caso a 5173 esteja em uso).
