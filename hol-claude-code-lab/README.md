# Claude Code Hands-On Lab

Welcome to the **Claude Code Hands-On Lab**! This comprehensive 4-hour workshop will teach you how to leverage Claude Code as your AI-powered development assistant throughout the entire software development lifecycle.

## 🎯 What You'll Learn

This hands-on lab is designed to give developers practical experience using **Claude Code** to:
- Navigate and understand unfamiliar codebases efficiently
- Write, edit, and refactor code with AI assistance
- Generate comprehensive unit tests and improve code quality
- Work with multiple agents for parallel development tasks
- Integrate external tools and data sources via Model Context Protocol (MCP)
- Customize Claude Code with instructions, skills, and automation hooks
- Build features faster while maintaining high code quality and security standards

## 🚀 Lab Structure

The lab consists of 6 progressive exercises, each building on the previous one:

| Lab | Title | Duration | Focus |
|-----|-------|----------|-------|
| [Lab 1](Instructions/Labs/Lab-1-Getting-Started.md) | Getting Started with Claude Code | 15 min | Installation, setup, and first session |
| [Lab 2](Instructions/Labs/Lab-2-Exploring-Codebases.md) | Exploring Codebases | 30 min | Code navigation, understanding projects |
| [Lab 3](Instructions/Labs/Lab-3-Code-Editing.md) | Code Editing and Testing | 30 min | Writing/editing code, generating tests |
| [Lab 4](Instructions/Labs/Lab-4-Working-With-Agents.md) | Working with Agents | 30 min | Subagents, parallel execution |
| [Lab 5](Instructions/Labs/Lab-5-MCP-Integration.md) | MCP Integration | 30 min | Connecting external tools and data |
| [Lab 6](Instructions/Labs/Lab-6-Customization.md) | Customizing Claude Code | 30 min | Instructions, skills, hooks, memory |

**Total Duration:** ~4 hours (includes breaks and exploration time)

## 💼 Scenario: DataFlow Analytics

Throughout this lab, you'll work as a developer at **DataFlow Analytics**, a startup building tools for data analysis and visualization. You'll be working on two main applications:

### 1. **Python Data Processor** 
A backend service that processes, analyzes, and transforms data from various sources. You'll enhance its functionality, add tests, and improve error handling.

### 2. **Angular Task Application**
A frontend application for managing data processing tasks and viewing analytics. You'll add new features, improve the UI, and integrate with the backend.

Your manager has emphasized that **speed to market** is crucial, but **code quality** and **security** cannot be compromised. Claude Code will be your secret weapon for accelerating development while maintaining high standards.

## 📋 Prerequisites

To complete this lab, you should have:

- **Basic programming knowledge** in Python and/or JavaScript/TypeScript
- **Familiarity with command-line interfaces** (terminal/shell)
- **Git basics** (clone, commit, push)
- **A computer with:**
  - macOS 13.0+, Windows 10+, or Linux (Ubuntu 20.04+, Debian 10+)
  - 4 GB+ RAM
  - Internet connection
  - Terminal or command prompt access

## 🔧 Required Software

Before starting the lab, ensure you have:

1. **Claude Code CLI** - You'll install this in Lab 1
2. **Python 3.9+** - [Download here](https://www.python.org/downloads/)
3. **Node.js 18+** - [Download here](https://nodejs.org/)
4. **Git** - [Download here](https://git-scm.com/downloads)
5. **A code editor** - VS Code, PyCharm, or your preferred IDE
6. **Claude subscription** - Pro, Team, Enterprise, or API access via Console

## 🎓 Getting Started

### Quick Start

1. **Clone or download this repository:**
   ```bash
   git clone <repository-url>
   cd hol-claude-code-lab
   ```

2. **Start with Lab 1:**
   Open [Lab 1 - Getting Started](Instructions/Labs/Lab-1-Getting-Started.md) to begin your journey!

3. **Work through each lab in sequence:**
   Each lab builds on concepts from previous labs, so we recommend completing them in order.

### Lab Resources

- **`Instructions/Labs/`** - Step-by-step lab guides with exercises
- **`SampleApps/`** - Python and Angular applications to work with
  - `python-data-processor/` - Backend data processing service
  - `angular-task-app/` - Frontend task management application
  - `angular-task-app/playwright-tests/` - Browser automation test examples
- **`WorkflowExamples/`** - Production-ready workflow scripts for complex agent orchestration
  - `code-review-workflow.js` - Multi-dimensional code review
  - `feature-pipeline-workflow.js` - Complete feature development pipeline
  - `security-audit-workflow.js` - Comprehensive security audit
- **`AdditionalLearning/`** - Extra resources and advanced topics
  - `Advanced-Agents-and-Workflows.md` - Advanced parallel agents and workflow patterns
  - `playwright-mcp-guide.md` - Complete browser automation guide
  - `Advanced-Topics.md` - Additional advanced topics
- **`media/`** - Screenshots and images for the labs

## 🌟 What Makes Claude Code Different?

Claude Code isn't just another AI code assistant. It's an **agentic coding tool** that:

- **Reads your entire codebase** to understand context
- **Edits files directly** with precise, targeted changes
- **Runs commands** to test, build, and validate
- **Uses multiple tools** (Read, Write, Edit, Grep, Glob, Bash, and more)
- **Spawns subagents** to work on tasks in parallel
- **Connects to external systems** via MCP (Model Context Protocol)
- **Works everywhere** - CLI, VS Code, JetBrains, Desktop app, Web, Mobile

Think of Claude Code as having a senior developer on your team who:
- Never gets tired
- Has instant access to documentation
- Can work on multiple things at once
- Learns your project's patterns and preferences
- Is available 24/7

## 📚 Additional Resources

- **Official Documentation:** [code.claude.com/docs](https://code.claude.com/docs/en/)
- **Claude Academy:** [academy.claude.com](https://academy.claude.com/)
  - [Claude Code 101](https://academy.claude.com/courses/claude-code-101)
  - [Claude Code in Action](https://academy.claude.com/courses/claude-code-in-action)
- **API Documentation:** [docs.anthropic.com](https://docs.anthropic.com/)
- **Community:** Share your experience and learn from others

## 🤝 Support and Feedback

Need help during the lab?

1. **Check the troubleshooting section** in each lab
2. **Review the [official troubleshooting guide](https://code.claude.com/docs/en/troubleshooting)**
3. **Ask Claude Code itself** - it can help debug issues!
4. **Report issues:** [github.com/anthropics/claude-code/issues](https://github.com/anthropics/claude-code/issues)

## 🎉 Let's Get Started!

You're about to discover how AI can transform your development workflow. Claude Code isn't here to replace developers—it's here to amplify your capabilities, handle the tedious work, and let you focus on what you do best: solving interesting problems and building great software.

**Ready to begin?** Head over to [Lab 1 - Getting Started with Claude Code](Instructions/Labs/Lab-1-Getting-Started.md)!

---

*This hands-on lab is designed for educational purposes and is not officially affiliated with Anthropic. It's created to help developers learn Claude Code effectively through practical exercises.*
