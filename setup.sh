#!/bin/bash

# ComfortCo Website - Quick Setup Script

echo "🚀 Setting up ComfortCo Website..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install the glass component from 21st.dev
echo "🎨 Installing glass component from 21st.dev..."
npx shadcn@latest add "https://21st.dev/r/suraj-xd/liquid-glass"

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "To build for production, run:"
echo "  npm run build"
