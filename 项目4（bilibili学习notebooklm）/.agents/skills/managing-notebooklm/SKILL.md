---
name: managing-notebooklm
description: Interacts with Google NotebookLM via the NotebookLM MCP server. Enables querying existing notebooks, executing deep/fast web and Google Drive research, adding and syncing sources, and generating studio artifacts including audio overviews, slide decks, infographics, reports, mind maps, quizzes, and flashcards. Trigger when the user mentions NotebookLM, Google Notebook, research notebooks, audio overview podcasts, or NotebookLM MCP tools.
---

# Managing NotebookLM via MCP

## 1. Context & Objective
This skill provides automated, reliable workflows for managing Google NotebookLM through the Model Context Protocol (MCP). It equips the agent to perform knowledge ingestion, grounded multi-source querying, autonomous deep web research, and studio-grade artifact generation (audio overviews, slide decks, reports, mind maps, and interactive study assets).

Use this skill whenever the user wants to:
- Query, summarize, or extract facts from their Google NotebookLM notebooks.
- Conduct automated deep or fast research to populate notebooks with web or Google Drive documents.
- Manage sources (add URLs, text, Google Drive docs, sync stale documents, or delete sources).
- Generate studio media and learning assets (audio/video overviews, reports, infographics, slide decks, quizzes, flashcards, mind maps, data tables).
- Authenticate or refresh credentials for the NotebookLM MCP server.

---

## 2. Prerequisites
1. **MCP Server Configuration**: The `notebooklm` MCP server must be registered in the MCP config file (`mcp_config.json` or `opencode.json`).
2. **Session Authentication**: Active authentication tokens in `~/.notebooklm-mcp/auth.json`. If expired or unauthenticated:
   - Run `notebooklm-mcp-auth` in the terminal to launch the interactive browser login.
   - Alternatively, call `refresh_auth` or the fallback tool `save_auth_tokens`.
3. **Correct Domain Mapping**: Ensure connections route to `notebook.google.com` (with backward compatibility for `notebooklm.google.com`).

---

## 3. Execution Workflows

### Phase 1: Authentication & Health Check
- **Token Verification & Refresh**:
  - When encountering `401 Unauthorized` or session timeouts, invoke `refresh_auth` to reload tokens from disk or execute headless background refresh.
  - If re-authentication is needed, prompt the user or run `notebooklm-mcp-auth` in the CLI.

---

### Phase 2: Notebook Discovery & Management
1. **List Notebooks**: Call `notebook_list` to fetch all available notebooks and their IDs.
2. **Inspect Notebook**:
   - Call `notebook_get(notebook_id)` to retrieve notebook metadata and list of attached sources.
   - Call `notebook_describe(notebook_id)` to obtain an AI-generated synthesis and suggested exploratory topics.
3. **Create / Rename Notebook**:
   - Call `notebook_create(title)` to initialize a new workspace.
   - Call `notebook_rename(notebook_id, new_title)` to update titles.
4. **Configure Chat Dynamics**:
   - Call `chat_configure(notebook_id, ...)` to tailor chat persona, tone, goal, or output length.
5. **Delete Notebook**:
   - Call `notebook_delete(notebook_id, confirm=True)`. **Explicit user confirmation is strictly required prior to calling this tool.**

---

### Phase 3: Source Ingestion & Synchronization
1. **Ingest Content**:
   - **Web / YouTube**: Call `notebook_add_url(notebook_id, url)`.
   - **Direct Text**: Call `notebook_add_text(notebook_id, title, content)`.
   - **Google Drive**: Call `notebook_add_drive(notebook_id, file_id)`.
2. **Inspect & Extract Source Content**:
   - Call `source_describe(source_id)` for high-level summaries and keyword tags.
   - Call `source_get_content(source_id)` to extract raw indexed text without AI processing (recommended for rapid text export).
3. **Google Drive Sync Workflow**:
   - Step 1: Call `source_list_drive(notebook_id)` to identify stale or out-of-date Drive sources.
   - Step 2: Call `source_sync_drive(notebook_id, confirm=True)` to pull the latest versions.
4. **Delete Source**:
   - Call `source_delete(source_id, confirm=True)`. Requires explicit confirmation.

---

### Phase 4: Grounded Querying vs. Deep Research & Automated Source Import

