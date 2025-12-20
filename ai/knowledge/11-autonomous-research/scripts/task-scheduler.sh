#!/bin/bash

##############################################################################
# Task Scheduler - Manages proper sequencing of research tasks
# Parameterized version - works with any website
##############################################################################

set -euo pipefail

# Auto-detect paths from script location
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
LOGS_DIR="$RESEARCH_DIR/logs"
LOCK_DIR="$RESEARCH_DIR/.locks"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"

# Extract website slug from path for logging
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")

# Create directories
mkdir -p "$LOGS_DIR" "$LOCK_DIR"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$WEBSITE_SLUG] $*" >> "$LOGS_DIR/scheduler.log"
}

log "Scheduler check starting..."

# Define task dependencies and priority
declare -A TASKS
TASKS["01-keyword-research"]="1:"
TASKS["02-competitor-analysis"]="1:"
TASKS["03-content-gap-analysis"]="2:01-keyword-research,02-competitor-analysis"
TASKS["04-topic-cluster-planning"]="2:01-keyword-research,03-content-gap-analysis"
TASKS["05-content-planning"]="3:03-content-gap-analysis,04-topic-cluster-planning"
TASKS["06-local-seo-research"]="2:01-keyword-research,02-competitor-analysis"
TASKS["07-service-page-planning"]="3:03-content-gap-analysis,04-topic-cluster-planning"
TASKS["08-blog-content-planning"]="3:04-topic-cluster-planning,05-content-planning"

# Function to check if a task is complete
is_task_complete() {
    local task="$1"

    case "$task" in
        "01-keyword-research")
            [ -d "$RESEARCH_DIR/keywords" ] && [ "$(find "$RESEARCH_DIR/keywords" -type f | wc -l)" -ge 5 ]
            ;;
        "02-competitor-analysis")
            [ -d "$RESEARCH_DIR/competitor-analysis" ] && [ "$(find "$RESEARCH_DIR/competitor-analysis" -type f | wc -l)" -ge 8 ]
            ;;
        "03-content-gap-analysis")
            [ -d "$RESEARCH_DIR/content-gaps" ] && [ "$(find "$RESEARCH_DIR/content-gaps" -type f | wc -l)" -ge 8 ]
            ;;
        "04-topic-cluster-planning")
            [ -d "$RESEARCH_DIR/topic-clusters" ] && [ "$(find "$RESEARCH_DIR/topic-clusters" -type f | wc -l)" -ge 10 ]
            ;;
        "05-content-planning")
            [ -d "$RESEARCH_DIR/content-planning" ] && [ "$(find "$RESEARCH_DIR/content-planning" -type f | wc -l)" -ge 10 ]
            ;;
        "06-local-seo-research")
            [ -d "$RESEARCH_DIR/local-seo" ] && [ "$(find "$RESEARCH_DIR/local-seo" -type f | wc -l)" -ge 10 ]
            ;;
        "07-service-page-planning")
            [ -d "$RESEARCH_DIR/service-pages" ] && [ "$(find "$RESEARCH_DIR/service-pages" -type f | wc -l)" -ge 15 ]
            ;;
        "08-blog-content-planning")
            [ -d "$RESEARCH_DIR/blog-planning" ] && [ "$(find "$RESEARCH_DIR/blog-planning" -type f | wc -l)" -ge 10 ]
            ;;
        *)
            return 1
            ;;
    esac
}

# Function to check if a task is running
is_task_running() {
    local task="$1"
    [ -f "$LOCK_DIR/${task}.lock" ]
}

# Function to check if dependencies are met
dependencies_met() {
    local task="$1"
    IFS=':' read -r slot deps <<< "${TASKS[$task]}"

    if [ -z "$deps" ]; then
        return 0
    fi

    IFS=',' read -ra DEP_ARRAY <<< "$deps"
    for dep in "${DEP_ARRAY[@]}"; do
        if ! is_task_complete "$dep"; then
            log "$task waiting for dependency: $dep"
            return 1
        fi
    done

    return 0
}

# Function to get current running tasks in a slot
get_slot_count() {
    local slot="$1"
    local count=0

    for task in "${!TASKS[@]}"; do
        IFS=':' read -r task_slot _ <<< "${TASKS[$task]}"
        if [ "$task_slot" = "$slot" ] && is_task_running "$task"; then
            count=$((count + 1))
        fi
    done

    echo "$count"
}

# Main scheduling logic
STARTED_ANY=0

for slot in 1 2 3; do
    SLOT_COUNT=$(get_slot_count "$slot")

    if [ "$SLOT_COUNT" -ge 2 ]; then
        log "Slot $slot has $SLOT_COUNT running tasks (max 2). Skipping."
        continue
    fi

    for task in "${!TASKS[@]}"; do
        IFS=':' read -r task_slot _ <<< "${TASKS[$task]}"

        if [ "$task_slot" != "$slot" ]; then
            continue
        fi

        if is_task_complete "$task"; then
            continue
        fi

        if is_task_running "$task"; then
            continue
        fi

        if ! dependencies_met "$task"; then
            continue
        fi

        SLOT_COUNT=$(get_slot_count "$slot")
        if [ "$SLOT_COUNT" -ge 2 ]; then
            log "Slot $slot now has $SLOT_COUNT tasks. Moving to next slot."
            break
        fi

        log "Starting task: $task (slot $slot)"
        nohup "$SCRIPTS_DIR/execute-research-task.sh" "$task" >> "$LOGS_DIR/scheduler.log" 2>&1 &
        STARTED_ANY=1

        sleep 2
    done
done

if [ $STARTED_ANY -eq 0 ]; then
    log "No tasks to start. All tasks complete or waiting for dependencies."
fi

log "Scheduler check complete"
exit 0
