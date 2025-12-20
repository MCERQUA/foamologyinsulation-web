#!/bin/bash

##############################################################################
# Execute Research Task - Runs Claude Code with research prompts
# Parameterized version - works with any website
##############################################################################

set -euo pipefail

# Auto-detect paths from script location
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
PROMPTS_DIR="$RESEARCH_DIR/prompts"
LOGS_DIR="$RESEARCH_DIR/logs"
LOCK_DIR="$RESEARCH_DIR/.locks"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"

# Extract website slug from path for logging
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")

# Create directories
mkdir -p "$LOGS_DIR" "$LOCK_DIR"

# Log function
log() {
    local level="$1"
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] [$WEBSITE_SLUG] $*" | tee -a "$LOGS_DIR/executor.log"
}

# Notification function
notify() {
    local message="$1"
    if [ -f "$HOME/.claude/slack-notification-channels.sh" ]; then
        (
            set +u
            source "$HOME/.claude/slack-notification-channels.sh" 2>/dev/null || true
            notify_status "🤖 [$WEBSITE_SLUG] $message" 2>/dev/null || true
        ) || true
    fi
}

# Check arguments
if [ $# -lt 1 ]; then
    log "ERROR" "Usage: $0 <task-number-and-name>"
    exit 1
fi

TASK_NAME="$1"
PROMPT_FILE="$PROMPTS_DIR/${TASK_NAME}.txt"
LOCK_FILE="$LOCK_DIR/${TASK_NAME}.lock"
LOG_FILE="$LOGS_DIR/${TASK_NAME}-$(date '+%Y%m%d-%H%M%S').log"

# Check if prompt exists
if [ ! -f "$PROMPT_FILE" ]; then
    log "ERROR" "Prompt file not found: $PROMPT_FILE"
    exit 1
fi

# Check for lock file
if [ -f "$LOCK_FILE" ]; then
    LOCK_AGE=$(($(date +%s) - $(stat -c %Y "$LOCK_FILE" 2>/dev/null || echo 0)))
    if [ $LOCK_AGE -lt 3600 ]; then
        log "WARN" "Task $TASK_NAME is already running. Skipping."
        exit 0
    else
        log "WARN" "Stale lock detected. Removing and continuing."
        rm -f "$LOCK_FILE"
    fi
fi

# Create lock
echo "$$" > "$LOCK_FILE"
log "INFO" "Starting task: $TASK_NAME (PID: $$)"
notify "Starting $TASK_NAME"

# Cleanup function
cleanup() {
    local exit_code=$?
    rm -f "$LOCK_FILE"
    if [ $exit_code -eq 0 ]; then
        log "INFO" "Task $TASK_NAME completed successfully"
        notify "✅ Completed $TASK_NAME"
    else
        log "ERROR" "Task $TASK_NAME failed with exit code $exit_code"
        notify "❌ Failed $TASK_NAME (exit code: $exit_code)"
    fi
}
trap cleanup EXIT

# Read prompt
PROMPT=$(cat "$PROMPT_FILE")

# Change to website directory
cd "$WEBSITE_DIR"

# Execute Claude Code
log "INFO" "Executing Claude Code for $TASK_NAME"
log "INFO" "Prompt length: ${#PROMPT} characters"
log "INFO" "Log file: $LOG_FILE"

FULL_PROMPT="$PROMPT

═══════════════════════════════════════════════════════════
⚠️  CRITICAL EXECUTION REQUIREMENTS ⚠️
═══════════════════════════════════════════════════════════

YOU MUST COMPLETE THIS ENTIRE TASK IN ONE EXECUTION.

1. CREATE ALL REQUIRED FILES - Do not stop after creating only 1-2 files
2. COMPLETE EACH FILE FULLY - No placeholder content or "TODO" sections
3. WORK SYSTEMATICALLY - Go through each deliverable in order
4. NO QUESTIONS - Make reasonable assumptions if unclear
5. BE COMPREHENSIVE - Each file should be detailed and thorough
6. VERIFY COMPLETION - Before finishing, confirm all files exist

FAILURE TO COMPLETE ALL DELIVERABLES IS NOT ACCEPTABLE.

When you have created ALL required files, output: 'TASK COMPLETE: $TASK_NAME - ALL DELIVERABLES CREATED'

BEGIN EXECUTION NOW.
═══════════════════════════════════════════════════════════"

# Write prompt to temporary file
PROMPT_TEMP_FILE="$LOCK_DIR/${TASK_NAME}-prompt.txt"
echo "$FULL_PROMPT" > "$PROMPT_TEMP_FILE"

if timeout 3600 claude --print --dangerously-skip-permissions < "$PROMPT_TEMP_FILE" 2>&1 | tee "$LOG_FILE"
then
    log "INFO" "Claude Code execution completed"
    rm -f "$PROMPT_TEMP_FILE"

    # Check output
    TASK_NUM=$(echo "$TASK_NAME" | cut -d'-' -f1)
    case "$TASK_NUM" in
        "01") OUTPUT_DIR="$RESEARCH_DIR/keywords" ;;
        "02") OUTPUT_DIR="$RESEARCH_DIR/competitor-analysis" ;;
        "03") OUTPUT_DIR="$RESEARCH_DIR/content-gaps" ;;
        "04") OUTPUT_DIR="$RESEARCH_DIR/topic-clusters" ;;
        "05") OUTPUT_DIR="$RESEARCH_DIR/content-planning" ;;
        "06") OUTPUT_DIR="$RESEARCH_DIR/local-seo" ;;
        "07") OUTPUT_DIR="$RESEARCH_DIR/service-pages" ;;
        "08") OUTPUT_DIR="$RESEARCH_DIR/blog-planning" ;;
        *) OUTPUT_DIR="$RESEARCH_DIR" ;;
    esac

    FILE_COUNT=$(find "$OUTPUT_DIR" -type f -newer "$LOCK_FILE" 2>/dev/null | wc -l)
    log "INFO" "Created/modified $FILE_COUNT files in $OUTPUT_DIR"

    if [ "$FILE_COUNT" -gt 0 ]; then
        log "INFO" "Task produced output successfully"
    else
        log "WARN" "Task completed but no new files detected"
    fi
else
    log "ERROR" "Claude Code execution failed or timed out"
    exit 1
fi

exit 0
