# Backend para Sistema Educacional Online com NestJS e Prisma

## Resumo

Projeto desenvolvido para um sistema educacional online, utilizando NestJS como framework backend e Prisma como ORM para gerenciar o banco de dados. O objetivo é fornecer uma API eficiente e escalável para suportar funcionalidades como gerenciamento de usuários, cursos, matrículas e avaliações.

## Tecnologias Utilizadas

- NestJS: 11.0.1
- Prisma: 6.5.0
- TypeScript: 5.7.3

## Instalação/Preparação do Ambiente

### Passos para Configuração

1. Clone o repositório:

   ```sh
   git clone https://github.com/AbelardoOkAmbienteEducacional-Backend
   cd AmbienteEducacional-Backend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure o arquivo `.env` com as variáveis necessárias, como conexão com o banco de dados:

   ```sh
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco"
   ```

4. Execute as migrações do Prisma para preparar o banco de dados:

   ```sh
   npx prisma migrate dev --name init
   ```

5. Inicie o servidor:
   ```sh
   npm run start:dev
   ```

## Resultado Esperado

Ao executar o servidor, espera-se que a API esteja disponível para receber requisições em `http://localhost:3000`, com endpoints para gerenciar usuários, cursos e outras funcionalidades do sistema educacional online.
