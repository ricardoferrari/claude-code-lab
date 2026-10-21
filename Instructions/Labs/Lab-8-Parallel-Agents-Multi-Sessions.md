# Lab 8 - Parallel Agents and Multi-Sessions

#### Duration: 40 minutes

## 🎯 Learning Objectives

By the end of this lab, you will:
- Understand the different approaches to parallel work in Claude Code
- Launch and manage multiple Claude sessions simultaneously
- Use cross-session messaging to coordinate work between sessions
- Master session naming and discovery with `/rename` and `/list-agents`
- Dispatch background sessions with agent view
- Apply best practices for multi-session coordination

## 🌐 Multi-Session Architecture

Claude Code provides five ways to work on multiple tasks at once:

| Approach | What it gives you | Use it when |
|----------|-------------------|-------------|
| **Subagents** | Delegated workers inside one session | A side task would flood your conversation with search results |
| **Agent view** | Background sessions you dispatch and monitor | You have independent tasks to hand off and check status later |
| **Agent teams** | Coordinated sessions with shared task list (experimental) | Claude splits a project into pieces and assigns them |
| **Projects** | Cloud conversations with parallel threads | Work spans days/weeks and should continue when machine is off |
| **Dynamic workflows** | Script-driven multi-agent orchestration | Job needs 10+ agents or cross-checked verification |

**This lab focuses on agent view and cross-session messaging.**

## 🔗 Cross-Session Messaging

Claude sessions can message each other to coordinate work, share findings, and report status.

### Key Tools

- **`/list-agents`** (or `/peers`): Lists all sessions Claude can reach
- **`/rename <name>`**: Give your session a memorable name
- **`SendMessage`**: Claude uses this tool to message other sessions

### How It Works

```
Session "principal" (you)
    ↓ message
Session "traducao" (other terminal)
    ↓ reply
Session "principal"
```

Messages travel:
- **Same machine**: Over local socket (never through Anthropic servers)
- **Other machines**: Through Anthropic via Remote Control
- **Cloud sessions**: Through Anthropic servers to cloud

## 🚀 Step 1: Session Discovery and Naming

Let's start by understanding how sessions identify and find each other.

### View Available Sessions

**Try this:**
```
/list-agents
```

**What you'll see:**
```
This session: principal [5d9c20] (the name other sessions use to message it)

Peer sessions (1):
  traducao [ea761a]  ·  interactive  ·  waiting  ·  started 15m ago
```

**Key observations:**
- First line shows YOUR session name (how others address you)
- Each session has a name and a short ID
- Status shows: interactive/background, waiting/working, age

### Name Your Session

Open a new terminal and start Claude:

```bash
cd F:\Desenvolvimento\claude-code-lab
claude --name "reviewer"
```

Or rename an existing session:
```
/rename reviewer
```

**Best practices for naming:**
- Use descriptive names: `api-worker`, `test-runner`, `db-migration`
- Keep names short (under 20 chars)
- Use hyphens not spaces: `bug-fix` not `bug fix`
- Names help with @-mentions and disambiguation

## 📨 Step 2: Your First Cross-Session Message

Let's have two sessions communicate.

### Setup: Two Sessions

**Terminal 1 (Session A):**
```bash
claude --name "analyzer"
```

**Terminal 2 (Session B):**
```bash
claude --name "coordinator"
```

### Send a Message

**In the "coordinator" session, try:**
```
List all available sessions, then send a message to the analyzer session asking it to review the Python data processor for performance issues.
```

**What Claude does:**
1. Runs `/list-agents` to discover sessions
2. Uses `SendMessage` tool to reach "analyzer"
3. The message appears in analyzer's session

**In the "analyzer" session, you'll see:**
```
› Message from @coordinator: Please review data_processor.py for performance issues (ctrl+o to expand)
```

**Press `Ctrl+O`** to see the full message in the transcript viewer.

### Reply to a Message

**In the "analyzer" session:**
```
Review the data processor for performance issues as requested. When done, send your findings back to the coordinator session.
```

Claude will:
1. Perform the review
2. Send findings back to coordinator
3. Coordinator receives the results

## 🎛️ Step 3: Agent View - Managing Background Sessions

Agent view is Claude's dashboard for dispatching and monitoring multiple parallel sessions.

### Launch Agent View

**In a new terminal:**
```bash
claude agents
```

**What you see:**
- List of all background sessions
- State indicators (working, idle, blocked, completed)
- Dispatch input at the bottom

### Dispatch Your First Background Session

