
# DQAAT Backend API

Backend service for the **Data Quality And Adequacy Assessment Tool (DQAAT)**.

This repository provides the API and database layer for storing structured dataset evaluations submitted from the frontend application.

Frontend repository:
[https://github.com/GEOHUM-PLUS/dqsurvey](https://github.com/GEOHUM-PLUS/dqsurvey)

---

# Overview

The backend:

* Exposes REST API endpoints for each evaluation section
* Stores structured data in a PostgreSQL database
* Maintains relational links between sections
* Supports a multi-step evaluation workflow

Built with:

* **Node.js**
* **Express**
* **PostgreSQL**
* Hosted via **Render**

---

# Architecture

Main server entry:

* `index.js` 

Database connection:

* `config/connection.js` 

The server:

* Registers route modules
* Connects to PostgreSQL
* Starts the API service

---

# Section-Based API Structure

The backend mirrors the evaluation workflow of the frontend.

Each section references the previous section’s ID to maintain relational integrity.

---

## 1. Dataset – Initial Information

Route:
`POST /dataset`

Handles:

* Dataset title
* Evaluator details
* Data processing level
* Data type
* Evaluation type
* Use-case parameters (if applicable)

Validation schema:

* `models/intial_dataset.js` 

Purpose:
Creates the base evaluation record and generates the primary evaluation ID used by subsequent sections.

---

## 2. Section 1 – Descriptives

Route:
`POST /section1`

Stores:

* Metadata documentation
* Identifier
* Dataset description
* Accessibility
* Licensing
* Language

Purpose:
Captures documentation quality and accessibility attributes linked to the dataset record.

---

## 3. Section 2 – Design

Route:
`POST /section2`

Stores:

* Spatial resolution
* Coverage
* Timeliness
* Fit-for-purpose parameters
* Deviation metrics
* Design-related scoring

Purpose:
Records structural and technical design characteristics of the dataset.

---

## 4. Section 3 – Conformance

Route:
`POST /section3`

Stores:

* Completeness metrics
* Consistency metrics
* Accuracy indicators
* Validation information
* Reproducibility indicators

Purpose:
Evaluates internal validity and technical conformance of the dataset or derived product.

---

## 5. Section 4 – Context

Route:
`POST /section4`

Stores:

* Producer reputation
* Relevance
* Applicability
* Transferability
* Context-based scoring

Purpose:
Captures trust, usability, and cross-domain applicability indicators.

---

# Database

* **PostgreSQL**
* Managed and hosted via **Render**
* Connection pooling configured in `connection.js` 

Each section stores relational IDs to maintain structured linkage across the evaluation.

---

# API Workflow

Typical submission sequence:

1. `POST /dataset` → receive evaluation ID
2. `POST /section1` → linked to dataset
3. `POST /section2` → linked to previous section
4. `POST /section3` → linked to previous section
5. `POST /section4` → linked to previous section

Each endpoint returns the inserted record ID.

---

# Deployment

* Backend deployed via **Render**
* PostgreSQL database managed by Render
* Automatic deployment from GitHub repository

---

# Health Check

Root endpoint:

```
GET /
```

Returns confirmation message indicating the backend is running .

---

# Hosting Summary

| Component  | Platform            | Notes            |
| ---------- | ------------------- | ---------------- |
| API Server | Render              | Free Tier        |
| Database   | PostgreSQL (Render) | Managed instance |

---

### Note on Render Free Tier

- The API may enter sleep mode after inactivity

- Initial requests may experience a short cold-start delay

- Suitable for research and demonstration purposes

---

# License

* **Code:** MIT License
* **Documentation & non-code content:** CC BY 4.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE-CC-BY-4.0.md)

---

# Suggested Citation

[![Paper: under review](https://img.shields.io/badge/Paper-under%20review-blue.svg)](#suggested-citation)

The Data Quality And Adequacy Assessment Tool (DQAAT) forms part of a peer-reviewed research manuscript currently under review.


