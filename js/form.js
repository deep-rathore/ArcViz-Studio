// EmailJS configuration variables
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID

const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const consent = document.getElementById('consent').checked;
        
        if (!name || !email || !message || !consent) {
            alert('Please fill all required fields and accept the privacy policy.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        const submitBtn = e.target.querySelector('.form-submit');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                phone: document.getElementById('phone').value,
                project_type: document.getElementById('project-type').value,
                budget: document.getElementById('budget').value,
                message: message
            }, PUBLIC_KEY);
            
            // GSAP success animation
            gsap.to('#contactForm', { 
                opacity: 0, 
                y: -20, 
                duration: 0.5, 
                onComplete: () => {
                    document.getElementById('contactForm').style.display = 'none';
                    document.getElementById('formSuccess').style.display = 'block';
                    gsap.from('#formSuccess', { opacity: 0, y: 20, duration: 0.6 });
                }
            });
        } catch(err) {
            submitBtn.textContent = 'Send Enquiry';
            submitBtn.disabled = false;
            alert('Something went wrong. Please try calling us directly.');
            console.error('EmailJS Error:', err);
        }
    });
}
