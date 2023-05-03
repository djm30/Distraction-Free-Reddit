use std::{
    env, fs,
    path::{Path, PathBuf},
    process,
};

// Usage: cargo run <browser>
// Where browser is either chrome or firefox
// Will build either the chrome or firefox extension

// Need to get what browser i want to use
// Need to move appropriate files to the correct location
// Background and content into the main folder, adjusting imports
// And then moving the manifest into the public folder
// Before then running the npm run build command
// And then check if it is successful somehow
// Before renaming the build folder to the name of the browser

// This is probably the most pointless and also the worst rust code to ever have been written

enum Browser {
    Chrome,
    Firefox,
}

impl Clone for Browser {
    fn clone(&self) -> Self {
        match self {
            Browser::Chrome => Browser::Chrome,
            Browser::Firefox => Browser::Firefox,
        }
    }
}

impl Browser {
    fn to_string(&self) -> String {
        match self {
            Browser::Chrome => "chrome".to_string(),
            Browser::Firefox => "firefox".to_string(),
        }
    }
}

struct FileFinder {
    root_path: String,
    browser: Browser,
}

impl FileFinder {
    fn new(root_path: String, browser: Browser) -> Self {
        FileFinder { root_path, browser }
    }

    fn get(&self, file_type: Files) -> PathBuf {
        match file_type {
            Files::BrowserBackground => Path::new(self.root_path.as_str())
                .join("src")
                .join(self.browser.to_string())
                .join("background.ts"),
            Files::BrowserContent => Path::new(self.root_path.as_str())
                .join("src")
                .join(self.browser.to_string())
                .join("content.ts"),
            Files::BrowserManifest => Path::new(self.root_path.as_str())
                .join("src")
                .join(self.browser.to_string())
                .join("manifest.json"),
            Files::Manifest => Path::new(self.root_path.as_str())
                .join("public")
                .join("manifest.json"),
            Files::StorageService => Path::new(self.root_path.as_str())
                .join("src")
                .join("common")
                .join("storage-service.ts"),
            Files::OriginalBackground => Path::new(self.root_path.as_str())
                .join("src")
                .join("background.ts"),
            Files::OriginalContent => Path::new(self.root_path.as_str())
                .join("src")
                .join("content.ts"),
            Files::BrowserBuildFolder => Path::new(self.root_path.as_str())
                .join(format!("build_{}", self.browser.to_string())),
            Files::BuildFolder => Path::new(self.root_path.as_str()).join("build"),
        }
    }
}

enum Files {
    BrowserBackground,
    BrowserContent,
    BrowserManifest,
    Manifest,
    StorageService,
    OriginalBackground,
    OriginalContent,
    BuildFolder,
    BrowserBuildFolder,
}

fn adjust_import_paths(file: &String) -> String {
    let mut new_file = String::new();
    for line in file.split("\n") {
        let mut new_line = if line.contains("import") {
            line.replace("..", ".")
        } else {
            line.to_owned()
        };
        new_line.push_str("\n");
        new_file.push_str(&new_line);
    }
    new_file
}

fn adjust_storage_service_imports(file: &String, browser: Browser) -> String {
    let mut new_file = String::new();
    let mut import_updated = false;
    for line in file.split("\n") {
        let mut new_line = if line.contains("SELECTED_BROWSER") {
            if !import_updated {
                import_updated = true;
                format!(
                    "import storageFunctions from \"../{}/storage\"",
                    browser.to_string()
                )
            } else {
                String::new()
            }
        } else {
            line.to_owned()
        };
        new_line.push_str("\n");

        if !new_line.contains("StorageFunctions") {
            new_file.push_str(&new_line);
        }
    }
    new_file
}

fn restore_files(
    file_finder: &FileFinder,
    original_background_contents: &String,
    original_content_contents: &String,
    original_storage_contents: &String,
) -> Result<(), std::io::Error> {
    save_to_file(
        &original_background_contents,
        &file_finder.get(Files::OriginalBackground),
    )?;
    save_to_file(
        &original_content_contents,
        &file_finder.get(Files::OriginalContent),
    )?;
    save_to_file(
        &original_storage_contents,
        &file_finder.get(Files::StorageService),
    )
}

