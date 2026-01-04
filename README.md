## Verify build provenance (GitHub attestation)

This repo publishes a container image to GHCR and generates a SLSA v1 build provenance attestation via GitHub Actions.

### Verify the image attestation

```bash
gh attestation verify oci://ghcr.io/dareedyone/verifiable-supply-chain:latest --repo dareedyone/verifiable-supply-chain


Expected: Verification succeeded and the attestation should reference:
	•	Predicate type: https://slsa.dev/provenance/v1
	•	Build workflow: .github/workflows/build-attest-sign.yml@refs/heads/main



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
