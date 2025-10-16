# Database Migration Guide - Owner ID Implementation

## ✅ Migration Completed

The database schema has been successfully updated with the `ownerId` column using `npm run db:push`.

## 🚨 Important: Handling Existing Posts

If you had any posts in the database before this migration, they won't have an `ownerId` value, which could cause errors.

### Option 1: Clear Test Data (Recommended for Development)

If these are just test posts, the easiest solution is to delete them:

```sql
-- Connect to your database and run:
DELETE FROM posts_to_categories;
DELETE FROM posts;
```

Or using Drizzle Studio:

```bash
npm run db:studio
# Open http://localhost:4983
# Manually delete all posts
```

### Option 2: Assign Default Owner ID

If you want to keep existing posts, assign them a default owner ID:

```sql
-- Replace 'YOUR_UUID_HERE' with any valid UUID
UPDATE posts
SET owner_id = 'YOUR_UUID_HERE'
WHERE owner_id IS NULL OR owner_id = '';
```

To get a valid UUID, you can:

1. Create a new post in the app and check localStorage for `coblog_user_id`
2. Or generate one at: https://www.uuidgenerator.net/

### Option 3: Make Owner ID Nullable (Not Recommended)

If you want to support posts without owners temporarily:

```typescript
// In src/server/db/schema.ts, change:
ownerId: text("owner_id").notNull(), // Remove .notNull()

// To:
ownerId: text("owner_id"),

// Then run: npm run db:push
```

⚠️ **Warning**: This breaks the ownership validation system.

## 🧪 Testing the Identity System

1. **Open the app**: http://localhost:3000
2. **Check localStorage**:

   - Open DevTools (F12)
   - Go to Application → Local Storage → http://localhost:3000
   - Look for `coblog_user_id` key

3. **Test Creating Posts**:

   - Navigate to Dashboard
   - Create a new post
   - Verify it appears in "My Posts"

4. **Test Ownership Validation**:

   - Open incognito/private window
   - Navigate to Dashboard
   - Try to edit/delete the post from step 3
   - You should see a permission error

5. **Test My Posts Page**:
   - Navigate to "My Posts" in the navigation
   - Verify you see your User ID
   - Verify you see only your posts
   - Test Edit/Delete/View actions

## 📋 Verification Checklist

- [ ] Database migration completed (`npm run db:push`)
- [ ] Existing posts handled (deleted or assigned owner ID)
- [ ] localStorage `coblog_user_id` is created on first visit
- [ ] New posts are created with correct ownerId
- [ ] Edit only works for post owner
- [ ] Delete only works for post owner
- [ ] "My Posts" page shows only user's posts
- [ ] Permission errors display correctly

## 🔍 Troubleshooting

### Error: "null value in column 'owner_id' violates not-null constraint"

**Cause**: Trying to create a post without an ownerId
**Solution**: Clear browser cache and localStorage, refresh the page

### Error: "You don't have permission to delete this post"

**Cause**: Trying to delete a post owned by a different user
**Expected Behavior**: This is working correctly!

### Posts not showing in "My Posts"

**Cause**: The posts were created before the migration or by a different browser/device
**Solution**:

1. Check if localStorage `coblog_user_id` matches the post's ownerId in the database
2. Create new posts to test

### localStorage not working

**Cause**: Browser privacy settings or incognito mode cleared
**Solution**: Normal mode should persist the ID. Incognito will create a new ID each session.

## 🎯 Next Steps

1. Test the complete flow with different browsers/devices
2. Consider adding a user profile page showing the user ID
3. Consider adding a "Clear my identity" button for testing
4. Add analytics to track how many unique users are creating content

## 📝 Notes

- User IDs are UUIDv4 format (36 characters with dashes)
- IDs are stored in localStorage key: `coblog_user_id`
- Each browser/device gets a unique ID
- Clearing browser data will create a new identity
- This is a simple client-side identity system (not for production with real auth)