```
                     ┌────────────────────────────────┐
                     │ User Intent / Request Type     │
                     └───────────────┬────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────────────┐
│ Query EXISTING Notebook Content       │   │ Discover & Ingest NEW Knowledge               │
│ Tool: notebook_query                  │   │ Workflow: Deep / Fast Research                │
└───────────────────────────────────────┘   └───────────────────┬───────────────────────────┘
                                                                │
                 ┌──────────────────────────────────────────────┴──────────────────────────────┐
                 │ 1. research_start(query, mode="deep"|"fast", source="web"|"drive", title)   │
                 │ 2. Automated Polling / Timer (Wait 5–10 mins for deep research completion)  │
                 │ 3. research_status(notebook_id, task_id) -> status="completed"              │
                 │ 4. AUTOMATIC: research_import(notebook_id, task_id) [No manual step needed] │
                 └─────────────────────────────────────────────────────────────────────────────┘
```

1. **Querying Existing Knowledge**:
   - Use `notebook_query(notebook_id, query)` **only** to ask questions grounded in documents already present in the notebook.
   - Do NOT use `notebook_query` for web searching or finding missing information.
2. **Deep / Fast Autonomous Research & Mandatory Auto-Import Workflow**:
   - **Step 1 (Start Research)**: Call `research_start(query, mode="deep", source="web", title=..., notebook_id=...)`.
     - `mode="fast"`: ~30 seconds, gathers ~10 sources.
     - `mode="deep"`: ~3–5 minutes (up to 5–10 minutes), gathers 40–100+ sources and a synthesized deep report.
   - **Step 2 (Autonomous Polling & Timing)**:
     - The agent MUST NOT leave the task incomplete or require the user to manually trigger the import.
     - The agent MUST wait or asynchronously poll progress at intervals (checking `research_status` across a 5–10 minute window) until `status="completed"`.
   - **Step 3 (Automatic Import - Zero Manual Effort)**:
     - As soon as the research status reaches `"completed"`, the agent MUST **automatically invoke `research_import(notebook_id, task_id)`** to import all discovered sources and synthesized deep reports into the notebook.
     - The agent should then report the imported source count and notebook link to the user.

---

### Phase 5: Studio Media & Asset Generation

All generation tools produce high-quality multimedia and learning artifacts based on the notebook's sources.

1. **Audio & Video Overviews**:
   - `audio_overview_create(notebook_id, confirm=True)`: Generates two-host deep dive audio podcast discussion.
   - `video_overview_create(notebook_id, confirm=True)`: Generates dynamic video synthesis.
2. **Presentations & Infographics**:
   - `slide_deck_create(notebook_id, confirm=True)`: Generates comprehensive structured slide decks.
   - `infographic_create(notebook_id, confirm=True)`: Generates visual summary graphics.
3. **Structured Reports & Data**:
   - `report_create(notebook_id, confirm=True)`: Generates formal research and briefing documents.
   - `data_table_create(notebook_id, confirm=True)`: Extracts key metrics into tabular form.
   - `mind_map_create(notebook_id, confirm=True)`: Produces hierarchical concept maps.
4. **Interactive Study Assets**:
   - `flashcards_create(notebook_id, confirm=True)`: Creates review flashcards for key concepts.
   - `quiz_create(notebook_id, confirm=True)`: Generates interactive self-test quizzes.
5. **Monitoring & Deletion**:
   - Call `studio_status(notebook_id)` to check generation progress and retrieve rendered artifact URLs.
   - Call `studio_delete(artifact_id, confirm=True)` to remove unwanted studio items.

---

## 4. Constraints & Rules

### STRICT BOUNDARIES:
- **Mandatory Autonomous Auto-Import**:
  - Whenever a new notebook is created with deep research or `research_start` is triggered, the agent **MUST automatically track the task (waiting the requisite 5–10 minutes) and execute `research_import` immediately upon completion**.
  - The agent MUST NOT halt and ask the user to manually run the import step.
- **Confirmation Requirement**: The agent MUST verify intent or obtain implicit/explicit approval before invoking irreversible operations or generation tools with `confirm=True` (`notebook_delete`, `source_delete`, `studio_delete`, `audio_overview_create`, `slide_deck_create`, etc.).
- **Query vs. Research Separation**:
  - MUST NOT call `notebook_query` when the user asks to "search the web", "find sources", or "deep research".
  - MUST use `research_start -> research_status -> research_import` for external information gathering.
- **Content Retrieval Efficiency**:
  - When raw text of an ingested PDF, doc, or video transcript is needed, MUST prefer `source_get_content` over asking repetitive `notebook_query` prompts.
- **Error Handling**:
  - If any API call returns `401 Unauthorized`, immediately call `refresh_auth`. If refresh fails, guide the user to run `notebooklm-mcp-auth` in their terminal.
  - If a research polling times out, check `research_status` with `max_wait=0` to inspect whether the task is still progressing before restarting.
