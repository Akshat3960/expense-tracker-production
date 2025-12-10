# 💰 MERN Expense Tracker

A comprehensive full-stack web application for managing personal finances with AI-powered bill scanning, built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-8.0.0-green.svg)

## 🌐 Live Demo

- **Frontend:** [Your Deployed URL]
- **API:** [Your API URL]
- **API Health Check:** [Your API URL]/health

## ✨ Features

### 🔐 User Authentication
- Secure registration and login system
- JWT-based authentication
- Password encryption with bcrypt
- Protected routes and session management

### 💵 Income Management
- Add, view, and delete income entries
- Categorize income (Salary, Freelance, Business, Investments, Other)
- Track income with date and description
- Real-time total income calculation
- Export income data to Excel

### 💸 Expense Management
- Comprehensive expense tracking
- Multiple categories (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Other)
- Visual card-based display
- Hover-to-reveal delete functionality
- Export expenses to Excel

### 📸 AI-Powered Bill Scanning
- Upload receipt/bill images (JPG, PNG, GIF up to 5MB)
- Automatic text extraction using OCR (Optical Character Recognition)
- Intelligent data parsing:
  - Merchant/Store name
  - Total amount
  - Transaction date
  - Individual line items
  - Automatic categorization
- **Edit parsed data** before creating expenses
- One-click expense creation from scanned bills
- Processing confidence score display

### 📊 Interactive Dashboard
- **Summary Cards:**
  - Total Balance (Income - Expenses)
  - Total Income
  - Total Expenses
- **Visual Analytics:**
  - Bar Chart: Monthly income vs expenses
  - Pie Chart: Expense breakdown by category
  - Line Chart: Financial trends over time
- Recent transactions display
- Real-time data updates

### 📥 Data Export
- Export income/expense records to Excel (.xlsx)
- Formatted spreadsheets with proper headers
- One-click download

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface
- Adaptive navigation

### 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (5 attempts per 15 min for auth)
- CORS protection
- Helmet.js security headers
- Input validation

## 🛠️ Technology Stack

### Frontend
- **React.js** 18.2.0 - UI library
- **React Router DOM** 6.20.0 - Client-side routing
- **Axios** 1.6.0 - HTTP client
- **Recharts** 2.10.0 - Data visualization
- **XLSX & FileSaver** - Excel export
- **CSS3** - Styling with Flexbox and Grid

### Backend
- **Node.js** 18+ - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** 8.0.0 - Database
- **Mongoose** 8.0.0 - ODM
- **JWT** 9.0.2 - Authentication
- **bcrypt.js** 2.4.3 - Password hashing
- **Multer** 1.4.5 - File uploads
- **Tesseract.js** 5.0.3 - OCR
- **Cloudinary** - Image storage
- **Helmet** 7.1.0 - Security
- **Express Rate Limit** 7.1.5 - Rate limiting

### Cloud Services
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image storage and CDN
- **Render** - Backend API hosting
- **Vercel** - Frontend hosting

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Income.js            # Income schema
│   │   ├── Expense.js           # Expense schema
│   │   └── Bill.js              # Bill schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── income.js            # Income CRUD routes
│   │   ├── expense.js           # Expense CRUD routes
│   │   └── billUpload.js        # Bill scanning routes
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── utils/
│   │   └── billParser.js        # OCR text extraction
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express app
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/            # Login, Register
    │   │   ├── Dashboard/       # Dashboard, Charts
    │   │   ├── Income/          # Income management
    │   │   ├── Expense/         # Expense management
    │   │   ├── BillScanner/     # Bill scanning
    │   │   ├── Charts/          # Data visualizations
    │   │   └── Layout/          # Sidebar, Navigation
    │   ├── context/
    │   │   └── AuthContext.js   # Global auth state
    │   ├── config/
    │   │   └── api.js           # Axios configuration
    │   ├── utils/
    │   │   └── exportToExcel.js # Excel export utility
    │   ├── App.js               # Main app component
    │   ├── App.css
    │   └── index.js
    ├── .env                     # Environment variables
    ├── .gitignore
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/expense-tracker-mern.git
   cd expense-tracker-mern
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

#### Backend Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your_jwt_secret_key_min_32_characters
PORT=5000
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**To generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Frontend Environment Variables

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

#### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage Guide

### 1. Registration & Login
1. Open the application
2. Click "Register" to create a new account
3. Enter your name, email, and password
4. After registration, you'll be automatically logged in
5. Or use "Login" if you already have an account

### 2. Adding Income
1. Navigate to "Income" from the sidebar
2. Fill in the form:
   - Title (e.g., "Monthly Salary")
   - Amount (e.g., 5000)
   - Category (Salary, Freelance, Business, etc.)
   - Date
   - Description (optional)
3. Click "Add Income"
4. Your income will appear in the list below

### 3. Adding Expenses
1. Navigate to "Expense" from the sidebar
2. Fill in the form:
   - Title (e.g., "Grocery Shopping")
   - Amount (e.g., 150.50)
   - Category (Food, Transport, Shopping, etc.)
   - Date
   - Description (optional)
3. Click "Add Expense"
4. Your expense will appear in the list below

### 4. Scanning Bills (AI-Powered)
1. Navigate to "Scan Bill" from the sidebar
2. Click the upload area or drag & drop a receipt image
3. Click "Scan Bill" button
4. Wait 20-30 seconds for processing
5. Review the extracted data:
   - Merchant name
   - Total amount
   - Date
   - Confidence score
6. Click "Edit Details" if you need to correct any information
7. Click "Create Expense" to add to your expenses
8. Or click "Scan Another Bill" to process more receipts

