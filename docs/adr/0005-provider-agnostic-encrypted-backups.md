# ADR 0005 — Provider-agnostic encrypted backup files

## Status

Accepted — 2026-08-19

## Context

Cross-device backup is useful, but GradeCraft's baseline promise is local-first use without accounts, backend storage, or provider credentials. Direct integrations with cloud drives would create OAuth scopes, credential handling, provider-specific maintenance, and new data-transfer/privacy boundaries.

## Decision

GradeCraft creates and restores a versioned encrypted backup **file** and leaves transport/storage to the user.

The version-1 encrypted envelope uses:

- AES-256-GCM authenticated encryption;
- PBKDF2 with SHA-256 for passphrase-based key derivation;
- a fresh random 16-byte salt per export;
- a fresh random 12-byte IV per export;
- 210,000 PBKDF2 iterations recorded in the envelope;
- the standard GradeCraft JSON backup as the encrypted plaintext.

The exported envelope contains algorithm/KDF metadata, iteration count, salt, IV, and ciphertext. It does not contain the passphrase.

GradeCraft does not persist the passphrase, create a recovery key, or authenticate to a storage provider. The user may move the encrypted file through any provider they choose.

## Consequences

### Positive

- Core use still requires no account or backend.
- GradeCraft never needs Google/Microsoft/Dropbox/etc. provider credentials.
- A stolen encrypted backup file does not reveal ordinary JSON grade data without the passphrase, assuming the cryptographic primitives and passphrase are adequate.
- AES-GCM detects ciphertext tampering/wrong-key authentication failures.
- Provider choice can change without changing the encrypted file format.

### Trade-offs

- Losing the passphrase makes the backup unrecoverable.
- This protects exported backup files, not normal in-use Local Storage.
- PBKDF2 is intentionally expensive and can take noticeable time on slower devices.
- GradeCraft cannot offer account-based recovery or automatic synchronization under this design.

## Rejected alternatives

- Store backups unencrypted in a GradeCraft backend: rejected for privacy, security, cost, and operational complexity.
- Direct provider OAuth integrations in the core app: rejected because they expand scopes, dependencies, and failure modes.
- Store the encryption key/passphrase locally for convenience: rejected because it weakens the purpose of a portable encrypted backup.
- Custom encryption algorithm: rejected in favor of standard browser Web Crypto primitives.
