# nx-extend

**A comprehensive collection of Nx plugins for deployment, infrastructure, testing, and development tools.**

nx-extend provides production-ready plugins that extend Nx workspace capabilities with deployment targets, infrastructure-as-code tools, testing frameworks, and development utilities. Built to streamline modern full-stack development workflows.

---

## 📦 Available Packages

### Cloud Deployment & Hosting

#### Google Cloud Platform
- **[@nx-extend/gcp-cloud-run](./packages/gcp-cloud-run/README.md)** - Deploy applications to Google Cloud Run
  ```sh
  npm install -D @nx-extend/gcp-cloud-run
  ```

- **[@nx-extend/gcp-functions](./packages/gcp-functions/README.md)** - Build and deploy Google Cloud Functions
  ```sh
  npm install -D @nx-extend/gcp-functions
  ```

- **[@nx-extend/gcp-storage](./packages/gcp-storage/README.md)** - Upload and manage files in Google Cloud Storage
  ```sh
  npm install -D @nx-extend/gcp-storage
  ```

- **[@nx-extend/gcp-secrets](./packages/gcp-secrets/README.md)** - Manage secrets with Google Cloud Secret Manager
  ```sh
  npm install -D @nx-extend/gcp-secrets
  ```

- **[@nx-extend/gcp-deployment-manager](./packages/gcp-deployment-manager/README.md)** - Deploy resources with GCP Deployment Manager
  ```sh
  npm install -D @nx-extend/gcp-deployment-manager
  ```

- **[@nx-extend/gcp-task-runner](./packages/gcp-task-runner/README.md)** - Use Google Cloud Storage as Nx remote cache
  ```sh
  npm install -D @nx/gcs-cache@npm:@nx-extend/gcp-task-runner
  ```

#### Other Platforms
- **[@nx-extend/firebase-hosting](./packages/firebase-hosting/README.md)** - Deploy to Firebase Hosting
  ```sh
  npm install -D @nx-extend/firebase-hosting
  ```

- **[@nx-extend/vercel](./packages/vercel/README.md)** - Deploy to Vercel
  ```sh
  npm install -D @nx-extend/vercel
  ```

- **[@nx-extend/github-pages](./packages/github-pages/README.md)** - Deploy to GitHub Pages
  ```sh
  npm install -D @nx-extend/github-pages
  ```

### Infrastructure as Code
- **[@nx-extend/terraform](./packages/terraform/README.md)** - Manage infrastructure with Terraform
  ```sh
  npm install -D @nx-extend/terraform
  ```

- **[@nx-extend/pulumi](./packages/pulumi/README.md)** - Manage infrastructure with Pulumi
  ```sh
  npm install -D @nx-extend/pulumi
  ```

### Testing & Quality
- **[@nx-extend/e2e-runner](./packages/e2e-runner/README.md)** - Run E2E tests with automatic service startup
  ```sh
  npm install -D @nx-extend/e2e-runner
  ```

- **[@nx-extend/playwright](./packages/playwright/README.md)** - Playwright integration (deprecated - use @nx/playwright)
  ```sh
  npm install -D @nx-extend/playwright
  ```

### UI & Frontend
- **[@nx-extend/shadcn-ui](./packages/shadcn-ui/README.md)** - Add shadcn/ui components to Nx workspace
  ```sh
  npm install -D @nx-extend/shadcn-ui
  ```

- **[@nx-extend/react-email](./packages/react-email/README.md)** - Build emails with React Email
  ```sh
  npm install -D @nx-extend/react-email
  ```

- **[@nx-extend/docusaurus](./packages/docusaurus/README.md)** - Generate and build Docusaurus documentation sites
  ```sh
  npm install -D @nx-extend/docusaurus
  ```

### CMS & Backend
- **[@nx-extend/strapi](./packages/strapi/README.md)** - Generate and run Strapi projects in Nx
  ```sh
  npm install -D @nx-extend/strapi
  ```

### Localization & Utilities
- **[@nx-extend/translations](./packages/translations/README.md)** - Extract, manage, and translate FormatJS messages
  ```sh
  npm install -D @nx-extend/translations
  ```

- **[@nx-extend/changelog-notify](./packages/changelog-notify/README.md)** - Send changelog notifications
  ```sh
  npm install -D @nx-extend/changelog-notify
  ```

---

## 🚀 GitHub Actions

nx-extend provides GitHub Actions to streamline your CI/CD workflows:

- **[set-shas](./actions/set-shas/README.md)** - Set SHAs for Nx affected commands
  ```yaml
  - uses: tripss/nx-extend/actions/set-shas@master
  ```

- **[plan](./actions/plan/README.md)** - Plan and analyze Nx tasks
  ```yaml
  - uses: tripss/nx-extend/actions/plan@master
  ```

- **[run-many](./actions/run-many/README.md)** - Execute multiple Nx targets efficiently
  ```yaml
  - uses: tripss/nx-extend/actions/run-many@master
  ```

---

## 🤝 Contributing

Contributions are welcome! If you have questions, ideas, or run into issues:

- [Open an issue](https://github.com/TriPSs/nx-extend/issues/new) for bug reports or feature requests
- [Browse existing issues](https://github.com/TriPSs/nx-extend/issues) for discussions and known problems
- Submit pull requests to help improve the project

## 📄 License

This project is [MIT licensed](./LICENSE).

## 💡 Quick Start

1. **Install a plugin:**
   ```sh
   npm install -D @nx-extend/<plugin-name>
   ```

2. **Run the generator (if available):**
   ```sh
   nx g @nx-extend/<plugin-name>:init
   ```

3. **Use the executor:**
   ```sh
   nx <target> <project-name>
   ```

For detailed documentation, visit the individual package README files linked above.
