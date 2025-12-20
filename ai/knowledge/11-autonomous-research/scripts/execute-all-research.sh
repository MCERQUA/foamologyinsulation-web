#!/bin/bash

##############################################################################
# Master Research Executor - Runs ALL 8 Research Tasks to Completion
#
# This script executes the complete autonomous research workflow in ONE RUN:
# 1. Keyword Research (500+ keywords)
# 2. Competitor Analysis (15-20 competitors)
# 3. Content Gap Analysis (50+ opportunities)
# 4. Topic Cluster Planning (8-12 clusters)
# 5. Content Planning (100+ briefs)
# 6. Local SEO Research (multiple markets)
# 7. Service Page Planning (15+ pages)
# 8. Blog Content Planning (50+ posts)
#
# Usage: ./execute-all-research.sh <website-slug>
# Example: ./execute-all-research.sh arizonainsulationremoval
#
# Expected Duration: 4-8 hours (depending on task complexity)
# Expected Output: 76+ files, 1-2MB of research data
##############################################################################

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Tool directory
TOOL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEBSITES_BASE="/home/josh/Josh-AI/websites"

# Timestamp for this execution
EXECUTION_ID=$(date '+%Y%m%d-%H%M%S')

# Define all 8 research tasks in execution order
TASKS=(
    "01-keyword-research"
    "02-competitor-analysis"
    "03-content-gap-analysis"
    "04-topic-cluster-planning"
    "05-content-planning"
    "06-local-seo-research"
    "07-service-page-planning"
    "08-blog-content-planning"
)

# Expected file counts per task (minimum acceptable)
declare -A EXPECTED_FILES=(
    ["01-keyword-research"]=7
    ["02-competitor-analysis"]=11
    ["03-content-gap-analysis"]=8
    ["04-topic-cluster-planning"]=10
    ["05-content-planning"]=12
    ["06-local-seo-research"]=8
    ["07-service-page-planning"]=15
    ["08-blog-content-planning"]=14
)

# Task timeout in seconds (1 hour per task)
TASK_TIMEOUT=3600

# Logging functions
log_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $*${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}\n"
}

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

