# Execution Authority Model (Non-Authoritative)

## Protocol vs Runtime
- Protocol = frozen authority surface anchored to freeze/* and authoritative executables.
- Runtime = delivery surface; may advance without modifying authority.

## Authority Mutation
Authority mutation is forbidden by default. Any upgrade requires a formal procedure that produces a new frozen surface and explicit seal.
