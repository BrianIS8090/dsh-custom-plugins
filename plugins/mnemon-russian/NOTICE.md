# Upstream notice

Mnemon Russian is an **unofficial Russian localization** of the Mnemon Starter and four Source packages. It is not an official release of the upstream authors and does not imply endorsement.

Upstream project: https://github.com/omdsh-dev/dsh-mnemon

Upstream copyright: **Copyright (c) 2026 dsh-external contributors**. The upstream packages are licensed under the MIT License; the full notice is preserved in `LICENSE` and in every packaged upstream component.

The build downloads these exact npm artifacts and verifies their SHA-512 `dist.integrity` before extraction:

| Package | Version | SHA-512 integrity |
|---|---:|---|
| `dsh-mnemon` | `0.5.42` | `sha512-LXAhVZexnox+swoa/uP2zQO7S674/5Ek0veXJe8vpKKQ0+0aMdAlsa5U5yEmXdazoy6Yq/WdAjkPesL6Bg28kA==` |
| `dsh-mnemon-source-runtime` | `0.5.18` | `sha512-RCkgSsmKRpTaDkTCyMV+23JNCzp6X2zCwt4jHG3y4k4Qy8SnRPABCsE5lSAHJbgMTSZNt1n2AH6LHuxPNw1P8w==` |
| `dsh-mnemon-source-documents` | `0.6.0` | `sha512-QMBavZq3GrVW1n/ByDhEaSBjOIGxysf1iXKM1I4KZiFN+TmmSeLDSpLI2vRS0ern2FbZ6hiPaojRX32eFQjuWA==` |
| `dsh-mnemon-source-memory-spaces` | `0.5.25` | `sha512-N3DFxAasXt/lICcE2QiXxmydrs8DMYyZFmZCf8HXU0AmVhGy18GNEqujZTBN1+mPdydmzoUCORRVXnq8GrWwFg==` |
| `dsh-mnemon-source-skills` | `0.5.9` | `sha512-NmEgxWCAwRpzXO1NOLb2+u49zOQypNHSyO00eCvFwme0/HmuAwKsoZVr3HC+RDFNuQV48FmyANFRggLeVZCi6A==` |

The localized Starter version is `0.5.42+ru.2`. Build metadata distinguishes the derivative while preserving compatibility with the Source packages' `dsh-mnemon` caret peer ranges. The package is private and is intended for local installation from a rebuilt tarball, not npm publication.