log_progress() {
    echo -e "${MAGENTA}◆${NC} $*"
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
MASTER_LOG="$RESEARCH_DIR/logs/master-execution-${EXECUTION_ID}.log"
PROGRESS_FILE="$RESEARCH_DIR/.execution-progress"
RESULTS_FILE="$RESEARCH_DIR/EXECUTION-RESULTS-${EXECUTION_ID}.md"

# Create logs directory
mkdir -p "$RESEARCH_DIR/logs"

# Initialize master log
exec > >(tee -a "$MASTER_LOG") 2>&1

echo ""
log_header "WEBSITE AUTONOMOUS RESEARCH - MASTER EXECUTION"
log_info "Execution ID: $EXECUTION_ID"
log_info "Website: $WEBSITE_SLUG"
log_info "Started: $(date)"
echo ""

# Validate website directory exists
if [ ! -d "$WEBSITE_DIR" ]; then
    log_error "Website directory not found: $WEBSITE_DIR"
    log_info "Available websites:"
    ls -1 "$WEBSITES_BASE" 2>/dev/null | grep -v "^test-" | sed 's/^/  - /'
    exit 1
fi

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

# Validate config exists
if [ ! -f "$CONFIG_FILE" ]; then
    log_error "Configuration file not found: $CONFIG_FILE"
    log_info "Please run: $TOOL_DIR/scripts/init-website.sh $WEBSITE_SLUG"
    exit 1
fi

# Load business name for logging
BUSINESS_NAME=$(jq -r '.businessName // "Unknown"' "$CONFIG_FILE" 2>/dev/null || echo "Unknown")

log_info "Business: $BUSINESS_NAME"
log_info "Research Directory: $RESEARCH_DIR"
log_info "Master Log: $MASTER_LOG"
echo ""

# Check if already running
if [ -f "$RESEARCH_DIR/.master-execution-running" ]; then
    RUNNING_PID=$(cat "$RESEARCH_DIR/.master-execution-running" 2>/dev/null || echo "unknown")

    if [ "$RUNNING_PID" != "unknown" ] && ps -p "$RUNNING_PID" > /dev/null 2>&1; then
        log_error "Master execution already running (PID: $RUNNING_PID)"
        log_info "If this is an error, remove: $RESEARCH_DIR/.master-execution-running"
        exit 1
    else
        log_warn "Stale execution lock detected. Cleaning up..."
        rm -f "$RESEARCH_DIR/.master-execution-running"
    fi
fi

# Create execution lock
echo "$$" > "$RESEARCH_DIR/.master-execution-running"

# Cleanup function
cleanup() {
    local exit_code=$?
    rm -f "$RESEARCH_DIR/.master-execution-running"

    if [ $exit_code -eq 0 ]; then
        log_success "Master execution completed successfully!"
        touch "$RESEARCH_DIR/.research-complete"
        echo "$(date)" > "$RESEARCH_DIR/.research-complete"
    else
        log_error "Master execution failed with exit code: $exit_code"
    fi

    # Generate final results
    generate_results_report
}
trap cleanup EXIT

# Initialize progress tracking
echo "0/8" > "$PROGRESS_FILE"

# Send Slack notification (if configured)
notify_slack() {
    local message="$1"
    if [ -f "$HOME/.claude/slack-notification-channels.sh" ]; then
        (
            set +u
            source "$HOME/.claude/slack-notification-channels.sh" 2>/dev/null || true
            notify_status "🔬 [$WEBSITE_SLUG] $message" 2>/dev/null || true
        ) || true
    fi
}

# Task execution function
execute_task() {
    local task_name="$1"
    local task_number=$(echo "$task_name" | cut -d'-' -f1)
    local task_index=$((10#$task_number))

    log_header "TASK $task_index/8: ${task_name}"
    log_info "Started: $(date)"

    # Update progress
    echo "$((task_index - 1))/8" > "$PROGRESS_FILE"

    # Notify start
    notify_slack "Starting task $task_index/8: $task_name"

    # Get output directory
    case "$task_number" in
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

    mkdir -p "$OUTPUT_DIR"

    # Record start time
    local start_time=$(date +%s)
    local start_files=$(find "$OUTPUT_DIR" -type f 2>/dev/null | wc -l)

    log_info "Output Directory: $OUTPUT_DIR"
    log_info "Existing Files: $start_files"
    log_info "Expected Files: ${EXPECTED_FILES[$task_name]}"
    log_info "Timeout: ${TASK_TIMEOUT}s ($(( TASK_TIMEOUT / 60 )) minutes)"
    echo ""

    # Execute task
    log_progress "Executing Claude Code..."

    if "$RESEARCH_DIR/scripts/execute-research-task.sh" "$task_name"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        local end_files=$(find "$OUTPUT_DIR" -type f 2>/dev/null | wc -l)
        local new_files=$((end_files - start_files))
        local output_size=$(du -sh "$OUTPUT_DIR" 2>/dev/null | cut -f1)

        echo ""
        log_success "Task completed in $(( duration / 60 ))m $(( duration % 60 ))s"
        log_info "Files Created: $new_files (Total: $end_files)"
        log_info "Output Size: $output_size"

        # Validate output
        if [ "$end_files" -ge "${EXPECTED_FILES[$task_name]}" ]; then
            log_success "Output validation: PASSED (≥${EXPECTED_FILES[$task_name]} files)"
            notify_slack "✅ Completed task $task_index/8: $task_name ($new_files files, $output_size)"
            return 0
        else
            log_warn "Output validation: INCOMPLETE (${end_files}/${EXPECTED_FILES[$task_name]} files)"
            log_warn "Task may need manual review"
            notify_slack "⚠️  Task $task_index/8 completed with fewer files than expected (${end_files}/${EXPECTED_FILES[$task_name]})"
            return 0  # Continue anyway, but logged as warning
        fi
    else
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        echo ""
        log_error "Task failed after $(( duration / 60 ))m $(( duration % 60 ))s"
        notify_slack "❌ Failed task $task_index/8: $task_name"
        return 1
    fi
}

# Generate results report
generate_results_report() {
    log_info "Generating results report..."

    cat > "$RESULTS_FILE" << 'EOFRESULTS'
# Website Autonomous Research - Execution Results

**Website:** {{WEBSITE_SLUG}}
**Business:** {{BUSINESS_NAME}}
**Execution ID:** {{EXECUTION_ID}}
**Started:** {{START_TIME}}
**Completed:** {{END_TIME}}
**Duration:** {{DURATION}}

---

## Execution Summary

### Tasks Completed

EOFRESULTS

    local total_files=0
    local total_size=0

    for task in "${TASKS[@]}"; do
        local task_num=$(echo "$task" | cut -d'-' -f1)

        case "$task_num" in
            "01") OUTPUT_DIR="$RESEARCH_DIR/keywords" ;;
            "02") OUTPUT_DIR="$RESEARCH_DIR/competitor-analysis" ;;
            "03") OUTPUT_DIR="$RESEARCH_DIR/content-gaps" ;;
            "04") OUTPUT_DIR="$RESEARCH_DIR/topic-clusters" ;;
            "05") OUTPUT_DIR="$RESEARCH_DIR/content-planning" ;;
            "06") OUTPUT_DIR="$RESEARCH_DIR/local-seo" ;;
            "07") OUTPUT_DIR="$RESEARCH_DIR/service-pages" ;;
            "08") OUTPUT_DIR="$RESEARCH_DIR/blog-planning" ;;
        esac

        if [ -d "$OUTPUT_DIR" ]; then
            local file_count=$(find "$OUTPUT_DIR" -type f 2>/dev/null | wc -l)
            local dir_size=$(du -sh "$OUTPUT_DIR" 2>/dev/null | cut -f1)
            total_files=$((total_files + file_count))

            echo "- ✅ **$task**: $file_count files ($dir_size)" >> "$RESULTS_FILE"
        else
            echo "- ❌ **$task**: Not completed" >> "$RESULTS_FILE"
        fi
    done

    cat >> "$RESULTS_FILE" << EOFRESULTS

