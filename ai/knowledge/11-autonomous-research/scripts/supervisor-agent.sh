#!/bin/bash

##############################################################################
# Autonomous Research Supervisor Agent
# Monitors all research tasks, ensures quality, and fixes issues
# This is the "crack the whip" agent that keeps everything on track
##############################################################################

set -euo pipefail

# Configuration - Auto-detect paths
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
LOGS_DIR="$RESEARCH_DIR/logs"
LOCK_DIR="$RESEARCH_DIR/.locks"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")
SUPERVISOR_LOG="$LOGS_DIR/supervisor-$(date '+%Y-%m-%d').log"

# Ensure log directory exists
mkdir -p "$LOGS_DIR"

# Logging function
log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$SUPERVISOR_LOG"
}

# Notification function
notify() {
    local message="$1"
    if [ -f "$HOME/.claude/slack-notification-channels.sh" ]; then
        source "$HOME/.claude/slack-notification-channels.sh"
        notify_status "👁️ Supervisor: $message" 2>/dev/null || true
    fi
}

# Quality check function
notify_quality() {
    local level="$1"
    local message="$2"
    if [ -f "$HOME/.claude/slack-notification-channels.sh" ]; then
        source "$HOME/.claude/slack-notification-channels.sh"
        if [ "$level" = "PASS" ]; then
            notify_status "✅ Quality Check PASSED: $message" 2>/dev/null || true
        elif [ "$level" = "FAIL" ]; then
            notify_status "❌ Quality Check FAILED: $message" 2>/dev/null || true
        else
            notify_status "⚠️ Quality Check WARNING: $message" 2>/dev/null || true
        fi
    fi
}

log "INFO" "========================================="
log "INFO" "Supervisor Agent Starting"
log "INFO" "========================================="

# Define expected tasks and their output requirements
declare -A TASK_OUTPUTS
TASK_OUTPUTS["01-keyword-research"]="keywords:5"
TASK_OUTPUTS["02-competitor-analysis"]="competitor-analysis:8"
TASK_OUTPUTS["03-content-gap-analysis"]="content-gaps:8"
TASK_OUTPUTS["04-topic-cluster-planning"]="topic-clusters:10"
TASK_OUTPUTS["05-content-planning"]="content-planning:10"
TASK_OUTPUTS["06-local-seo-research"]="local-seo:10"
TASK_OUTPUTS["07-service-page-planning"]="service-pages:15"
TASK_OUTPUTS["08-blog-content-planning"]="blog-planning:10"

