# Portfolio Customization Guide

This guide will help you add your personal information to the portfolio website.

## 🎯 **Quick Start: Direct HTML Editing**

### 1. **Personal Information (Hero Section)**
Edit these lines in `index.html`:

```html
<!-- Around line 600 -->
<div class="hero-name animate-pulse">Muhammed Ajeel</div>
<h1 class="hero-title">Portfolio</h1>
<p class="hero-subtitle">Cloud Engineer & Cybersecurity Professional</p>
```

**Change to your info:**
- Replace "Muhammed Ajeel" with your name
- Update the subtitle with your professional title

### 2. **About Section**
Edit around line 650:

```html
<h2 class="about-title">Muhammed Ajeel</h2>
<div class="about-role">Cloud Engineer & Cybersecurity Professional</div>
<p class="about-text">
    Passionate technology professional with expertise in cloud infrastructure...
</p>
```

**Update:**
- Your name in the title
- Your role/title
- Write your personal bio in the about-text paragraph
- Update the stats numbers (years experience, projects, etc.)

### 3. **Education Section**
Edit around line 680:

```html
<div class="education-item animate-on-scroll">
    <div class="education-year">2020 - 2024</div>
    <div class="education-content">
        <h3 class="education-degree">Bachelor of Computer Science</h3>
        <div class="education-school">University of Technology</div>
        <div class="education-details">
            <p>Specialized in Cloud Computing and Cybersecurity</p>
            <div class="education-achievements">
                <span class="achievement">Magna Cum Laude</span>
                <span class="achievement">Dean's List</span>
                <span class="achievement">Cybersecurity Club President</span>
            </div>
        </div>
    </div>
</div>
```

**Replace with your education:**
- Years attended
- Your degree
- Your university/school
- Your specialization
- Your achievements

### 4. **Experience Section**
Edit around line 750:

```html
<div class="experience-item animate-on-scroll">
    <div class="experience-period">2023 - Present</div>
    <div class="experience-content">
        <h3 class="experience-title">Senior Cloud Engineer</h3>
        <div class="experience-company">TechCorp Solutions</div>
        <div class="experience-description">
            <p>Lead cloud infrastructure design and implementation...</p>
            <ul class="experience-achievements">
                <li>Designed and deployed 20+ cloud architectures on AWS and Azure</li>
                <li>Reduced infrastructure costs by 40% through optimization strategies</li>
                <li>Led security audits and compliance implementations</li>
                <li>Mentored junior engineers and conducted technical training</li>
            </ul>
        </div>
        <div class="experience-tech">
            <span class="tech-tag">AWS</span>
            <span class="tech-tag">Azure</span>
            <span class="tech-tag">Kubernetes</span>
            <span class="tech-tag">Terraform</span>
        </div>
    </div>
</div>
```

**Update with your jobs:**
- Employment periods
- Job titles
- Company names
- Job descriptions
- Your achievements (bullet points)
- Technologies you used

### 5. **Projects Section**
Edit around line 850:

```html
<div class="project-card">
    <div class="project-image">
        <div class="project-image-placeholder">🚀</div>
    </div>
    <div class="project-content">
        <h3 class="project-title">Cloud Infrastructure Platform</h3>
        <p class="project-description">
            Scalable cloud architecture solution with automated deployment 
            and monitoring capabilities for enterprise applications.
        </p>
        <div class="project-tags">
            <span class="project-tag">AWS</span>
            <span class="project-tag">Docker</span>
            <span class="project-tag">Kubernetes</span>
            <span class="project-tag">Terraform</span>
        </div>
    </div>
</div>
```

**Add your projects:**
- Project names
- Project descriptions
- Technologies used
- Change emojis (🚀, 🔒, ⚡) to match your projects

### 6. **Contact Information**
Edit around line 950:

```html
<div class="contact-links">
    <a href="mailto:contact@example.com" class="contact-link">Email</a>
    <a href="#" class="contact-link">LinkedIn</a>
    <a href="#" class="contact-link">GitHub</a>
</div>
```

**Update with your links:**
- Replace "contact@example.com" with your email
- Add your LinkedIn URL
- Add your GitHub URL
- Add any other social links

## 🔧 **Method 2: Using Data File (Advanced)**

For easier management, you can use the existing `data/portfolio.json` file:

