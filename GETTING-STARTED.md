# Getting Started with the Claude Code Hands-On Lab

Welcome! This guide will help you get started with the Claude Code Hands-On Lab.

## 📁 What's Included

This hands-on lab contains:

### 📚 **6 Comprehensive Labs** (~4 hours total)
1. **Getting Started** (15 min) - Installation and first session
2. **Exploring Codebases** (30 min) - Code navigation with Read, Grep, Glob
3. **Code Editing and Testing** (30 min) - Edit/Write tools, test generation
4. **Working with Agents** (30 min) - Multi-agent coordination
5. **MCP Integration** (30 min) - Connecting external tools
6. **Customizing Claude Code** (30 min) - CLAUDE.md, skills, hooks, memory

### 💻 **Two Sample Applications**
- **Python Data Processor** - Backend data processing service
- **Angular Task App** - Frontend task management application

### 📖 **Additional Resources**
- Advanced topics guide
- Best practices
- Troubleshooting tips

## 🚀 Quick Start

### Step 1: Prerequisites

Ensure you have installed:
- **Python 3.9+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **Git** → [git-scm.com](https://git-scm.com/downloads)

### Step 2: Clone or Download

If you received this as a download, extract it to your preferred location.

If using Git:
```bash
cd /path/to/your/projects
# Extract or place the hol-claude-code-lab folder here
```

### Step 3: Start with Lab 1

1. Open the main README:
   ```bash
   cd hol-claude-code-lab
   cat README.md  # or open in your editor
   ```

2. Navigate to Lab 1:
   ```bash
   cd Instructions/Labs
   # Open Lab-1-Getting-Started.md
   ```

3. Follow the instructions to install Claude Code!

## 📋 Lab Progression

Work through the labs in order:

```
Lab 1: Getting Started
   ↓
Lab 2: Exploring Codebases
   ↓
Lab 3: Code Editing and Testing
   ↓
Lab 4: Working with Agents
   ↓
Lab 5: MCP Integration
   ↓
Lab 6: Customizing Claude Code
   ↓
🎉 Complete!
```

Each lab builds on concepts from previous labs, so sequential completion is recommended.

## 🎯 Learning Path

### For Beginners
- Start with Lab 1 and work through sequentially
- Take time to experiment with each concept
- Complete the exercises at the end of each lab
- Don't rush - understanding is more important than speed

### For Experienced Developers
- Skim Lab 1 if you've used CLI tools before
- Focus on Labs 4-6 for advanced features
- Try the optional exercises and challenges
- Explore the Advanced Topics guide

## 💡 Tips for Success

### 1. **Hands-On Practice**
Don't just read - actually run the commands and try the examples!

### 2. **Experiment Freely**
The sample applications are designed for experimentation. Break things, fix them, learn!

### 3. **Ask Claude for Help**
If you get stuck, remember that Claude Code itself can help:
```
I'm on Lab 3 and confused about the Edit tool. Can you explain when to use Edit vs Write?
```

### 4. **Take Notes**
Document your learnings, especially:
- Prompts that worked well
- Patterns you discover
- Ideas for your own projects

### 5. **Join the Community**
- Share your experience
- Ask questions
- Help others learn

## 🗂️ Directory Structure

```
hol-claude-code-lab/
├── README.md                          # Lab overview
├── GETTING-STARTED.md                 # This file
├── .gitignore                         # Git ignore rules
│
├── Instructions/
│   └── Labs/
│       ├── Lab-1-Getting-Started.md
│       ├── Lab-2-Exploring-Codebases.md
│       ├── Lab-3-Code-Editing.md
│       ├── Lab-4-Working-With-Agents.md
│       ├── Lab-5-MCP-Integration.md
│       └── Lab-6-Customization.md
│
├── SampleApps/
│   ├── python-data-processor/         # Python backend
│   │   ├── src/                       # Source code
│   │   ├── tests/                     # Test suite
│   │   ├── data/                      # Sample data
│   │   └── README.md                  # Setup guide
│   │
│   └── angular-task-app/              # Angular frontend
│       ├── src/                       # Source code
│       │   ├── app/
│       │   │   ├── components/
│       │   │   ├── services/
│       │   │   └── models/
│       │   └── environments/
│       └── README.md                  # Setup guide
│
├── AdditionalLearning/
│   └── Advanced-Topics.md             # Advanced concepts
│
└── media/                             # Images and diagrams
```

## 🐍 Setting Up the Python App

```bash
cd SampleApps/python-data-processor

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run the demo
python main.py
```

## 🅰️ Setting Up the Angular App

```bash
cd SampleApps/angular-task-app

# Install dependencies
npm install

# Start dev server
npm start

# Open browser to http://localhost:4200
```

## ❓ Troubleshooting

### Claude Code Installation Issues
- See [Troubleshoot Installation](https://code.claude.com/docs/en/troubleshoot-install)
- Run `claude doctor` for diagnostics

### Python Issues
- Ensure Python 3.9+ is installed: `python --version`
- Virtual environment not activating? Try recreating it
- Import errors? Check you're in the virtual environment

### Angular Issues
- Ensure Node.js 18+ is installed: `node --version`
- Port 4200 in use? Try: `ng serve --port 4201`
- Build errors? Delete `node_modules` and run `npm install` again

### General Help
- Check the README in each project
- Ask Claude Code for help (seriously!)
- Review the troubleshooting section in each lab

## 🎓 What You'll Learn

By the end of this lab, you'll be able to:

✅ **Navigate any codebase** quickly and efficiently

✅ **Write and edit code** with AI assistance

✅ **Generate comprehensive tests** automatically

✅ **Orchestrate multiple agents** for complex tasks

✅ **Integrate external tools** via MCP

✅ **Customize Claude Code** for your workflow

✅ **Apply AI-assisted development** to real projects

## 🎉 Ready to Begin?

Start your journey here:

**[Open Lab 1: Getting Started →](Instructions/Labs/Lab-1-Getting-Started.md)**

## 📚 Additional Resources

- **Documentation**: [code.claude.com/docs](https://code.claude.com/docs/en/)
- **Claude Academy**: [academy.claude.com](https://academy.claude.com/)
- **API Docs**: [docs.anthropic.com](https://docs.anthropic.com/)
- **Blog**: [claude.com/blog](https://claude.com/blog)

## 💬 Feedback

We'd love to hear about your experience! Share feedback about:
- What worked well
- What was challenging
- What you'd like to see added
- How you plan to use Claude Code

## 🙏 Credits

This hands-on lab was created to help developers learn Claude Code through practical, hands-on exercises. It is designed for educational purposes.

---

**Happy Learning! Let's build something amazing with Claude Code! 🚀**