### 5. Viewing Dashboard
1. Navigate to "Dashboard" from the sidebar
2. View your financial summary:
   - Total Balance
   - Total Income
   - Total Expenses
3. Analyze visual charts:
   - Monthly income vs expenses (Bar Chart)
   - Expense categories breakdown (Pie Chart)
   - Financial trends over time (Line Chart)
4. Check recent transactions at the bottom

### 6. Exporting Data
1. Go to Income or Expense page
2. Click the "📥 Export to Excel" button
3. An Excel file will be downloaded with all your data
4. Open with Excel, Google Sheets, or any spreadsheet software

### 7. Deleting Transactions
1. Go to Income or Expense page
2. Hover over any transaction card
3. A delete button (🗑️) will appear
4. Click it to delete (confirmation dialog will appear)

### 8. Logout
- Click "Logout" in the sidebar to end your session

## 🎨 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Interactive dashboard with summary cards and charts*

### Income Management
![Income](screenshots/income.png)
*Track all your income sources*

### Expense Tracking
![Expenses](screenshots/expenses.png)
*Manage expenses by category*

### Bill Scanner
![Bill Scanner](screenshots/bill-scanner.png)
*AI-powered receipt scanning with OCR*

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (protected)

### Income
- `GET /api/income` - Get all incomes (protected)
- `POST /api/income` - Create income (protected)
- `DELETE /api/income/:id` - Delete income (protected)

### Expenses
- `GET /api/expense` - Get all expenses (protected)
- `POST /api/expense` - Create expense (protected)
- `DELETE /api/expense/:id` - Delete expense (protected)

### Bills
- `POST /api/bills/upload` - Upload bill image (protected)
- `GET /api/bills/status/:billId` - Get processing status (protected)
- `GET /api/bills/history` - Get bill history (protected)
- `POST /api/bills/create-expense/:billId` - Create expense from bill (protected)
- `DELETE /api/bills/:billId` - Delete bill (protected)

### Health Check
- `GET /health` - API health status

## 🚀 Deployment

### Prerequisites for Deployment
1. GitHub account
2. MongoDB Atlas account (free tier)
3. Cloudinary account (free tier)
4. Render account (free tier)
5. Vercel account (free tier)

### Deployment Steps

#### 1. MongoDB Atlas Setup
1. Create account at https://mongodb.com/cloud/atlas
2. Create a cluster (free M0 tier)
3. Create database user with read/write permissions
4. Add IP `0.0.0.0/0` to network access
5. Get connection string

#### 2. Cloudinary Setup
1. Create account at https://cloudinary.com
2. Go to Dashboard
3. Copy Cloud Name, API Key, API Secret

#### 3. Deploy Backend to Render
1. Push code to GitHub
2. Go to https://render.com
3. Create new "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables (from .env)
7. Deploy

#### 4. Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Root Directory: `frontend`
   - Framework: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL` = Your Render backend URL
5. Deploy

#### 5. Update CORS
1. In Render, update `FRONTEND_URL` to your Vercel URL
2. Redeploy backend

### Deployment Cost
- **Free Tier**: $0/month
  - MongoDB Atlas: 512MB
  - Cloudinary: 25GB storage
  - Render: Free (with cold starts)
  - Vercel: 100GB bandwidth

## 🐛 Troubleshooting

### Common Issues

**Issue: MongoDB Connection Error**
- Check your connection string format
- Verify network access allows `0.0.0.0/0`
- Ensure database user has correct permissions
- Check if password has special characters (URL encode them)

**Issue: CORS Error**
- Verify `FRONTEND_URL` in backend matches frontend URL exactly
- Check CORS configuration in `server.js`
- Clear browser cache

**Issue: Images Not Uploading**
- Verify Cloudinary credentials are correct
- Check file size is under 5MB
- Ensure file format is JPG, PNG, or GIF

**Issue: OCR Not Working**
- Make sure image is clear and well-lit
- Try a different image format
- Check Tesseract.js is properly installed
- OCR works best with printed receipts

**Issue: Build Fails**
- Run `npm install` to ensure all dependencies are installed
- Check for missing environment variables
- Verify Node.js version (18+)
- Check build logs for specific errors

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/) - The amazing UI library
- [Tesseract.js](https://tesseract.projectnaptha.com/) - For OCR capabilities
- [Recharts](https://recharts.org/) - For beautiful charts
- [MongoDB](https://www.mongodb.com/) - For flexible database
- [Cloudinary](https://cloudinary.com/) - For reliable image hosting
- [Express.js](https://expressjs.com/) - For robust backend framework
- Open-source community for inspiration and support

## 📧 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

**Project Link:** [https://github.com/YOUR-USERNAME/expense-tracker-mern](https://github.com/YOUR-USERNAME/expense-tracker-mern)

**Live Demo:** [https://your-app.vercel.app](https://your-app.vercel.app)

## 🔮 Future Enhancements

- [ ] Budget setting and alerts
- [ ] Recurring transactions
- [ ] Advanced analytics and insights
- [ ] Custom categories
- [ ] Multi-user support (family accounts)
- [ ] Bank account synchronization via Plaid
- [ ] Email reports
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Document attachments
- [ ] Advanced search and filters
- [ ] Financial goal tracking
- [ ] AI-powered spending insights
- [ ] Push notifications

## 📊 Project Stats

- **Lines of Code:** ~5,000+
- **Components:** 30+
- **API Endpoints:** 15+
- **Technologies Used:** 15+
- **Development Time:** 80-100 hours

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

## 📱 Stay Connected

- Follow for updates: [GitHub Profile](https://github.com/YOUR-USERNAME)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Website](https://yourwebsite.com)

---

**Built with ❤️ using the MERN Stack**

*Last Updated: December 2024*
