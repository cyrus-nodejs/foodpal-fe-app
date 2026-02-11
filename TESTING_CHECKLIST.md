# 🧪 Pre-Commit Testing Checklist

## 1. **Start Local Development Server**

```bash
npm run dev
```

Access: http://localhost:5173

## 2. **Test Backend Connection**

Open browser console and run:

```javascript
// Test connection
fetch("https://jollofai.render.com/api/health")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

## 3. **Core Features to Test:**

### ✅ **Authentication Flow**

- [ ] Sign up new user
- [ ] Login existing user
- [ ] Logout functionality
- [ ] Password reset (if implemented on backend)

### ✅ **Recipe Features**

- [ ] View recipes list
- [ ] Create new recipe
- [ ] View recipe details
- [ ] Rate and review recipes

### ✅ **User Profile**

- [ ] View profile page
- [ ] Update profile information
- [ ] Upload profile picture

### ✅ **Community Features**

- [ ] View community posts
- [ ] Create new post
- [ ] Comment on posts
- [ ] Like/interact with posts

### ✅ **Pantry Management**

- [ ] Add pantry items
- [ ] View pantry inventory
- [ ] Add to shopping list
- [ ] Expiry date tracking

### ✅ **Meal Planning**

- [ ] Create meal plans
- [ ] View weekly calendar
- [ ] Generate shopping lists from meal plans

### ✅ **Nutrition Dashboard**

- [ ] View nutrition goals
- [ ] Track daily nutrition
- [ ] View progress charts

### ✅ **Admin Features** (if admin user)

- [ ] Access admin dashboard
- [ ] View user management
- [ ] System analytics

## 4. **Check for Errors**

Monitor browser console for:

- ❌ API connection errors
- ❌ CORS issues
- ❌ Authentication failures
- ❌ Missing endpoints

## 5. **Performance Check**

- [ ] Page load times < 3 seconds
- [ ] Smooth navigation between pages
- [ ] Responsive design on mobile
- [ ] No memory leaks in dev tools

## 🚦 **Commit When:**

- ✅ All core features work with backend
- ✅ No console errors
- ✅ Authentication flow complete
- ✅ At least 80% of features functional

## 🔧 **If Issues Found:**

1. Fix backend endpoint URLs
2. Update API configurations
3. Handle missing backend features gracefully
4. Add proper error handling
5. Test again before committing
