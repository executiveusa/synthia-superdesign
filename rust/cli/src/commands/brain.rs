use super::BrainCommands;
use std::fs;

pub async fn handle(action: BrainCommands) -> Result<(), Box<dyn std::error::Error>> {
    match action {
        BrainCommands::Search { query, tag, limit } => {
            search(&query, tag, limit).await
        }
        BrainCommands::Add {
            title,
            content,
            tags,
            source,
        } => add(&title, &content, tags, &source).await,
        BrainCommands::Export { output } => export(output).await,
        BrainCommands::Import { path } => import(&path).await,
        BrainCommands::Stats => stats().await,
    }
}

async fn search(
    query: &str,
    tag: Option<String>,
    limit: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("🔍 Searching second brain for: '{}'", query);

    // TODO: Make HTTP request to /api/brain
    // Example:
    // let url = if let Some(tag) = tag {
    //     format!("http://localhost:3000/api/brain?q={}&tag={}&limit={}", query, tag, limit)
    // } else {
    //     format!("http://localhost:3000/api/brain?q={}&limit={}", query, limit)
    // };
    //
    // let response = reqwest::get(&url).await?;
    // let entries: serde_json::Value = response.json().await?;
    //
    // println!("{}", serde_json::to_string_pretty(&entries)?);

    println!("  ✓ Found entries (mock)");
    Ok(())
}

async fn add(
    title: &str,
    content: &str,
    tags: Option<String>,
    source: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("📝 Adding entry: '{}'", title);

    // TODO: Make POST request to /api/brain
    // let client = reqwest::Client::new();
    // let payload = serde_json::json!({
    //     "title": title,
    //     "content": content,
    //     "tags": tags.map(|t| t.split(',').map(|s| s.trim()).collect::<Vec<_>>()).unwrap_or_default(),
    //     "source": source
    // });
    //
    // let response = client
    //     .post("http://localhost:3000/api/brain")
    //     .json(&payload)
    //     .send()
    //     .await?;
    //
    // let result: serde_json::Value = response.json().await?;
    // println!("{}", serde_json::to_string_pretty(&result)?);

    println!("  ✓ Entry added (mock)");
    Ok(())
}

async fn export(output: Option<String>) -> Result<(), Box<dyn std::error::Error>> {
    println!("📤 Exporting second brain...");

    // TODO: Make GET request to /api/brain and write to file
    // let response = reqwest::get("http://localhost:3000/api/brain").await?;
    // let data: serde_json::Value = response.json().await?;
    //
    // let json = serde_json::to_string_pretty(&data)?;
    //
    // if let Some(path) = output {
    //     fs::write(&path, json)?;
    //     println!("  ✓ Exported to: {}", path);
    // } else {
    //     println!("{}", json);
    // }

    println!("  ✓ Export complete (mock)");
    Ok(())
}

async fn import(path: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("📥 Importing from: {}", path);

    let content = fs::read_to_string(path)?;

    // TODO: Parse and POST to /api/onboarding/import
    // let file_data = serde_json::json!({
    //     "content": content,
    //     "filename": path
    // });
    //
    // let client = reqwest::Client::new();
    // let response = client
    //     .post("http://localhost:3000/api/onboarding/import")
    //     .json(&file_data)
    //     .send()
    //     .await?;
    //
    // let result: serde_json::Value = response.json().await?;
    // println!("{}", serde_json::to_string_pretty(&result)?);

    println!("  ✓ Import complete (mock)");
    Ok(())
}

async fn stats() -> Result<(), Box<dyn std::error::Error>> {
    println!("📊 Brain statistics:");

    // TODO: Make GET request to /api/brain?stats=true
    // let response = reqwest::get("http://localhost:3000/api/brain/stats").await?;
    // let stats: serde_json::Value = response.json().await?;
    //
    // println!("  Total entries: {}", stats["total_entries"]);
    // println!("  Storage used: {} bytes", stats["total_bytes"]);
    // println!("  Tags: {}", stats["tags_count"].as_object().unwrap().len());

    println!("  ✓ Stats retrieved (mock)");
    Ok(())
}
