#!/bin/bash
if ls .env* 1> /dev/null 2>&1; then
  echo "Error: .env files detected. Commit blocked."
  exit 1
fi
