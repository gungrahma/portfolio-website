document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (projectId) {
        const projects = {
            'ai-research': {
                category: 'AI',
                title: 'Build an simple AI Agent using n8n',
                description: 'How i built a simple AI agent using n8n to automate tasks.',
                challenge: 'TBA',
                solution: 'TBA',
                result: 'TBA',
                image: ''
            },
            'coinfolio': {
                category: 'UI/UX',
                title: 'Analyse BROS Hospital : When UI can kill UX',
                description: 'A comprehensive analysis of the user interface and user experience of BROS Hospital\'s digital platforms.',
                challenge: 'Most healthcare apps are cluttered with noisy data. The user wanted a calm way to check their health metrics.',
                solution: 'We designed a dark-mode interface using React Native, focusing only on the essential metrics: Total Balance and 24h Change. No news feeds, no ads.',
                result: 'Achieved 10,000 active users in the first month and featured in "Best Design Apps" on the App Store.',
                image: 'assets/coinfolio-shot.png' 
            },
            'architecture': {
                category: 'UI/UX',
                title: 'UI/UX Rework (Case study : Bank BPD BALI)',
                description: 'A rework of UI app from BPD BALI Bank.',
                challenge: 'The firm wanted to showcase their blueprints and finished buildings side-by-side without a complex navigation.',
                solution: 'Implemented a horizontal scrolling grid layout using CSS Grid and sparse Javascript for smooth interactions.',
                result: 'The site won an Awwwards Honorable Mention and helped the firm secure 3 major commercial contracts.',
                image: 'assets/architecture-shot.png' 
            },
            'Cosplay': {
                category: 'Cosplay',
                title: 'Cosplay App Redesign',
                description: 'A redesign of a popular cosplay app to improve user engagement.',
                challenge: 'The app had a high drop-off rate during the onboarding process.',
                solution: 'We implemented a more intuitive onboarding flow and personalized user profiles.',
                result: 'Increased user retention by 30% and received positive feedback from the community.',
                image: 'assets/cosplay-shot.png'
            }

        };

        const data = projects[projectId];
        if (data) {
            document.getElementById('project-category').textContent = data.category;
            document.getElementById('project-title').textContent = data.title;
            document.getElementById('project-description').textContent = data.description;
            document.getElementById('project-challenge').textContent = data.challenge;
            document.getElementById('project-solution').textContent = data.solution;
            document.getElementById('project-result').textContent = data.result;

            // Update Image
            const imgElement = document.getElementById('project-image');
            if (imgElement && data.image) {
                imgElement.src = data.image;
                imgElement.alt = data.title + " Screenshot";
            }

            document.title = data.title + " - Case Study";
        }
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('show');
                    }
                });
            });
        });
    }

    const blogId = urlParams.get('id');
    if (blogId && window.location.pathname.includes('blog-post.html')) {
        const posts = {
            'introduce': {
                title: 'Introduce and pathway',
                date: 'Jan 1, 2026',
                content: `
                    <p>In this section, i just wanna share my experience as a AI Enthusiasm, Project planner, Editor and VALORANT Coach so far!</p>
                    <h2>How my journey started</h2>
                    <p>TBA</p>
                    <h3>What i learned in the past few years : </h3>
                    <p>TBA</p>
                    <h3>Key of sucess what i'm doing and motivation</h3>
                    <ol>
                        <li>Good</li>
                        <li>Bad</li>
                    </ol>
                `
            },

            'openclaw': {
                title: 'Setup your AI Agent using Openclaw',
                date: 'Feb 18, 2026',
                content: `
                    <p>How to setup your AI Agent using Openclaw</p>
                    <h2>Understanding AI Agent</h2>
                    <p>An AI Agent is a software entity that can perform tasks autonomously or semi-autonomously. It uses artificial intelligence techniques to understand its environment, make decisions, 
                    and take actions to achieve specific goals.</p>
                    <p>When we talk about AI Agents, we often think about their capabilities, such as natural language processing, machine learning, and computer vision. 
                    These capabilities enable AI Agents to interact with users and their environment in meaningful ways.</p>
                    <h2>What is Openclaw?</h2>
                    <p>Openclaw is a fully free-to-use (Open Source) framework for building AI Agents in many chat platforms.</p>
                    <p>With Openclaw, you can create AI Agents that can interact with users in various chat platforms, such as Slack, Discord, and Microsoft Teams.</p>
                `
            },

            'ui-ux-kill': {
                title: 'Why UI can also kill UX in an applications?',
                date: 'Oct 20, 2025',
                content: `
                    <p>UI can kill the UX, but how?</p>
                    <h2>Understanding basic between UI and UX</h2>
                    <p>UI is a visual representation of the system, while UX encompasses the overall experience a user has with the system.
                    in other words, UI is about the look and feel of the product, while UX is about the functionality and user journey.</p>
                    <p>When we talking about UI stuff, it genuiely have connection between the interface and the experience. Making a perfect UI
                    itself it's not too hard while thinking about the experience user that would be effected around that.</p>
                    <h2>How they kill each other?</h2>
                    <p>They killing each other it's quite simple, just like knive with two eyes.</p>
                    <p>First, knive itself can kill people. In this UI and UX cases, when they have a really perfection UI but they have so much resource to load,
                    it would be affected hard with the UX itself. So, user can't experience the best in that app.</p>
                    <p>Second, knive itself can chop some "vegetable". In this UI and UX cases, this knive can help anything. For an example, when
                    we talk about a simple and minimalist UI, the experience itself quite simple too!. So, the app can driven a good experience and smooth
                    between the system and the user.
                    <h2>Real case study</h2>
                    <p>Let's consider a real-world example where a poorly designed UI led to a frustrating user experience.</p>
                    <h2>A. Case Study: BROS Mobile Application</h2>
                    <p>In this case,</p>
                    <ol>
                        <li><strong>Problem:</strong> Users couldn't find the main action button.</li>
                        <li><strong>Solution:</strong> Redesign the layout to make the button more prominent.</li>
                    </ol>
                `
            },
            'google-devfest': {
                title: 'Google DevFest Bali 2025 : A new experience',
                date: 'Dec 6, 2025',
                content: `
                    <h2>A new experience at Google DevFest Bali 2025</h2>
                    <p>This year's Google DevFest in Bali was an incredible experience filled with learning and networking opportunities.
                    In this year, Google Devfest focusing on AI and its impact on various industries.</p>
                    <h2>What is Google DevFest? and what the benefit for myself?</h2>
                    <p>DevFest is a large offline event by google that contains hundred or thousand developer to share experience between expert and participants. 
                    The event typically features a variety of sessions, workshops, and networking opportunities, making it a valuable experience for developers at all levels.</p>
                    <h2>Highlights from the Event</h2>
                    <h4>Workshop : Building forms with AI</h4>
                    <p>In this Workshop, me with my friend curious about the title. Why we curious? simple. "Building forms with AI"? 
                    so we gonna prompting this? why?</p>
                    <p>After i explore the workshop, i just found what we gonna do. We are <strong>NOT ACTUALLY</strong> building
                    forms with AI, but we <strong>INSERT LOCAL AI</strong> in our forms code, This is was a experimental use from google
                    to test local AI that can generate fill in the form that we've made! it's took a long time to spend downloading Local AI (Gemma).</p>
                    <h4>Talkshow : Smart Tower Recommendation: Driving Tower Profitability with Geospatial AI</h4>
                    <p><strong>This talkshow was insane tech.</strong> Why i wrote like this? I dont even know what the in the earth is <strong>GEOSPATIAL AI.</strong></p>
                    <p>After i listen the talkshow, i just realize this kinda tech was a new and revolutioner for business impact. Geospatial AI is a GPS AI that can searching
                    place as simple as searching in google maps. It was fun because if you wanna start your business, you gonna survey that place before build something!
                    But with this Geospatial AI, you can survey with AI stuff and research are that place is potentialy making money at the place that you wanna survey
                    (in terms of Geographical, Total population etc).<p>
                    <h4>Talkshow : Optimising Classification Tasks with Gemma</h4>
                    <p>This is cool talkshow. With Mr Matthias Baetens as a guide teaching "How you optimise task classification with local model gemma", it's bring me
                    a good solution as not all local LLM can 100% perfect.</p>
                `
            },
            'project-management': {
                title: 'How manage your cosplay project as simple but perfect',
                date: 'June 8, 2025',
                content: `
                    <h2>Managing Your Cosplay Project</h2>
                    <p>In this post, I'll share my approach to managing a cosplay project effectively while keeping it simple.</p>
                    <h2>Key Steps to Success</h2>
                    <ol>
                        <li><strong>Planning:</strong> Start with a clear plan outlining your goals, budget, and timeline.</li>
                        <li><strong>Organization:</strong> Keep all your materials and resources organized for easy access.</li>
                        <li><strong>Execution:</strong> Break down tasks into manageable steps and tackle them one at a time.</li>
                    </ol>
                    <h2>Conclusion</h2>
                    <p>By following these steps, you can manage your cosplay project with ease and achieve great results.</p>
                `
            }

        };

        const post = posts[blogId];
        if (post) {
            document.title = post.title + " - Lamfy Blog";
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-date').textContent = post.date;
            document.getElementById('post-content').innerHTML = post.content;
        } else {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
        }
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        } else {
        }
    }
    if (!savedTheme) {
        updateThemeIcon('light');
    }

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

});
