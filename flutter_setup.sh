#!/bin/bash

# Flutter Project Setup Script
# Compatible with any code editor including Trae

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a Flutter project
check_flutter_project() {
    if [[ ! -f "pubspec.yaml" ]]; then
        log_error "Not in a Flutter project directory. Please run this script from a Flutter project root."
        exit 1
    fi
    log_success "Flutter project detected"
}

# Create .vscode directory and tasks.json
setup_vscode_tasks() {
    log_info "Setting up development tasks..."
    
    mkdir -p .vscode
    
    cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Replace lib folder with setup_project lib",
      "type": "shell",
      "command": "if [ \"$(uname)\" = \"Darwin\" ]; then rm -rf lib && echo -e \"\\033[32mDeleted existing lib folder\\033[0m\" && git clone --no-checkout https://github.com/Eldeengawy/setup_project.git temp_repo && echo -e \"\\033[32mCloned repository\\033[0m\" && cd temp_repo && git sparse-checkout init --cone && git sparse-checkout set lib && git checkout main && echo -e \"\\033[32mChecked out lib folder\\033[0m\" && cd .. && mv temp_repo/lib lib && echo -e \"\\033[32mMoved lib folder to project\\033[0m\" && rm -rf temp_repo && echo -e \"\\033[32mCleaned up temp_repo\\033[0m\" && project_name=$(basename \"$PWD\") && echo -e \"\\033[32mProject name: $project_name\\033[0m\" && camel_case=$(echo \"$project_name\" | awk -F_ '{for(i=1;i<=NF;i++){ printf \"%s\", toupper(substr($i,1,1)) substr($i,2) } printf \"\\n\"}') && echo -e \"\\033[32mCamel case name: $camel_case\\033[0m\" && find . -type f \\( -name \"*.dart\" -o -name \"*.yaml\" -o -name \"*.yml\" -o -name \"*.json\" \\) -exec sed -i '' \"s|crm_app/|${project_name}/|g\" {} \\; -exec sed -i '' \"s|CrmApp|${camel_case}|g\" {} \\; && echo -e \"\\033[32mReplaced placeholders in project files\\033[0m\" || echo -e \"\\033[31mError during execution\\033[0m\"; fi",
      "group": { "kind": "build", "isDefault": false },
      "presentation": { "reveal": "always", "panel": "shared" },
      "problemMatcher": [],
      "detail": "Replaces lib folder using Git sparse checkout, adds colored logs, and replaces placeholders like 'crm_app/' and 'CrmApp' across the project."
    },
    {
      "label": "Install Flutter packages",
      "type": "shell",
      "command": "flutter pub add flutter_bloc dartz cached_network_image percent_indicator smooth_page_indicator equatable easy_localization shared_preferences flutter_screenutil bot_toast dio pretty_dio_logger connectivity_plus go_router flutter_html url_launcher flutter_svg shimmer logger get_it fluttertoast auto_size_text flutter_spinkit dropdown_button2 file_picker && flutter pub get",
      "group": { "kind": "build", "isDefault": false },
      "presentation": { "reveal": "always", "panel": "shared" },
      "problemMatcher": [],
      "detail": "Installs essential Flutter packages and runs pub get."
    },
    {
      "label": "Complete Project Setup",
      "dependsOrder": "sequence",
      "dependsOn": [
        "Replace lib folder with setup_project lib",
        "Install Flutter packages"
      ],
      "group": { "kind": "build", "isDefault": true },
      "problemMatcher": [],
      "detail": "Runs the complete setup: replaces lib folder, fixes project names, and installs packages in sequence."
    }
  ]
}
EOF
    
    log_success "Development tasks created (.vscode/tasks.json)"
}

# Replace lib folder with setup_project
replace_lib_folder() {
    log_info "Replacing lib folder with setup_project lib..."
    
    # Remove existing lib folder
    if [[ -d "lib" ]]; then
        rm -rf lib
        log_success "Deleted existing lib folder"
    fi
    
    # Clone repository with sparse checkout
    git clone --no-checkout https://github.com/Eldeengawy/setup_project.git temp_repo
    log_success "Cloned repository"
    
    cd temp_repo
    git sparse-checkout init --cone
    git sparse-checkout set lib
    git checkout main
    log_success "Checked out lib folder"
    
    cd ..
    mv temp_repo/lib lib
    log_success "Moved lib folder to project"
    
    rm -rf temp_repo
    log_success "Cleaned up temp_repo"
}

