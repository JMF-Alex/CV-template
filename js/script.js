document.addEventListener('DOMContentLoaded', function() {
    
    const navigationLinks = document.querySelectorAll('nav a[href^="#"]');
    navigationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const contactForm = document.querySelector('.contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    const requiredFields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', validateField);
    });

    function validateField(e) {
        const field = e.target;
        const fieldContainer = field.closest('.field');
        
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un email válido';
            }
        } else if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un teléfono válido';
            }
        }
        
        if (!isValid) {
            field.style.borderColor = '#dc3545';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = errorMessage;
            fieldContainer.appendChild(errorDiv);
        } else {
            field.style.borderColor = field.value ? '#28a745' : '#e9ecef';
        }
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        requiredFields.forEach(field => {
            const event = new Event('blur');
            field.dispatchEvent(event);
            
            if (!field.value.trim()) {
                isFormValid = false;
            }
        });
        
        const privacyCheckbox = contactForm.querySelector('#privacy');
        if (!privacyCheckbox.checked) {
            isFormValid = false;
            alert('Debes aceptar la política de privacidad para continuar');
            return;
        }
        
        if (isFormValid) {
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('¡Gracias por tu mensaje! Te contactaré pronto.');
                contactForm.reset();
                submitButton.textContent = 'Enviar Mensaje';
                submitButton.disabled = false;
                
                const allFields = contactForm.querySelectorAll('input, select, textarea');
                allFields.forEach(field => {
                    field.style.borderColor = '#e9ecef';
                });
                
                const errorMessages = contactForm.querySelectorAll('.error-message');
                errorMessages.forEach(msg => msg.remove());
                
            }, 2000);
        } else {
            alert('Por favor, completa todos los campos obligatorios correctamente');
        }
    });

    const resetButton = contactForm.querySelector('button[type="reset"]');
    resetButton.addEventListener('click', function() {
        setTimeout(() => {
            const allFields = contactForm.querySelectorAll('input, select, textarea');
            allFields.forEach(field => {
                field.style.borderColor = '#e9ecef';
            });
            
            const errorMessages = contactForm.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
        }, 10);
    });

    const mainTitle = document.querySelector('header h1');
    const titleText = mainTitle.textContent;
    mainTitle.textContent = '';
    
    let characterIndex = 0;
    function typeWriter() {
        if (characterIndex < titleText.length) {
            mainTitle.textContent += titleText.charAt(characterIndex);
            characterIndex++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);

    const messageTextarea = document.querySelector('#message');
    const maxLength = 500;
    
    const characterCounter = document.createElement('div');
    characterCounter.className = 'char-counter';
    characterCounter.style.textAlign = 'right';
    characterCounter.style.fontSize = '0.875rem';
    characterCounter.style.color = '#6c757d';
    characterCounter.style.marginTop = '0.25rem';
    
    messageTextarea.parentNode.appendChild(characterCounter);
    
    function updateCharacterCounter() {
        const currentLength = messageTextarea.value.length;
        characterCounter.textContent = `${currentLength}/${maxLength} caracteres`;
        
        if (currentLength > maxLength * 0.9) {
            characterCounter.style.color = '#dc3545';
        } else if (currentLength > maxLength * 0.7) {
            characterCounter.style.color = '#ffc107';
        } else {
            characterCounter.style.color = '#6c757d';
        }
    }
    
    messageTextarea.addEventListener('input', updateCharacterCounter);
    messageTextarea.setAttribute('maxlength', maxLength);
    updateCharacterCounter();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const intersectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        intersectionObserver.observe(section);
    });

    function highlightActiveNavigationLink() {
        const sections = document.querySelectorAll('section[id]');
        const navigationLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navigationLinks.forEach(link => {
            link.style.backgroundColor = '';
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.style.backgroundColor = 'rgba(255,255,255,0.3)';
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveNavigationLink);
    
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
        }
    });
});