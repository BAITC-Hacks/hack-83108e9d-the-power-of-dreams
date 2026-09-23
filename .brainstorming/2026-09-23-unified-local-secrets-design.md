# Unified local secrets

Approved by the user on 2026-09-23. Outcome: use one untracked root `.env`
for OpenAI, NVIDIA, database access, and future server secrets. Publish only
an empty `.env.example` and organizer instructions. Read settings centrally
on the server, check required names before using a service, and never print
values or send secrets to the browser. Organizers copy and fill the template;
team credentials, if provided, travel through a separately agreed private channel.

A plaintext file is appropriate for this local hackathon setup. Encrypted files
require separate password distribution; a hosted secret manager adds accounts
and infrastructure. Neither is needed for the approved scope.

The application is not implemented yet. Deliver a dependency-free configuration
module and a preflight command now; future application entry points must call
the module with their required settings before starting external operations.
No live provider or database connectivity is claimed by configuration checks.
Current requirements and progress live in
`openspec/changes/unified-local-secrets/` after transfer.
