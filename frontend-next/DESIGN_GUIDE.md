# 🎨 Design & Layout Guide

## Overall App Flow

```
┌─────────────────────────────────────┐
│   CODE INPUT PAGE                   │
│                                     │
│   🎓 Lễ Tốt Nghiệp                  │
│                                     │
│   [______ ______]  Enter 6-digit    │
│   [X/6 characters]                  │
│   [  Submit Button  ]               │
│                                     │
│   📧 Code sent via email            │
└─────────────────────────────────────┘
           ↓ Code valid
┌─────────────────────────────────────┐
│   INVITATION CARD                   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ GREEN → BLUE GRADIENT       │   │
│   │ 🎓 Thiệp Mời Lễ Tốt Nghiệp  │   │
│   │ Với sự hân hạnh mời bạn     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   FULL-WIDTH PHOTO          │   │
│   │   (From Azure Storage)       │   │
│   │                             │   │
│   │   [Graduate Photo]          │   │
│   └─────────────────────────────┘   │
│                                     │
│   Kính gửi,                         │
│   Nguyễn Văn A                      │
│                                     │
│   ...kính mời Quý vị                │
│   Đến dự buổi lễ tốt nghiệp của    │
│   Trần Thị B                        │
│   Bachelor | Computer Science       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  📅 DATE & TIME             │   │
│   │  Thứ 7, 15 tháng 6, 2024    │   │
│   │  10:00 AM                   │   │
│   │                             │   │
│   │  📍 LOCATION                │   │
│   │  Hội Trường A               │   │
│   │  123 Đường ABC, Hà Nội      │   │
│   │                             │   │
│   │  🅿️ PARKING                 │   │
│   │  B3, B4                     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  📞 CONTACT INFO            │   │
│   │  📧 nguyena@example.com     │   │
│   │  📱 0123 456 789            │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ GOLD GRADIENT FOOTER        │   │
│   │                             │   │
│   │ Cảm ơn Quý vị đã dành       │   │
│   │ thời gian tham dự...        │   │
│   └─────────────────────────────┘   │
│                                     │
│   [❌ Back] [💬 Ask Questions]      │
└─────────────────────────────────────┘
           ↓ Click Chat
┌─────────────────────────────────────┐
│   CHATBOT                           │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 💬 Trợ Lý Thông Tin        │   │
│   │ Hỏi về sự kiện này         │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ BOT: Xin chào! 👋 Tôi có   │   │
│   │      thể giúp bạn...        │   │
│   │                             │   │
│   │       USER: Lúc mấy giờ? →→│   │
│   │                             │   │
│   │ BOT: Lễ diễn ra lúc 10h sáng│   │
│   └─────────────────────────────┘   │
│                                     │
│   [Input] [Send →]                  │
└─────────────────────────────────────┘
```

## Color Palette

### Primary Colors
```
Green: #2E7D32   (Vibrant green - growth, celebration)
Blue: #1565C0    (Deep blue - professionalism)
Gold: #FFC107    (Warm gold - achievement, thanks)
```

### Secondary Colors
```
Background: #f5f5f5 / #ffffff (Light, clean)
Text: #333333 (Dark gray for readability)
Border: #e0e0e0 (Subtle separators)
Error: #d32f2f (Red for errors)
```

### Gradients
```
Header: linear-gradient(135deg, #2E7D32 0%, #1565C0 100%)
Footer: linear-gradient(135deg, #FFC107 0%, #FFD700 100%)
Text: linear-gradient(135deg, #2E7D32 0%, #1565C0 100%)
```

## Typography

### Headings
- **H1** (Main title): 
  - Font: Bold, 3-4rem
  - Color: White (header), Gray-900 (body)
  - Family: System sans-serif

- **H2** (Section): 
  - Font: Bold, 2-3rem
  - Color: Gray-900

- **H3** (Subsection): 
  - Font: Semibold, 1.5rem
  - Color: Gray-800

### Body Text
- **Regular**: 
  - Font-size: 1rem
  - Color: Gray-700
  - Line-height: 1.5

- **Small**: 
  - Font-size: 0.875rem
  - Color: Gray-600

- **Large**: 
  - Font-size: 1.125rem
  - Color: Gray-700

## Component Layouts

