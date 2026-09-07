# Abhijeet Lokhande

**Phone:** 07480801382  
**Location:** London, United Kingdom  
**Email:** abhijeet_lokhande@proton.me  
**LinkedIn:** https://www.linkedin.com/in/ablds/  
**GitHub:** https://github.com/abhijeetscode  
**Hugging Face:** https://huggingface.co/ab-ai

---

## Summary

AI engineer committed to continuous learning and building impactful AI solutions, from fine-tuning LLMs (67K+ HuggingFace downloads) to developing AI agents and data pipelines. Passionate about solving real-world problems through innovative machine learning approaches. Production experience in FinTech since 2022, with a research background in drug discovery at King's College London.

---

## Experience

### Built AI, AI/ML Engineer (Early Stage Hire)
**FinTech & AI Company · London, UK · April 2022 – Present**

- Designed and deployed a client facing multimodal conversational AI assistant for 5+ leading investment management firms, handling thousands of Slack messages across chat and live meetings using Recall, ElevenLabs, and Tavus.
- Core engineer on an [Innovate UK funded R&D project](https://gtr.ukri.org/projects?ref=10022996) (£205,895 grant, 2022 to 2023) that built an ML data platform and street level analytics for commercial real estate investors.
- Enabled secure enterprise access to 180+ AI powered tools through a production ready FastAPI MCP server for Claude Desktop and Glean compatible clients.
- Defined terminal impact from real client chats and designed agent evaluations, Quality of Service metrics, and incident mechanisms to make reliability, groundedness, latency, and failure modes measurable.
- Built and deployed an autonomous AI agent that generates Discounted Cash Flow financial models from raw financial data, reducing analyst modelling time by 70%.
- Built an LLM agent that explains financial cashflows with robust validation, and am developing an investment query agent that retrieves financial modelling outputs and produces actionable responses.
- Built financial document intelligence systems using LLMs, RAG, embeddings, and a vector database, enabling analysts to query multiple PDFs in natural language and cutting manual review time.
- Developed a machine learning model to infer missing values in large property datasets and built a geolocation enriched ingestion pipeline linking 80% of property records to support rental value inference.
- Improved financial modelling engine performance by 85% through a graph based Apache Hamilton architecture and vectorisation, and delivered a 30% productivity gain through an AWS Textract document processing pipeline.
- Own production operations for shipped systems, including instrumentation, telemetry, dashboards, alerting, on call response, CI/CD, deployment verification, and rollback. Mentor junior engineers, review code, and establish reusable engineering practices.

### King's College London, Research Associate
**London, UK · March 2021 – January 2022**

- Developed a novel deep learning model utilizing Graph Convolution Network and Generative Adversarial Network (GAN) techniques for drug discovery, resulting in a 63% enhancement in the novelty score of drug structures.
- Designed and implemented a robust data preprocessing pipeline for clinical data, ensuring accuracy and completeness of a million-row dataset.
- Utilized Scrapy and Beautiful Soup to gather data from various websites for research purposes.

---

## Open Source Contributions

- **PII Detection LLMs:** Fine-tuned GPT (with LoRA) and BERT to detect Personally Identifiable Information (PII). Published models collectively achieving 67K+ downloads on HuggingFace.  
  https://huggingface.co/ab-ai/PII-Model-Phi3-Mini · https://huggingface.co/ab-ai/pii_model

- **Spec-to-Code Agent:** Built an autonomous ReAct-based coding agent using LangGraph and the Anthropic API that generates installable, tested software packages from plain-language markdown specs. Achieves 9/9 pass rate across a polyglot benchmark (Python, Go, Rust, Java, JS).  
  https://github.com/abhijeetscode/Spec-to-Code-Agent

- **Agentic Enterprise Assistant:** Built an internal operations assistant where an LLM agent (Claude, native tool use) answers staff questions in natural language over grounded customer and issue data, with role-based access enforced at the MCP server as the authoritative RBAC boundary (Keycloak JWT), a grounding-validation gate that checks every answer against tool results before responding, and fully auditable, token-redacted interaction traces. Hybrid BM25 + semantic search (Qwen3 embeddings, reciprocal rank fusion) over Elasticsearch; FastAPI, PostgreSQL, Redis, OpenTelemetry to Arize Phoenix; Docker Compose with a separate MCP server container. Passed 13/13 evaluation cases (100% tool selection, grounding, and RBAC compliance).  
  https://github.com/abhijeetscode/Agentic-Enterprise-Assistant

- **Agentic Search API:** Built a production-grade cross-domain search service (FastAPI, PostgreSQL, Elasticsearch semantic search) for wealth-management advisors. Claude decomposes queries and routes to specialized tools (lexical/semantic client search, document search) with a deterministic lexical + semantic fallback for resilience when the LLM fails. Local Qwen3 embeddings (no external embedding API), PDF ingestion with auto-classification and chunking, and read-your-write consistency. Achieves p95 ≈ 175ms deterministic retrieval and a 0.76 macro QoS evaluation score across mixed query types.  
  https://github.com/abhijeetscode/search-agent

- **Transformer from Scratch in Rust:** Built a GPT-style decoder-only transformer from first principles in Rust using the Candle framework (multi-head causal self-attention, pre-norm blocks with residual connections, token/position embeddings, and a full training loop with early stopping and SafeTensors checkpointing). Supports character and BPE (r50k_base) training with Metal GPU acceleration; default config mirrors GPT-2 small (768 dims, 12 heads, 12 layers, 1024-token context).  
  https://github.com/abhijeetscode/transformer-rust

- **GPT from Scratch in PyTorch:** Built a decoder-only GPT with every component hand-written in PyTorch, no `nn.Transformer`, no `nn.MultiheadAttention`, no HuggingFace. Implements tiled FlashAttention with online softmax (running max, numerator, and denominator across query/key tiles), RMSNorm, sinusoidal positional encoding, and pre-norm transformer blocks with residual connections around both attention and the feed-forward network.  
  https://github.com/abhijeetscode/gpt-from-scratch-pytorch

- **InferQ:** Built an async batched inference queue on FastAPI that accepts generation requests, hands back a job id, and drains an `asyncio.Queue` with a pool of batching async workers.  
  https://github.com/abhijeetscode/inferq

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
