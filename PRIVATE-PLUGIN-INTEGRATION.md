# Private plugin integration

The workflow checks out this public repository and the private `hanstechy1/PLUGIN` repository, validates JavaScript, and creates a downloadable artifact.

Required repository secret: `PLUGIN_REPO_TOKEN` in this public repository. Use a fine-grained personal access token scoped only to `hanstechy1/PLUGIN` with Contents: Read-only.

Run it from GitHub → Actions → Integrate private PLUGIN repository → Run workflow.

This workflow does not deploy or start the WhatsApp bot. Deployment must be configured separately for your hosting provider.