### 1. **Update Portfolio Data**
Edit `data/portfolio.json`:

```json
{
  "personal": {
    "name": "Muhammed Ajeel",
    "title": "Cloud Engineer & Cybersecurity Professional",
    "bio": "Your personal bio here...",
    "email": "your.email@example.com",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourusername"
  },
  "education": [
    {
      "degree": "Your Degree",
      "school": "Your University",
      "year": "2020-2024",
      "description": "Your specialization",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "experience": [
    {
      "title": "Your Job Title",
      "company": "Company Name",
      "period": "2023-Present",
      "description": "Job description",
      "achievements": ["Achievement 1", "Achievement 2"],
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "technologies": ["Tech1", "Tech2"],
      "link": "https://project-url.com"
    }
  ]
}
```

### 2. **Create Dynamic Loading Script**
Add this JavaScript to load from the data file:

```javascript
// Add this to the bottom of index.html before </body>
<script>
async function loadPortfolioData() {
    try {
        const response = await fetch('data/portfolio.json');
        const data = await response.json();
        
        // Update hero section
        document.querySelector('.hero-name').textContent = data.personal.name;
        document.querySelector('.hero-subtitle').textContent = data.personal.title;
        
        // Update about section
        document.querySelector('.about-title').textContent = data.personal.name;
        document.querySelector('.about-text').textContent = data.personal.bio;
        
        // Update contact links
        document.querySelector('a[href^="mailto:"]').href = `mailto:${data.personal.email}`;
        
        console.log('Portfolio data loaded successfully');
    } catch (error) {
        console.log('Using static content');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadPortfolioData);
</script>
```

## 📝 **Step-by-Step Instructions**

### **Option A: Quick HTML Edit (Recommended for beginners)**

1. **Open** `index.html` in any text editor
2. **Search** for "Muhammed Ajeel" and replace with your name
3. **Search** for "Cloud Engineer" and replace with your title
4. **Find** the education section and update with your schools
5. **Find** the experience section and update with your jobs
6. **Find** the projects section and update with your projects
7. **Find** the contact section and update with your email/links
8. **Save** the file
9. **Refresh** your browser at `http://localhost/port`

### **Option B: Use Data File (Recommended for advanced users)**

1. **Edit** `data/portfolio.json` with your information
2. **Add** the dynamic loading script to `index.html`
3. **Test** by refreshing your browser

## 🎨 **Customization Tips**

### **Adding More Projects**
Copy this block and paste it in the projects section:

```html
<div class="project-card">
    <div class="project-image">
        <div class="project-image-placeholder">🎯</div>
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Name</h3>
        <p class="project-description">
            Your project description here...
        </p>
        <div class="project-tags">
            <span class="project-tag">Technology1</span>
            <span class="project-tag">Technology2</span>
        </div>
    </div>
</div>
```

### **Adding More Experience**
Copy this block and paste it in the experience section:

```html
<div class="experience-item animate-on-scroll">
    <div class="experience-period">Year - Year</div>
    <div class="experience-content">
        <h3 class="experience-title">Job Title</h3>
        <div class="experience-company">Company Name</div>
        <div class="experience-description">
            <p>Job description...</p>
            <ul class="experience-achievements">
                <li>Achievement 1</li>
                <li>Achievement 2</li>
            </ul>
        </div>
        <div class="experience-tech">
            <span class="tech-tag">Tech1</span>
            <span class="tech-tag">Tech2</span>
        </div>
    </div>
</div>
```

### **Changing Colors**
Edit the CSS variables at the top of `index.html`:

```css
:root {
    --color-accent: #ff6b35; /* Change this to your preferred color */
    --color-bg: #0a0a0a;     /* Background color */
    --color-surface: #1a1a1a; /* Card backgrounds */
}
```

## 🚀 **Quick Start Checklist**

- [ ] Replace "Muhammed Ajeel" with your name
- [ ] Update professional title/subtitle
- [ ] Write your personal bio
- [ ] Add your education details
- [ ] Add your work experience
- [ ] Add your projects
- [ ] Update contact information
- [ ] Test the website
- [ ] Customize colors (optional)
- [ ] Add more sections (optional)

## 📞 **Need Help?**

If you need help with any specific section, just let me know what information you want to add and I can help you place it in the right location!