# Check for hung processes
log "INFO" "Checking for hung or stale processes..."
shopt -s nullglob
for lock_file in "$LOCK_DIR"/*.lock; do
    if [ -f "$lock_file" ]; then
        LOCK_AGE=$(($(date +%s) - $(stat -c %Y "$lock_file")))
        TASK_NAME=$(basename "$lock_file" .lock)

        if [ $LOCK_AGE -gt 3600 ]; then
            log "WARN" "Found stale lock for $TASK_NAME (${LOCK_AGE}s old)"
            notify_quality "WARN" "$TASK_NAME has been running for ${LOCK_AGE}s - may be hung"

            # If over 2 hours, force restart
            if [ $LOCK_AGE -gt 7200 ]; then
                log "WARN" "Removing stale lock and restarting $TASK_NAME"
                rm -f "$lock_file"
                notify_quality "FAIL" "$TASK_NAME force-restarted after ${LOCK_AGE}s"

                # Restart the task
                nohup "$SCRIPTS_DIR/execute-research-task.sh" "$TASK_NAME" >/dev/null 2>&1 &
                log "INFO" "Restarted $TASK_NAME"
            fi
        else
            log "INFO" "$TASK_NAME is running (${LOCK_AGE}s elapsed)"
        fi
    fi
done

# Check output quality for each task
log "INFO" "Performing quality checks on completed tasks..."

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

for task in "${!TASK_OUTPUTS[@]}"; do
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    IFS=':' read -r output_dir min_files <<< "${TASK_OUTPUTS[$task]}"
    OUTPUT_PATH="$RESEARCH_DIR/$output_dir"

    if [ -d "$OUTPUT_PATH" ]; then
        FILE_COUNT=$(find "$OUTPUT_PATH" -type f -name "*.md" -o -name "*.csv" 2>/dev/null | wc -l)

        log "INFO" "Checking $task: Found $FILE_COUNT files (expected: $min_files+)"

        if [ "$FILE_COUNT" -ge "$min_files" ]; then
            # Check file sizes - files should be substantial
            SMALL_FILES=$(find "$OUTPUT_PATH" -type f \( -name "*.md" -o -name "*.csv" \) -size -1k 2>/dev/null | wc -l)

            if [ "$SMALL_FILES" -gt 0 ]; then
                log "WARN" "$task has $SMALL_FILES suspiciously small files"
                notify_quality "WARN" "$task - $SMALL_FILES files under 1KB"
                WARNING_CHECKS=$((WARNING_CHECKS + 1))
            else
                log "INFO" "$task PASSED quality check"
                PASSED_CHECKS=$((PASSED_CHECKS + 1))
            fi

            # Check for actual content in files
            EMPTY_FILES=$(find "$OUTPUT_PATH" -type f \( -name "*.md" -o -name "*.csv" \) -empty 2>/dev/null | wc -l)
            if [ "$EMPTY_FILES" -gt 0 ]; then
                log "ERROR" "$task has $EMPTY_FILES empty files!"
                notify_quality "FAIL" "$task - $EMPTY_FILES empty files found"
                FAILED_CHECKS=$((FAILED_CHECKS + 1))
            fi
        else
            log "WARN" "$task has insufficient files: $FILE_COUNT < $min_files"
            notify_quality "WARN" "$task - Only $FILE_COUNT/$min_files files created"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))

            # If task has very few files and no lock, restart it
            if [ "$FILE_COUNT" -lt 2 ] && [ ! -f "$LOCK_DIR/${task}.lock" ]; then
                log "INFO" "Restarting incomplete task: $task"
                notify "Restarting incomplete task: $task"
                nohup "$SCRIPTS_DIR/execute-research-task.sh" "$task" >/dev/null 2>&1 &
            fi
        fi
    else
        log "ERROR" "$task output directory does not exist: $OUTPUT_PATH"
        notify_quality "FAIL" "$task - Output directory missing"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))

        # Start the task if not locked
        if [ ! -f "$LOCK_DIR/${task}.lock" ]; then
            log "INFO" "Starting missing task: $task"
            notify "Starting missing task: $task"
            nohup "$SCRIPTS_DIR/execute-research-task.sh" "$task" >/dev/null 2>&1 &
        fi
    fi
done

# Generate summary report
log "INFO" "========================================="
log "INFO" "Supervisor Summary"
log "INFO" "========================================="
log "INFO" "Total Checks: $TOTAL_CHECKS"
log "INFO" "Passed: $PASSED_CHECKS"
log "INFO" "Warnings: $WARNING_CHECKS"
log "INFO" "Failed: $FAILED_CHECKS"
log "INFO" "========================================="

# Send summary notification
SUMMARY_MSG="Checked $TOTAL_CHECKS tasks | ✅ $PASSED_CHECKS | ⚠️ $WARNING_CHECKS | ❌ $FAILED_CHECKS"
notify "$SUMMARY_MSG"

# Check overall progress
TOTAL_FILES=$(find "$RESEARCH_DIR" -type f \( -name "*.md" -o -name "*.csv" \) 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$RESEARCH_DIR" 2>/dev/null | cut -f1)
log "INFO" "Total research files: $TOTAL_FILES"
log "INFO" "Total research size: $TOTAL_SIZE"

# Generate progress report
PROGRESS_REPORT="$LOGS_DIR/progress-report-$(date '+%Y-%m-%d-%H%M').md"
{
    echo "# Autonomous Research Progress Report"
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "## Summary"
    echo "- Total Files Created: $TOTAL_FILES"
    echo "- Total Storage Used: $TOTAL_SIZE"
    echo "- Quality Checks: $PASSED_CHECKS passed, $WARNING_CHECKS warnings, $FAILED_CHECKS failed"
    echo ""
    echo "## Task Status"
    echo ""

    for task in "${!TASK_OUTPUTS[@]}"; do
        IFS=':' read -r output_dir min_files <<< "${TASK_OUTPUTS[$task]}"
        OUTPUT_PATH="$RESEARCH_DIR/$output_dir"

        if [ -d "$OUTPUT_PATH" ]; then
            FILE_COUNT=$(find "$OUTPUT_PATH" -type f 2>/dev/null | wc -l)
            DIR_SIZE=$(du -sh "$OUTPUT_PATH" 2>/dev/null | cut -f1)

            if [ -f "$LOCK_DIR/${task}.lock" ]; then
                STATUS="🔄 Running"
            elif [ "$FILE_COUNT" -ge "$min_files" ]; then
                STATUS="✅ Complete"
            else
                STATUS="⚠️ Incomplete"
            fi

            echo "### $task"
            echo "- Status: $STATUS"
            echo "- Files: $FILE_COUNT"
            echo "- Size: $DIR_SIZE"
            echo ""
        else
            echo "### $task"
            echo "- Status: ❌ Not Started"
            echo ""
        fi
    done

    echo "## Recent Activity"
    echo ""
    echo "\`\`\`"
    tail -20 "$SUPERVISOR_LOG" 2>/dev/null || echo "No recent activity"
    echo "\`\`\`"

} > "$PROGRESS_REPORT"

log "INFO" "Progress report saved: $PROGRESS_REPORT"

# Check for system resources
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
DISK_USAGE=$(df -h "$RESEARCH_DIR" | tail -1 | awk '{print $5}' | tr -d '%')

log "INFO" "System load: $LOAD_AVG"
log "INFO" "Disk usage: ${DISK_USAGE}%"

if [ "${DISK_USAGE}" -gt 80 ]; then
    log "WARN" "Disk usage is high: ${DISK_USAGE}%"
    notify "⚠️ Disk usage high: ${DISK_USAGE}%"
fi

log "INFO" "Supervisor check complete"
exit 0