# Replace project placeholders
replace_placeholders() {
    local project_name=$(basename "$PWD")
    log_info "🔍 Detected project name: $project_name"
    
    # Convert to CamelCase
    local camel_case=$(echo "$project_name" | awk -F_ '{for(i=1;i<=NF;i++){ printf "%s", toupper(substr($i,1,1)) substr($i,2) } printf "\n"}')
    log_info "📝 Generated CamelCase: $camel_case"
    
    log_info "🔄 Replacing placeholders..."
    
    # Replace project_name with actual project name
    find . -type f \( -name "*.dart" -o -name "*.yaml" -o -name "*.yml" -o -name "*.json" -o -name "*.md" \) \
        -not -path "./.git/*" -not -path "./.*" \
        -exec sed -i '' "s|package:project_name/|package:${project_name}/|g" {} \; \
        -exec sed -i '' "s|project_name/|${project_name}/|g" {} \; \
        -exec sed -i '' "s|'project_name'|'${project_name}'|g" {} \; \
        -exec sed -i '' "s|\"project_name\"|\"${project_name}\"|g" {} \;
    
    # Replace ProjectName with CamelCase
    find . -type f \( -name "*.dart" -o -name "*.yaml" -o -name "*.yml" -o -name "*.json" -o -name "*.md" \) \
        -not -path "./.git/*" -not -path "./.*" \
        -exec sed -i '' "s|ProjectName|${camel_case}|g" {} \;
    
    # Replace crm_app references (from original template)
    find . -type f \( -name "*.dart" -o -name "*.yaml" -o -name "*.yml" -o -name "*.json" \) \
        -not -path "./.git/*" -not -path "./.*" \
        -exec sed -i '' "s|crm_app/|${project_name}/|g" {} \; \
        -exec sed -i '' "s|CrmApp|${camel_case}|g" {} \;
    
    log_success "✅ Replaced all placeholders"
    echo -e "${CYAN}📊 Summary:${NC}"
    echo -e "${CYAN}  • project_name → $project_name${NC}"
    echo -e "${CYAN}  • ProjectName → $camel_case${NC}"
    echo -e "${CYAN}  • crm_app → $project_name${NC}"
    echo -e "${CYAN}  • CrmApp → $camel_case${NC}"
}

# Install Flutter packages
install_packages() {
    log_info "📦 Installing Flutter packages..."
    
    local packages=(
        "flutter_bloc"
        "dartz"
        "cached_network_image"
        "percent_indicator"
        "smooth_page_indicator"
        "equatable"
        "easy_localization"
        "shared_preferences"
        "flutter_screenutil"
        "bot_toast"
        "dio"
        "pretty_dio_logger"
        "connectivity_plus"
        "go_router"
        "flutter_html"
        "url_launcher"
        "flutter_svg"
        "shimmer"
        "logger"
        "get_it"
        "fluttertoast"
        "auto_size_text"
        "flutter_spinkit"
        "dropdown_button2"
        "file_picker"
    )
    
    # Add packages
    log_info "Adding packages to pubspec.yaml..."
    flutter pub add "${packages[@]}"
    
    # Get dependencies
    log_info "Running flutter pub get..."
    flutter pub get
    log_success "✅ All packages installed successfully"
}

# Clean Flutter project
clean_project() {
    log_info "🧹 Cleaning Flutter project..."
    
    flutter clean
    rm -rf pubspec.lock .dart_tool .packages
    flutter pub get
    flutter pub cache repair
    
    log_success "✅ Project cleaned and dependencies refreshed"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Flutter Project Setup Script${NC}"
    echo -e "${BLUE}==================================${NC}"
    echo -e "${YELLOW}Compatible with Trae, VS Code, and any editor${NC}"
    echo ""
    
    check_flutter_project
    
    # Ask user what they want to do
    echo -e "\n${YELLOW}What would you like to do?${NC}"
    echo "1) 🚀 Complete setup (recommended)"
    echo "2) 📁 Replace lib folder only"
    echo "3) 📦 Install packages only"
    echo "4) 🏷️  Replace placeholders only"
    echo "5) 🧹 Clean project only"
    echo "6) ⚙️  Setup development tasks only"
    echo ""
    
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            echo -e "\n${BLUE}🚀 Starting complete setup...${NC}"
            setup_vscode_tasks
            replace_lib_folder
            replace_placeholders
            install_packages
            echo -e "\n${GREEN}🎉 Complete setup finished!${NC}"
            echo -e "${CYAN}💡 Restart your IDE and Dart Analysis Server if needed.${NC}"
            echo -e "${CYAN}   In Trae/VS Code: Cmd+Shift+P -> 'Dart: Restart Analysis Server'${NC}"
            ;;
        2)
            replace_lib_folder
            replace_placeholders
            log_success "✅ Lib folder replacement finished!"
            ;;
        3)
            install_packages
            log_success "✅ Package installation finished!"
            ;;
        4)
            replace_placeholders
            log_success "✅ Placeholder replacement finished!"
            ;;
        5)
            clean_project
            log_success "✅ Project cleaning finished!"
            ;;
        6)
            setup_vscode_tasks
            log_success "✅ Development tasks setup finished!"
            ;;
        *)
            log_error "Invalid choice!"
            exit 1
            ;;
    esac
    
    echo -e "\n${GREEN}📱 Your Flutter project is ready for development!${NC}"
    echo -e "${CYAN}🔥 Happy coding with Trae!${NC}"
}

# Run main function
main "$@"