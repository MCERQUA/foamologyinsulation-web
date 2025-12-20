#!/bin/bash

##############################################################################
# Install Cron Jobs - Temporary cron installation for research
# Parameterized version - works with any website
##############################################################################

set -euo pipefail

# Auto-detect paths from script location
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"

# Extract website slug from path
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")

echo "========================================="
echo "  Installing Cron Jobs"
echo "  Website: $WEBSITE_SLUG"
echo "========================================="
echo ""

# Backup crontab
crontab -l > "$HOME/crontab-backup-$(date +%Y%m%d-%H%M%S).txt" 2>/dev/null || true

# Create temp cron file
TEMP_CRON=$(mktemp)

# Get existing crontab
crontab -l 2>/dev/null > "$TEMP_CRON" || true

# Remove any existing cron jobs for THIS website
sed -i "/$WEBSITE_SLUG/d" "$TEMP_CRON"
sed -i "\|$RESEARCH_DIR|d" "$TEMP_CRON"

# Add new cron jobs
cat >> "$TEMP_CRON" <<EOF

# Autonomous Research System - $WEBSITE_SLUG
# Task Scheduler - every 5 minutes
*/5 * * * * $SCRIPTS_DIR/task-scheduler.sh >> $RESEARCH_DIR/logs/cron.log 2>&1

# Supervisor Agent - every 10 minutes
*/10 * * * * $SCRIPTS_DIR/supervisor-agent.sh >> $RESEARCH_DIR/logs/cron.log 2>&1

# Recovery Monitor - every 10 minutes
*/10 * * * * $SCRIPTS_DIR/recovery-monitor.sh >> $RESEARCH_DIR/logs/cron.log 2>&1

EOF

# Install new crontab
crontab "$TEMP_CRON"
rm "$TEMP_CRON"

echo "✅ Cron jobs installed successfully!"
echo ""
echo "Research will run autonomously for $WEBSITE_SLUG"
echo ""
echo "Scheduled tasks:"
echo "  - Task Scheduler: Every 5 minutes"
echo "  - Supervisor Agent: Every 10 minutes"
echo "  - Recovery Monitor: Every 10 minutes"
echo ""
echo "Logs: $RESEARCH_DIR/logs/"
echo ""
echo "To view current crontab:"
echo "  crontab -l"
echo ""
echo "========================================="
echo "System is now running autonomously!"
echo "========================================="
echo ""

exit 0