### CodeInputPage
```
┌─────────────────────────────────────┐
│          CENTERED (max-w-md)        │
│                                     │
│            [Text Center]            │
│                                     │
│      🎓 (6rem emoji)               │
│                                     │
│      Lễ Tốt Nghiệp                  │
│      (4xl bold)                     │
│                                     │
│      Vui lòng nhập mã...           │
│      (lg text-gray-600)             │
│                                     │
│    ┌──────────────────────────┐    │
│    │ Input (text center,      │    │
│    │ 3xl font, tracking-wide) │    │
│    └──────────────────────────┘    │
│                                     │
│    X/6 characters (sm text-gray)    │
│                                     │
│    ┌──────────────────────────┐    │
│    │ Submit Button            │    │
│    │ bg-gradient-to-r         │    │
│    │ from-green to-blue       │    │
│    └──────────────────────────┘    │
│                                     │
│    📧 Code sent via email          │
│    (sm text-gray-600)               │
└─────────────────────────────────────┘
```

### InvitationPage Card
```
┌─────────────────────────────────────┐
│ HEADER (Gradient Green→Blue)        │
│                                     │
│  🎓 Thiệp Mời Lễ Tốt Nghiệp         │
│  Với sự hân hạnh mời bạn            │
│                                     │
└─────────────────────────────────────┘
│ CONTENT (White background)          │
│                                     │
│  Kính gửi,                          │
│  [Guest Name] (3xl bold center)     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Full-width photo (h-96)     │   │
│  │ object-cover                │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Invitation text center]           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Gray-50 bg, rounded         │   │
│  │                             │   │
│  │ Grid 2-col (md responsive)  │   │
│  │                             │   │
│  │ 📅 Date & Time              │   │
│  │ 📍 Location                 │   │
│  │ 🅿️ Parking (full width)     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Blue-50 bg, border-blue-200 │   │
│  │ 📞 CONTACT INFO             │   │
│  │ 📧 email (link)             │   │
│  │ 📱 phone (link)             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
│ FOOTER (Gold gradient)              │
│                                     │
│ Cảm ơn Quý vị... (italic)           │
│                                     │
└─────────────────────────────────────┘
```

### ChatBot Component
```
┌─────────────────────────────────────┐
│ HEADER (Gradient Green→Blue)        │
│                                     │
│ 💬 Trợ Lý Thông Tin                 │
│ Hỏi tôi bất cứ điều gì...          │
│                                     │
├─────────────────────────────────────┤
│ MESSAGES (Gray-50 bg, h-80 scroll)  │
│                                     │
│ 🤖 [BOT message left aligned]       │
│    (gray-200 bg, gray-900 text)    │
│                                     │
│                    [USER message →] │
│                    (blue-600 bg,    │
│                     white text)    │
│                                     │
│ 🤖 [BOT typing...] •••              │
│                                     │
├─────────────────────────────────────┤
│ INPUT (White bg)                    │
│                                     │
│ [Input field] [Send button]         │
│                                     │
└─────────────────────────────────────┘
```

## Spacing System

```
px-4   = 1rem (16px) horizontal
py-8   = 2rem (32px) vertical
gap-6  = 1.5rem (24px) between items
space-y-8 = 2rem (32px) vertical spacing

Large sections: 40-50px padding
Card padding: 24-32px
Element spacing: 16-24px
Text spacing: 8-12px
```

## Responsive Breakpoints

```
Mobile:  < 768px
- Single column
- Full-width images
- Touch-friendly (44px min height)
- Stack all sections

Tablet:  768px - 1024px
- 2-column grids where applicable
- Optimized images
- Balanced layout

Desktop: > 1024px
- Full 2-column layouts
- Larger images
- Hover effects
- Optimal readability
```

## Icon Usage

```
🎓 Main graduation icon (header)
📅 Date & time
📍 Location
🅿️ Parking
📞 Contact
📧 Email
📱 Phone
💬 Chat/message
⚙️ Settings/admin
❌ Close/back
➤ Send/submit
```

## Animation Effects

```
Buttons:
- Hover: shadow-lg transition
- Active: scale-95
- Disabled: opacity-50

Loading:
- Spinner animation (animate-spin)
- Dots animation (animate-bounce with delay)

Messages:
- Slide in from side
- Fade in
- Auto-scroll to bottom

Transitions:
- 150-300ms
- Easing: ease-in-out
```

## Accessibility Features

```
✅ Color contrast (WCAG AA)
✅ Semantic HTML
✅ ARIA labels
✅ Keyboard navigation
✅ Focus indicators
✅ Clear error messages
✅ Alternative text for images
✅ Readable font sizes
✅ Sufficient touch targets (44px min)
```

## Dark Mode (Optional Future)

Consider adding dark mode with:
```
Dark bg: #1a1a1a
Dark text: #f5f5f5
Dark card: #2a2a2a
Accent colors remain same
```

---

This design guide ensures:
- 🎨 Professional appearance
- 📱 Responsive across devices
- ♿ Accessibility compliance
- 🚀 Fast performance
- 💡 Clear information hierarchy
