#!/bin/bash
# Auto-commit script for 金庸群侠传dc版 game development

# This script is designed to automatically commit changes when modules are completed and tested
# It follows the convention of committing specific module changes with descriptive messages

MODULE_NAME=$1
TEST_RESULT=$2

if [ -z "$MODULE_NAME" ]; then
    echo "Usage: $0 <module_name> <test_result>"
    echo "Example: $0 'Combat System' 'pass'"
    exit 1
fi

if [ "$TEST_RESULT" != "pass" ] && [ "$TEST_RESULT" != "fail" ]; then
    echo "Test result must be either 'pass' or 'fail'"
    exit 1
fi

# Check if there are changes to commit
if [[ -z $(git status --porcelain) ]]; then
    echo "No changes to commit"
    exit 0
fi

# Create a detailed commit message based on the module and test result
COMMIT_MSG="Complete $MODULE_NAME implementation"

if [ "$TEST_RESULT" = "pass" ]; then
    COMMIT_MSG="$COMMIT_MSG

- Implemented core functionality
- All tests passed
- Ready for integration"
else
    COMMIT_MSG="$COMMIT_MSG

- Implementation completed but tests failed
- See logs for details"
fi

# Stage all changes
git add .

# Commit with the detailed message
git commit -m "$COMMIT_MSG"

# Optionally push to remote repository
echo "Changes committed successfully. To push to remote repository, run:"
echo "git push origin main"

echo ""
echo "Module '$MODULE_NAME' has been committed with test result: $TEST_RESULT"