/**
 * Feature Implementation Pipeline Workflow
 *
 * This workflow implements a complete feature development pipeline:
 * Design → Implementation → Testing → Documentation
 *
 * Each phase waits for the previous one to complete.
 *
 * Usage:
 *   Ask Claude: "Run the feature pipeline workflow for adding a new validation module"
 *   Or provide custom requirements: "Run WorkflowExamples/feature-pipeline-workflow.js
 *   with args describing the feature to implement"
 */

export const meta = {
  name: 'feature-pipeline',
  description: 'Complete feature development pipeline from design to documentation',
  phases: [
    { title: 'Architecture Design', detail: 'Designing the feature architecture' },
    { title: 'Implementation', detail: 'Writing the code' },
    { title: 'Testing', detail: 'Creating comprehensive tests' },
    { title: 'Documentation', detail: 'Documenting the feature' },
    { title: 'Verification', detail: 'Final verification and validation' }
  ]
};

// Get feature requirements from args or use default
const featureDescription = args || 'Add input validation module with email, phone, and data format validators';

// Phase 1: Architecture Design
const designResult = await agent(
  `Design the architecture for this feature:
  ${featureDescription}

  Provide:
  1. Component structure and responsibilities
  2. API/interface design
  3. Dependencies and external libraries needed
  4. Data models and schemas
  5. Error handling strategy
  6. Performance considerations
  7. Security considerations`,
  {
    phase: 'Architecture Design',
    label: 'architect',
    schema: {
      type: 'object',
      properties: {
        components: { type: 'array' },
        apiDesign: { type: 'object' },
        dependencies: { type: 'array' },
        dataModels: { type: 'object' },
        errorHandling: { type: 'string' },
        performance: { type: 'string' },
        security: { type: 'string' }
      }
    }
  }
);

// Phase 2: Implementation (waits for design)
const implementationResult = await agent(
  `Implement the feature based on this design:
  ${JSON.stringify(designResult, null, 2)}

  Requirements:
  - Follow the architecture design exactly
  - Include proper error handling
  - Add type hints/types
  - Follow coding best practices
  - Include inline comments for complex logic
  - Make the code production-ready`,
  {
    phase: 'Implementation',
    label: 'implement',
    schema: {
      type: 'object',
      properties: {
        filesCreated: { type: 'array' },
        filesModified: { type: 'array' },
        codeQuality: { type: 'string' }
      }
    }
  }
);

// Phase 3: Testing (waits for implementation)
const testingResult = await agent(
  `Create comprehensive tests for the implemented feature:

  Implementation details: ${JSON.stringify(implementationResult, null, 2)}

  Test requirements:
  - Unit tests for all functions/methods
  - Integration tests for workflows
  - Edge case testing
  - Error handling tests
  - Performance tests if applicable
  - Aim for >90% code coverage
  - Include both positive and negative test cases`,
  {
    phase: 'Testing',
    label: 'test',
    schema: {
      type: 'object',
      properties: {
        testFiles: { type: 'array' },
        testCount: { type: 'number' },
        coverage: { type: 'string' }
      }
    }
  }
);

// Phase 4: Documentation (waits for tests)
const documentationResult = await agent(
  `Generate comprehensive documentation for the feature:

  Design: ${JSON.stringify(designResult, null, 2)}
  Implementation: ${JSON.stringify(implementationResult, null, 2)}

  Documentation should include:
  1. Overview and purpose
  2. Installation/setup instructions
  3. API reference with examples
  4. Usage examples for common scenarios
  5. Configuration options
  6. Error handling guide
  7. Performance considerations
  8. Troubleshooting section`,
  {
    phase: 'Documentation',
    label: 'document',
    schema: {
      type: 'object',
      properties: {
        docFiles: { type: 'array' },
        exampleCount: { type: 'number' }
      }
    }
  }
);

// Phase 5: Final Verification
const verificationResult = await agent(
  `Perform final verification of the feature:

  1. Verify all tests pass
  2. Check code follows project conventions
  3. Ensure documentation is complete
  4. Verify no security issues introduced
  5. Check for performance regressions
  6. Validate error handling works correctly

  Provide a go/no-go recommendation for merging.`,
  {
    phase: 'Verification',
    label: 'verify',
    schema: {
      type: 'object',
      properties: {
        testsPass: { type: 'boolean' },
        codeQualityPass: { type: 'boolean' },
        documentationComplete: { type: 'boolean' },
        securityChecks: { type: 'boolean' },
        recommendation: { type: 'string' }
      }
    }
  }
);

// Return comprehensive results
return {
  feature: featureDescription,
  pipeline: {
    design: designResult,
    implementation: implementationResult,
    testing: testingResult,
    documentation: documentationResult,
    verification: verificationResult
  },
  summary: {
    filesCreated: [
      ...(implementationResult.filesCreated || []),
      ...(testingResult.testFiles || []),
      ...(documentationResult.docFiles || [])
    ],
    testsCreated: testingResult.testCount || 0,
    testsPassing: verificationResult.testsPass || false,
    readyToMerge: verificationResult.recommendation?.includes('GO') || false
  },
  status: verificationResult.recommendation?.includes('GO')
    ? '✅ Feature ready for merge'
    : '⚠️ Feature needs additional work'
};
