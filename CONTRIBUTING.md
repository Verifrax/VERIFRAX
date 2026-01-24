# Contributing to VERIFRAX

## Before You Start

VERIFRAX is a **deterministic verification system**. Changes to execution semantics require extraordinary scrutiny.

### What Will Be Accepted

- **Documentation improvements**: Clarifications, typo fixes, examples
- **Test coverage**: Additional test cases that don't modify behavior
- **Bug fixes**: With clear reproduction steps and tests
- **Security fixes**: Via private disclosure (see SECURITY.md)

### What Will Be Rejected

- Changes to verification semantics without spec update
- Changes that break determinism guarantees
- Features that add runtime state
- "Improvements" that alter certificate format
- PRs without tests for behavioral changes

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Verifrax/VERIFRAX.git
cd VERIFRAX

# Install Wrangler CLI
npm install -g wrangler

# Run locally
wrangler dev
```

## Running Tests

```bash
# Run verification tests
npm test

# Test determinism
npm run test:determinism
```

## Pull Request Process

### For Documentation Changes

1. Fork the repository
2. Create a branch: `docs/your-change`
3. Make changes
4. Submit PR with label `docs-only`

**Documentation PRs can be merged without extensive review.**

### For Code Changes

1. Fork the repository
2. Create a branch: `fix/issue-number` or `feature/description`
3. Write tests first
4. Make changes
5. Ensure all tests pass
6. Submit PR with appropriate labels

**Code PRs require:**
- Passing CI
- At least one approval
- No unresolved conversations

### For Execution Semantics Changes

1. Open an issue first describing the change
2. Wait for explicit approval before starting work
3. Update specification document
4. Write comprehensive tests
5. Submit PR with label `contract-change`

**Execution semantics PRs require:**
- Explicit maintainer approval before work begins
- Specification update
- Comprehensive test coverage
- Multiple reviewer approvals

## Labels

| Label | Meaning |
|-------|---------|
| `docs-only` | Documentation changes only (fast path) |
| `contract-change` | Changes execution semantics (hard scrutiny) |
| `security` | Security-related (private handling) |
| `good-first-issue` | Suitable for new contributors |

## Code Style

- JavaScript: Follow existing patterns in `worker.js`
- No unnecessary dependencies
- Comments for non-obvious logic
- Descriptive commit messages

## Commit Messages

```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Test changes
- `refactor`: Code refactoring (no behavior change)
- `feat`: New feature (requires discussion)

## Questions?

Open a discussion or issue. Do not open PRs for questions.