**At the agent view prompt, type:**
```
Review the Angular task app for accessibility issues - focus on ARIA labels and keyboard navigation
```

**Press Enter.**

**What happens:**
1. Claude spawns a new background session
2. Session appears in the list with animated "working" icon
3. You're free to dispatch more tasks
4. When done, status changes to "completed"

### Dispatch Multiple Parallel Tasks

**Dispatch these tasks one after another:**

```
Task 1: Find all TODO comments in the codebase and create a prioritized list
```

```
Task 2: Analyze the Python data processor for potential security vulnerabilities
```

```
Task 3: Generate unit tests for any functions lacking test coverage in the Angular app
```

**Observe:**
- All three run simultaneously
- Each has its own row with status
- They complete independently

### Managing Sessions

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate between sessions |
| `Enter` or `→` | Attach to selected session |
| `Space` | Peek at output without attaching |
| `Ctrl+R` | Rename session |
| `Ctrl+X` twice | Stop and delete session |
| `Ctrl+F` | Find sessions by name |
| `Ctrl+S` | Toggle grouping (by state/directory) |

**Try it:**
1. Use `↑`/`↓` to navigate
2. Press `Space` to peek at a session's output
3. Press `Enter` to fully attach to a session
4. Press `←` to return to agent view

## 🔄 Step 4: Coordinated Multi-Session Workflows

Now let's coordinate multiple sessions working on related tasks.

### Scenario: Parallel Code Review

**Goal**: Review the entire codebase from multiple angles simultaneously.

### Setup the Workflow

**Terminal 1 - Coordinator:**
```bash
claude --name "review-coordinator"
```

**Prompt:**
```
I'm going to coordinate a multi-session code review. List all available sessions so we can prepare.
```

### Dispatch Review Sessions

**From agent view (`claude agents`):**

**Task 1:**
```
Session name: security-review
Task: Perform security audit of Python data processor - check for SQL injection, unsafe file operations, input validation issues. Report findings with severity levels.
```

**Task 2:**
```
Session name: perf-review  
Task: Analyze Python data processor for performance bottlenecks - slow algorithms, inefficient database queries, memory issues. Suggest optimizations.
```

**Task 3:**
```
Session name: accessibility-review
Task: Audit Angular task app for accessibility - ARIA labels, keyboard navigation, color contrast, screen reader compatibility. Generate fixes.
```

**Task 4:**
```
Session name: test-coverage
Task: Analyze test coverage across both projects. Identify critical paths lacking tests and generate missing test cases.
```

### Aggregate Results

Once all sessions complete, **in the coordinator session:**

```
Check on all review sessions. For each completed session, request they send me their findings. Then aggregate all findings, eliminate duplicates, and create a prioritized action plan.
```

**What Claude does:**
1. Uses `/list-agents` to check session states
2. Sends `SendMessage` to each review session
3. Receives findings from each
4. Aggregates and prioritizes

## 🎯 Step 5: Real-World Multi-Session Scenarios

Let's practice realistic development scenarios.

### Scenario 1: Feature Development Pipeline

**Goal**: Implement a new CSV export feature across frontend and backend.

**Setup:**
```bash
# Terminal 1
claude agents
```

**Dispatch these sessions:**

**Session 1: Design Phase**
```
name: csv-design
task: Design CSV export architecture for the data processor - API endpoints, data formatting, error handling, streaming for large datasets
```

**Wait for design to complete, then:**

**Session 2: Backend Implementation**
```
name: csv-backend
task: Check the csv-design session for the architecture plan. Implement the CSV export functionality in Python based on that design.
```

**Session 3: Frontend Integration** (can run parallel to Session 2)
```
name: csv-frontend
task: Add CSV export button to Angular task app. Implement download functionality and user feedback during export.
```

**Session 4: Testing**
```
name: csv-tests
task: Write comprehensive tests for CSV export - unit tests for Python exporter, integration tests for API, E2E tests for UI button.
```

**Coordinator session:**
```
Monitor the CSV feature development sessions. As each completes, have them report status to me. Verify all pieces integrate correctly.
```

### Scenario 2: Debugging Across Services

**Goal**: Track down a bug affecting multiple components.

**Dispatch:**

**Session 1: Log Analysis**
```
name: log-hunter
task: Search entire codebase for error logs related to "timeout" or "connection refused". Report files, line numbers, and context.
```

**Session 2: Network Review**
```
name: network-review
task: Analyze all HTTP client code for timeout configurations, retry logic, and error handling. Identify inconsistencies.
```

