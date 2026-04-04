use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "cynthia")]
#[command(about = "Cynthia Design Studio CLI — The canonical design authority")]
#[command(version)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// Studio root directory (default: current directory)
    #[arg(long, default_value = ".")]
    studio_root: PathBuf,
}

#[derive(Subcommand)]
enum Commands {
    /// List all studio artifacts
    Inventory,

    /// Generate a design plan from a brief
    Plan {
        /// The brief text or path to brief file
        brief: String,
    },

    /// Classify an artifact
    Classify {
        /// Path to the file to classify
        file: PathBuf,
    },

    /// Run automated review checks
    Review {
        /// Path to the file to review
        file: PathBuf,
    },

    /// Apply automated fixes
    Repair {
        /// Path to the file to repair
        file: PathBuf,
    },

    /// Package a job for delivery
    Package {
        /// Job ID to package
        job_id: String,
    },

    /// Search studio knowledge
    Search {
        /// Search query
        query: String,
    },

    /// Show agent health status
    Heartbeat,

    /// Run a site audit
    Audit {
        /// URL to audit
        url: String,
    },

    /// Rebuild studio index
    Index,

    /// Check doctrine compliance
    Validate {
        /// Optional path to validate (default: entire studio)
        path: Option<PathBuf>,
    },
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Inventory => {
            println!("Scanning studio at: {}", cli.studio_root.display());
            inventory(&cli.studio_root)?;
        }
        Commands::Plan { brief } => {
            println!("Generating design plan for: {}", brief);
            // TODO: Implement plan generation
        }
        Commands::Classify { file } => {
            println!("Classifying: {}", file.display());
            // TODO: Implement classification
        }
        Commands::Review { file } => {
            println!("Reviewing: {}", file.display());
            validate_file(&file)?;
        }
        Commands::Repair { file } => {
            println!("Repairing: {}", file.display());
            // TODO: Implement repair
        }
        Commands::Package { job_id } => {
            println!("Packaging job: {}", job_id);
            // TODO: Implement packaging
        }
        Commands::Search { query } => {
            println!("Searching for: {}", query);
            // TODO: Implement search
        }
        Commands::Heartbeat => {
            println!("Checking agent heartbeats...");
            // TODO: Implement heartbeat check
        }
        Commands::Audit { url } => {
            println!("Auditing: {}", url);
            // TODO: Implement site audit
        }
        Commands::Index => {
            println!("Rebuilding studio index...");
            // TODO: Implement index rebuild
        }
        Commands::Validate { path } => {
            let target = path.unwrap_or(cli.studio_root.clone());
            println!("Validating: {}", target.display());
            validate_file(&target)?;
        }
    }

    Ok(())
}

fn inventory(root: &PathBuf) -> anyhow::Result<()> {
    let studio_dir = root.join("studio");
    if !studio_dir.exists() {
        println!("No studio/ directory found at {}", root.display());
        return Ok(());
    }

    let categories = [
        "doctrine", "laws", "principles", "anti-patterns", "rubrics",
        "workflows", "patterns", "components", "design-contracts",
        "schemas", "prompts", "brand", "agents", "jobs", "memory",
        "index", "exemplars", "research",
    ];

    for category in categories {
        let dir = studio_dir.join(category);
        if dir.exists() {
            let count = count_files(&dir);
            println!("  {:<20} {:>4} files", category, count);
        }
    }

    Ok(())
}

fn count_files(dir: &PathBuf) -> usize {
    glob::glob(&format!("{}/**/*", dir.display()))
        .map(|paths| paths.filter_map(|p| p.ok()).filter(|p| p.is_file()).count())
        .unwrap_or(0)
}

fn validate_file(path: &PathBuf) -> anyhow::Result<()> {
    if !path.exists() {
        println!("File not found: {}", path.display());
        return Ok(());
    }

    let content = std::fs::read_to_string(path)?;
    let mut violations = Vec::new();

    // Anti-pattern checks
    let checks: Vec<(&str, &str)> = vec![
        (r"(?i)font-family[^;]*(?:Inter|Roboto|Arial|Helvetica|Open Sans)", "AP-TYP-001: Banned font detected"),
        (r"(?i)(?:purple|violet|indigo)", "AP-CLR-001: Purple color detected"),
        (r"addEventListener\s*\(\s*['\"]scroll['\"]", "AP-MOT-001: Scroll event listener (use IntersectionObserver)"),
        (r"(?i)(?:TODO|FIXME|placeholder|lorem ipsum|coming soon)", "AP-CON-001: Stub content detected"),
        (r"(?i)outline:\s*(?:none|0[^.])", "AP-ACC-002: Focus indicator removed"),
    ];

    for (pattern, message) in checks {
        let re = regex::Regex::new(pattern)?;
        for mat in re.find_iter(&content) {
            violations.push(format!("{} (at byte {})", message, mat.start()));
        }
    }

    if violations.is_empty() {
        println!("  PASS — No anti-pattern violations detected");
    } else {
        println!("  FAIL — {} violation(s):", violations.len());
        for v in &violations {
            println!("    - {}", v);
        }
    }

    Ok(())
}
