/**
 * Synthia™ CLI Commands
 *
 * Usage:
 * ```
 * synthia brain search "AI development"
 * synthia brain add --title "My Note" --content "..."
 * synthia brain export > backup.json
 * synthia media generate --prompt "..." --type image
 * synthia tools list
 * synthia tools add openai sk-...
 * synthia health
 * synthia validate
 * ```
 */

pub mod brain;
pub mod media;
pub mod tools;
pub mod system;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(name = "synthia")]
#[command(about = "Synthia™ CLI - Your sovereign AI assistant", long_about = None)]
pub struct Args {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    /// Second Brain operations
    Brain {
        #[command(subcommand)]
        action: BrainCommands,
    },

    /// Media generation
    Media {
        #[command(subcommand)]
        action: MediaCommands,
    },

    /// Tool/provider management
    Tools {
        #[command(subcommand)]
        action: ToolsCommands,
    },

    /// System operations
    #[command(subcommand)]
    System(SystemCommands),
}

#[derive(Subcommand, Debug)]
pub enum BrainCommands {
    /// Search second brain entries
    Search {
        /// Search query
        query: String,

        /// Filter by tag
        #[arg(short, long)]
        tag: Option<String>,

        /// Maximum results
        #[arg(short, long, default_value = "50")]
        limit: usize,
    },

    /// Add new entry to second brain
    Add {
        /// Entry title
        #[arg(short, long)]
        title: String,

        /// Entry content
        #[arg(short, long)]
        content: String,

        /// Tags (comma-separated)
        #[arg(short, long)]
        tags: Option<String>,

        /// Source
        #[arg(short, long, default_value = "manual")]
        source: String,
    },

    /// Export entire second brain
    Export {
        /// Output file (default: stdout)
        #[arg(short, long)]
        output: Option<String>,
    },

    /// Import entries from file
    Import {
        /// File to import
        path: String,
    },

    /// Get brain statistics
    Stats,
}

#[derive(Subcommand, Debug)]
pub enum MediaCommands {
    /// Generate image via muapi.ai
    Image {
        /// Image prompt
        prompt: String,

        /// Model (default: flux-pro)
        #[arg(short, long)]
        model: Option<String>,

        /// Image size
        #[arg(short, long, default_value = "1024x1024")]
        size: String,
    },

    /// Generate video via muapi.ai
    Video {
        /// Video prompt
        prompt: String,

        /// Duration in seconds (max 60)
        #[arg(short, long, default_value = "10")]
        duration: u32,

        /// Model (default: runway-ml-gen3)
        #[arg(short, long)]
        model: Option<String>,
    },

    /// Generate cinematic video
    Cinema {
        /// Scene prompt
        prompt: String,

        /// Camera movement (pan, zoom, dolly, tracking, orbiting)
        #[arg(short, long, default_value = "pan")]
        camera: String,

        /// Lighting mood (cinematic, moody, bright, neon, natural)
        #[arg(short, long, default_value = "cinematic")]
        lighting: String,

        /// Duration in seconds
        #[arg(short, long, default_value = "15")]
        duration: u32,
    },

    /// Check generation job status
    Status {
        /// Job ID
        job_id: String,
    },
}

#[derive(Subcommand, Debug)]
pub enum ToolsCommands {
    /// List configured providers
    List,

    /// Add/update API key for provider
    Add {
        /// Provider name (openai, anthropic, google, elevenlabs, suno, stability, replicate)
        provider: String,

        /// API key
        #[arg(short, long)]
        key: String,

        /// Skip verification
        #[arg(long)]
        skip_verify: bool,
    },

    /// Remove provider
    Remove {
        /// Provider name
        provider: String,
    },

    /// Verify provider configuration
    Verify {
        /// Provider name
        provider: String,
    },
}

#[derive(Subcommand, Debug)]
pub enum SystemCommands {
    /// Check system health
    Health,

    /// Validate environment
    Validate,

    /// Show system status
    Status,

    /// Import data from file
    Import {
        /// Import file path
        path: String,
    },

    /// Export all data
    Export {
        /// Output file (default: ./synthia-backup-{date}.json)
        #[arg(short, long)]
        output: Option<String>,
    },
}

pub async fn execute(args: Args) -> Result<(), Box<dyn std::error::Error>> {
    match args.command {
        Commands::Brain { action } => brain::handle(action).await,
        Commands::Media { action } => media::handle(action).await,
        Commands::Tools { action } => tools::handle(action).await,
        Commands::System(action) => system::handle(action).await,
    }
}
