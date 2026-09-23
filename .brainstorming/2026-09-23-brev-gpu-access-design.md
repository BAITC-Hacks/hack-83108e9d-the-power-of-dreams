# Brev GPU access

The user approved separate responsibilities for OpenAI and NVIDIA Brev, created
the dreams-gpu L40S environment, and explicitly requested autonomous connection,
verification, and installation of necessary tools. This slice prepares that
existing machine and repeatable access from Windows. No second VM is created.

Use Ubuntu in WSL and the official Brev CLI. Read BREV_API_KEY from the existing
local secrets loader, pass it only through process environment, and verify actual
remote GPU execution. Keep an isolated Python environment on /data. Preserve the
no-commit/no-push/no-merge hold. Do not expose a new public endpoint.

OpenAI remains responsible for reasoning and explanations; Brev is for a
specialized GPU workload. The actual model/workload and product routing remain
undecided. Do not invent those decisions or claim the product adapters are ready.
