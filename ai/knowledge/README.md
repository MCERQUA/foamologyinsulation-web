# foamologyinsulation-web Knowledge Base

**Domain:** comfort-website
**Created:** 2025-12-19 04:26:03
**Structure Version:** 1.0.0

---

## Overview

This is the centralized knowledge base for foamologyinsulation-web (comfort-website). It contains all research, strategic planning, content intelligence, and ongoing learning data organized in a standardized structure designed for:

1. **Human Use** - Easy navigation and understanding
2. **Article Creation** - Pre-processed knowledge ready to use
3. **AI Processing** - Structured for future AI server integration
4. **Continuous Learning** - Grows as content is created

---

## Directory Structure

### 01-business-intel
Business context, brand voice, target audience, value propositions, and unique selling points.

### 02-market-research
Market analysis, competitive intelligence, target markets, opportunities, and gaps.

### 03-keyword-research
Comprehensive SEO keyword research including primary, location-based, long-tail, competitor, and seasonal keywords.

### 04-content-strategy
Content planning, topic clusters, content calendar, detailed content briefs, and gap analysis.

### 05-technical-seo
Technical SEO audits, schema markup, internal linking strategy, URL structure, and performance data.

### 06-local-seo
Local market intelligence, location targeting, citations, local link building, and local content opportunities.

### 07-conversion-optimization
Conversion funnel analysis, CTA strategies, lead magnets, and landing page optimization.

### 08-content-created
Living database of all published content with performance tracking and insights extraction.

### 09-business-insights
Derived intelligence including patterns, opportunities, and AI-generated recommendations.

### tools
Scripts and utilities for knowledge base management and analysis.

---

## Three-Tier Processing

Each aspect directory contains three subdirectories:

- **raw/** - Original research data (markdown, HTML, scrapes)
- **processed/** - Analyzed and structured (JSON, CSV)
- **ready/** - Final format ready for AI/article use (rich JSON with metadata)

---

## Navigation

Each aspect directory contains:

- **INDEX.md** - Navigation guide for that aspect
- **SUMMARY.md** - Executive summary of key findings

---

## Knowledge Status

See [KNOWLEDGE-STATUS.json](./KNOWLEDGE-STATUS.json) for machine-readable metadata about knowledge base completeness and freshness.

---

## Usage

### For Article Creation
1. Navigate to `04-content-strategy/ready/content-briefs/`
2. Select a brief that matches your article type
3. Reference related knowledge:
   - Brand voice: `01-business-intel/ready/brand-voice.json`
   - Keywords: `03-keyword-research/ready/`
   - Competitor insights: `02-market-research/ready/competitors.json`

### For Strategic Planning
1. Review `SUMMARY.md` files in each aspect directory
2. Check `09-business-insights/recommendations/` for AI-generated recommendations
3. Review `knowledge-graph.json` for interconnections

### For AI Server Integration
- All `/ready/` directories contain JSON files optimized for programmatic access
- `knowledge-graph.json` provides relationship mapping
- SQLite databases in `08-content-created/` and `09-business-insights/` for complex queries

---

## Maintenance

### Adding New Research
1. Place raw research in appropriate `/raw/` directory
2. Run processing scripts to generate `/processed/` data
3. Run optimization scripts to generate `/ready/` data
4. Update knowledge graph if new relationships discovered

### After Publishing Content
1. Add article metadata to `08-content-created/articles/`
2. Track performance metrics
3. Extract insights and add to `09-business-insights/`
4. Update related knowledge based on performance data

---

## Quick Links

- [Website Knowledge Base Standard](/home/josh/Josh-AI/WEBSITE-KNOWLEDGE-BASE-STANDARD.md)
- [Processing Tools](./tools/)
- [Knowledge Graph](./knowledge-graph.json)
- [Knowledge Status](./KNOWLEDGE-STATUS.json)

---

**Last Updated:** 2025-12-19 04:26:03
**Version:** 1.0.0
