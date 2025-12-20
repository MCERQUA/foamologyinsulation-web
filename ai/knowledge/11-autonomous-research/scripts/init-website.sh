#!/bin/bash

##############################################################################
# Initialize Website for Autonomous Research
# Sets up research directory structure and configuration
#
# Usage: ./init-website.sh <website-slug>
##############################################################################

set -euo pipefail

TOOL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEBSITES_BASE="/home/josh/Josh-AI/websites"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ${NC} $*"; }
log_success() { echo -e "${GREEN}✓${NC} $*"; }
log_prompt() { echo -e "${YELLOW}?${NC} $*"; }

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <website-slug>"
    exit 1
fi

WEBSITE_SLUG="$1"
WEBSITE_DIR="$WEBSITES_BASE/$WEBSITE_SLUG"
RESEARCH_DIR="$WEBSITE_DIR/ai/knowledge/11-autonomous-research"

echo ""
echo "========================================"
echo "  Initialize Website for Research"
echo "========================================"
echo ""

# Validate website exists
if [ ! -d "$WEBSITE_DIR" ]; then
    echo "Error: Website directory not found: $WEBSITE_DIR"
    exit 1
fi

log_info "Website: $WEBSITE_SLUG"
log_info "Location: $WEBSITE_DIR"
echo ""

# Check if already initialized
if [ -d "$RESEARCH_DIR" ] && [ -f "$RESEARCH_DIR/config.json" ]; then
    log_info "Research directory already exists"
    read -p "Reinitialize? This will reset configuration (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. No changes made."
        exit 0
    fi
fi

# Create directory structure
log_info "Creating directory structure..."
mkdir -p "$RESEARCH_DIR"/{scripts,prompts,keywords,competitor-analysis,content-gaps,topic-clusters,content-planning,local-seo,service-pages,blog-planning,logs,.locks}

log_success "Directories created"
echo ""

# Collect website information
echo "══════════════════════════════════"
echo "  Website Configuration"
echo "══════════════════════════════════"
echo ""

log_prompt "Business name:"
read -r BUSINESS_NAME

log_prompt "Domain (e.g., example.com):"
read -r DOMAIN

log_prompt "Industry/niche:"
read -r INDUSTRY

log_prompt "Business description (one sentence):"
read -r DESCRIPTION

echo ""
log_prompt "Target markets (comma-separated cities/states):"
log_info "Example: Phoenix AZ, Scottsdale AZ, Mesa AZ"
read -r MARKETS
IFS=',' read -ra MARKETS_ARRAY <<< "$MARKETS"

echo ""
log_prompt "Services offered (comma-separated):"
log_info "Example: Service 1, Service 2, Service 3"
read -r SERVICES
IFS=',' read -ra SERVICES_ARRAY <<< "$SERVICES"

echo ""
log_prompt "Competitor URLs (comma-separated, max 5):"
log_info "Example: https://competitor1.com, https://competitor2.com"
read -r COMPETITORS
IFS=',' read -ra COMPETITORS_ARRAY <<< "$COMPETITORS"

echo ""
log_prompt "Primary keywords (comma-separated):"
log_info "Example: keyword 1, keyword 2, keyword 3"
read -r KEYWORDS
IFS=',' read -ra KEYWORDS_ARRAY <<< "$KEYWORDS"

echo ""
log_info "Creating configuration..."

# Create config.json
cat > "$RESEARCH_DIR/config.json" <<EOF
{
  "website": {
    "slug": "$WEBSITE_SLUG",
    "name": "$BUSINESS_NAME",
    "domain": "$DOMAIN",
    "paths": {
      "website_dir": "$WEBSITE_DIR",
      "research_dir": "$RESEARCH_DIR"
    }
  },
  "business": {
    "name": "$BUSINESS_NAME",
    "industry": "$INDUSTRY",
    "description": "$DESCRIPTION",
    "target_markets": [
$(printf '      "%s"' "${MARKETS_ARRAY[@]}" | sed 's/$/,/;$s/,$//')
    ],
    "services": [
$(printf '      "%s"' "${SERVICES_ARRAY[@]}" | sed 's/$/,/;$s/,$//')
    ],
    "competitors": [
$(printf '      "%s"' "${COMPETITORS_ARRAY[@]}" | sed 's/$/,/;$s/,$//')
    ],
    "primary_keywords": [
$(printf '      "%s"' "${KEYWORDS_ARRAY[@]}" | sed 's/$/,/;$s/,$//')
    ]
  },
  "research": {
    "status": "not_started",
    "started_at": null,
    "completed_at": null,
    "total_files": 0,
    "cron_installed": false
  }
}
EOF

log_success "Configuration created"
echo ""

# Copy scripts from tool
log_info "Copying research scripts..."
cp -r "$TOOL_DIR/scripts/"*.sh "$RESEARCH_DIR/scripts/" 2>/dev/null || true

# Make scripts executable
chmod +x "$RESEARCH_DIR/scripts/"*.sh

log_success "Scripts copied"
echo ""

# Generate prompts from templates
log_info "Generating research prompts..."
"$TOOL_DIR/scripts/generate-prompts.sh" "$RESEARCH_DIR/config.json"

log_success "Prompts generated"
echo ""

# Create README
cat > "$RESEARCH_DIR/README.md" <<EOF
# Autonomous Research - $BUSINESS_NAME

**Website:** $DOMAIN
**Initialized:** $(date '+%Y-%m-%d %H:%M:%S')
**Status:** Ready to run

## Quick Start

### Run Research
\`\`\`bash
cd /home/josh/Josh-AI/tools/website-autonomous-research
./scripts/run-research.sh $WEBSITE_SLUG
\`\`\`

### Monitor Progress
\`\`\`bash
cd $RESEARCH_DIR
./scripts/status.sh
\`\`\`

### Watch Live
\`\`\`bash
tail -f logs/scheduler.log
tail -f logs/supervisor-\$(date +%Y-%m-%d).log
\`\`\`

## Configuration

See \`config.json\` for full configuration details.

## Expected Output

After 8-24 hours:
- 500+ keywords researched
- 15-20 competitors analyzed
- 50+ content gaps identified
- 8-12 topic clusters planned
- 100+ content briefs created
- Complete local SEO strategies
- Service page specifications
- Blog editorial calendar

Total: 100+ files, 1-2MB of strategic intelligence

---

**Tool Location:** /home/josh/Josh-AI/tools/website-autonomous-research/
**Documentation:** /home/josh/Josh-AI/WEBSITE-AUTONOMOUS-RESEARCH-STANDARD.md
EOF

log_success "README created"
echo ""

echo "════════════════════════════════════"
log_success "Initialization Complete!"
echo "════════════════════════════════════"
echo ""

log_info "Configuration saved to:"
echo "  $RESEARCH_DIR/config.json"
echo ""

log_info "To start research, run:"
echo "  cd /home/josh/Josh-AI/tools/website-autonomous-research"
echo "  ./scripts/run-research.sh $WEBSITE_SLUG"
echo ""

exit 0
