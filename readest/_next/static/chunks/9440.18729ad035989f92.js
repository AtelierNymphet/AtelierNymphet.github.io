"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9440],{89440:(T,E,e)=>{e.d(E,{getMigrations:()=>_});let N={opds:[{name:"2026052701_opds_source_mappings",sql:`
        CREATE TABLE IF NOT EXISTS opds_source_mappings (
          catalog_id TEXT NOT NULL,
          source_url TEXT NOT NULL,
          book_hash TEXT NOT NULL,
          PRIMARY KEY (catalog_id, source_url)
        );
      `}],"hardcover-sync":[{name:"2026032901_hardcover_note_mappings",sql:`
        CREATE TABLE IF NOT EXISTS hardcover_note_mappings (
          book_hash TEXT NOT NULL,
          note_id TEXT NOT NULL,
          hardcover_journal_id INTEGER NOT NULL,
          payload_hash TEXT NOT NULL,
          synced_at INTEGER NOT NULL,
          PRIMARY KEY (book_hash, note_id)
        );

        CREATE INDEX IF NOT EXISTS idx_hardcover_note_mappings_synced_at
        ON hardcover_note_mappings (synced_at);
      `}],reedy:[{name:"2026052601_reedy_init",sql:`
        CREATE TABLE IF NOT EXISTS reedy_book_meta (
          book_hash TEXT PRIMARY KEY,
          indexing_status TEXT NOT NULL,
          chunk_count INTEGER NOT NULL DEFAULT 0,
          embedding_model TEXT NOT NULL,
          embedding_dim INTEGER NOT NULL,
          indexed_at INTEGER,
          error TEXT
        );

        CREATE TABLE IF NOT EXISTS reedy_book_chunks (
          id TEXT PRIMARY KEY,
          book_hash TEXT NOT NULL,
          section_index INTEGER NOT NULL,
          chapter_title TEXT,
          start_cfi TEXT NOT NULL,
          end_cfi TEXT NOT NULL,
          position_index INTEGER NOT NULL,
          text TEXT NOT NULL,
          token_count INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_chunks_book_position
        ON reedy_book_chunks (book_hash, position_index);

        CREATE INDEX IF NOT EXISTS idx_chunks_fts
        ON reedy_book_chunks USING fts (text) WITH (tokenizer = 'ngram');
      `},{name:"2026052602_reedy_metrics",sql:`
        CREATE TABLE IF NOT EXISTS reedy_metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ts INTEGER NOT NULL,
          event TEXT NOT NULL,
          book_hash TEXT,
          session_id TEXT,
          turn_id TEXT,
          message_id TEXT,
          app_version TEXT NOT NULL,
          schema_version INTEGER NOT NULL,
          payload TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_metrics_ts ON reedy_metrics (ts DESC);
        CREATE INDEX IF NOT EXISTS idx_metrics_session ON reedy_metrics (session_id, ts DESC);
      `},{name:"2026052603_reedy_memory",sql:`
        CREATE TABLE IF NOT EXISTS reedy_memory (
          id TEXT PRIMARY KEY,
          scope TEXT NOT NULL,
          scope_key TEXT NOT NULL,
          key TEXT NOT NULL,
          summary TEXT NOT NULL,
          source_message_id TEXT,
          updated_at INTEGER NOT NULL,
          UNIQUE(scope, scope_key, key)
        );

        CREATE INDEX IF NOT EXISTS idx_memory_scope
        ON reedy_memory (scope, scope_key, updated_at DESC);
      `},{name:"2026052604_reedy_skills",sql:`
        CREATE TABLE IF NOT EXISTS reedy_skills (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          instructions TEXT NOT NULL,
          tool_allowlist TEXT,
          builtin INTEGER NOT NULL DEFAULT 1,
          enabled INTEGER NOT NULL DEFAULT 1
        );
      `}]};function _(T){return N[T]??[]}}}]);