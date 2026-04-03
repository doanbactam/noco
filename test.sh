#!/bin/bash
# Test script to verify git-no-ai-author hook works

echo "Testing git-no-ai-author hook..."
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR" || exit 1

echo "Created test directory: $TEMP_DIR"

# Initialize git repo
git init > /dev/null 2>&1

echo "Initialized git repo"

# Check if hook exists
if [ -f ".git/hooks/commit-msg" ]; then
    echo "Hook file exists"
else
    echo "Hook file NOT found!"
    echo "  Make sure git template directory is set correctly:"
    echo "  git config --global init.templatedir"
    exit 1
fi

# Create test file
echo "test" > test.txt
git add test.txt

# Create commit message with AI co-author
COMMIT_MSG="Test commit

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Commit
git commit -m "$COMMIT_MSG" > /dev/null 2>&1

# Check commit message
ACTUAL_MSG=$(git log -1 --format=%B)

echo ""
echo "Commit message:"
echo "----------------------------------------"
echo "$ACTUAL_MSG"
echo "----------------------------------------"
echo ""

# Check if AI co-author was removed
if echo "$ACTUAL_MSG" | grep -q "Co-Authored-By: Claude"; then
    echo "FAILED: AI co-author was NOT removed"
    exit 1
else
    echo "PASSED: AI co-author was removed successfully!"
fi

# Cleanup
cd -
rm -rf "$TEMP_DIR"
echo ""
echo "Cleaned up test directory"
