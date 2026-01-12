#!/bin/bash

API_KEY="slb_sk_a8f4e2b9c7d1f3a5e8b2c4d6f1a3e5b7c9d2f4a6e8b1c3d5f7a9e2b4c6d8f1a3"

echo "Testing rate limiting (max 10 requests per minute):"
echo "=================================================="

for i in {1..12}; do
  response=$(curl -s -w "\n%{http_code}" -H "x-api-key: $API_KEY" "http://localhost:3000/api/data?type=outcomes")
  status=$(echo "$response" | tail -1)

  if [ "$status" = "200" ]; then
    echo "Request $i: ✓ Success (HTTP $status)"
  elif [ "$status" = "429" ]; then
    echo "Request $i: ✗ Rate limited (HTTP $status)"
  else
    echo "Request $i: ? Other (HTTP $status)"
  fi

  sleep 0.1
done

echo ""
echo "Testing market intelligence rate limiting (1 request per 15 minutes):"
echo "====================================================================="

for i in {1..3}; do
  response=$(curl -s -w "\n%{http_code}" -H "x-api-key: $API_KEY" "http://localhost:3000/api/market-intelligence?action=refresh")
  status=$(echo "$response" | tail -1)

  if [ "$status" = "200" ]; then
    echo "Refresh $i: ✓ Success (HTTP $status)"
  elif [ "$status" = "429" ]; then
    echo "Refresh $i: ✗ Rate limited (HTTP $status)"
  else
    echo "Refresh $i: ? Other (HTTP $status)"
  fi

  sleep 0.1
done
