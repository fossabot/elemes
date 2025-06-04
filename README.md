# ELEMES

<div align="center">
  <img src="./src/icons/logo.svg" alt="elemes logo" width="120" height="120" />

  <strong>LMS but only the exam part :D</strong>

  <span>A modern examination platform built with TanStack Start and Mantine UI</span>
</div>

## 🚀 Quick Start

The easiest way to get started is using the provided DevContainer configuration:

1. **Prerequisites:**

   - [Docker](https://docs.docker.com/get-docker/)
   - [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in DevContainer:**

   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Select "Dev Containers: Clone Repository in Container Volume"
   - Wait for the container to build and start

> [!IMPORTANT]
> When running the DevContainer for the first time, you may encounter an error because the `.env` file is not yet present. Create a `.env` file first inside the recovery container (you can use `.env.example` as a template).

3. **Start development:**
   ```bash
   npm run dev
   ```

The development server will be available at `http://localhost:3000`

## 🐳 Production Deployment

See [compose.yml](./compose.yml) for the production setup.

Deploy with:

```bash
docker-compose up -d
```

## 🛠️ Development

### Database Migrations

see [migrate guide](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate) for details on how to manage database migrations.

### Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── routes/             # File-based routing
│   ├── lib/                # Utilities and configurations
│   ├── mantine/            # Mantine theme customization
│   └── types/              # TypeScript type definitions
├── migrations/             # Database migrations
├── public/                 # Static assets
├── .devcontainer/          # DevContainer configuration
└── scripts/                # Build and deployment scripts
```

## 📦 Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **UI Library:** [Mantine](https://mantine.dev/)
- **Database:** PostgreSQL
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Styling:** PostCSS with Mantine
- **TypeScript:** Full type safety
- **Package Manager:** npm

## 📝 License

This project is open-sourced software licensed under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for the amazing router and query tools
- [Mantine](https://mantine.dev/) for the beautiful UI components
- [Better Auth](https://www.better-auth.com/) for authentication
