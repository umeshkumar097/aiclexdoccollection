#!/bin/bash
echo "Packaging AICLEX Portal for CodeCanyon..."
mkdir -p release
zip -r release/AICLEX_Portal_v1.0.zip . -x "node_modules/*" ".git/*" ".next/*" ".env" "release/*" "*.DS_Store" "package-release.sh"
echo "Done! The file AICLEX_Portal_v1.0.zip is ready in the 'release' folder."
