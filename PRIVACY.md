# Privacy Policy

GradeCraft is designed to work without an account or application backend.

## Data stored locally

Course names, codes, optional semester/term labels, categories, assignment scores, grade scales, appearance/accessibility/language preferences, and backup metadata are stored in the browser's Local Storage on the device/profile where GradeCraft runs.

GradeCraft also keeps a local recovery copy of the previous valid state so it can fall back if the primary Local Storage record becomes unreadable.

## Data transmission

The GradeCraft application itself does not transmit grade data to a GradeCraft server and does not include analytics or advertising SDKs. Hosting providers and browsers may still process ordinary network metadata when application assets are downloaded.

GradeCraft does not connect directly to cloud-storage providers. If you place an exported backup in a provider such as a drive or sync service, that transfer is initiated and governed outside GradeCraft.

## Exports and imports

JSON backups and CSV files are processed in the browser. Standard JSON and CSV exports are **not encrypted** and should be handled like any other file containing academic data.

CSV imports are staged in memory while you review detected column mappings. Imported rows are written to the selected local course only after you confirm the mapping workflow.

Once an unencrypted export is downloaded, that file is controlled by you and by the storage location where you save it.

## Optional encrypted backups

GradeCraft can create an optional encrypted backup file in the browser. The backup payload is protected with authenticated AES-GCM encryption. A key is derived from the passphrase using PBKDF2-SHA-256 with a randomized salt; each export also uses a randomized IV.

The passphrase is entered into the current page and is not written to GradeCraft Local Storage, included in the backup file, sent to a GradeCraft server, or recoverable by the project. Losing the passphrase makes that encrypted backup unrecoverable.

The encrypted file contains encryption metadata, salt, IV, iteration count, and ciphertext. It does not contain the passphrase. You may save or transfer that encrypted file using any storage provider you choose; GradeCraft does not receive that provider's credentials.

## Application logs

GradeCraft does not send application logs to a telemetry backend. Diagnostic console events use structured logging with redaction and avoid recording raw storage/import exception text or backup passphrases.

## Deletion

Settings → **Delete all local data** removes GradeCraft's primary and recovery records from Local Storage. Browser-level backups, synced browser profiles, downloaded exports, files copied to third-party storage, or operating-system backups are outside GradeCraft's control.

## Contact

Privacy/support questions: `supportramsandesh@gmail.com`.
