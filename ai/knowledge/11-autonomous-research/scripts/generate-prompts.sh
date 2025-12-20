#!/bin/bash

##############################################################################
# Generate Prompts - Convert templates to actual prompts using config
##############################################################################

set -euo pipefail

CONFIG_FILE="$1"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Config file not found: $CONFIG_FILE"
    exit 1
fi

# Get paths from config
RESEARCH_DIR=$(dirname "$CONFIG_FILE")
PROMPTS_DIR="$RESEARCH_DIR/prompts"
TOOL_DIR="/home/josh/Josh-AI/tools/website-autonomous-research"
TEMPLATES_DIR="$TOOL_DIR/prompts-templates"

# Load config variables
WEBSITE_SLUG=$(jq -r '.website.slug' "$CONFIG_FILE")
WEBSITE_NAME=$(jq -r '.website.name' "$CONFIG_FILE")
BUSINESS_NAME=$(jq -r '.business.name' "$CONFIG_FILE")
INDUSTRY=$(jq -r '.business.industry' "$CONFIG_FILE")
DESCRIPTION=$(jq -r '.business.description' "$CONFIG_FILE")
DOMAIN=$(jq -r '.website.domain' "$CONFIG_FILE")
WEBSITE_DIR=$(jq -r '.website.paths.website_dir' "$CONFIG_FILE")

# Convert arrays to comma-separated strings
TARGET_MARKETS=$(jq -r '.business.target_markets | join(", ")' "$CONFIG_FILE")
SERVICES=$(jq -r '.business.services | join(", ")' "$CONFIG_FILE")
COMPETITORS=$(jq -r '.business.competitors | join(", ")' "$CONFIG_FILE")
PRIMARY_KEYWORDS=$(jq -r '.business.primary_keywords | join(", ")' "$CONFIG_FILE")

mkdir -p "$PROMPTS_DIR"

echo "Generating prompts for $WEBSITE_NAME..."
echo ""

# Process each template
for template in "$TEMPLATES_DIR"/*.txt.template; do
    if [ ! -f "$template" ]; then
        continue
    fi

    BASENAME=$(basename "$template" .template)
    OUTPUT_FILE="$PROMPTS_DIR/$BASENAME"

    echo "  Generating $BASENAME..."

    # Replace all variables
    sed -e "s|{{WEBSITE_SLUG}}|$WEBSITE_SLUG|g" \
        -e "s|{{WEBSITE_NAME}}|$WEBSITE_NAME|g" \
        -e "s|{{BUSINESS_NAME}}|$BUSINESS_NAME|g" \
        -e "s|{{INDUSTRY}}|$INDUSTRY|g" \
        -e "s|{{DESCRIPTION}}|$DESCRIPTION|g" \
        -e "s|{{DOMAIN}}|$DOMAIN|g" \
        -e "s|{{TARGET_MARKETS}}|$TARGET_MARKETS|g" \
        -e "s|{{SERVICES}}|$SERVICES|g" \
        -e "s|{{COMPETITORS}}|$COMPETITORS|g" \
        -e "s|{{PRIMARY_KEYWORDS}}|$PRIMARY_KEYWORDS|g" \
        -e "s|{{WEBSITE_DIR}}|$WEBSITE_DIR|g" \
        -e "s|{{RESEARCH_DIR}}|$RESEARCH_DIR|g" \
        "$template" > "$OUTPUT_FILE"
done

echo ""
echo "✅ Prompts generated successfully!"
echo "Location: $PROMPTS_DIR"
echo ""

exit 0
