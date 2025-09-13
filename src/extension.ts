import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('flutter-project-setup.setupProject', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace open. Open a Flutter project folder first.');
      return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const vscodeDir = path.join(workspacePath, '.vscode');
    const tasksFile = path.join(vscodeDir, 'tasks.json');

    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
    }

    // Your tasks JSON
    const tasksJson = {
      "version": "2.0.0",
      "tasks": [
        {
          "label": "Replace lib folder with setup_project lib",
          "type": "shell",
          "command": "if [ \"$(uname)\" = \"Darwin\" ]; then rm -rf lib && echo -e \"\\033[32mDeleted existing lib folder\\033[0m\" && git clone --no-checkout https://github.com/Eldeengawy/setup_project.git temp_repo && echo -e \"\\033[32mCloned repository\\033[0m\" && cd temp_repo && git sparse-checkout init --cone && git sparse-checkout set lib && git checkout main && echo -e \"\\033[32mChecked out lib folder\\033[0m\" && cd .. && mv temp_repo/lib lib && echo -e \"\\033[32mMoved lib folder to project\\033[0m\" && rm -rf temp_repo && echo -e \"\\033[32mCleaned up temp_repo\\033[0m\" && project_name=$(basename \"$PWD\") && echo -e \"\\033[32mProject name: $project_name\\033[0m\" && camel_case=$(echo \"$project_name\" | awk -F_ '{for(i=1;i<=NF;i++){ printf \"%s\", toupper(substr($i,1,1)) substr($i,2) } printf \"\\n\"}') && echo -e \"\\033[32mCamel case name: $camel_case\\033[0m\" && find . -type f \\( -name \"*.dart\" -o -name \"*.yaml\" -o -name \"*.yml\" -o -name \"*.json\" \\) -exec sed -i '' \"s|crm_app/|${project_name}/|g\" {} \\; -exec sed -i '' \"s|CrmApp|${camel_case}|g\" {} \\; && echo -e \"\\033[32mReplaced placeholders in project files\\033[0m\" || echo -e \"\\033[31mError during execution\\033[0m\"; elif [ \"$(uname)\" = \"Linux\" ]; then rm -rf lib && echo -e \"\\033[32mDeleted existing lib folder\\033[0m\" && git clone --no-checkout https://github.com/Eldeengawy/setup_project.git temp_repo && echo -e \"\\033[32mCloned repository\\033[0m\" && cd temp_repo && git sparse-checkout init --cone && git sparse-checkout set lib && git checkout main && echo -e \"\\033[32mChecked out lib folder\\033[0m\" && cd .. && mv temp_repo/lib lib && echo -e \"\\033[32mMoved lib folder to project\\033[0m\" && rm -rf temp_repo && echo -e \"\\033[32mCleaned up temp_repo\\033[0m\" && project_name=$(basename \"$PWD\") && echo -e \"\\033[32mProject name: $project_name\\033[0m\" && camel_case=$(echo \"$project_name\" | awk -F_ '{for(i=1;i<=NF;i++){ printf \"%s\", toupper(substr($i,1,1)) substr($i,2) } printf \"\\n\"}') && echo -e \"\\033[32mCamel case name: $camel_case\\033[0m\" && find . -type f \\( -name \"*.dart\" -o -name \"*.yaml\" -o -name \"*.yml\" -o -name \"*.json\" \\) -exec sed -i \"s|crm_app/|${project_name}/|g\" {} \\; -exec sed -i \"s|CrmApp|${camel_case}|g\" {} \\; && echo -e \"\\033[32mReplaced placeholders in project files\\033[0m\" || echo -e \"\\033[31mError during execution\\033[0m\"; else powershell -Command \"Remove-Item -Recurse -Force lib -ErrorAction SilentlyContinue; Write-Host -ForegroundColor Green 'Deleted existing lib folder'; git clone --no-checkout https://github.com/Eldeengawy/setup_project.git temp_repo; Write-Host -ForegroundColor Green 'Cloned repository'; Push-Location temp_repo; git sparse-checkout init --cone; git sparse-checkout set lib; git checkout main; Write-Host -ForegroundColor Green 'Checked out lib folder'; Pop-Location; Move-Item temp_repo/lib lib; Write-Host -ForegroundColor Green 'Moved lib folder to project'; Remove-Item -Recurse -Force temp_repo; Write-Host -ForegroundColor Green 'Cleaned up temp_repo'; $project_name = (Get-Item $PWD).Name; Write-Host -ForegroundColor Green \\\"Project name: $project_name\\\"; $parts = $project_name -split '_'; $camel_case = ''; foreach($part in $parts){ $camel_case += $part[0].ToUpper() + $part.Substring(1) }; Write-Host -ForegroundColor Green \\\"Camel case name: $camel_case\\\"; Get-ChildItem -Recurse -Include *.dart,*.yaml,*.yml,*.json | ForEach-Object { $content = Get-Content $_ -Raw; $content = $content -replace 'crm_app/', \\\"$project_name/\\\"; $content = $content -replace 'CrmApp', $camel_case; Set-Content $_ $content }; Write-Host -ForegroundColor Green 'Replaced placeholders in project files'\" ; fi",
          "group": { "kind": "build", "isDefault": false },
          "presentation": { "reveal": "never", "panel": "shared" },
          "problemMatcher": [],
          "detail": "Replaces lib folder using Git sparse checkout, adds colored logs, and replaces placeholders like 'crm_app/' and 'CrmApp' across the project."
        },
        {
          "label": "Install Flutter packages",
          "type": "shell",
          "command": "if [ \"$(uname)\" = \"Darwin\" ] || [ \"$(uname)\" = \"Linux\" ]; then if [ ! -f pubspec.yaml ]; then echo -e \"\\033[31mError: pubspec.yaml not found\\033[0m\" && exit 1; fi; echo -e \"\\033[32mFound pubspec.yaml\\033[0m\"; packages=('flutter_bloc' 'dartz' 'cached_network_image' 'percent_indicator' 'smooth_page_indicator' 'equatable' 'easy_localization' 'shared_preferences' 'flutter_screenutil' 'bot_toast' 'dio' 'pretty_dio_logger' 'connectivity_plus' 'go_router' 'flutter_html' 'url_launcher' 'flutter_svg' 'shimmer' 'logger' 'get_it' 'fluttertoast' 'auto_size_text' 'flutter_spinkit' 'dropdown_button2' 'file_picker'); for pkg in \"${packages[@]}\"; do if ! grep -q \"^[[:space:]]*$pkg:\" pubspec.yaml; then temp_file=$(mktemp); awk -v pkg=\"$pkg\" '/^dependencies:/{print; print \"  \" pkg \":\"; next} {print}' pubspec.yaml > \"$temp_file\" && mv \"$temp_file\" pubspec.yaml && echo -e \"\\033[32mAdded $pkg to pubspec.yaml\\033[0m\"; else echo -e \"\\033[32mSkipped $pkg (already in pubspec.yaml)\\033[0m\"; fi; done; flutter pub get && echo -e \"\\033[32mRan flutter pub get successfully\\033[0m\" || echo -e \"\\033[31mError: Failed to run flutter pub get\\033[0m\"; else powershell -Command \"if (-not (Test-Path pubspec.yaml)) { Write-Host -ForegroundColor Red 'Error: pubspec.yaml not found'; exit 1 }; Write-Host -ForegroundColor Green 'Found pubspec.yaml'; $packages = @('flutter_bloc', 'dartz' , 'cached_network_image' , 'percent_indicator' ,'smooth_page_indicator' ,'equatable','easy_localization', 'shared_preferences', 'flutter_screenutil', 'bot_toast', 'dio', 'pretty_dio_logger', 'connectivity_plus', 'go_router', 'flutter_html', 'url_launcher', 'flutter_svg', 'shimmer', 'logger', 'get_it', 'fluttertoast', 'auto_size_text', 'flutter_spinkit', 'dropdown_button2', 'file_picker'); foreach ($pkg in $packages) { if (-not (Select-String -Path pubspec.yaml -Pattern \\\"^\\\\s*$pkg\\:\\\")) { $content = Get-Content pubspec.yaml; $newContent = @(); $dependenciesFound = $false; foreach ($line in $content) { $newContent += $line; if ($line -match '^dependencies:' -and -not $dependenciesFound) { $newContent += \\\"  $pkg:\\\"; $dependenciesFound = $true; Write-Host -ForegroundColor Green \\\"Added $pkg to pubspec.yaml\\\" } }; Set-Content pubspec.yaml $newContent } else { Write-Host -ForegroundColor Green \\\"Skipped $pkg (already in pubspec.yaml)\\\" } }; flutter pub get; if ($?) { Write-Host -ForegroundColor Green 'Ran flutter pub get successfully' } else { Write-Host -ForegroundColor Red 'Error: Failed to run flutter pub get' }\"; fi",
          "dependsOn": ["Replace lib folder with setup_project lib"],
          "group": { "kind": "build", "isDefault": false },
          "presentation": { "reveal": "never", "panel": "shared" },
          "problemMatcher": [],
          "detail": "Installs specified Flutter packages in pubspec.yaml without versions, allowing latest versions, with colored logs, handling macOS/Linux and Windows."
        },
        {
          "label": "Run Flutter pub get only",
          "type": "shell",
          "command": "flutter pub get",
          "group": { "kind": "build", "isDefault": false },
          "presentation": { "reveal": "never", "panel": "shared" },
          "problemMatcher": [],
          "detail": "Simply runs flutter pub get without adding packages."
        },
        {
          "label": "Fix Package Dependencies Issues",
          "type": "shell",
          "command": "echo -e \"\\033[32m🧹 Cleaning Flutter cache...\\033[0m\" && flutter clean && echo -e \"\\033[32m🗑️ Removing cached dependencies...\\033[0m\" && rm -rf pubspec.lock && rm -rf .dart_tool && rm -rf .packages && echo -e \"\\033[32m📦 Getting fresh dependencies...\\033[0m\" && flutter pub get && echo -e \"\\033[32m🔧 Repairing pub cache...\\033[0m\" && flutter pub cache repair && echo -e \"\\033[32m✅ Done! Restart your IDE and Dart Analysis Server\\033[0m\" && echo -e \"\\033[33m🔄 In VS Code: Cmd+Shift+P -> 'Dart: Restart Analysis Server'\\033[0m\"",
          "group": { "kind": "build", "isDefault": false },
          "presentation": { "reveal": "never", "panel": "shared" },
          "problemMatcher": [],
          "detail": "Completely cleans and reinstalls all Flutter dependencies to fix package recognition issues."
        },
        {
          "label": "Auto-detect and Replace Project Placeholders",
          "type": "shell",
          "command": "if [ \"$(uname)\" = \"Darwin\" ] || [ \"$(uname)\" = \"Linux\" ]; then project_name=$(basename \"$PWD\") && echo -e \"\\033[36m🔍 Detected project name: $project_name\\033[0m\" && camel_case=$(echo \"$project_name\" | awk -F_ '{for(i=1;i<=NF;i++){ printf \"%s\", toupper(substr($i,1,1)) substr($i,2) } printf \"\\n\"}') && echo -e \"\\033[36m📝 Generated CamelCase: $camel_case\\033[0m\" && echo -e \"\\033[33m🔄 Replacing 'project_name' with '$project_name'...\\033[0m\" && find . -type f \\( -name \"*.dart\" -o -name \"*.yaml\" -o -name \"*.yml\" -o -name \"*.json\" -o -name \"*.md\" \\) -not -path \"./.git/*\" -not -path \"./.*\" -exec grep -l \"project_name\" {} \\; | while read file; do echo -e \"\\033[32m  ✓ Processing: $file\\033[0m\"; sed -i '' \"s|package:project_name/|package:${project_name}/|g\" \"$file\"; sed -i '' \"s|project_name/|${project_name}/|g\" \"$file\"; sed -i '' \"s|'project_name'|'${project_name}'|g\" \"$file\"; sed -i '' \"s|\\\"project_name\\\"|\\\"${project_name}\\\"|g\" \"$file\"; done && echo -e \"\\033[33m🔄 Replacing 'ProjectName' with '$camel_case'...\\033[0m\" && find . -type f \\( -name \"*.dart\" -o -name \"*.yaml\" -o -name \"*.yml\" -o -name \"*.json\" -o -name \"*.md\" \\) -not -path \"./.git/*\" -not -path \"./.*\" -exec grep -l \"ProjectName\" {} \\; | while read file; do echo -e \"\\033[32m  ✓ Processing: $file\\033[0m\"; sed -i '' \"s|ProjectName|${camel_case}|g\" \"$file\"; done && echo -e \"\\033[32m✅ Successfully replaced all project placeholders!\\033[0m\" && echo -e \"\\033[36m📊 Summary:\\033[0m\" && echo -e \"\\033[36m  • project_name → $project_name\\033[0m\" && echo -e \"\\033[36m  • ProjectName → $camel_case\\033[0m\" && echo -e \"\\033[36m  • package:project_name/ → package:${project_name}/\\033[0m\"; else powershell -Command \"$project_name = (Get-Item $PWD).Name; Write-Host -ForegroundColor Cyan \\\"🔍 Detected project name: $project_name\\\"; $parts = $project_name -split '_'; $camel_case = ''; foreach($part in $parts){ $camel_case += $part[0].ToUpper() + $part.Substring(1) }; Write-Host -ForegroundColor Cyan \\\"📝 Generated CamelCase: $camel_case\\\"; Write-Host -ForegroundColor Yellow \\\"🔄 Replacing 'project_name' with '$project_name'...\\\"; Get-ChildItem -Recurse -Include *.dart,*.yaml,*.yml,*.json,*.md | Where-Object { $_.FullName -notmatch '\\\\.git' } | ForEach-Object { $content = Get-Content $_ -Raw -ErrorAction SilentlyContinue; if ($content -and $content.Contains('project_name')) { Write-Host -ForegroundColor Green \\\"  ✓ Processing: $($_.Name)\\\"; $content = $content -replace 'package:project_name/', \\\"package:$project_name/\\\"; $content = $content -replace 'project_name/', \\\"$project_name/\\\"; $content = $content -replace \\\"'project_name'\\\", \\\"'$project_name'\\\"; $content = $content -replace '\\\"project_name\\\"', \\\"\\\"$project_name\\\"\\\"; Set-Content $_ $content } }; Write-Host -ForegroundColor Yellow \\\"🔄 Replacing 'ProjectName' with '$camel_case'...\\\"; Get-ChildItem -Recurse -Include *.dart,*.yaml,*.yml,*.json,*.md | Where-Object { $_.FullName -notmatch '\\\\.git' } | ForEach-Object { $content = Get-Content $_ -Raw -ErrorAction SilentlyContinue; if ($content -and $content.Contains('ProjectName')) { Write-Host -ForegroundColor Green \\\"  ✓ Processing: $($_.Name)\\\"; $content = $content -replace 'ProjectName', $camel_case; Set-Content $_ $content } }; Write-Host -ForegroundColor Green \\\"✅ Successfully replaced all project placeholders!\\\"; Write-Host -ForegroundColor Cyan \\\"📊 Summary:\\\"; Write-Host -ForegroundColor Cyan \\\"  • project_name → $project_name\\\"; Write-Host -ForegroundColor Cyan \\\"  • ProjectName → $camel_case\\\"; Write-Host -ForegroundColor Cyan \\\"  • package:project_name/ → package:$project_name/\\\"\" ; fi",
          "group": { "kind": "build", "isDefault": false },
          "presentation": { "reveal": "never", "panel": "shared" },
          "problemMatcher": [],
          "detail": "Automatically detects the project name from folder and replaces all 'project_name' and 'ProjectName' placeholders throughout the codebase."
        },
        {
          "label": "Reload VS Code Window",
          "type": "shell",
          "command": "${command:workbench.action.reloadWindow}",
          "group": { "kind": "build", "isDefault": false },
          "presentation": { "reveal": "never", "panel": "shared" },
          "problemMatcher": [],
          "detail": "Attempts to reload VS Code window automatically using system commands."
        },
        {
          "label": "Complete Project Setup",
          "dependsOrder": "sequence",
          "dependsOn": [
            "Replace lib folder with setup_project lib",
            "Auto-detect and Replace Project Placeholders",
            "Install Flutter packages",
            "Reload VS Code Window"
          ],
          "group": { "kind": "build", "isDefault": true },
          "problemMatcher": [],
          "detail": "Runs the complete setup: replaces lib folder, fixes project names, installs packages, and automatically reloads VS Code window in sequence."
        }
      ]
    };

    try {
      fs.writeFileSync(tasksFile, JSON.stringify(tasksJson, null, 2));
      vscode.window.showInformationMessage('tasks.json created/updated successfully.');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to write tasks.json: ${(error as Error).message}`);
      return;
    }

    try {
      const tasks = await vscode.tasks.fetchTasks();
      const setupTask = tasks.find(task => task.name === 'Complete Project Setup');
      if (setupTask) {
        vscode.tasks.executeTask(setupTask);
      } else {
        vscode.window.showErrorMessage('Failed to find "Complete Project Setup" task.');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to execute task: ${(error as Error).message}`);
    }
  });

  context.subscriptions.push(disposable);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'flutter-project-setup.setupProject';
  statusBarItem.text = '$(tools) Setup Flutter Project';
  statusBarItem.tooltip = 'Run complete Flutter project setup';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
