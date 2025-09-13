import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { createFeatureStructure, createUITemplate } from './feature-creator';

   export function activate(context: vscode.ExtensionContext) {
     // Webview Panel Command
     let showMainPanelDisposable = vscode.commands.registerCommand('flutter-project-setup.showMainPanel', () => {
       const panel = vscode.window.createWebviewPanel(
         'flutterSetupPanel',
         'Flutter Project Setup',
         vscode.ViewColumn.One,
         {
           enableScripts: true,
           retainContextWhenHidden: true
         }
       );

       // HTML content for Webview
       panel.webview.html = getWebviewContent();

       // Handle messages from Webview
       panel.webview.onDidReceiveMessage(
         async (message) => {
           switch (message.command) {
             case 'setupProject':
               await vscode.commands.executeCommand('flutter-project-setup.setupProject');
               break;
             case 'createFeature':
               await vscode.commands.executeCommand('flutter-project-setup.createFeature');
               break;
             case 'generateUITemplate':
               await vscode.commands.executeCommand('flutter-project-setup.generateUITemplate');
               break;
             case 'setupUnitTests':
               await vscode.commands.executeCommand('flutter-project-setup.setupUnitTests');
               break;
             case 'setupLocalization':
               await vscode.commands.executeCommand('flutter-project-setup.setupLocalization');
               break;
           }
         },
         undefined,
         context.subscriptions
       );
     });

     // Tree View Data Provider
     class FlutterSetupTreeDataProvider implements vscode.TreeDataProvider<FlutterSetupItem> {
       private _onDidChangeTreeData: vscode.EventEmitter<FlutterSetupItem | undefined | null | void> = new vscode.EventEmitter<FlutterSetupItem | undefined | null | void>();
       readonly onDidChangeTreeData: vscode.Event<FlutterSetupItem | undefined | null | void> = this._onDidChangeTreeData.event;

       getTreeItem(element: FlutterSetupItem): vscode.TreeItem {
         return element;
       }

       getChildren(element?: FlutterSetupItem): Thenable<FlutterSetupItem[]> {
         if (element) {
           return Promise.resolve([]);
         }
         return Promise.resolve([
           new FlutterSetupItem('Setup Project', 'flutter-project-setup.setupProject', vscode.TreeItemCollapsibleState.None, '$(tools)'),
           new FlutterSetupItem('Create Feature', 'flutter-project-setup.createFeature', vscode.TreeItemCollapsibleState.None, '$(add)'),
           new FlutterSetupItem('Generate UI Template', 'flutter-project-setup.generateUITemplate', vscode.TreeItemCollapsibleState.None, '$(window)'),
           new FlutterSetupItem('Setup Unit Tests', 'flutter-project-setup.setupUnitTests', vscode.TreeItemCollapsibleState.None, '$(beaker)'),
           new FlutterSetupItem('Setup Localization', 'flutter-project-setup.setupLocalization', vscode.TreeItemCollapsibleState.None, '$(globe)')
         ]);
       }

       refresh(): void {
         this._onDidChangeTreeData.fire();
       }
     }

     class FlutterSetupItem extends vscode.TreeItem {
       constructor(
         public readonly label: string,
         public readonly commandId: string,
         public readonly collapsibleState: vscode.TreeItemCollapsibleState,
         public readonly icon?: string
       ) {
         super(label, collapsibleState);
         this.command = {
           command: commandId,
           title: label
         };
         this.iconPath = icon ? new vscode.ThemeIcon(icon) : undefined;
       }
     }

     // Register Tree View
     const treeDataProvider = new FlutterSetupTreeDataProvider();
     vscode.window.registerTreeDataProvider('flutterSetupTree', treeDataProvider);

     // Original setup project command
     let setupDisposable = vscode.commands.registerCommand('flutter-project-setup.setupProject', async () => {
       await vscode.window.withProgress({
         location: vscode.ProgressLocation.Notification,
         title: 'Setting up Flutter Project...',
         cancellable: false
       }, async (progress) => {
         progress.report({ message: 'Checking workspace...' });
         const workspaceFolders = vscode.workspace.workspaceFolders;
         if (!workspaceFolders) {
           vscode.window.showErrorMessage('No workspace open. Open a Flutter project folder first.');
           return;
         }

         const workspacePath = workspaceFolders[0].uri.fsPath;
         const vscodeDir = path.join(workspacePath, '.vscode');
         const tasksFile = path.join(vscodeDir, 'tasks.json');

         progress.report({ message: 'Creating tasks.json...' });
         if (!fs.existsSync(vscodeDir)) {
           fs.mkdirSync(vscodeDir, { recursive: true });
         }

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
           progress.report({ message: 'Executing setup tasks...' });
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
     });

     // Create feature command
     let createFeatureDisposable = vscode.commands.registerCommand('flutter-project-setup.createFeature', async () => {
       const workspaceFolders = vscode.workspace.workspaceFolders;
       if (!workspaceFolders) {
         vscode.window.showErrorMessage('No workspace open. Open a Flutter project folder first.');
         return;
       }

       const workspacePath = workspaceFolders[0].uri.fsPath;
       const libPath = path.join(workspacePath, 'lib');
       const featuresPath = path.join(libPath, 'features');

       if (!fs.existsSync(featuresPath)) {
         vscode.window.showErrorMessage('No features folder found. Make sure you have run the project setup first.');
         return;
       }

       const featureName = await vscode.window.showInputBox({
         prompt: 'Enter the feature name (e.g., "User Profile", "On Boarding", "Shopping Cart")',
         placeHolder: 'Feature Name',
         validateInput: (input) => {
           if (!input || input.trim().length === 0) {
             return 'Feature name cannot be empty';
           }
           if (input.length > 50) {
             return 'Feature name is too long';
           }
           return null;
         }
       });

       if (!featureName) {
         return;
       }

       try {
         await vscode.window.withProgress({
           location: vscode.ProgressLocation.Notification,
           title: `Creating feature "${featureName}"...`,
           cancellable: false
         }, async (progress) => {
           progress.report({ message: 'Generating feature structure...' });
           await createFeatureStructure(featuresPath, workspacePath, featureName);
           vscode.window.showInformationMessage(`✅ Feature "${featureName}" created successfully!`);
           const featureFolderPath = path.join(featuresPath, convertToSnakeCase(featureName));
           await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(featureFolderPath));
         });
       } catch (error) {
         vscode.window.showErrorMessage(`Failed to create feature: ${(error as Error).message}`);
       }
     });

     // Generate UI Template command
     let generateUITemplateDisposable = vscode.commands.registerCommand('flutter-project-setup.generateUITemplate', async () => {
       const workspaceFolders = vscode.workspace.workspaceFolders;
       if (!workspaceFolders) {
         vscode.window.showErrorMessage('No workspace open. Open a Flutter project folder first.');
         return;
       }

       const workspacePath = workspaceFolders[0].uri.fsPath;
       const featuresPath = path.join(workspacePath, 'lib', 'features');

       if (!fs.existsSync(featuresPath)) {
         vscode.window.showErrorMessage('No features folder found. Run project setup first.');
         return;
       }

       const templates = [
         { label: 'Login Page', description: 'Generate a login page with email and password fields' },
         { label: 'Dynamic List', description: 'Generate a list view with sample data' },
         { label: 'Profile Page', description: 'Generate a user profile page' }
       ];

       const selectedTemplate = await vscode.window.showQuickPick(templates, {
         placeHolder: 'Select a UI template to generate',
       });

       if (!selectedTemplate) {return;}

       const featureName = await vscode.window.showInputBox({
         prompt: 'Enter the feature name for the UI template',
         placeHolder: 'Feature Name',
         validateInput: (input) => input.trim().length === 0 ? 'Feature name cannot be empty' : null,
       });

       if (!featureName) {return;}

       try {
         await vscode.window.withProgress({
           location: vscode.ProgressLocation.Notification,
           title: `Generating UI template "${selectedTemplate.label}"...`,
           cancellable: false
         }, async (progress) => {
           progress.report({ message: 'Creating UI files...' });
           await createUITemplate(featuresPath, workspacePath, featureName, selectedTemplate.label);
           vscode.window.showInformationMessage(`✅ UI Template "${selectedTemplate.label}" created for "${featureName}"!`);
           const featureFolderPath = path.join(featuresPath, convertToSnakeCase(featureName));
           await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(featureFolderPath));
         });
       } catch (error) {
         vscode.window.showErrorMessage(`Failed to generate UI template: ${(error as Error).message}`);
       }
     });

     // Setup Unit Tests command
     let setupUnitTestsDisposable = vscode.commands.registerCommand('flutter-project-setup.setupUnitTests', async () => {
       const workspaceFolders = vscode.workspace.workspaceFolders;
       if (!workspaceFolders) {
         vscode.window.showErrorMessage('No workspace open. Open a Flutter project folder first.');
         return;
       }

       const workspacePath = workspaceFolders[0].uri.fsPath;
       const testPath = path.join(workspacePath, 'test');

       if (!fs.existsSync(testPath)) {
         fs.mkdirSync(testPath, { recursive: true });
       }

       const testContent = `
import 'package:flutter_test/flutter_test.dart';
import 'package:${path.basename(workspacePath)}/features/sample/data/models/responses/sample_model.dart';

void main() {
  group('SampleModel Tests', () {
    test('should create SampleModel from JSON', () {
      final json = {
        'id': '1',
        'name': 'Test',
        'description': 'Test Description',
        'created_at': '2023-01-01T00:00:00Z',
        'updated_at': '2023-01-01T00:00:00Z',
      };
      final model = SampleModel.fromJson(json);
      expect(model.id, '1');
      expect(model.name, 'Test');
    });
  });
}
`;

       try {
         await vscode.window.withProgress({
           location: vscode.ProgressLocation.Notification,
           title: 'Setting up unit tests...',
           cancellable: false
         }, async (progress) => {
           progress.report({ message: 'Creating test files...' });
           fs.writeFileSync(path.join(testPath, 'sample_model_test.dart'), testContent);
           vscode.window.showInformationMessage('Unit test file created successfully!');
           await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(testPath));
         });
       } catch (error) {
         vscode.window.showErrorMessage(`Failed to create test file: ${(error as Error).message}`);
       }
     });

     // Setup Localization command
     let setupLocalizationDisposable = vscode.commands.registerCommand('flutter-project-setup.setupLocalization', async () => {
       const workspaceFolders = vscode.workspace.workspaceFolders;
       if (!workspaceFolders) {
         vscode.window.showErrorMessage('No workspace open. Open a Flutter project folder first.');
         return;
       }

       const workspacePath = workspaceFolders[0].uri.fsPath;
       const assetsPath = path.join(workspacePath, 'assets', 'translations');
       const pubspecPath = path.join(workspacePath, 'pubspec.yaml');

       if (!fs.existsSync(pubspecPath)) {
         vscode.window.showErrorMessage('pubspec.yaml not found.');
         return;
       }

       await vscode.window.withProgress({
         location: vscode.ProgressLocation.Notification,
         title: 'Setting up localization...',
         cancellable: false
       }, async (progress) => {
         progress.report({ message: 'Creating translation files...' });
         fs.mkdirSync(assetsPath, { recursive: true });

         const enContent = JSON.stringify({ "welcome": "Welcome to the App" }, null, 2);
         const arContent = JSON.stringify({ "welcome": "مرحبًا بالتطبيق" }, null, 2);

         fs.writeFileSync(path.join(assetsPath, 'en.json'), enContent);
         fs.writeFileSync(path.join(assetsPath, 'ar.json'), arContent);

         progress.report({ message: 'Updating pubspec.yaml...' });
         const pubspecContent = fs.readFileSync(pubspecPath, 'utf-8');
         const updatedPubspec = pubspecContent.replace(
           /flutter:\n/,
           `flutter:\n  assets:\n    - assets/translations/\n`
         );
         fs.writeFileSync(pubspecPath, updatedPubspec);

         progress.report({ message: 'Updating main.dart...' });
         const mainPath = path.join(workspacePath, 'lib', 'main.dart');
         let mainContent = fs.readFileSync(mainPath, 'utf-8');
         mainContent = mainContent.replace(
           `void main() {`,
           `import 'package:easy_localization/easy_localization.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  runApp(
    EasyLocalization(
      supportedLocales: [Locale('en'), Locale('ar')],
      path: 'assets/translations',
      fallbackLocale: Locale('en'),
      child: MyApp(),
    ),
  );
}`
         );
         fs.writeFileSync(mainPath, mainContent);

         vscode.window.showInformationMessage('Localization setup completed!');
       });
     });

     context.subscriptions.push(showMainPanelDisposable);
     context.subscriptions.push(setupDisposable);
     context.subscriptions.push(createFeatureDisposable);
     context.subscriptions.push(generateUITemplateDisposable);
     context.subscriptions.push(setupUnitTestsDisposable);
     context.subscriptions.push(setupLocalizationDisposable);

     // Status Bar Item for Main Panel
     const mainPanelStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
     mainPanelStatusBarItem.command = 'flutter-project-setup.showMainPanel';
     mainPanelStatusBarItem.text = '$(rocket) Flutter Setup';
     mainPanelStatusBarItem.tooltip = 'Open Flutter Project Setup Panel';
     mainPanelStatusBarItem.show();
     context.subscriptions.push(mainPanelStatusBarItem);

     // Enhanced status bar with existing commands
     const setupStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
     setupStatusBarItem.command = 'flutter-project-setup.setupProject';
     setupStatusBarItem.text = '$(tools) Setup Project';
     setupStatusBarItem.tooltip = 'Run complete Flutter project setup';
     setupStatusBarItem.show();

     const createFeatureStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
     createFeatureStatusBarItem.command = 'flutter-project-setup.createFeature';
     createFeatureStatusBarItem.text = '$(add) Create Feature';
     createFeatureStatusBarItem.tooltip = 'Create new Flutter feature';
     createFeatureStatusBarItem.show();

     context.subscriptions.push(setupStatusBarItem);
     context.subscriptions.push(createFeatureStatusBarItem);

     // Update status bar items based on workspace state
    const updateStatusBarItems = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const hasFeaturesFolder = workspaceFolders && fs.existsSync(path.join(workspaceFolders[0].uri.fsPath, 'lib', 'features'));
    setupStatusBarItem.show(); // Always show the setup status bar item
    if (hasFeaturesFolder) {
      createFeatureStatusBarItem.show(); // Show if features folder exists
    } else {
      createFeatureStatusBarItem.hide(); // Hide if features folder does not exist
    }
  };

     vscode.workspace.onDidChangeWorkspaceFolders(updateStatusBarItems);
     vscode.workspace.onDidChangeConfiguration(updateStatusBarItems);
     updateStatusBarItems();
   }

   // Helper function to convert input to snake_case
   function convertToSnakeCase(input: string): string {
     return input
       .trim()
       .toLowerCase()
       .replace(/[\s\-]+/g, '_')
       .replace(/[^\w_]/g, '')
       .replace(/_+/g, '_')
       .replace(/^_|_$/g, '');
   }

   // Webview HTML content
   function getWebviewContent(): string {
     return `
       <!DOCTYPE html>
       <html lang="en">
       <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Flutter Project Setup</title>
         <style>
           body {
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
             background-color: #f0f0f0;
             padding: 20px;
             display: flex;
             flex-direction: column;
             align-items: center;
           }
           body.vscode-dark {
             background-color: #1e1e1e;
             color: #ffffff;
           }
           body.vscode-light {
             background-color: #f0f0f0;
             color: #000000;
           }
           h1 {
             color: #007acc;
             text-align: center;
           }
           .button {
             background-color: #007acc;
             color: white;
             padding: 12px 24px;
             border: none;
             border-radius: 5px;
             margin: 10px;
             cursor: pointer;
             font-size: 16px;
             transition: background-color 0.3s;
             width: 250px;
             text-align: center;
           }
           .button:hover {
             background-color: #005f99;
           }
           .button:active {
             background-color: #003f66;
           }
         </style>
       </head>
       <body>
         <h1>Flutter Project Setup</h1>
         <button class="button" onclick="sendMessage('setupProject')">Setup Flutter Project</button>
         <button class="button" onclick="sendMessage('createFeature')">Create New Feature</button>
         <button class="button" onclick="sendMessage('generateUITemplate')">Generate UI Template</button>
         <button class="button" onclick="sendMessage('setupUnitTests')">Setup Unit Tests</button>
         <button class="button" onclick="sendMessage('setupLocalization')">Setup Localization</button>
         <script>
           const vscode = acquireVsCodeApi();
           function sendMessage(command) {
             vscode.postMessage({ command });
           }
         </script>
       </body>
       </html>
     `;
   }

   export function deactivate() {}
