#!/bin/bash

# Blog System Testing Script
# Usage: bash test-blog.sh

echo "🚀 D-Arrow Blog System - Test Script"
echo "===================================="
echo ""

API_URL="https://www.d-arrow.com/"
SECRET_KEY="your_secret_key_here"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Blog API Endpoints...${NC}\n"

# Test 1: Check blog initialization status
echo -e "${YELLOW}[1/5] Checking Blog Status...${NC}"
response=$(curl -s -X GET "$API_URL/api/blog/init" \
  -H "Content-Type: application/json")
echo "Response: $response"
echo ""

# Test 2: Get existing blog posts
echo -e "${YELLOW}[2/5] Fetching Blog Posts...${NC}"
response=$(curl -s -X GET "$API_URL/api/blog/posts" \
  -H "Content-Type: application/json")
echo "Response: $response"
echo ""

# Test 3: Check schedule status
echo -e "${YELLOW}[3/5] Checking Schedule Status...${NC}"
response=$(curl -s -X GET "$API_URL/api/blog/schedule" \
  -H "Content-Type: application/json")
echo "Response: $response"
echo ""

# Test 4: Generate a single blog post
echo -e "${YELLOW}[4/5] Generating Single Blog Post...${NC}"
response=$(curl -s -X POST "$API_URL/api/blog/generate" \
  -H "Content-Type: application/json")
echo "Response: $response"
echo ""

# Test 5: Trigger schedule (auto-post)
echo -e "${YELLOW}[5/5] Triggering Auto-Post Schedule...${NC}"
response=$(curl -s -X POST "$API_URL/api/blog/schedule" \
  -H "Content-Type: application/json")
echo "Response: $response"
echo ""

echo -e "${GREEN}✅ Blog System Tests Complete!${NC}"
echo ""
echo "📝 Blog Page: https://www.d-arrow.com//blog"
echo "📊 API Status: https://www.d-arrow.com//api/blog/init"
