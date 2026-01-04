# Verifiable Supply Chain Demo (SLSA Provenance + GitHub Attestations + Sigstore Cosign)

This repo demonstrates a verifiable software supply chain:
- SLSA v1 build provenance (GitHub build attestations)
- Verifying that provenance with `gh attestation verify`
- Keyless container signing with Sigstore/cosign (GitHub Actions OIDC)
- Verifying the signature with `cosign verify`
- Attesting and verifying a non-container artifact (`.tgz` from `npm pack`)

## What this repo produces

On push to `main`, the workflow `.github/workflows/build-attest-sign.yml`:
- builds and pushes a container image to GHCR
- generates a SLSA v1 provenance attestation for the image
- signs the image keylessly using cosign (OIDC)
- builds an npm tarball (`npm pack`) and generates a SLSA v1 provenance attestation for the `.tgz`

## Quick run

```bash
docker pull ghcr.io/dareedyone/verifiable-supply-chain:latest
docker run --rm ghcr.io/dareedyone/verifiable-supply-chain:latest
```

## Verify provenance for the container image (GitHub attestation)

### Prerequisites
- Install GitHub CLI (`gh`)
- Authenticate:

```bash
gh auth login
```

### Verify

```bash
gh attestation verify \
  oci://ghcr.io/dareedyone/verifiable-supply-chain:latest \
  --repo dareedyone/verifiable-supply-chain
```

### Example output (real run)

```text
Loaded digest sha256:58ff78be244de5f7016c7ea6b0a17ae055f2f849f0d6508e0d98a59aa98738e7 for oci://ghcr.io/dareedyone/verifiable-supply-chain:latest
Loaded 1 attestation from GitHub API

The following policy criteria will be enforced:
- Predicate type must match:................ https://slsa.dev/provenance/v1
- Source Repository Owner URI must match:... https://github.com/dareedyone
- Source Repository URI must match:......... https://github.com/dareedyone/verifiable-supply-chain
- Subject Alternative Name must match regex: (?i)^https://github.com/dareedyone/verifiable-supply-chain/
- OIDC Issuer must match:................... https://token.actions.githubusercontent.com

✓ Verification succeeded!

The following 1 attestation matched the policy criteria

- Attestation #1
  - Build repo:..... dareedyone/verifiable-supply-chain
  - Build workflow:. .github/workflows/build-attest-sign.yml@refs/heads/main
  - Signer repo:.... dareedyone/verifiable-supply-chain
  - Signer workflow: .github/workflows/build-attest-sign.yml@refs/heads/main
```

## Verify keyless signing for the container image (Sigstore/cosign)

### Verify

```bash
cosign verify \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity "https://github.com/dareedyone/verifiable-supply-chain/.github/workflows/build-attest-sign.yml@refs/heads/main" \
  ghcr.io/dareedyone/verifiable-supply-chain:latest
```

### Example output (real run)

```text
Verification for ghcr.io/dareedyone/verifiable-supply-chain:latest --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates

[{"critical":{"identity":{"docker-reference":"ghcr.io/dareedyone/verifiable-supply-chain:latest"},"image":{"docker-manifest-digest":"sha256:985afc3b186d1bbf56238348dcb7701fabe719d2a5e77d96fb81466cfe6b9cbf"},"type":"https://sigstore.dev/cosign/sign/v1"},"optional":{}},{"critical":{"identity":{"docker-reference":"ghcr.io/dareedyone/verifiable-supply-chain:latest"},"image":{"docker-manifest-digest":"sha256:985afc3b186d1bbf56238348dcb7701fabe719d2a5e77d96fb81466cfe6b9cbf"},"type":"https://slsa.dev/provenance/v1"},"optional":{}}]
```

## Verify provenance for the build tarball (`.tgz`) (GitHub attestation)

The workflow attests the `.tgz` produced by `npm pack`. When downloaded from GitHub Actions it is wrapped in a ZIP (`npm-tarball.zip`). Verify the `.tgz` inside, not the ZIP.

### Unzip and verify

```bash
unzip -o npm-tarball.zip -d npm-tarball
gh attestation verify npm-tarball/*.tgz -R dareedyone/verifiable-supply-chain
```

### Example output (real run)

```text
Loaded digest sha256:138876839554c4216863d32d9f43c74ebcd2dda3354ddb6885e8093912ae17a7 for file://npm-tarball/verifiable-supplychain-demo-0.1.0.tgz
Loaded 1 attestation from GitHub API

The following policy criteria will be enforced:
- Predicate type must match:................ https://slsa.dev/provenance/v1
- Source Repository Owner URI must match:... https://github.com/dareedyone
- Source Repository URI must match:......... https://github.com/dareedyone/verifiable-supply-chain
- Subject Alternative Name must match regex: (?i)^https://github.com/dareedyone/verifiable-supply-chain/
- OIDC Issuer must match:................... https://token.actions.githubusercontent.com

✓ Verification succeeded!

The following 1 attestation matched the policy criteria

- Attestation #1
  - Build repo:..... dareedyone/verifiable-supply-chain
  - Build workflow:. .github/workflows/build-attest-sign.yml@refs/heads/main
  - Signer repo:.... dareedyone/verifiable-supply-chain
  - Signer workflow: .github/workflows/build-attest-sign.yml@refs/heads/main
```
