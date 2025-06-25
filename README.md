# Renthouse Management UI

A modern, responsive web application for rental property management built with Next.js, shadcn/ui, and Tailwind CSS. This frontend application provides role-based interfaces for both property owners and tenants.

## 🚀 Features

### For Tenants (Users)
- **Property Search**: Browse and search rental properties with advanced filters
- **Property Details**: View detailed information about properties, floors, and rooms
- **Favorites**: Save and manage favorite properties
- **Room Booking**: Book available rooms directly from the platform
- **Payment History**: Track rental payments and view QR codes
- **Responsive Dashboard**: Modern, mobile-friendly interface

### For Property Owners
- **Property Management**: Create, edit, and manage multiple rental properties
- **Floor & Room Management**: Organize properties by floors and individual rooms
- **Tenant Management**: View and manage current tenants
- **Payment Creation**: Generate payment requests with QR codes
- **Income Tracking**: Monitor monthly and yearly rental income
- **Analytics Dashboard**: Overview of occupancy rates and revenue

### Shared Features
- **JWT Authentication**: Secure login and registration system
- **Role-based Access Control**: Different interfaces for owners and tenants
- **Real-time Notifications**: Toast notifications for user feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface using shadcn/ui components

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Authentication**: JWT tokens with HTTP-only cookies

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── user/              # Tenant-specific pages
│   ├── owner/             # Owner-specific pages
│   ├── search/            # Property search page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   └── providers/         # Context providers
├── lib/                   # Utility functions
├── services/              # API service functions
├── store/                 # Zustand store
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware for route protection
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd renthouse-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Build & Deploy

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔐 Authentication Flow

1. **Registration**: Users can register as either a "Tenant" or "Property Owner"
2. **Login**: JWT token is stored in HTTP-only cookies for security
3. **Role-based Routing**: Middleware redirects users to appropriate dashboards
4. **Protected Routes**: All dashboard pages require authentication

## 🎨 UI Components

The application uses shadcn/ui components for a consistent, modern design:

- **Forms**: Input, Label, Button, Select components with validation
- **Navigation**: Sidebar with role-based menu items
- **Data Display**: Cards, Tables, Badges for organized information
- **Feedback**: Toast notifications and loading states
- **Layout**: Responsive grid system and flexbox layouts

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Tablet Optimized**: Layouts adapt for tablet screen sizes
- **Desktop Enhanced**: Full features available on desktop
- **Cross-browser**: Compatible with modern browsers

## 🔗 API Integration

The frontend is fully integrated with the Spring Boot backend API:

### Complete API Coverage
**Authentication:**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration with role selection

**User Endpoints:**
- `GET /api/user/renthouses/nearby` - Get properties near user location
- `GET /api/user/renthouses/search` - Search properties with filters
- `GET /api/user/renthouses/{id}` - Get detailed property information
- `GET /api/user/renthouses/{id}/rooms/available` - Get available rooms
- `POST /api/user/rooms/{id}/book` - Book a room
- `POST /api/user/favorites/{roomId}` - Add room to favorites
- `DELETE /api/user/favorites/{roomId}` - Remove from favorites
- `GET /api/user/favorites` - Get all favorite rooms
- `GET /api/user/payments` - Get user payment history
- `GET /api/user/payments/{id}/qr-code` - Get payment QR code

**Owner Endpoints:**
- `GET /api/owner/renthouses` - Get all owned properties
- `POST /api/owner/renthouses` - Create new property
- `PUT /api/owner/renthouses/{id}` - Update property
- `DELETE /api/owner/renthouses/{id}` - Delete property
- `POST /api/owner/renthouses/{id}/floors` - Add floor to property
- `POST /api/owner/floors/{id}/rooms` - Add room to floor
- `GET /api/owner/rooms` - Get all owned rooms
- `GET /api/owner/rooms/search` - Search rooms by criteria
- `POST /api/owner/payments` - Create payment record
- `GET /api/owner/payments` - Get payment records
- `GET /api/owner/income/monthly` - Get monthly income report
- `GET /api/owner/income/yearly` - Get yearly income report

### API Features
- **Automatic Authentication**: JWT tokens automatically attached to requests
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Loading indicators for all API operations
- **Real-time Updates**: Automatic data refresh after mutations
- **Toast Notifications**: Success and error feedback for all operations
- **Retry Logic**: Built-in retry mechanism for failed requests

## 🚦 Routing Structure

```
/ (homepage)              → Public landing page
/auth/login              → Login page
/auth/register           → Registration page

/user/dashboard          → Tenant dashboard
/user/favorites          → Saved properties
/user/payments           → Payment history
/user/renthouses/[id]    → Property detail view
/search                  → Property search page

/owner/dashboard         → Owner dashboard
/owner/renthouses        → Property management
/owner/renthouses/[id]   → Property detail management
/owner/renthouses/new    → Create new property
/owner/rooms             → Room management
/owner/room/[id]         → Individual room details
/owner/payments          → Payment management
/owner/income            → Income tracking
```

## 🎯 Key Features Implementation

### Authentication & Authorization
- JWT token storage in secure cookies
- Middleware-based route protection
- Role-based dashboard redirection
- Automatic token refresh handling

### Property Management
- Multi-step property creation form
- Floor and room organization
- Image upload support
- Location-based search

### Payment System
- QR code generation for payments
- Payment history tracking
- Monthly and yearly income reports
- Automated payment calculations

### Search & Discovery
- Advanced property filtering
- Location-based search
- Favorite properties system
- Real-time availability updates

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Write meaningful commit messages

### Component Organization
- Keep components small and focused
- Use proper TypeScript interfaces
- Implement loading and error states
- Follow shadcn/ui patterns

### State Management
- Use Zustand for global state
- Keep local state when appropriate
- Implement proper loading states
- Handle errors gracefully

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Known Issues & Future Enhancements

### Current Status
✅ **Completed:**
- Full API integration with Spring Boot backend
- User authentication and role-based access control
- Property search and filtering
- Room booking and favorites system
- Payment history and QR code viewing
- Property creation and management
- Responsive design and error handling

### Current Limitations
- Payment QR code visualization (placeholder display)
- Map integration not yet implemented
- File upload for property images pending
- Real-time notifications system
- Advanced analytics and reporting

### Planned Features
- **Enhanced UX:**
  - Interactive map integration with Mapbox/Leaflet
  - Property image upload and gallery
  - Real-time chat between owners and tenants
  - Push notifications for important updates

- **Advanced Features:**
  - Advanced search filters (amenities, room types)
  - Virtual property tours
  - Maintenance request system
  - Automated rent reminders
  - Financial reporting and analytics

- **Platform Extensions:**
  - Mobile app version (React Native)
  - Desktop app (Electron)
  - API rate limiting and caching
  - Multi-language support

## 📞 Support

For questions or support, please create an issue in the repository or contact the development team.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
