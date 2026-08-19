# Abhijeet Lokhande

**Phone:** 07480801382  
**Location:** London, United Kingdom  
**Email:** abhijeet_lokhande@proton.me  
**LinkedIn:** https://www.linkedin.com/in/ablds/  
**GitHub:** https://github.com/abhijeetscode  
**Hugging Face:** https://huggingface.co/ab-ai

---

## Summary

AI engineer committed to continuous learning and building impactful AI solutions — from fine-tuning LLMs (50K+ HuggingFace downloads) to developing AI agents and data pipelines. Passionate about solving real-world problems through innovative machine learning approaches. 3+ years of production experience in FinTech, with a research background in drug discovery at King's College London.

---

## Experience

### Built AI — AI/ML Engineer (Early Stage Hire)
**FinTech & AI Company · London, UK · April 2022 – Present**

- Designed and deployed a client-facing, multimodal conversational AI persona, now used by 5+ leading investment management firms and handling ~100 Slack messages/day, that helps investors manage their portfolios in natural language: users talk to her, message her on Slack, add her to Google Meet calls, and ask ad-hoc questions, served through a multi-channel agent across chat and live meetings. Real-time voice on live calls is built with Recall (meeting-bot integration), ElevenLabs (text-to-speech), and Tavus (AI avatar/video).
- Core engineer on an [Innovate UK funded R&D project](https://gtr.ukri.org/projects?ref=10022996) (£205,895 grant, 2022–23) that built a novel ML data platform and street-level analytics, enabling commercial real estate investors to make data-driven decisions over hyper-local market signals.
- Enabled secure enterprise access to 180+ AI-powered tools by building a production-ready MCP server on FastAPI, exposed through the Model Context Protocol for Claude Desktop and Glean-compatible clients.
- Designed agent evals, Quality of Service metrics, and incident-triggering mechanisms to monitor reliability, groundedness, latency, and failure modes in production.
- Own production operations for the systems I ship: instrumentation, telemetry, dashboards and alerting; on-call and incident response; hands-on CI/CD build, test and deployment pipelines; and release practices covering environment promotion, deployment verification, and rollback.
- Mentor junior engineers, review colleagues' code as a routine practice, and define engineering patterns, practices and reusable components that other engineers have adopted.
- Defined and measured "terminal impact," a conversation-outcome metric that classifies the state in which a user exits an agent dialogue (positive, negative, or unsatisfied), computed from real client chats to track whether conversations actually help users rather than just complete.
- Developed and deployed an autonomous AI agent that generates Discounted Cash Flow (DCF) financial models from raw financial data, reducing analyst modeling time by 70%.
- Built a production-ready LLM agent to understand and explain financial cashflows to users, with robust validation to ensure accurate and reliable outputs.
- Developing an AI agent that interprets investment-related queries, retrieves relevant outputs from a financial modeling engine, and generates user-friendly responses with actionable insights.
- Built a Conversational AI bot for analyzing financial documents using LLMs, RAG, embeddings, and vector database — enabled financial analysts to query multiple PDFs with natural language, cutting manual review time.
- Developed and deployed a novel machine learning model to infer missing values in large-scale property datasets. Enabled accurate estimation of rent per square foot across London postcodes.
- Built a data processing and ingestion pipeline linking 80% of property records across diverse datasets with geolocation enrichment, enabling a machine learning model to infer missing rental values by area.
- Improved performance of the financial modelling engine by 85% by rearchitecting the existing codebase into a graph-based system leveraging Apache Hamilton and vectorisation techniques.
- Delivered a 30% productivity gain by designing and implementing an automated financial document processing pipeline leveraging AWS Textract.

### King's College London — Research Associate
**London, UK · March 2021 – January 2022**

- Developed a novel deep learning model utilizing Graph Convolution Network and Generative Adversarial Network (GAN) techniques for drug discovery, resulting in a 63% enhancement in the novelty score of drug structures.
- Designed and implemented a robust data preprocessing pipeline for clinical data, ensuring accuracy and completeness of a million-row dataset.
- Utilized Scrapy and Beautiful Soup to gather data from various websites for research purposes.

---

## Open Source Contributions

- **PII Detection LLMs:** Fine-tuned GPT (with LoRA) and BERT to detect Personally Identifiable Information (PII). Published models collectively achieving 30,000+ downloads on HuggingFace.  
  https://huggingface.co/ab-ai/PII-Model-Phi3-Mini · https://huggingface.co/ab-ai/pii_model

- **Spec-to-Code Agent:** Built an autonomous ReAct-based coding agent using LangGraph and the Anthropic API that generates installable, tested software packages from plain-language markdown specs. Achieves 9/9 pass rate across a polyglot benchmark (Python, Go, Rust, Java, JS).  
  https://github.com/abhijeetscode/Spec-to-Code-Agent

- **Agentic Enterprise Assistant:** Built an internal operations assistant where an LLM agent (Claude, native tool use) answers staff questions in natural language over grounded customer and issue data, with role-based access enforced at the MCP server as the authoritative RBAC boundary (Keycloak JWT), a grounding-validation gate that checks every answer against tool results before responding, and fully auditable, token-redacted interaction traces. Hybrid BM25 + semantic search (Qwen3 embeddings, reciprocal rank fusion) over Elasticsearch; FastAPI, PostgreSQL, Redis, OpenTelemetry to Arize Phoenix; Docker Compose with a separate MCP server container. Passed 13/13 evaluation cases (100% tool selection, grounding, and RBAC compliance).  
  https://github.com/abhijeetscode/Agentic-Enterprise-Assistant

- **Agentic Search API:** Built a production-grade cross-domain search service (FastAPI, PostgreSQL, Elasticsearch semantic search) for wealth-management advisors. Claude decomposes queries and routes to specialized tools (lexical/semantic client search, document search) with a deterministic lexical + semantic fallback for resilience when the LLM fails. Local Qwen3 embeddings (no external embedding API), PDF ingestion with auto-classification and chunking, and read-your-write consistency. Achieves p95 ≈ 175ms deterministic retrieval and a 0.76 macro QoS evaluation score across mixed query types.  
  https://github.com/abhijeetscode/search-agent

- **Transformer from Scratch in Rust:** Built a GPT-style decoder-only transformer from first principles in Rust using the Candle framework — multi-head causal self-attention, pre-norm blocks with residual connections, token/position embeddings, and a full training loop with early stopping and SafeTensors checkpointing. Supports character and BPE (r50k_base) training with Metal GPU acceleration; default config mirrors GPT-2 small (768 dims, 12 heads, 12 layers, 1024-token context).  
  https://github.com/abhijeetscode/transformer-rust

---

## Education

**King's College London**  
MSc in Data Science · London, UK

**C-DAC: Centre for Development of Advanced Computing**  
Post Graduate Diploma in Advanced Computing (PG-DAC) · Pune, India

**University of Pune**  
Bachelor of Engineering in Computer Science · Pune, India

---

## Technical Skills

**AI/ML:** Machine Learning, Deep Learning, NLP, LLMs, AI Agents, RAG, Numerical Optimization, Statistics, Forecasting  
**Frameworks:** Scikit-Learn, TensorFlow, Keras, PyTorch, Candle, XGBoost, LangChain, LlamaIndex, LangGraph, Geopandas  
**Languages:** Python, SQL, Rust  
**Web/API:** FastAPI, Django, Test Driven Development  
**Data:** ETL processes, Data pipelines, MySQL, PostgreSQL, MongoDB, Data Analysis  
**Infrastructure:** AWS, GCP (BigQuery, Cloud Run, GCS, IAM), Airflow, Terraform (IaC), Docker, CI/CD, Git, GitHub
**AI-Assisted Development:** Claude Code, GitHub Copilot (daily driver in day-to-day development, with rigorous review and testing of generated code)
