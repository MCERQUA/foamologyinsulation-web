#!/bin/bash

##############################################################################
# Recovery Monitor - Fixes stale locks and crashed processes
# Parameterized version - works with any website
##############################################################################

# Auto-detect paths from script location
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"

# Extract website slug from path
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")

LOG_FILE="$RESEARCH_DIR/logs/recovery-$(date +%Y-%m-%d).log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$WEBSITE_SLUG] $1" | tee -a "$LOG_FILE"
}

log "========================================"
log "Recovery Monitor Check Starting"
log "========================================"

cd "$RESEARCH_DIR"

# Check for stale locks (older than 2 hours)
STALE_THRESHOLD=7200
CURRENT_TIME=$(date +%s)

for lock_file in .locks/*.lock; do
    if [ -f "$lock_file" ]; then
        LOCK_TIME=$(stat -c %Y "$lock_file")
        AGE=$((CURRENT_TIME - LOCK_TIME))

        if [ $AGE -gt $STALE_THRESHOLD ]; then
            TASK_NAME=$(basename "$lock_file" .lock)
            log "FIXING: Removing stale lock for $TASK_NAME (${AGE}s old)"
            rm -f "$lock_file"
            log "FIXED: Cleared stale lock for $TASK_NAME"
        fi
    fi
done

# Check for crashed/zombie processes
for lock_file in .locks/*.lock; do
    if [ -f "$lock_file" ]; then
        PID=$(cat "$lock_file" 2>/dev/null)
        if [ -n "$PID" ]; then
            if ! ps -p "$PID" > /dev/null 2>&1; then
                TASK_NAME=$(basename "$lock_file" .lock")
                log "FIXING: Process $PID for $TASK_NAME is dead but lock exists"
                rm -f "$lock_file"
                log "FIXED: Cleared lock for dead process"
            fi
        fi
    fi
done

# Check if tasks are producing output
check_task_output() {
    local task_name=$1
    local output_dir=$2
    local lock_file=".locks/${task_name}.lock"

    if [ -f "$lock_file" ]; then
        FILE_COUNT=$(find "$output_dir" -type f 2>/dev/null | wc -l)
        LOCK_AGE=$((CURRENT_TIME - $(stat -c %Y "$lock_file")))

        # If running for >30 min with 0 files, something is wrong
        if [ $LOCK_AGE -gt 1800 ] && [ $FILE_COUNT -eq 0 ]; then
            log "FIXING: Task $task_name running for ${LOCK_AGE}s but produced no files"
            rm -f "$lock_file"
            log "FIXED: Cleared non-productive task lock"
        fi
    fi
}

check_task_output "01-keyword-research" "keywords"
check_task_output "02-competitor-analysis" "competitor-analysis"
check_task_output "03-content-gap-analysis" "content-gaps"
check_task_output "04-topic-cluster-planning" "topic-clusters"
check_task_output "05-content-planning" "content-planning"
check_task_output "06-local-seo-research" "local-seo"
check_task_output "07-service-page-planning" "service-pages"
check_task_output "08-blog-content-planning" "blog-planning"

log "Recovery Monitor Check Complete"
log ""

exit 0
