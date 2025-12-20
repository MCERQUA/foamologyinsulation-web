#!/bin/bash

##############################################################################
# Website Autonomous Research - Manual Execution
# One-time research process for a website project
#
# Usage: ./run-research.sh <website-slug>
# Example: ./run-research.sh arizonainsulationremoval
##############################################################################

set -euo pipefail

TOOL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEBSITES_BASE="/home/josh/Josh-AI/websites"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $*"
}

log_success() {
    echo -e "${GREEN}✓${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $*"
}

log_error() {
    echo -e "${RED}✗${NC} $*"
}

# Check arguments
if [ $# -lt 1 ]; then
    log_error "Usage: $0 <website-slug>"
    log_info "Example: $0 arizonainsulationremoval"
    log_info ""
    log_info "Available websites:"
    ls -1 "$WEBSITES_BASE" 2>/dev/null | grep -v "^test-" | sed 's/^/  - /'
    exit 1
fi

WEBSITE_SLUG="$1"
WEBSITE_DIR="$WEBSITES_BASE/$WEBSITE_SLUG"
RESEARCH_DIR="$WEBSITE_DIR/ai/knowledge/11-autonomous-research"
CONFIG_FILE="$RESEARCH_DIR/config.json"

echo ""
echo "========================================"
echo "  Website Autonomous Research System"
echo "========================================"
echo ""

# Validate website exists
if [ ! -d "$WEBSITE_DIR" ]; then
    log_error "Website directory not found: $WEBSITE_DIR"
    log_info "Available websites:"
    ls -1 "$WEBSITES_BASE" 2>/dev/null | grep -v "^test-" | sed 's/^/  - /'
    exit 1
fi

log_info "Website: $WEBSITE_SLUG"
log_info "Location: $WEBSITE_DIR"
echo ""

# Check if research directory exists
if [ ! -d "$RESEARCH_DIR" ]; then
    log_warn "Research directory not found. Initializing..."
    echo ""

    # Run initialization
    "$TOOL_DIR/scripts/init-website.sh" "$WEBSITE_SLUG"

    if [ ! -d "$RESEARCH_DIR" ]; then
        log_error "Initialization failed"
        exit 1
    fi

    log_success "Initialization complete"
    echo ""
fi

# Check if config exists
if [ ! -f "$CONFIG_FILE" ]; then
    log_error "Configuration file not found: $CONFIG_FILE"
    log_info "Please run: $TOOL_DIR/scripts/init-website.sh $WEBSITE_SLUG"
    exit 1
fi

# Check if research already complete
if [ -f "$RESEARCH_DIR/.research-complete" ]; then
    log_warn "Research already complete for this website!"
    log_info "Completed: $(cat "$RESEARCH_DIR/.research-complete")"
    echo ""
    read -p "Do you want to re-run research? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Exiting. No changes made."
        exit 0
    fi
    rm -f "$RESEARCH_DIR/.research-complete"
fi

# Check if research is currently running
if [ -f "$RESEARCH_DIR/.research-running" ]; then
    log_warn "Research is already running for this website!"
    RUNNING_PID=$(cat "$RESEARCH_DIR/.research-running" 2>/dev/null || echo "unknown")
    log_info "Started: $(stat -c %y "$RESEARCH_DIR/.research-running" 2>/dev/null || echo "unknown")"
    log_info "PID: $RUNNING_PID"
    echo ""

    # Check if process is actually running
    if [ "$RUNNING_PID" != "unknown" ] && ps -p "$RUNNING_PID" > /dev/null 2>&1; then
        log_info "Process is actively running"
        log_info "To monitor: cd $RESEARCH_DIR && ./scripts/status.sh"
        exit 0
    else
        log_warn "Process appears to be dead. Cleaning up stale lock..."
        rm -f "$RESEARCH_DIR/.research-running"
    fi
fi

echo ""
log_info "════════════════════════════════════════"
log_info "  Starting Autonomous Research Process"
log_info "════════════════════════════════════════"
echo ""

# Create running lock
echo "$$" > "$RESEARCH_DIR/.research-running"
trap 'rm -f "$RESEARCH_DIR/.research-running"' EXIT

log_success "Starting research process"
echo ""

# Install temporary cron jobs
log_info "Installing temporary cron jobs..."
"$RESEARCH_DIR/scripts/install-cron-jobs.sh"
log_success "Cron jobs installed"
echo ""

# Show status
log_info "Research system is now running autonomously"
log_info ""
log_info "Expected duration: 8-24 hours"
log_info "Expected output: 100+ files (1-2MB)"
echo ""

# Monitoring instructions
log_info "════════════════════════════════════════"
log_info "  Monitoring Commands"
log_info "════════════════════════════════════════"
echo ""
echo "  Quick status:"
echo "    cd $RESEARCH_DIR"
echo "    ./scripts/status.sh"
echo ""
echo "  Watch live:"
echo "    tail -f $RESEARCH_DIR/logs/scheduler.log"
echo "    tail -f $RESEARCH_DIR/logs/supervisor-\$(date +%Y-%m-%d).log"
echo ""
echo "  Progress reports:"
echo "    ls -t $RESEARCH_DIR/logs/progress-report-*.md | head -1 | xargs cat"
echo ""

# Launch completion monitor in background
nohup "$RESEARCH_DIR/scripts/completion-monitor.sh" >> "$RESEARCH_DIR/logs/completion-monitor.log" 2>&1 &
MONITOR_PID=$!

log_info "Completion monitor started (PID: $MONITOR_PID)"
log_info "Will auto-cleanup when research completes"
echo ""

log_success "Research process initiated successfully!"
echo ""
log_info "You can close this terminal. Research will continue in background."
log_info "Check status anytime with: cd $RESEARCH_DIR && ./scripts/status.sh"
echo ""

exit 0
