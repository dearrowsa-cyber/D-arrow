#!/bin/bash
# D-Arrow Chatbot API Test Script

echo "🚀 D-Arrow Chatbot API Testing Tool"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API endpoint
API_URL="https://www.d-arrow.com//api/chat"

# Test questions
TEST_QUESTIONS=(
    "Hello! What services do you offer?"
    "Tell me about your pricing plans"
    "Can you handle both SEO and web design?"
    "What results can D-Arrow achieve for my business?"
    "How does your process work?"
)

# Check if server is running
echo -e "${YELLOW}Checking if server is running...${NC}"
if ! curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server not running on $API_URL${NC}"
    echo "Please start the development server with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Test each question
for i in "${!TEST_QUESTIONS[@]}"; do
    QUESTION="${TEST_QUESTIONS[$i]}"
    echo -e "${YELLOW}Test $((i+1)): $QUESTION${NC}"
    
    # Make API call
    RESPONSE=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"messages\": [{\"role\": \"user\", \"content\": \"$QUESTION\"}]}")
    
    # Check if response contains content
    if echo "$RESPONSE" | grep -q '"content"'; then
        CONTENT=$(echo "$RESPONSE" | jq -r '.content' 2>/dev/null)
        echo -e "${GREEN}✅ Response received:${NC}"
        echo "   $CONTENT"
        echo ""
    else
        echo -e "${RED}❌ No valid response${NC}"
        echo "   Raw response: $RESPONSE"
        echo ""
    fi
    
    # Small delay between requests
    sleep 1
done

echo "===================================="
echo -e "${GREEN}✅ Testing complete!${NC}"
