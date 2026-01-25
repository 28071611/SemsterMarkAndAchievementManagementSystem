# MongoDB Atlas IP Whitelist Guide

## 🗄️ **Step 3: Configure MongoDB Atlas**

### **Add IP to Whitelist**
1. **Go to**: https://cloud.mongodb.com
2. **Login**: Your MongoDB Atlas account
3. **Navigate**: Network Access (left sidebar)
4. **Click**: "Add IP Address"
5. **Choose**: "Add Current IP Address"
6. **Confirm**: Click "Confirm"

### **Alternative: Allow All IPs (Testing)**
1. **Add IP Address**: "0.0.0.0/0"
2. **Purpose**: Allows access from anywhere
3. **Security**: Not recommended for production

### **Verify Connection**
```bash
# Test connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://edutrack:edutrack123@edutrack.2m3.mongodb.net/edutrack?retryWrites=true&w=majority')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ Connection Error:', err));
"
```

### **Expected Result**
✅ MongoDB Atlas accessible from your deployed services
