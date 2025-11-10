# Contributing to Ekachitta

Thanks for your interest! This document explains how to contribute code, docs, models, tests, or design — with an emphasis on **privacy-first ML features** for the browser extension.

---

## Table of contents

* [Getting started](#getting-started)
* [Contribution workflow](#workflow)
* [Code style & linting](#code-style)
* [Testing & CI](#testing-ci)
* [ML-specific guidelines (client-side)](#ml-guidelines)
* [PR checklist](#pr-checklist)
* [Filing issues](#issues)
* [Code of Conduct](#code-of-conduct)
* [License & attribution](#license)

### 1. Getting started

1.  Fork the repo on GitHub and clone it:
    ```bash
    git clone https://github.com/yourusername/ekachitta.git
    cd ekachitta
    git remote add upstream https://github.com/hehenischal/ekachitta.git
    ```
2.  Create a branch:
    ```bash
    git checkout -b feat/short-description
    ```

### 2. Contribution workflow

1.  Work on a single concern per PR (bugfix, feature, docs, model update).
2.  Rebase or merge from upstream regularly:
    ```bash
    git fetch upstream
    git rebase upstream/main
    ```
3.  Use clear commit messages (see format below).
4.  Open a pull request against `main` and select an appropriate label (feature, bug, docs, ml, enhancement).

#### Commit message format

Use the conventional style below — short subject (max 72 chars) and an optional body.
type(scope): short summary
Optional longer description, include motivation and context. Refs: #ISSUE_NUMBER or closes #ISSUE_NUMBER

**Types:** feat, fix, docs, style, refactor, perf, test, ci, chore, ml

### 3. Code style & linting

* **Do what fits**

### 4. Testing & CI

* **we test in production**

### 5. ML-specific guidelines (client-side)

Ekachitta aims to be privacy-first and run ML inference in the browser. The rules below keep the models safe, small, and maintainable.

#### Model type & placement

* All inference models must be **pre-trained offline** (in Python/PyTorch/TF) and exported to a web-friendly format (TensorFlow.js or ONNX).
* Place the runtime model files under `/extension/models/` and keep each file ideally under **10 MB**. If >10MB, discuss in an issue first.
* Do not include sensitive user data or training datasets in the repo. Provide reproducible training scripts under `/ml/` that reference public datasets or synthetic examples.

#### Privacy & telemetry

* No user data should be sent off-device by default. If you propose an opt-in sync or cloud model update mechanism, open an issue and include a privacy plan.
* Make all ML decisions explainable in the UI — e.g., “Why was this hidden?” with a short rationale or confidence score.

#### Model size & performance

* Prefer tiny models: TF Lite/TFJS small or distilled Transformer variants. TFJS, ONNX Runtime Web are acceptable.
* Benchmark model inference time on low-end devices (target: **<200ms** per title on typical laptop CPUs).
* Provide a fall-back heuristic approach (TF-IDF or regex) if the model fails to load.

#### Updating models

1.  Create a PR with a short explanation, new model file(s), and a small test describing expected behavior differences.
2.  Include a versioned model manifest (e.g., `models/manifest.json`) and update the manifest in the PR.

### 6. PR checklist

* [ ] PR is targeted to `main` or a release branch.
* [ ] CI passes (lint, tests).
* [ ] Follow commit message format.
* [ ] If adding a model: model size & inference benchmark included.
* [ ] Documentation updated (README, docs/, or this file as needed).
* [ ] If UI changes: include screenshots or GIFs in the PR description.

### 7. Filing issues

Good issues help maintainers reproduce, triage, and fix problems fast.

* Use the issue templates (Bug, Feature, Discussion) when creating an issue.
* Include: steps to reproduce, expected vs actual behavior, browser & extension version, and screenshots if possible.

### 8. Code of Conduct

We follow a Contributor Covenant-style Code of Conduct. Be respectful. Harassment of any kind is not tolerated. File conduct concerns to the maintainers or email `nischallc56@gmail.com` .

### 9. License & attribution

This project is licensed under the [MIT License](LICENSE) (or your chosen license). When contributing, you agree to license your contributions under the same project license.

---

#### Developer tips & helpers

* Prefer small, incremental PRs. They’re easier to review and merge.
* If you plan a large refactor or new ML approach, open an RFC/discussion issue first.
* Maintain backwards compatibility for user settings and storage keys—document any migration in the PR.

#### Contact & links

* Repo: [github.com/yourusername/ekachitta](https://github.com/hehenischal/ekachitta)
* Issues: [Issues](https://github.com/yourusername/ekachitta/issues)
* Chat / Discussions (if enabled): use the repository Discussion tab for general questions.

---

Thanks for helping build Ekachitta — smarter focus with compassion. ❤️
