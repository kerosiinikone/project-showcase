import 'server-only'

import { Database } from 'better-sqlite3'

const sql = `
    CREATE TABLE 'account' (
        'userId' text NOT NULL,
        'type' text NOT NULL,
        'provider' text NOT NULL,
        'providerAccountId' text NOT NULL,
        'refresh_token' text,
        'access_token' text,
        'expires_at' integer,
        'token_type' text,
        'scope' text,
        'id_token' text,
        'session_state' text,
        PRIMARY KEY('provider', 'providerAccountId'),
        FOREIGN KEY ('userId') REFERENCES 'user'('id') ON UPDATE no action ON DELETE cascade
    );
    --> statement-breakpoint
    CREATE TABLE 'project' (
        'id' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        'alt_id' text NOT NULL,
        'name' text NOT NULL,
        'description' text,
        'image' text,
        'stage' text NOT NULL,
        'author_id' text NOT NULL,
        'github_url' text,
        'website' text,
        FOREIGN KEY ('author_id') REFERENCES 'user'('id') ON UPDATE no action ON DELETE no action
    );
    --> statement-breakpoint
    CREATE TABLE 'projects_to_tags' (
        'project_id' integer NOT NULL,
        'tag_id' integer NOT NULL,
        PRIMARY KEY('project_id', 'tag_id'),
        FOREIGN KEY ('project_id') REFERENCES 'project'('id') ON UPDATE no action ON DELETE cascade,
        FOREIGN KEY ('tag_id') REFERENCES 'tags'('id') ON UPDATE no action ON DELETE cascade
    );
    --> statement-breakpoint
    CREATE TABLE 'tags' (
        'id' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        'name' text NOT NULL
    );
    --> statement-breakpoint
    CREATE TABLE 'user' (
        'id' text PRIMARY KEY NOT NULL,
        'name' text,
        'email' text(191) NOT NULL,
        'emailVerified' integer,
        'image' text(191),
        'github_url' text
    );
    --> statement-breakpoint
    CREATE TABLE 'users_to_projects' (
        'user_id' text NOT NULL,
        'project_id' integer NOT NULL,
        PRIMARY KEY('project_id', 'user_id'),
        FOREIGN KEY ('user_id') REFERENCES 'user'('id') ON UPDATE no action ON DELETE cascade,
        FOREIGN KEY ('project_id') REFERENCES 'project'('id') ON UPDATE no action ON DELETE cascade
    );
    --> statement-breakpoint
    CREATE INDEX 'name_idx' ON 'project' ('name');--> statement-breakpoint
    CREATE INDEX 'tag_t_idx' ON 'projects_to_tags' ('tag_id');--> statement-breakpoint
    CREATE INDEX 'project_t_idx' ON 'projects_to_tags' ('project_id');--> statement-breakpoint
    CREATE INDEX 'tag_idx' ON 'tags' ('name');--> statement-breakpoint
    CREATE UNIQUE INDEX 'users__email__idx' ON 'user' ('email');--> statement-breakpoint
    CREATE INDEX 'user_idx' ON 'users_to_projects' ('user_id');--> statement-breakpoint
    CREATE INDEX 'project_idx' ON 'users_to_projects' ('project_id');
`

// For dependency sake
export async function migrate(sqlite: Database) {
    sqlite.exec(sql)
}
