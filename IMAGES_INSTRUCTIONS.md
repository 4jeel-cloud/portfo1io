# How to Add Images to Your Portfolio

## Profile Picture
1. Save your profile picture as `headshot.jpg` (or .png) in the `images/profile/` folder
2. Update the HTML to use your image:
   - Find this line in `index.html`: `<img src="images/profile/headshot.svg"`
   - Change it to: `<img src="images/profile/headshot.jpg"`

## Project Images
To add images to project tiles:

1. **Save your project images** in the `images/projects/` folder with these names:
   - `hr-management.jpg` - HR Management System
   - `aws-vpc.jpg` - AWS VPC Project
   - `aws-iam.jpg` - AWS IAM Security
   - `aws-s3.jpg` - AWS S3 Website Hosting
   - `aws-lex.jpg` - AWS Lex Chatbot
   - `aws-network.jpg` - AWS Network Security
   - `python-apps.jpg` - Python Applications

2. **Update the HTML** for each project card:
   - Find each project card in `index.html`
   - Replace the placeholder div with an image:
   ```html
   <div class="project-image">
       <img src="images/projects/hr-management.jpg" alt="HR Management System" class="project-img">
       <div class="project-image-overlay">
           <div class="project-image-placeholder">💼</div>
       </div>
   </div>
   ```

## Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: 400x250 pixels or larger (will be scaled down)
- **Aspect ratio**: 16:10 or 4:3 works best
- **Quality**: High quality, clear images

## Video
1. Save your intro video as `intro.mp4` in the `videos/` folder
2. The HTML is already set up to use it

## Current Status
- ✅ Project tiles are now all the same size (600px height)
- ✅ No more overlapping issues
- ✅ Responsive design works on all screens
- ✅ Placeholder emojis are displayed until you add real images
