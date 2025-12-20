#!/bin/bash

##############################################################################
# Status Dashboard - Show research progress
# Parameterized version - works with any website
##############################################################################

# Auto-detect paths from script location
SCRIPTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RESEARCH_DIR="$(dirname "$SCRIPTS_DIR")"
WEBSITE_DIR="$(cd "$RESEARCH_DIR/../../.." && pwd)"

# Extract website slug from path
WEBSITE_SLUG=$(basename "$WEBSITE_DIR")
WEBSITE_NAME="$WEBSITE_SLUG"

echo "========================================="
echo "  Research Status: $WEBSITE_NAME"
echo "========================================="
echo "Slug: $WEBSITE_SLUG"
echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Check if research complete
if [ -f "$RESEARCH_DIR/.research-complete" ]; then
    echo "🎉 RESEARCH COMPLETE!"
    echo "Completed: $(cat "$RESEARCH_DIR/.research-complete")"
    echo ""
fi

# Check cron jobs
echo "📋 CRON JOBS:"
if crontab -l 2>/dev/null | grep -q "$RESEARCH_DIR"; then
    echo "  ✅ Installed and running"
else
    echo "  ❌ Not installed"
fi
echo ""

# Check running tasks
echo "🔄 RUNNING TASKS:"
if [ -d "$RESEARCH_DIR/.locks" ]; then
    RUNNING_COUNT=$(find "$RESEARCH_DIR/.locks" -name "*.lock" 2>/dev/null | wc -l)
    if [ "$RUNNING_COUNT" -gt 0 ]; then
        echo "  $RUNNING_COUNT task(s) currently running:"
        for lock in "$RESEARCH_DIR/.locks"/*.lock; do
            if [ -f "$lock" ]; then
                TASK=$(basename "$lock" .lock)
                AGE=$(($(date +%s) - $(stat -c %Y "$lock")))
                MINS=$((AGE / 60))
                echo "    - $TASK (running for ${MINS}m)"
            fi
        done
    else
        echo "  No tasks currently running"
    fi
else
    echo "  No tasks currently running"
fi
echo ""

# Check completed tasks
echo "✅ COMPLETED TASKS:"
declare -A TASKS
TASKS["keywords"]="01-keyword-research:5"
TASKS["competitor-analysis"]="02-competitor-analysis:8"
TASKS["content-gaps"]="03-content-gap-analysis:8"
TASKS["topic-clusters"]="04-topic-cluster-planning:10"
TASKS["content-planning"]="05-content-planning:10"
TASKS["local-seo"]="06-local-seo-research:10"
TASKS["service-pages"]="07-service-page-planning:15"
TASKS["blog-planning"]="08-blog-content-planning:10"

TOTAL_TASKS=0
COMPLETED_TASKS=0

for dir in "${!TASKS[@]}"; do
    TOTAL_TASKS=$((TOTAL_TASKS + 1))
    IFS=':' read -r name min_files <<< "${TASKS[$dir]}"

    if [ -d "$RESEARCH_DIR/$dir" ]; then
        COUNT=$(find "$RESEARCH_DIR/$dir" -type f 2>/dev/null | wc -l)
        SIZE=$(du -sh "$RESEARCH_DIR/$dir" 2>/dev/null | cut -f1)

        if [ "$COUNT" -ge "$min_files" ]; then
            echo "  ✅ $name: $COUNT files ($SIZE)"
            COMPLETED_TASKS=$((COMPLETED_TASKS + 1))
        else
            echo "  ⏳ $name: $COUNT/$min_files files ($SIZE)"
        fi
    else
        echo "  ⏳ $name: Not started"
    fi
done
echo ""

# Overall progress
PROGRESS=$((COMPLETED_TASKS * 100 / TOTAL_TASKS))
echo "📊 OVERALL PROGRESS: $COMPLETED_TASKS/$TOTAL_TASKS tasks ($PROGRESS%)"
echo ""

# Total output
TOTAL_FILES=$(find "$RESEARCH_DIR" -type f \( -name "*.md" -o -name "*.csv" \) 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh "$RESEARCH_DIR" 2>/dev/null | cut -f1)
echo "📁 TOTAL OUTPUT:"
echo "  Files: $TOTAL_FILES"
echo "  Size: $TOTAL_SIZE"
echo ""

# Recent activity
echo "📜 RECENT ACTIVITY:"
if [ -f "$RESEARCH_DIR/logs/scheduler.log" ]; then
    tail -5 "$RESEARCH_DIR/logs/scheduler.log" | while read line; do
        echo "  $line"
    done
else
    echo "  No activity yet"
fi
echo ""

echo "========================================="
echo "Quick Commands:"
echo "  Monitor scheduler: tail -f logs/scheduler.log"
echo "  Monitor supervisor: tail -f logs/supervisor-\$(date +%Y-%m-%d).log"
echo "  View progress report: ls -t logs/progress-report-*.md | head -1 | xargs cat"
echo "========================================="