**Session 3: State Management**
```
name: state-review
task: Review frontend state management for race conditions when handling network errors. Check for proper error boundaries.
```

**Coordinator:**
```
Coordinate the debugging sessions. As each finds potential issues, have them message me. Cross-reference findings to identify the root cause.
```

### Scenario 3: Migration Project

**Goal**: Migrate from one library to another across the codebase.

**Dispatch:**

**Session 1: Inventory**
```
name: migration-inventory
task: Find all usages of the old library across the codebase. Categorize by usage pattern and complexity.
```

**Wait for inventory, then dispatch workers:**

**Sessions 2-5: Parallel Migration**
```
name: migration-worker-1
task: Check migration-inventory for findings. Migrate files in /src/components directory from old to new library.
```

```
name: migration-worker-2
task: Check migration-inventory for findings. Migrate files in /src/services directory from old to new library.
```

```
name: migration-worker-3
task: Check migration-inventory for findings. Migrate files in /src/utils directory from old to new library.
```

```
name: migration-worker-4  
task: Check migration-inventory for findings. Update all test files to use the new library.
```

**Session 6: Verification**
```
name: migration-verify
task: After all workers complete, run full test suite and verify no references to old library remain. Report any issues.
```

## 💡 Best Practices for Multi-Session Work

### 1. Session Naming Strategy

**Good names:**
```
✅ api-bug-fix
✅ db-migration
✅ performance-review
✅ feature-csv-export
```

**Poor names:**
```
❌ claude-code-lab-43
❌ test
❌ untitled-session
❌ asdf
```

### 2. Choose the Right Approach

**Use subagents when:**
- Task is part of your current work
- You need results in this conversation
- Simple delegation (1-3 agents)

**Use background sessions when:**
- Tasks are independent
- You want to check back later
- Running 4+ parallel tasks
- Don't need constant updates

**Use cross-session messaging when:**
- Sessions need to coordinate
- Sharing findings between sessions
- One session depends on another's results
- Building multi-stage pipelines

### 3. Message Design

**Clear messages:**
```
✅ "Security review found 3 critical SQL injection vulnerabilities in data_processor.py lines 45, 67, and 103. Recommend immediate patching."

❌ "Found some issues, check it out"
```

**Include:**
- What was found
- Where it is (file:line)
- Severity/priority
- Recommended action

### 4. Isolation and Worktrees

Background sessions automatically use worktrees for file isolation:

```
Main working directory
    ├── .claude/worktrees/session-1/  (isolated copy)
    ├── .claude/worktrees/session-2/  (isolated copy)
    └── .claude/worktrees/session-3/  (isolated copy)
```

**Benefits:**
- Parallel sessions don't conflict
- Each can edit different files
- Changes don't affect main directory until committed

**To merge changes back:**
```bash
cd .claude/worktrees/session-name
git log  # Review commits
git push origin session-branch
```

### 5. Resource Management

**Rate limits apply:**
- 10 parallel sessions = ~10x token usage
- Monitor costs with `/status`
- Stop idle sessions with `Ctrl+X`

**Lifecycle:**
```bash
claude agents               # View all sessions
claude stop <name>          # Stop a session
claude rm <name>           # Remove from list
claude attach <name>        # Reattach to session
```

## 🎯 Exercise: Multi-Session Project Audit

Complete this advanced exercise on your own!

### Exercise: Comprehensive Project Audit

**Goal**: Perform a complete audit of the claude-code-lab using coordinated sessions.

**Architecture:**
```
coordinator (you)
    ├── security-audit (background)
    ├── performance-audit (background)
    ├── code-quality-audit (background)
    ├── documentation-audit (background)
    └── test-audit (background)
```

**Your task:**

1. **Start coordinator session:**
   ```bash
   claude --name "audit-coordinator"
   ```

2. **Launch agent view and dispatch 5 audit sessions:**
   ```bash
   # In another terminal
   claude agents
   ```

3. **Each audit should:**
   - Review both Python and Angular projects
   - Report findings with file:line references
   - Assign severity levels
   - Suggest fixes
   - Message coordinator when complete

4. **Coordinator should:**
   - Track progress of all audits
   - Receive findings from each session
   - Eliminate duplicates across audits
   - Create unified report
   - Prioritize top 10 issues
   - Generate action plan

**Prompts to get started:**

**Audit 1: Security**
```
Comprehensive security audit of both projects: SQL injection, XSS, CSRF, insecure dependencies, hardcoded secrets, unsafe file operations. Message audit-coordinator when complete with findings.
```

