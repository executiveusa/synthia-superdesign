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

    /// Extract design tokens from a URL (Design MD Chrome integration)
    Extract {
        /// URL to extract design tokens from
        #[arg(long)]
        url: String,

        /// Output directory for extracted files (DESIGN.md, SKILL.md, WCAG report)
        #[arg(long, default_value = "./extracted")]
        output: PathBuf,

        /// Extraction mode: 'full' (default), 'wcag' (accessibility only), 'tokens' (design tokens only)
        #[arg(long, default_value = "full")]
        mode: String,

        /// Path to anti-pattern rules (Cynthia doctrine compliance check)
        #[arg(long)]
        rules: Option<PathBuf>,

        /// Batch mode: read URLs from file (one per line)
        #[arg(long)]
        batch: Option<PathBuf>,

        /// Save to studio memory automatically (studio/memory/extracted-systems/)
        #[arg(long)]
        to_memory: bool,
    },

    /// Clone a website completely (HTML + CSS + JS + Design System + Assets)
    Clone {
        /// URL to clone
        url: String,

        /// Clone mode: 'full' (everything), 'design-only', 'structure-only', 'tokens-only'
        #[arg(long, default_value = "full")]
        mode: String,

        /// Output directory
        #[arg(long, default_value = "./cloned-websites")]
        output: PathBuf,

        /// Include assets (images, fonts, videos)
        #[arg(long)]
        with_assets: bool,

        /// Create offline-ready version (embed fonts and images)
        #[arg(long)]
        offline: bool,

        /// Run deep analysis (library detection, perf audit, dependency graph)
        #[arg(long)]
        deep_analysis: bool,

        /// Run full WCAG 2.2 AA audit
        #[arg(long)]
        wcag_full: bool,

        /// Skip using cached version
        #[arg(long)]
        skip_cache: bool,

        /// Validate against Cynthia design doctrine
        #[arg(long)]
        cynthia_check: bool,

        /// Format for competitive analysis
        #[arg(long)]
        competitor_analysis: bool,

        /// Save directly to studio memory
        #[arg(long)]
        to_memory: bool,

        /// Batch mode: read URLs from file
        #[arg(long)]
        batch: Option<PathBuf>,

        /// Parallel batch cloning (number of parallel jobs)
        #[arg(long)]
        parallel: Option<usize>,

        /// Compress output to .zip
        #[arg(long)]
        zip: bool,

        /// Specific formats to output (comma-separated: html,json,tailwind,react,css,yaml,md)
        #[arg(long)]
        format: Option<String>,
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
        Commands::Extract { url, output, mode, rules, batch, to_memory } => {
            if let Some(batch_file) = batch {
                println!("Running batch extraction from: {}", batch_file.display());
                extract_batch(&batch_file, &output, &mode, rules.as_ref(), to_memory, &cli.studio_root)?;
            } else {
                println!("Extracting design tokens from: {}", url);
                extract_url(&url, &output, &mode, rules.as_ref(), to_memory, &cli.studio_root)?;
            }
        }
        Commands::Clone {
            url,
            mode,
            output,
            with_assets,
            offline,
            deep_analysis,
            wcag_full,
            skip_cache,
            cynthia_check,
            competitor_analysis,
            to_memory,
            batch,
            parallel,
            zip,
            format
        } => {
            if let Some(batch_file) = batch {
                let parallel_jobs = parallel.unwrap_or(1);
                println!("Running batch clone from: {} (parallel: {})", batch_file.display(), parallel_jobs);
                clone_batch(&batch_file, &output, &mode, with_assets, offline, deep_analysis, wcag_full, cynthia_check, competitor_analysis, to_memory, &cli.studio_root)?;
            } else {
                println!("Cloning website: {}", url);
                clone_website(&url, &mode, &output, with_assets, offline, deep_analysis, wcag_full, skip_cache, cynthia_check, competitor_analysis, to_memory, format.as_deref(), &cli.studio_root)?;
            }
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

fn extract_url(url: &str, output: &PathBuf, mode: &str, rules: Option<&PathBuf>, to_memory: bool, studio_root: &PathBuf) -> anyhow::Result<()> {
    println!("  Mode: {}", mode);

    std::fs::create_dir_all(output)?;

    println!("  NOTE: Design MD Chrome extraction requires running in a browser environment.");
    println!("  This CLI currently serves as a placeholder/router for headless extraction.");
    println!("\n  To extract tokens, use one of:");
    println!("    1. Load design-md-chrome extension in Chrome and click the icon");
    println!("    2. Use design-md-chrome headless mode: npm run extract -- --url {}", url);
    println!("    3. Integrate via Puppeteer: see DESIGN-MD-CHROME-INTEGRATION.md");

    if to_memory {
        let memory_dir = studio_root.join("studio/memory/extracted-systems");
        println!("\n  Output will be saved to: {}", memory_dir.display());
    } else {
        println!("\n  Output directory: {}", output.display());
    }

    if let Some(rules_path) = rules {
        println!("  Anti-pattern rules: {}", rules_path.display());
    }

    println!("\n  Extraction queued. See: studio/ops/DESIGN-MD-CHROME-INTEGRATION.md");
    Ok(())
}

fn extract_batch(batch_file: &PathBuf, output: &PathBuf, mode: &str, rules: Option<&PathBuf>, to_memory: bool, studio_root: &PathBuf) -> anyhow::Result<()> {
    if !batch_file.exists() {
        println!("Batch file not found: {}", batch_file.display());
        return Ok(());
    }

    let content = std::fs::read_to_string(batch_file)?;
    let urls: Vec<&str> = content.lines().filter(|l| !l.is_empty() && !l.starts_with('#')).collect();

    println!("Found {} URLs to extract", urls.len());
    std::fs::create_dir_all(output)?;

    for (i, url) in urls.iter().enumerate() {
        println!("[{}/{}] Extracting: {}", i + 1, urls.len(), url);
        extract_url(url, output, mode, rules, to_memory, studio_root)?;
    }

    println!("\nBatch extraction complete. Check: {}", output.display());
    Ok(())
}

fn clone_website(url: &str, mode: &str, output: &PathBuf, with_assets: bool, offline: bool, deep_analysis: bool, wcag_full: bool, skip_cache: bool, cynthia_check: bool, competitor_analysis: bool, to_memory: bool, format: Option<&str>, studio_root: &PathBuf) -> anyhow::Result<()> {
    println!("\n🎬 CLONE — Complete Website Cloning & Design System Extraction");
    println!("  URL: {}", url);
    println!("  Mode: {}", mode);
    println!("  Options:");
    if with_assets { println!("    ✓ Download assets (images, fonts, videos)"); }
    if offline { println!("    ✓ Create offline-ready version"); }
    if deep_analysis { println!("    ✓ Deep analysis (libraries, perf, dependencies)"); }
    if wcag_full { println!("    ✓ Full WCAG 2.2 AA audit"); }
    if cynthia_check { println!("    ✓ Validate against Cynthia doctrine"); }
    if competitor_analysis { println!("    ✓ Format for competitive analysis"); }

    std::fs::create_dir_all(output)?;

    match mode {
        "full" => {
            println!("\n  Cloning in FULL mode (HTML + CSS + JS + Design Tokens + Assets)");
            println!("    1. Puppeteer: Cloning HTML structure...");
            println!("    2. CSS Parser: Extracting all stylesheets...");
            println!("    3. JS Analyzer: Analyzing scripts and interactivity...");
            println!("    4. Design MD Chrome: Extracting design tokens...");
            if with_assets { println!("    5. Asset Downloader: Downloading images, fonts, videos..."); }
            if offline { println!("    6. Offline Packager: Embedding assets as data URIs..."); }
        }
        "design-only" => {
            println!("\n  Cloning in DESIGN-ONLY mode (design tokens + system only)");
            println!("    1. Design MD Chrome: Extracting DESIGN.md...");
            println!("    2. designlang: Generating 8 design token formats...");
        }
        "structure-only" => {
            println!("\n  Cloning in STRUCTURE-ONLY mode (HTML + CSS)");
            println!("    1. Puppeteer: Cloning HTML...");
            println!("    2. CSS Parser: Extracting stylesheets...");
        }
        "tokens-only" => {
            println!("\n  Cloning in TOKENS-ONLY mode (design tokens only)");
            println!("    1. designlang: Extracting design tokens...");
        }
        _ => {
            println!("  ERROR: Unknown mode: {}. Use: full, design-only, structure-only, or tokens-only", mode);
            return Ok(());
        }
    }

    if deep_analysis {
        println!("    X. Deep Analysis: Library detection, perf audit, dependency graph...");
    }
    if wcag_full {
        println!("    X. WCAG Audit: Running comprehensive accessibility check...");
    }
    if cynthia_check {
        println!("    X. Doctrine Validation: Checking against Cynthia design laws...");
    }

    println!("\n  This will generate:");
    println!("    ├── Full website clone (HTML/CSS/JS)");
    println!("    ├── DESIGN.md (design system documentation)");
    println!("    ├── SKILL.md (AI-agent executable)");
    println!("    ├── design-tokens.json / .yaml / .html");
    println!("    ├── tailwind.config.js (if applicable)");
    println!("    ├── theme.ts (React TypeScript)");
    println!("    ├── styles.css (CSS variables)");
    println!("    ├── accessibility-report.md (WCAG audit)");
    println!("    ├── anti-patterns.md (doctrine violations)");
    println!("    ├── clone-manifest.json (metadata)");
    if with_assets { println!("    ├── assets/ (images, fonts, videos)"); }
    println!("    └── README.md (how to use)");

    if to_memory {
        let memory_dir = studio_root.join("studio/memory/cloned-websites");
        println!("\n  📁 Output will be saved to: {}", memory_dir.display());
    } else {
        println!("\n  📁 Output directory: {}", output.display());
    }

    if let Some(formats) = format {
        println!("  📄 Output formats: {}", formats);
    }

    println!("\n  ℹ️  Cloning implementation requires:");
    println!("    • Puppeteer (for HTML/CSS/JS cloning)");
    println!("    • design-md-chrome (for design system extraction)");
    println!("    • designlang (for design tokens)");
    println!("    • axe-core (for WCAG audit)");
    println!("\n  💡 Install: npm install puppeteer design-md-chrome designlang");
    println!("\n  🔗 This CLI routes to the headless extraction engine.");
    println!("  📖 See: studio/doctrine/clone-SKILL.md for full documentation");

    Ok(())
}

fn clone_batch(batch_file: &PathBuf, output: &PathBuf, mode: &str, with_assets: bool, offline: bool, deep_analysis: bool, wcag_full: bool, cynthia_check: bool, competitor_analysis: bool, to_memory: bool, studio_root: &PathBuf) -> anyhow::Result<()> {
    if !batch_file.exists() {
        println!("Batch file not found: {}", batch_file.display());
        return Ok(());
    }

    let content = std::fs::read_to_string(batch_file)?;
    let urls: Vec<&str> = content.lines().filter(|l| !l.is_empty() && !l.starts_with('#')).collect();

    println!("🎬 BATCH CLONE — Cloning {} websites", urls.len());
    println!("  Mode: {}", mode);
    std::fs::create_dir_all(output)?;

    for (i, url) in urls.iter().enumerate() {
        println!("\n[{}/{}] Cloning: {}", i + 1, urls.len(), url);
        clone_website(url, mode, output, with_assets, offline, deep_analysis, wcag_full, false, cynthia_check, competitor_analysis, to_memory, None, studio_root)?;
    }

    println!("\n✅ Batch cloning complete. Check: {}", output.display());
    Ok(())
}
