

import {
    startChat,
    sendMessage,
    generateContactResponse,
    identifyEWaste,
    findRecyclingCenters,
    analyzeDeviceImpact,
    getWipingInstructions,
} from './services/geminiService.js';


document.addEventListener('DOMContentLoaded', () => {
    let lastIdentifiedItem = null;

    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                header.classList.add('bg-brand-dark/80', 'backdrop-blur-lg', 'shadow-lg');
                header.classList.remove('bg-transparent');
            } else {
                header.classList.remove('bg-brand-dark/80', 'backdrop-blur-lg', 'shadow-lg');
                header.classList.add('bg-transparent');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- SMOOTH SCROLLING ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    document.querySelectorAll('button[data-scroll-to]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.scrollTo;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // --- DYNAMIC CONTENT INJECTION ---
    
    // Services Section
    const servicesContainer = document.querySelector('#services .grid');
    if (servicesContainer) {
        const services = [
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-light-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 9.5l-1.5-1.5M4.5 14.5l1.5 1.5" /></svg>`, title: 'Secure Data Destruction', description: 'Protect your sensitive information with our certified data wiping and physical destruction services, ensuring complete data security.' },
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-light-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5" /><path d="M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2" /></svg>`, title: 'Corporate & Business Solutions', description: 'Tailored pickup schedules and recycling programs for businesses of all sizes. We handle everything from office cleanouts to regular IT asset disposal.' },
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-light-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`, title: 'Residential Drop-off', description: 'Convenient drop-off locations for individuals to safely dispose of old electronics, from smartphones and laptops to TVs and appliances.' },
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-light-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v3m0 9v-3m0-6h3m-3 12h3m-6-6v3m0-9v-3m-3 6h3m12 0h-3m-6 3V6m-3 6h3m-3 0h-3m6 6v-3m6-6h3m-3 0h-3" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l-4-4-4 4m8 8l-4 4-4-4" /></svg>`, title: 'Component Recovery', description: 'We meticulously sort and recover valuable materials and components for reuse, minimizing waste and conserving natural resources.' },
        ];
        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = "animate-fade-in-up";
            card.style.animationDelay = `${index * 150}ms`;
            card.innerHTML = `
                <div class="bg-brand-blue p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out h-full">
                    ${service.icon}
                    <h3 class="text-2xl font-bold mb-3 text-white">${service.title}</h3>
                    <p class="text-brand-light opacity-80">${service.description}</p>
                </div>`;
            servicesContainer.appendChild(card);
        });
    }

    // Process Section
    const processContainer = document.getElementById('process-steps-container');
    if (processContainer) {
        const steps = [
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`, title: 'Step 1: Collection', description: 'You schedule a pickup or drop off your e-waste at one of our convenient locations. We handle all the logistics.' },
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>`, title: 'Step 2: Sorting & Dismantling', description: 'Our expert technicians manually sort and dismantle devices to separate materials like plastics, metals, and circuit boards.' },
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 9.5l-1.5-1.5M4.5 14.5l1.5 1.5" /></svg>`, title: 'Step 3: Data Sanitization', description: 'All data-bearing devices undergo a rigorous, certified data destruction process to guarantee your privacy and security.' },
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v3m0 9v-3m0-6h3m-3 12h3m-6-6v3m0-9v-3m-3 6h3m12 0h-3m-6 3V6m-3 6h3m-3 0h-3m6 6v-3m6-6h3m-3 0h-3" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l-4-4-4 4m8 8l-4 4-4-4" /></svg>`, title: 'Step 4: Responsible Recycling', description: 'Recovered materials are sent to certified partners for processing, re-entering the supply chain and reducing environmental impact.' },
        ];

        steps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = "flex flex-col items-center text-center p-4 md:w-1/4 animate-fade-in-up";
            stepEl.style.animationDelay = `${index * 200}ms`;
            stepEl.innerHTML = `
                <div class="bg-brand-dark p-6 rounded-full mb-6">
                  ${step.icon}
                </div>
                <h3 class="text-2xl font-bold mb-3 text-white">${step.title}</h3>
                <p class="text-brand-light opacity-80">${step.description}</p>
            `;
            processContainer.appendChild(stepEl);

            if (index < steps.length - 1) {
                const arrowEl = document.createElement('div');
                arrowEl.className = "hidden md:flex items-center justify-center w-auto";
                arrowEl.innerHTML = `<svg class="w-12 h-12 text-brand-green opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>`;
                processContainer.appendChild(arrowEl);
            }
        });
    }

    // --- E-WASTE IDENTIFIER ---
    const identifierFileInput = document.getElementById('ewaste-upload-input');
    const identifierUploadLabel = document.getElementById('ewaste-upload-label');
    const identifierImagePreview = document.getElementById('ewaste-image-preview');
    const identifierResultArea = document.getElementById('identifier-result-area');
    let imageBase64 = null;
    let imageMimeType = null;

    const handleIdentifyClick = async () => {
        if (!imageBase64 || !imageMimeType || !identifierResultArea) {
            identifierResultArea.innerHTML = `<p class="text-red-400 text-center">Please upload an image first.</p>`;
            return;
        }

        identifierResultArea.innerHTML = `
            <div class="text-center">
                <svg class="animate-spin h-10 w-10 text-brand-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="mt-4 text-lg text-brand-light">Analyzing image...</p>
            </div>`;

        try {
            const jsonResponse = await identifyEWaste(imageBase64, imageMimeType);
            const result = JSON.parse(jsonResponse);
            lastIdentifiedItem = result; // Store for contact form
            
            let resultHTML = `
                <div class="text-center">
                    <p class="text-brand-light opacity-80 mb-1">Identified Item:</p>
                    <h3 class="text-3xl font-bold text-white mb-2">${result.itemName}</h3>
                    <p class="text-brand-light opacity-80 mb-1">Category:</p>
                    <p class="text-lg text-brand-light-green mb-4">${result.category}</p>
                    
                    `;
            if (result.recyclable) {
                 resultHTML += `
                    <p class="text-green-400 font-bold mb-4">✅ We can recycle this item!</p>
                    <button data-scroll-to="#contact" class="bg-brand-green hover:bg-brand-light-green text-brand-dark font-bold py-2 px-6 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105">
                        Schedule Pickup
                    </button>`;
            } else {
                resultHTML += `<p class="text-yellow-400 font-bold">❌ This item may not be recyclable through our standard program. Please contact us for more information.</p>`;
            }
            resultHTML += `</div></div>`;
            identifierResultArea.innerHTML = resultHTML;
            
            const newScrollButton = document.querySelector('#identifier-result-area button[data-scroll-to]');
            if(newScrollButton) {
                newScrollButton.addEventListener('click', function (e) {
                     e.preventDefault();
                     const contactFormMessage = document.querySelector('#contact-form textarea[name="message"]');
                     if(contactFormMessage && lastIdentifiedItem) {
                        contactFormMessage.value = `I'd like to schedule a pickup for my identified e-waste: ${lastIdentifiedItem.itemName} (${lastIdentifiedItem.category}).`;
                     }
                     document.querySelector(this.dataset.scrollTo).scrollIntoView({ behavior: 'smooth' });
                });
            }

        } catch (err) {
            identifierResultArea.innerHTML = `<p class="text-red-400 text-center">${err.message || 'An unexpected error occurred.'}</p>`;
        }
    };

    const resetIdentifierUI = () => {
        if (!identifierResultArea) return;
        identifierResultArea.innerHTML = `
            <button id="ewaste-identify-button" class="bg-brand-green hover:bg-brand-light-green text-brand-dark font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed" disabled>
                Identify Item
            </button>`;
        const identifyButton = document.getElementById('ewaste-identify-button');
        if (identifyButton) {
            identifyButton.addEventListener('click', handleIdentifyClick);
        }
    };
    resetIdentifierUI(); // Initial setup

    identifierFileInput?.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file && identifierUploadLabel && identifierImagePreview) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result !== 'string' || !result.startsWith('data:image/')) {
                    console.error('File reader did not return a valid image data URL.');
                    if(identifierResultArea) {
                        identifierResultArea.innerHTML = `<p class="text-red-400 text-center">Invalid file type. Please upload an image.</p>`;
                    }
                    if (identifierFileInput) identifierFileInput.value = '';
                    return;
                }

                identifierImagePreview.src = result;
                identifierImagePreview.classList.remove('hidden');
                identifierUploadLabel.classList.add('hidden');

                const mimeTypeMatch = result.match(/^data:(image\/[a-zA-Z0-9-.+]+);base64,/);
                if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
                    console.error('Could not parse Data URL.');
                    if(identifierResultArea) {
                        identifierResultArea.innerHTML = `<p class="text-red-400 text-center">There was an error processing the image file.</p>`;
                    }
                    imageBase64 = null;
                    imageMimeType = null;
                    if (identifierFileInput) identifierFileInput.value = '';
                    return;
                }
                
                imageMimeType = mimeTypeMatch[1];
                imageBase64 = result.substring(mimeTypeMatch[0].length);
                
                resetIdentifierUI();
                document.getElementById('ewaste-identify-button')?.removeAttribute('disabled');
            };

            reader.onerror = () => {
                 if(identifierResultArea) {
                    identifierResultArea.innerHTML = `<p class="text-red-400 text-center">Could not read the selected file.</p>`;
                 }
            };

            reader.readAsDataURL(file);
        }
    });

    // --- AI SMART TOOLS ---
    const findCentersBtn = document.getElementById('find-centers-btn');
    const locatorResultsContainer = document.getElementById('locator-results');
    const analyzerForm = document.getElementById('analyzer-form');
    const analyzerResultsContainer = document.getElementById('analyzer-results');
    const securityAdvisorForm = document.getElementById('security-advisor-form');
    const securityAdvisorResultsContainer = document.getElementById('security-advisor-results');
    
    const showLoadingSpinner = (container) => {
        container.innerHTML = `
            <div class="text-center p-4">
                <svg class="animate-spin h-8 w-8 text-brand-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="mt-2 text-brand-light opacity-80">Thinking...</p>
            </div>`;
    };

    findCentersBtn?.addEventListener('click', () => {
        const deviceType = document.getElementById('device-type-locator').value;
        if (!deviceType.trim()) {
            locatorResultsContainer.innerHTML = `<p class="text-yellow-400 text-center">Please enter a device type.</p>`;
            return;
        }
        
        showLoadingSpinner(locatorResultsContainer);
        
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const resultsJson = await findRecyclingCenters(latitude, longitude, deviceType);
                        const results = JSON.parse(resultsJson);
                        renderLocatorResults(results);
                    } catch (error) {
                        locatorResultsContainer.innerHTML = `<p class="text-red-400 text-center">${error.message}</p>`;
                    }
                },
                (error) => {
                     locatorResultsContainer.innerHTML = `<p class="text-red-400 text-center">Could not get your location. Please enable location services. Error: ${error.message}</p>`;
                }
            );
        } else {
            locatorResultsContainer.innerHTML = `<p class="text-red-400 text-center">Geolocation is not supported by your browser.</p>`;
        }
    });

    const renderLocatorResults = (results) => {
        if (!results || results.length === 0) {
            locatorResultsContainer.innerHTML = `<p class="text-center text-brand-light">No suitable centers found. Please try a different device type or contact us directly.</p>`;
            return;
        }
        
        const resultsHtml = results.map(center => `
            <div class="bg-brand-dark p-4 rounded-lg mb-4 border border-brand-teal/50">
                <h4 class="font-bold text-lg text-brand-light-green">${center.name}</h4>
                <p class="text-sm text-brand-light">${center.address}</p>
                <p class="text-sm text-brand-light opacity-70 mt-2"><strong>Accepts:</strong> ${center.accepted}</p>
                <p class="text-sm text-yellow-400 mt-2"><strong>Recommended because:</strong> ${center.bestFor}</p>
            </div>
        `).join('');
        locatorResultsContainer.innerHTML = `<h4 class="text-xl font-bold text-white mb-4">Recommended Centers:</h4>${resultsHtml}`;
    };

    analyzerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const deviceName = document.getElementById('device-name-analyzer').value;
        const deviceCondition = document.getElementById('device-condition').value;

        showLoadingSpinner(analyzerResultsContainer);

        try {
            const resultsJson = await analyzeDeviceImpact(deviceName, deviceCondition);
            const results = JSON.parse(resultsJson);
            renderAnalyzerResults(results);
        } catch(error) {
            analyzerResultsContainer.innerHTML = `<p class="text-red-400 text-center">${error.message}</p>`;
        }
    });
    
    const renderAnalyzerResults = (data) => {
        const { impact, recommendation } = data;
        const recommendationColor = {
            "Recycle": "bg-red-500/20 text-red-300 border-red-500",
            "Reuse": "bg-green-500/20 text-green-300 border-green-500",
            "Refurbish": "bg-yellow-500/20 text-yellow-300 border-yellow-500"
        }[recommendation.action] || "bg-gray-500/20 text-gray-300 border-gray-500";

        analyzerResultsContainer.innerHTML = `
            <div>
                <h4 class="text-xl font-bold text-white mb-4">Your Estimated Impact:</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div class="bg-brand-dark p-4 rounded-lg text-center border border-brand-teal/50">
                        <p class="text-sm opacity-70">Toxic Waste Avoided</p>
                        <p class="font-bold text-brand-light-green text-lg">${impact.toxicWasteAvoided}</p>
                    </div>
                     <div class="bg-brand-dark p-4 rounded-lg text-center border border-brand-teal/50">
                        <p class="text-sm opacity-70">Materials Recovered</p>
                        <p class="font-bold text-brand-light-green text-lg">${impact.materialsRecovered}</p>
                    </div>
                     <div class="bg-brand-dark p-4 rounded-lg text-center border border-brand-teal/50">
                        <p class="text-sm opacity-70">CO₂ Saved</p>
                        <p class="font-bold text-brand-light-green text-lg">${impact.co2Saved}</p>
                    </div>
                </div>

                <h4 class="text-xl font-bold text-white mb-4">AI Recommendation:</h4>
                <div class="p-4 rounded-lg border ${recommendationColor}">
                    <h5 class="font-bold text-2xl">${recommendation.action}</h5>
                    <p class="mt-2">${recommendation.reason}</p>
                    ${recommendation.refurbishEstimate ? `
                        <div class="mt-4 pt-4 border-t border-white/10">
                            <p><strong>Estimated Refurbish Cost:</strong> ${recommendation.refurbishEstimate.cost}</p>
                            <p><strong>Value Insight:</strong> ${recommendation.refurbishEstimate.value}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    };
    
    securityAdvisorForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const deviceType = document.getElementById('device-type-security').value;
        if (!deviceType.trim()) {
            securityAdvisorResultsContainer.innerHTML = `<p class="text-yellow-400 text-center">Please enter a device type.</p>`;
            return;
        }
        
        showLoadingSpinner(securityAdvisorResultsContainer);
        
        try {
            const resultsJson = await getWipingInstructions(deviceType);
            const results = JSON.parse(resultsJson);
            renderSecurityAdvice(results);
        } catch(error) {
            securityAdvisorResultsContainer.innerHTML = `<p class="text-red-400 text-center">${error.message}</p>`;
        }
    });
    
    const renderSecurityAdvice = (data) => {
        const instructionsHtml = data.instructions.map(item => `
            <li class="flex items-start py-2">
                <span class="font-bold text-brand-green mr-3">${item.step}.</span>
                <span class="text-brand-light">${item.action}</span>
            </li>
        `).join('');

        securityAdvisorResultsContainer.innerHTML = `
            <div class="bg-brand-dark p-6 rounded-lg mt-6 border border-brand-teal/50">
                <h4 class="text-2xl font-bold text-white mb-4">Secure Wiping Guide for: <span class="text-brand-light-green">${data.device}</span></h4>
                <ol class="list-none divide-y divide-brand-teal/30">
                    ${instructionsHtml}
                </ol>
                <div class="mt-6 pt-4 border-t border-brand-teal/50">
                    <h5 class="font-bold text-yellow-400 text-lg mb-2">Important Security Tip</h5>
                    <p class="text-brand-light opacity-80">${data.securityTip}</p>
                </div>
                 <div class="mt-4 text-xs text-brand-light opacity-60">
                    <p><strong>Disclaimer:</strong> ${data.disclaimer}</p>
                </div>
            </div>
        `;
    };

    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    const contactFormContainer = document.getElementById('contact-form-container');
    const submitButton = document.getElementById('contact-submit-button');
    const errorP = document.getElementById('contact-form-error');

    // --- EMAILJS INITIALIZATION ---
    const EMAILJS_PUBLIC_KEY = 'Ges_HsYFmnVGCYYrX'; // Replace with your Public Key
    const EMAILJS_SERVICE_ID = 'service_1ej3o18'; // Replace with your Service ID
    const EMAILJS_CONTACT_TEMPLATE_ID = 'template_py6hu9f'; // Replace with your Contact Form Template ID

    if (EMAILJS_PUBLIC_KEY) {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');

        if (!name || !email || !service || !message) {
            errorP.textContent = 'Please fill out all fields.';
            errorP.classList.remove('hidden');
            return;
        }
        errorP.classList.add('hidden');

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const isEmailJsConfigured = EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_CONTACT_TEMPLATE_ID;
            if (isEmailJsConfigured) {
                await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, contactForm);
            } else {
                 console.warn(`EmailJS not configured. Simulating email send.`);
                 await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const geminiResponse = await generateContactResponse(name, service);
            contactFormContainer.innerHTML = `
                <div class="text-center p-8 bg-brand-green/10 border border-brand-green rounded-lg">
                  <h3 class="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p class="text-brand-light">${geminiResponse}</p>
                </div>`;

        } catch (error) {
            console.error('FAILED to send email:', error);
            errorP.textContent = 'Sorry, there was an error sending your message. Please try again.';
            errorP.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });


    // --- CHATBOT ---
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotMessagesContainer = document.getElementById('chatbot-messages');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSubmitButton = document.getElementById('chatbot-submit-button');

    const toggleChatbot = (forceOpen = null) => {
        const isOpen = chatbotWindow.classList.contains('flex');
        if ((forceOpen === true) || (!isOpen && forceOpen === null)) {
            chatbotWindow.classList.remove('hidden');
            chatbotWindow.classList.add('flex');
            chatbotInput.focus();
        } else {
            chatbotWindow.classList.add('hidden');
            chatbotWindow.classList.remove('flex');
        }
    };
    
    chatbotToggleButton?.addEventListener('click', () => toggleChatbot());
    chatbotCloseButton?.addEventListener('click', () => toggleChatbot(false));

    const addMessageToChat = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex w-full ${sender === 'user' ? 'justify-end' : ''}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `p-3 rounded-lg max-w-xs text-sm break-words ${sender === 'user' ? 'bg-brand-green text-brand-dark' : 'bg-brand-blue text-brand-light'}`;
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatbotMessagesContainer.appendChild(messageDiv);
        chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight;
    };
    
    const showLoadingIndicator = () => {
         const loadingDiv = document.createElement('div');
         loadingDiv.id = 'loading-indicator';
         loadingDiv.className = "flex";
         loadingDiv.innerHTML = `
            <div class="p-3 rounded-lg bg-brand-blue text-brand-light">
                <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-brand-light-green rounded-full animate-pulse" style="animation-delay: 0s"></div>
                    <div class="w-2 h-2 bg-brand-light-green rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-brand-light-green rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                </div>
            </div>`;
        chatbotMessagesContainer.appendChild(loadingDiv);
        chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight;
    };
    
    const removeLoadingIndicator = () => {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    };

    addMessageToChat("Hello! How can I help you with your e-waste recycling questions today?", 'assistant');
    startChat();

    chatbotForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const trimmedInput = chatbotInput.value.trim();
        if (!trimmedInput) return;

        addMessageToChat(trimmedInput, 'user');
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotSubmitButton.disabled = true;
        showLoadingIndicator();

        try {
            const aiResponse = await sendMessage(trimmedInput);
            removeLoadingIndicator();
            addMessageToChat(aiResponse, 'assistant');
        } catch (error) {
            console.error("Chatbot error:", error);
            removeLoadingIndicator();
            addMessageToChat("Sorry, I'm having trouble connecting right now. Please try again later.", 'assistant');
        } finally {
            chatbotInput.disabled = false;
            chatbotSubmitButton.disabled = false;
            chatbotInput.focus();
        }
    });

});