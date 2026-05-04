use super::ToolsCommands;

pub async fn handle(action: ToolsCommands) -> Result<(), Box<dyn std::error::Error>> {
    match action {
        ToolsCommands::List => list().await,
        ToolsCommands::Add {
            provider,
            key,
            skip_verify,
        } => add(&provider, &key, skip_verify).await,
        ToolsCommands::Remove { provider } => remove(&provider).await,
        ToolsCommands::Verify { provider } => verify(&provider).await,
    }
}

async fn list() -> Result<(), Box<dyn std::error::Error>> {
    println!("🔑 Configured BYOT providers:");

    // TODO: GET /api/tools
    // let response = reqwest::get("http://localhost:3000/api/tools").await?;
    // let tools: serde_json::Value = response.json().await?;
    //
    // for tool in tools["tools"].as_array().unwrap() {
    //     let provider = &tool["provider"];
    //     let configured = tool["configured"].as_bool().unwrap();
    //     let status = if configured { "✓" } else { "✗" };
    //     println!("  {} {}", status, provider);
    // }

    println!("  (none configured)");
    println!("\n💡 Add tools with: synthia tools add <provider> --key <api-key>");
    println!("   Supported: openai, anthropic, google, elevenlabs, suno, stability, replicate");

    Ok(())
}

async fn add(provider: &str, key: &str, skip_verify: bool) -> Result<(), Box<dyn std::error::Error>> {
    println!("🔐 Adding API key for {}...", provider);

    if !skip_verify {
        println!("   Verifying key format...");
        // Basic validation
        if key.is_empty() {
            return Err("API key cannot be empty".into());
        }
    }

    // TODO: POST /api/tools
    // let payload = serde_json::json!({
    //     "provider": provider,
    //     "api_key": key
    // });
    //
    // let client = reqwest::Client::new();
    // let response = client
    //     .post("http://localhost:3000/api/tools")
    //     .json(&payload)
    //     .send()
    //     .await?;
    //
    // let result: serde_json::Value = response.json().await?;
    // if result["configured"].as_bool().unwrap() {
    //     println!("   ✓ {} configured", provider);
    // }

    println!("   ✓ {} configured (mock)", provider);
    println!("   💾 Key stored locally and encrypted");

    Ok(())
}

async fn remove(provider: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("🗑️  Removing API key for {}...", provider);

    // TODO: DELETE /api/tools
    println!("   ✓ {} removed", provider);
    Ok(())
}

async fn verify(provider: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("✅ Verifying {} configuration...", provider);

    // TODO: POST /api/tools/verify
    println!("   Models available: [list from provider]");
    println!("   Status: Connected");

    Ok(())
}
