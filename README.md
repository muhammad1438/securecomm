# SecureComm

A secure, decentralized communication application built with React Native and TypeScript, featuring end-to-end encryption and Bluetooth mesh networking for off-grid communication.

## 🚀 Features

### Core Communication
- **Multi-Platform Support**: Runs on iOS, Android, and Web
- **Real-time Messaging**: Instant secure messaging with encryption
- **Message History**: Persistent conversation history with timestamps
- **Contact Management**: Device discovery and contact organization

### Security & Privacy
- **End-to-End Encryption**: All messages encrypted using modern cryptographic standards
- **Bluetooth Mesh Networking**: Decentralized communication without internet dependency
- **Secure Key Exchange**: Automatic public/private key management
- **Device Authentication**: Trusted device pairing and verification

### Emergency Features
- **Emergency Broadcast System**: Critical alert broadcasting across the mesh network
- **Predefined Emergency Types**:
  - 🚑 Medical Emergency
  - 🔥 Fire Emergency
  - ⚠️ Safety Warning
  - 👤 Missing Person Alert
- **Custom Emergency Messages**: User-defined emergency broadcasts
- **Automatic Rebroadcasting**: Extended reach through TTL-based mesh forwarding
- **Priority System**: Critical, High, Medium, Low priority levels

### User Experience
- **Dark/Light Theme Toggle**: 🌙☀️ Seamless theme switching with system preference support
- **Intuitive Navigation**: Clean, modern interface across all screens
- **Network Visualization**: Interactive network topology mapping
- **Connection Status**: Real-time network and security status indicators
- **Cross-Platform UI**: Consistent experience across devices

## 📱 Application Screens

### 1. Home Dashboard
- Welcome interface with system status
- Quick access to key features
- App status monitoring (Connection, Bluetooth Mesh, Security)
- Emergency broadcast quick access

### 2. Messages/Chat
- Individual and group conversations
- Message bubbles with sender identification
- Attachment support (camera, microphone)
- Real-time message delivery status

### 3. Contacts/Devices
- Bluetooth device discovery
- Contact management with avatars
- Device pairing and trust levels
- Signal strength indicators

### 4. Network Map
- Visual network topology
- Device connection visualization
- Zoom and navigation controls
- Network health indicators

### 5. Settings
- Security preferences configuration
- Theme selection (Light/Dark/Auto)
- Network configuration options
- Privacy controls
- Emergency system settings

### 6. Emergency Broadcast
- Quick emergency alert buttons
- Custom message composition
- Real-time emergency message feed
- Priority-based message display

## 🛠 Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **React Native Web**: Web platform compatibility
- **TypeScript**: Type-safe development
- **React Context**: State management
- **Webpack**: Web bundling and optimization

### Backend Services
- **Bluetooth Service**: Mesh networking and device discovery
- **Crypto Service**: End-to-end encryption implementation
- **Emergency Broadcast Service**: Critical alert management
- **Network Service**: Connection and routing management

### Security
- **Modern Cryptography**: Secure encryption algorithms
- **Key Management**: Automatic key generation and exchange
- **Message Authentication**: Cryptographic message verification
- **Secure Storage**: Encrypted local data storage

## 🏗 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── SearchInput.tsx
│   │   ├── StatusCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── DeviceCard.tsx
│   └── chat/             # Chat-specific components
│       ├── MessageBubble.tsx
│       └── MessageInput.tsx
├── screens/              # Application screens
│   ├── HomeScreen.tsx
│   ├── ChatScreen.tsx
│   ├── ContactsScreen.tsx
│   ├── NetworkScreen.tsx
│   ├── SettingsScreen.tsx
│   └── EmergencyScreen.tsx
├── services/             # Core services
│   ├── BluetoothService.ts
│   ├── CryptoService.ts
│   ├── EmergencyBroadcastService.ts
│   └── NetworkService.ts
├── theme/                # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── ThemeContext.tsx
├── types/                # TypeScript definitions
└── App.tsx               # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- React Native development environment (for mobile)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd securecomm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   
   For web development:
   ```bash
   npm run web
   ```
   
   For mobile development:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

### Available Scripts

- `npm run web` - Start web development server
- `npm run build:web` - Build web application for production
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Theme Customization
Themes can be customized in `src/theme/colors.ts`:
- Light theme colors
- Dark theme colors
- Typography settings
- Spacing and layout values

### Network Settings
Bluetooth and mesh network settings are configured in:
- `src/services/BluetoothService.ts`
- `src/services/NetworkService.ts`

### Security Configuration
Encryption and security settings in:
- `src/services/CryptoService.ts`
- Key generation and management
- Encryption algorithm selection

## 🚨 Emergency Features

The emergency broadcast system provides critical communication capabilities:

### Emergency Types
- **Medical Emergency**: Immediate medical assistance requests
- **Fire Emergency**: Fire-related alerts and evacuations
- **Safety Warning**: General safety and hazard warnings
- **Missing Person**: Person location and search alerts
- **Custom Messages**: User-defined emergency communications

### Message Priority
- **CRITICAL**: Life-threatening emergencies
- **HIGH**: Urgent safety concerns
- **MEDIUM**: Important notifications
- **LOW**: General information

### Network Propagation
- Automatic message rebroadcasting
- TTL (Time To Live) based forwarding
- Mesh network coverage extension
- Priority-based message handling

## 🔒 Security Features

### Encryption
- End-to-end message encryption
- Secure key exchange protocols
- Message authentication codes
- Forward secrecy implementation

### Network Security
- Device authentication
- Trusted device management
- Secure mesh networking
- Anti-tampering protection

### Privacy
- No central server dependency
- Local data storage
- User-controlled data sharing
- Anonymous communication options

## 🌙 Theme System

SecureComm features a comprehensive theme system:

### Theme Modes
- **Light Mode**: Clean, professional appearance for daytime use
- **Dark Mode**: Easy on eyes for low-light conditions
- **Auto Mode**: Follows system preference automatically

### Theme Toggle
- Sun (☀️) and Moon (🌙) icons for intuitive switching
- Available on every screen for maximum convenience
- Instant theme switching with smooth transitions

## 📱 Cross-Platform Compatibility

### Web Platform
- Full-featured web application
- Responsive design for desktop and mobile browsers
- Progressive Web App (PWA) capabilities
- WebRTC for peer-to-peer communication

### Mobile Platforms
- Native iOS and Android applications
- Bluetooth Low Energy (BLE) support
- Background processing capabilities
- Push notification support

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
- Unit tests for services and utilities
- Component testing for UI elements
- Integration tests for core features
- End-to-end testing for critical workflows

## 🚀 Deployment

### Web Deployment
```bash
# Build for production
npm run build:web

# Deploy to hosting service
# (Configure with your preferred hosting platform)
```

### Mobile Deployment
```bash
# iOS App Store
npm run build:ios

# Google Play Store
npm run build:android
```

## 🤝 Contributing

We welcome contributions to SecureComm! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Maintain code coverage above 80%
- Use semantic commit messages
- Document new features and APIs
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

## 🙏 Acknowledgments

- React Native community for cross-platform framework
- Cryptographic libraries for security implementation
- Design inspiration from modern communication apps
- Open source contributors and maintainers

---

**SecureComm** - Secure, decentralized communication for everyone, everywhere.