**Audit 2: Performance**
```
Performance audit: algorithm complexity, database query efficiency, memory leaks, bundle size, render performance. Message audit-coordinator when complete.
```

**Audit 3: Code Quality**
```
Code quality audit: code smells, duplication, complexity, naming conventions, error handling. Message audit-coordinator when complete.
```

**Audit 4: Documentation**
```
Documentation audit: missing docstrings, outdated comments, README completeness, API documentation. Message audit-coordinator when complete.
```

**Audit 5: Tests**
```
Test audit: coverage gaps, flaky tests, missing edge cases, test organization. Message audit-coordinator when complete.
```

**Success criteria:**
- All 5 audits run in parallel
- Each messages coordinator upon completion
- Coordinator aggregates into unified report
- No manual copy-paste between sessions
- Report has prioritized action items

## 🔍 Understanding Session States

Sessions move through these states:

| State | Icon | Meaning | What to do |
|-------|------|---------|------------|
| Working | 🔄 | Actively processing | Wait or check other sessions |
| Idle | ⚪ | Ready for input | Send new prompt or stop |
| Blocked | 🟡 | Needs permission/input | Attach and respond |
| Completed | 🟢 | Task finished | Review results |
| Failed | 🔴 | Error occurred | Attach and debug |

**Checking state:**
```
/list-agents              # See all session states
claude agents --json      # Programmatic access
claude logs <name>        # View recent output
```

## 🧠 When NOT to Use Multi-Sessions

Multi-sessions aren't always the answer:

**Don't use for:**
- Simple sequential tasks (just do them)
- When you want to learn from the process
- Highly interdependent work that can't be split
- Quick exploratory work

**Do use for:**
- Independent parallel tasks
- Large-scale reviews or audits
- Multi-component features
- When one session blocks waiting on another

## 🎓 What You've Learned

By completing this lab, you now understand:

✅ **Multi-session architecture** - Five approaches and when to use each

✅ **Session discovery** - Using `/list-agents` and `/rename` effectively

✅ **Cross-session messaging** - Coordinating work between sessions

✅ **Agent view** - Dispatching and managing background sessions

✅ **Parallel workflows** - Coordinating complex multi-session projects

✅ **Best practices** - Naming, messaging, isolation, and resource management

## 🚀 Key Takeaways

1. **Choose the right tool** - Subagents vs background sessions vs messaging

2. **Name thoughtfully** - Good names make coordination easier

3. **Message clearly** - Include what, where, severity, and action

4. **Isolate with worktrees** - Parallel sessions won't conflict

5. **Coordinate explicitly** - Use coordinator pattern for complex work

6. **Monitor resources** - Parallel sessions multiply token usage

7. **Clean up** - Stop idle sessions, remove completed ones

## 🌐 Advanced: Remote Control (Optional)

With Remote Control, sessions can message across machines:

### Setup Remote Control

```bash
# Connect this session to claude.ai
claude --remote-control
```

**Now you can:**
- Message sessions on other machines
- Message cloud sessions at claude.ai/code
- Coordinate work across your infrastructure

**Example:**
```
List all my sessions across all machines. Ask the session on my laptop to run the test suite and report back.
```

**Learn more:**
- [Remote Control Documentation](https://code.claude.com/docs/en/remote-control)
- [Cloud Sessions](https://code.claude.com/docs/en/claude-code-on-the-web)

## 📚 Additional Resources

- **Cross-Session Messaging**: [Documentation](https://code.claude.com/docs/en/cross-session-messaging)
- **Agent View**: [Managing Sessions](https://code.claude.com/docs/en/agent-view)
- **Parallel Agents**: [Run Agents in Parallel](https://code.claude.com/docs/en/agents)
- **Worktrees**: [Isolated Checkouts](https://code.claude.com/docs/en/worktrees)
- **Agent Teams**: [Experimental](https://code.claude.com/docs/en/agent-teams)
- **Previous Lab**: [Lab 5 - Working with Agents](Lab-5-Working-With-Agents.md)

## 🔜 Next Steps

This completes all labs! For advanced topics, explore:

- **Advanced Agents and Workflows**: [Guide](../../AdditionalLearning/Advanced-Agents-and-Workflows.md)
- **Workflow Examples**: [Ready-to-run workflows](../../WorkflowExamples/)

---

#### 🎉 Congratulations! You've completed Lab 8 and mastered the entire Claude Code Hands-On Lab series! Happy coding with Claude!
