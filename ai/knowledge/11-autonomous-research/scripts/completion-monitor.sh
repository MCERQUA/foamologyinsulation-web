#!/bin/bash

##############################################################################
# Completion Monitor
# Monitors research progress and auto-cleans up when complete
##############################################################################

set -euo pipefail

# Auto-detect paths from script location (when run from scripts/)
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")
CONFIG_FILE="$RESEARCH_DIR/config.json"
LOG_FILE="$RESEARCH_DIR/logs/completion-monitor.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "Completion monitor started for $WEBSITE_SLUG"

# Expected minimum file counts
declare -A MIN_FILES
MIN_FILES["keywords"]=5
MIN_FILES["competitor-analysis"]=8
MIN_FILES["content-gaps"]=8
MIN_FILES["topic-clusters"]=10
MIN_FILES["content-planning"]=10
MIN_FILES["local-seo"]=10
MIN_FILES["service-pages"]=15
MIN_FILES["blog-planning"]=10

# Monitor loop - check every 10 minutes
while true; do
    sleep 600  # 10 minutes

    log "Checking completion status..."

    # Count completed tasks
    COMPLETED=0
    TOTAL=8

    for dir in "${!MIN_FILES[@]}"; do
        if [ -d "$RESEARCH_DIR/$dir" ]; then
            COUNT=$(find "$RESEARCH_DIR/$dir" -type f \( -name "*.md" -o -name "*.csv" \) 2>/dev/null | wc -l)
            MIN=${MIN_FILES[$dir]}

            if [ "$COUNT" -ge "$MIN" ]; then
                COMPLETED=$((COMPLETED + 1))
                log "  ✓ $dir: $COUNT/$MIN files"
            else
                log "  ⏳ $dir: $COUNT/$MIN files"
            fi
        fi
    done

    log "Progress: $COMPLETED/$TOTAL tasks complete"

    # Check if all complete
    if [ "$COMPLETED" -eq "$TOTAL" ]; then
        log "========================================="
        log "ALL RESEARCH TASKS COMPLETE!"
        log "========================================="

        # Count total files
        TOTAL_FILES=$(find "$RESEARCH_DIR" -type f \( -name "*.md" -o -name "*.csv" \) 2>/dev/null | wc -l)
        log "Total files generated: $TOTAL_FILES"

        # Update config (if jq is available)
        if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
            TMP_CONFIG=$(mktemp)
            jq ".research.status = \"completed\" | .research.completed_at = now | .research.total_files = $TOTAL_FILES | .research.cron_installed = false" "$CONFIG_FILE" > "$TMP_CONFIG" 2>/dev/null || true
            mv "$TMP_CONFIG" "$CONFIG_FILE" 2>/dev/null || true
        fi

        # Create completion marker
        date '+%Y-%m-%d %H:%M:%S' > "$RESEARCH_DIR/.research-complete"
        log "Completion marker created"

        # Remove running lock
        rm -f "$RESEARCH_DIR/.research-running"

        # Remove cron jobs
        log "Removing cron jobs..."
        crontab -l 2>/dev/null | grep -v "$RESEARCH_DIR" > /tmp/crontab.tmp || true
        crontab /tmp/crontab.tmp 2>/dev/null || true
        rm -f /tmp/crontab.tmp
        log "Cron jobs removed"

        # Send notification if available
        if [ -f "$HOME/.claude/slack-notification-channels.sh" ]; then
            source "$HOME/.claude/slack-notification-channels.sh" 2>/dev/null || true
            notify_status "✅ Research complete for $WEBSITE_SLUG! Generated $TOTAL_FILES files." 2>/dev/null || true
        fi

        log "========================================="
        log "Research system shut down successfully"
        log "Website is now research-ready!"
        log "========================================="

        exit 0
    fi

    # Check if it's been running for more than 48 hours
    if [ -f "$RESEARCH_DIR/.research-running" ]; then
        START_TIME=$(stat -c %Y "$RESEARCH_DIR/.research-running")
        CURRENT_TIME=$(date +%s)
        ELAPSED=$((CURRENT_TIME - START_TIME))

        # 48 hours = 172800 seconds
        if [ "$ELAPSED" -gt 172800 ]; then
            log "WARNING: Research has been running for >48 hours"
            log "This may indicate an issue. Check logs manually."

            # Send warning notification
            if [ -f "$HOME/.claude/slack-notification-channels.sh" ]; then
                source "$HOME/.claude/slack-notification-channels.sh" 2>/dev/null || true
                notify_status "⚠️ Research for $WEBSITE_SLUG has been running >48 hours. Progress: $COMPLETED/$TOTAL" 2>/dev/null || true
            fi
        fi
    fi
done