---

## Output Statistics

- **Total Files Generated:** $total_files
- **Total Research Data:** $(du -sh "$RESEARCH_DIR" 2>/dev/null | cut -f1)
- **Master Log:** $MASTER_LOG

---

## Directory Structure

\`\`\`
EOFRESULTS

    tree -L 2 "$RESEARCH_DIR" >> "$RESULTS_FILE" 2>/dev/null || find "$RESEARCH_DIR" -maxdepth 2 -type d | sed 's|[^/]*/|  |g' >> "$RESULTS_FILE"

    cat >> "$RESULTS_FILE" << EOFRESULTS
\`\`\`

---

## Next Steps

1. **Review Output**: Browse through the generated research files
2. **Validate Content**: Ensure all deliverables meet quality standards
3. **Use for Planning**: Use content briefs for website development
4. **Implement Strategy**: Apply SEO insights and recommendations

---

**Execution Complete!** 🎉
EOFRESULTS

    # Replace placeholders
    sed -i "s/{{WEBSITE_SLUG}}/$WEBSITE_SLUG/g" "$RESULTS_FILE"
    sed -i "s/{{BUSINESS_NAME}}/$BUSINESS_NAME/g" "$RESULTS_FILE"
    sed -i "s/{{EXECUTION_ID}}/$EXECUTION_ID/g" "$RESULTS_FILE"
    sed -i "s/{{START_TIME}}/$(date -d @$EXECUTION_START_TIME)/g" "$RESULTS_FILE" 2>/dev/null || true
    sed -i "s/{{END_TIME}}/$(date)/g" "$RESULTS_FILE"

    local total_duration=$(($(date +%s) - EXECUTION_START_TIME))
    local hours=$((total_duration / 3600))
    local minutes=$(( (total_duration % 3600) / 60 ))
    sed -i "s/{{DURATION}}/${hours}h ${minutes}m/g" "$RESULTS_FILE"

    log_success "Results report generated: $RESULTS_FILE"
}

# Start execution
EXECUTION_START_TIME=$(date +%s)
log_header "STARTING COMPREHENSIVE RESEARCH"
log_info "This will execute all 8 research tasks sequentially"
log_info "Expected duration: 4-8 hours"
log_info "You can monitor progress in real-time:"
log_info "  tail -f $MASTER_LOG"
echo ""

notify_slack "🚀 Starting comprehensive research (8 tasks)"

# Execute all tasks sequentially
COMPLETED_TASKS=0
FAILED_TASKS=0

for task in "${TASKS[@]}"; do
    if execute_task "$task"; then
        COMPLETED_TASKS=$((COMPLETED_TASKS + 1))
        echo "$COMPLETED_TASKS/8" > "$PROGRESS_FILE"
    else
        FAILED_TASKS=$((FAILED_TASKS + 1))
        log_error "Task $task failed. Continuing with remaining tasks..."
    fi

    # Brief pause between tasks
    sleep 5
done

# Final summary
EXECUTION_END_TIME=$(date +%s)
TOTAL_DURATION=$((EXECUTION_END_TIME - EXECUTION_START_TIME))
HOURS=$((TOTAL_DURATION / 3600))
MINUTES=$(( (TOTAL_DURATION % 3600) / 60 ))

echo ""
log_header "EXECUTION COMPLETE"
log_info "Completed: $(date)"
log_info "Duration: ${HOURS}h ${MINUTES}m"
log_success "Tasks Completed: $COMPLETED_TASKS/8"
if [ $FAILED_TASKS -gt 0 ]; then
    log_warn "Tasks Failed: $FAILED_TASKS"
fi
echo ""

# Count total output
TOTAL_FILES=$(find "$RESEARCH_DIR" -name "*.md" -o -name "*.csv" 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$RESEARCH_DIR" 2>/dev/null | cut -f1)

log_info "Total Output:"
log_info "  Files: $TOTAL_FILES"
log_info "  Size: $TOTAL_SIZE"
echo ""

log_success "Results report: $RESULTS_FILE"
log_success "Master log: $MASTER_LOG"
echo ""

notify_slack "✅ Research complete! $COMPLETED_TASKS/8 tasks ($TOTAL_FILES files, $TOTAL_SIZE)"

if [ $FAILED_TASKS -eq 0 ]; then
    log_header "ALL TASKS COMPLETED SUCCESSFULLY! 🎉"
    exit 0
else
    log_header "EXECUTION COMPLETED WITH WARNINGS"
    log_warn "$FAILED_TASKS task(s) had issues - review logs"
    exit 1
fi
