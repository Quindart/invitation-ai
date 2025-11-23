# Next.js Graduation Invitation Frontend

Modern, beautiful Next.js frontend for the graduation invitation web app.

## ✨ Features

✅ **Beautiful UI** - Modern design with Tailwind CSS  
✅ **Responsive Design** - Works on all devices  
✅ **Code Input** - 6-digit invitation code verification  
✅ **Invitation Card** - Professional invitation display with:
  - Graduate photo
  - Invitation text with guest name
  - Event date and time
  - Venue address
  - Parking information
  - Contact details
  - Thank you message

✅ **Chatbot Integration** - Ask questions about the event  
✅ **Image Optimization** - Next.js Image component  
✅ **TypeScript** - Full type safety  

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page with state management
│   └── globals.css      # Global styles
└── components/
    ├── CodeInputPage.tsx    # Code input form
    ├── InvitationPage.tsx   # Beautiful invitation display
    └── ChatBot.tsx          # Chatbot component
```

## 🎨 Design Components

### CodeInputPage
- 6-digit code input with validation
- Submit button with loading state
- Error message display
- Clean, centered layout

### InvitationPage
- Header with gradient background
- Guest name greeting
- Large profile image from Azure Storage
- Invitation text (customizable)
- Event details grid (date, time, location, parking)
- Contact information card
- Thank you footer with gold gradient
- Back button

### ChatBot
- Chat interface with message history
- Real-time messages
- Typing indicator
- Error handling
- Auto-scroll to latest message

## 🔧 Technologies

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.3
- **HTTP Client**: Axios 1.7.7
- **Images**: Next.js Image optimization
- **Animation**: Framer Motion 10.18.0 (optional)

## 🔗 API Integration

### Endpoints Used

```
POST /api/invitations/verify
- Input: { invitation_code: string }
- Returns: { graduate_id, guest_name, graduate_info }

POST /api/graduates/{graduateId}/chat
- Input: { message: string }
- Returns: { response: string }
```

## 🌐 Image URLs

Images are loaded from Azure Storage Blob:
```
https://[storage-account].blob.core.windows.net/graduation-photos/[graduate-id]/[filename]
```

Configure allowed domains in `next.config.js`:
```javascript
images: {
  domains: ['graduation-photos.blob.core.windows.net'],
}
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All components are fully responsive.

## 🎯 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#2E7D32',
  secondary: '#FFC107',
  accent: '#1565C0',
}
```

### Fonts
Edit `src/app/globals.css` or `tailwind.config.js`

### Text Content
Edit component text in:
- `src/components/InvitationPage.tsx`
- `src/components/ChatBot.tsx`
- `src/components/CodeInputPage.tsx`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Azure Static Web Apps

1. Create Static Web App in Azure Portal
2. Connect to GitHub repository
3. Set build configuration:
   - Build presets: Next.js
   - Build location: `frontend-next`
   - Output location: `.next`

### Docker Deployment

```bash
# Build image
docker build -t graduation-invitation-next .

# Run container
docker run -p 3000:3000 graduation-invitation-next
```

## 📚 Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Production
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

## 🐛 Troubleshooting

### Images not loading?
- Check `next.config.js` has the correct domain
- Verify Azure Storage connection string
- Check CORS settings on storage account

### API requests failing?
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Check CORS headers in backend

### Build errors?
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please submit PR with improvements.

## 📞 Support

For issues or questions, contact the development team or check the main project README.