fn save_to_file(file: &String, path: &Path) -> Result<(), std::io::Error> {
    fs::write(path, file)
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let browser: Browser;
    if args.len() > 1 {
        match args[1].as_str() {
            "firefox" => browser = Browser::Firefox,
            "chrome" => browser = Browser::Chrome,
            _ => panic!("No browser specified"),
        }
    } else {
        panic!("No browser specified");
    }

    let file_finder = FileFinder::new("..".to_owned(), browser.clone());

    // let x = match fs::read_to_string(dir_to_use.join("background.ts")) {
    //     Ok(x) => x,
    //     Err(e) => panic!("Error reading file: {}", e),
    // };

    // Backgrond and content will be reverted to their original state after the build
    let original_background_contents =
        fs::read_to_string(file_finder.get(Files::OriginalBackground)).unwrap();
    let original_content_contents =
        fs::read_to_string(file_finder.get(Files::OriginalContent)).unwrap();

    let storage_service_contents =
        fs::read_to_string(file_finder.get(Files::StorageService)).unwrap();

    // Browser files will be adjusted and then moved to the main folder for the build
    let browser_background_contents =
        fs::read_to_string(file_finder.get(Files::BrowserBackground)).unwrap();
    let browser_content_contents =
        fs::read_to_string(file_finder.get(Files::BrowserContent)).unwrap();
    let browser_manifest_contents =
        fs::read_to_string(file_finder.get(Files::BrowserManifest)).unwrap();

    // Alias for restore function without the long call signature, useless and dumb but yeah
    let restore = || match restore_files(
        &file_finder,
        &original_background_contents,
        &original_content_contents,
        &storage_service_contents,
    ) {
        Ok(_) => {}
        Err(e) => {
            println!(
                "Original Background Content: {}",
                original_background_contents
            );
            println!("Original Content Content: {}", original_content_contents);
            println!("Original Storage Content: {}", storage_service_contents);
            panic!("Error restoring files: {}", e)
        }
    };

    // Adjust imports for background and content
    match save_to_file(
        &adjust_import_paths(&browser_background_contents),
        &file_finder.get(Files::OriginalBackground),
    ) {
        Ok(_) => {}
        Err(e) => {
            restore();
            panic!("Error saving file: {}", e)
        }
    }

    match save_to_file(
        &adjust_import_paths(&browser_content_contents),
        &file_finder.get(Files::OriginalContent),
    ) {
        Ok(_) => {}
        Err(e) => {
            restore();
            panic!("Error saving file: {}", e)
        }
    }

    match save_to_file(
        &adjust_storage_service_imports(&storage_service_contents, browser),
        &file_finder.get(Files::StorageService),
    ) {
        Ok(_) => {}
        Err(e) => {
            restore();
            panic!("Error saving file: {}", e)
        }
    }

    match save_to_file(
        &browser_manifest_contents,
        &file_finder.get(Files::Manifest),
    ) {
        Ok(_) => {}
        Err(e) => {
            restore();
            panic!("Error saving file: {}", e)
        }
    }

    // Run npm run build
    let build_process = process::Command::new("npm")
        .arg("run")
        .arg("build")
        .output()
        .unwrap();

    let raw_output = String::from_utf8_lossy(&build_process.stdout);

    restore();

    if raw_output.contains("Failed to compile") {
        panic!("Build Failed:\n{}", raw_output);
    };

    match fs::remove_dir_all(file_finder.get(Files::BrowserBuildFolder)) {
        Ok(_) => {}
        Err(_) => println!("No build folder to remove!"),
    }

    match fs::rename(
        &file_finder.get(Files::BuildFolder),
        &file_finder.get(Files::BrowserBuildFolder),
    ) {
        Ok(_) => {
            println!("Build successful!")
        }
        Err(_) => println!("No build folder to rename! How did this happen?"),
    }
    // Revert files to their original state apart from the manifest because that ones ok
}
