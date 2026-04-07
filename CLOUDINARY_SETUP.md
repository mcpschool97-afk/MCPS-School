# Cloudinary Configuration Guide

To enable image upload for student profiles, follow these steps:

## Step 1: Create a Cloudinary Account
- Visit: https://cloudinary.com
- Sign up for a free account
- Verify your email

## Step 2: Get Your Cloud Name
1. Go to your Cloudinary Dashboard: https://cloudinary.com/console
2. Look for **Cloud Name** on the main dashboard (typically at the top)
3. Copy your Cloud Name (e.g., `dxyz12345`)

## Step 3: Create an Unsigned Upload Preset
1. In the Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets** section
3. Click **Add upload preset**
4. Fill in the form:
   - **Name**: `school_uploads` (or any name you prefer)
   - **Unsigned**: Toggle this ON (important - this allows uploads from the frontend without API key)
   - Leave other settings as default
5. Click **Save**
6. Copy the preset name (usually the name you entered)

## Step 4: Update Environment Variables
Edit your `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=school_uploads
```

Replace:
- `your_cloud_name_here` → with your actual Cloud Name from Step 2
- `school_uploads` → with your upload preset name from Step 3

## Step 5: Restart Your Development Server
After updating `.env.local`, restart your Next.js development server:

```bash
# In the frontend directory
npm run dev
```

## Testing the Setup

1. Login to the Admin Dashboard
2. Go to **Students** section
3. Click **Create Student**
4. Fill in the student form
5. Select a profile image (JPG, PNG, or other image format, max 5MB)
6. Click **Create Student**
7. The image should upload to Cloudinary and display successfully

## Troubleshooting

### Error: "cloud_name is not configured"
- The `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` environment variable is missing
- Check your `.env.local` file and ensure it has the Cloud Name set

### Error: "upload preset is not configured"
- The `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` environment variable is missing
- Check your `.env.local` file and ensure it has the Upload Preset set

### Error: "Unsigned uploads are not allowed"
- Your upload preset is not set to "Unsigned"
- Go back to Cloudinary Settings → Upload → Upload presets
- Edit your preset and toggle "Unsigned" to ON

### Error: "401 Unauthorized"
- Your Cloud Name might be incorrect
- Double-check the Cloud Name in your `.env.local` matches your Cloudinary account
- Clear browser cache and restart dev server after updating

### Image not showing after upload
- Verify the image URL appears in the database
- Check that `NEXT_PUBLIC_IMAGE_DOMAIN=res.cloudinary.com` is set in `.env.local`
- This allows Next.js Image component to load Cloudinary images

## Free vs Paid Accounts

Cloudinary free accounts include:
- ✅ 25 GB storage
- ✅ 25 GB monthly transformations
- ✅ Unlimited requests
- ✅ API access

This is sufficient for testing and small-scale school websites.

## Security Notes

- ✅ Safe: We use **unsigned uploads** (no API key stored in frontend)
- ✅ Safely: Only allows uploads to your Cloudinary account
- Our upload doesn't send any sensitive credentials to the browser

---

**Need help?** Check Cloudinary's documentation: https://cloudinary.com/documentation
