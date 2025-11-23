# 🚀 Next.js Frontend - Getting Started

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Backend API running on `http://localhost:8000`

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd frontend-next
npm install
```

### Step 2: Configure Environment

The `.env.local` is already created with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, update with your API URL.

### Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📱 What You'll See

1. **Code Input Page** - 6-digit code input
2. **Invitation Display** - Beautiful card with:
   - 🖼️ Graduate photo from Azure Storage
   - 🎓 Invitation text personalized with guest name
   - 📅 Event date and time
   - 📍 Venue address
   - 🅿️ Parking information
   - 📞 Contact details
   - 💬 Chatbot for questions
   - 🙏 Thank you message

## 🎨 Design Highlights

✨ **Modern UI**
- Gradient backgrounds
- Professional card layout
- Smooth animations
- Responsive design

📱 **Mobile Friendly**
- Works on phones, tablets, desktops
- Touch-friendly inputs
- Optimized images

🚀 **Performance**
- Next.js optimization
- Image compression
- Code splitting
- Fast load times

## 🔧 Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌐 Update API URL

For production deployment, update `.env.local`:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Production (Azure App Service example)
NEXT_PUBLIC_API_URL=https://your-api-app.azurewebsites.net/api

# Production (Custom domain example)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

Then rebuild:
```bash
npm run build
npm start
```

## 📦 Deployment Options

### 1. **Vercel (Easiest)**
```bash
npm install -g vercel
vercel
```

### 2. **Azure Static Web Apps**
- Connect repository to Azure
- Auto-builds and deploys on push
- Free tier available

### 3. **Docker**
```bash
docker build -t graduation-invitation-next .
docker run -p 3000:3000 graduation-invitation-next
```

### 4. **Traditional Hosting**
```bash
npm run build
npm start
```

Deploy the `.next` folder to your server.

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails?
```bash
npm run build -- --debug
```

## 📚 File Structure

```
frontend-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── CodeInputPage.tsx   # Code input form
│       ├── InvitationPage.tsx  # Invitation display
│       └── ChatBot.tsx         # Chat widget
├── public/                     # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Next Steps

1. ✅ Run `npm run dev` and test locally
2. ✅ Get a 6-digit invitation code from admin dashboard
3. ✅ Test the invitation viewing flow
4. ✅ Deploy to production when ready

## 💡 Tips

- Use browser DevTools to test responsive design
- Check console for API errors
- Monitor network tab for slow requests
- Clear cache if styles don't update: `npm run build`

## 🆘 Need Help?

- Check the main [README.md](../README.md)
- Review backend API docs at `http://localhost:8000/docs`
- Check [troubleshooting](#troubleshooting) section above

---

**Happy coding! 🎉**
