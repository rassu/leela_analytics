
export const arrow = '<svg viewBox="0 0 32 16" aria-hidden="true"><path d="M1 8h28M22 1l7 7-7 7"/></svg>';
const contactLink='<a class="text-link" href="/#contact">Tell us what you’re building '+arrow+'</a>';
const contactForm = `  <form id="contact-form" action="/api/contact" method="post" aria-label="Project enquiry">
    <div class="field-pair"><div class="field"><label for="name">Your name</label><input id="name" name="name" autocomplete="name" required minlength="2" maxlength="100"><span class="field-error" id="name-error"></span></div><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254"><span class="field-error" id="email-error"></span></div></div>
    <div class="field"><label for="company">Company <span>(optional)</span></label><input id="company" name="company" autocomplete="organization" maxlength="160"><span class="field-error" id="company-error"></span></div>
    <div class="field"><label for="message">What would you like to build?</label><textarea id="message" name="message" rows="4" required minlength="10" maxlength="5000" placeholder="A few lines about your idea or challenge…"></textarea><span class="field-error" id="message-error"></span></div>
    <div class="honey" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="website" tabindex="-1" autocomplete="off" maxlength="200"></div>
    <p class="form-note">We’ll use these details to respond to your enquiry. <a href="/privacy-policy.html">Privacy policy</a></p>
    <button class="button" type="submit"><span>Send enquiry</span>${arrow}</button>
    <p id="form-status" class="form-status" role="status" aria-live="polite" tabindex="-1"></p>
    <noscript><p class="form-note">This form needs JavaScript to send securely. Please <a href="mailto:hello@leelaanalytics.com">email us directly</a>.</p></noscript>
  </form>`;
const contactEmail = `<div class="contact-email"><h3>A conversation starts<br>with a few lines.</h3><p>Tell us what you’re working on, where you need a hand and any timing you have in mind.</p><a class="button" href="mailto:hello@leelaanalytics.com?subject=Project%20enquiry">Email Leela ${arrow}</a><p class="form-note">Opens your email app. You can also copy the address and write to us from your inbox.</p></div>`;
const home = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-copy">
    <h1 id="hero-title">AI, grounded<br>in your world.</h1>
    <p>We build AI products and the systems behind them. From models and data to the experience people use every day.</p>
    <a class="button" href="#expertise">Explore our expertise ${arrow}</a>
  </div>
  <figure class="hero-art"><img src="/assets/workshop-illustration.webp" width="1536" height="1024" fetchpriority="high" alt="An illustrated open workshop, with people, plants and spaces to think and build together."><figcaption>A little picture of how we like to work.</figcaption></figure>
</section>
<section class="section expertise" id="expertise">
  <div class="section-intro"><h2>Good ideas deserve<br>good engineering.</h2><p>AI becomes useful when it fits the work around it. We connect models, data and product design to build systems people can depend on.</p></div>
  <div class="expertise-list">
    <article><h3>AI &amp; LLM engineering</h3><div><p>Give a model the right context, tools and boundaries. We work on model selection, fine-tuning, retrieval, structured extraction and evaluation against the tasks that matter to you.</p><ul class="inline-list"><li>Model adaptation</li><li>Evaluation</li><li>Agent workflows</li></ul></div></article>
    <article><h3>Product design &amp; development</h3><div><p>Turn an early idea into something people can actually use. We design and build web and mobile experiences, with the operational tools that support them.</p><ul class="inline-list"><li>Web &amp; mobile</li><li>Multimodal experiences</li><li>Internal tools</li></ul></div></article>
    <article><h3>Data &amp; cloud infrastructure</h3><div><p>Build the foundations for the long run. We connect data pipelines, background jobs and cloud services, with attention to observability, maintainability and running costs.</p><ul class="inline-list"><li>Data pipelines</li><li>Cloud deployment</li><li>Background processing</li></ul></div></article>
  </div>
</section>
<section class="section applications">
  <div class="applications-heading"><h2>Built around<br>real-world work.</h2><p>Our experience spans consumer products and complex operational platforms. The details change. The care stays the same.</p><a class="text-link" href="/about-us.html">Get to know Leela ${arrow}</a></div>
  <div class="application-list">
    <article><h3>Make information useful.</h3><p>Intelligence platforms that turn unstructured content into searchable entities, relationships and evidence.</p></article>
    <article><h3>Help people make decisions.</h3><p>Food and nutrition tools, travel planning and visual discovery that bring context to everyday choices.</p></article>
    <article><h3>Move the work forward.</h3><p>Document extraction, commerce workflows and geospatial tools that connect information to the next action.</p></article>
  </div>
</section>
<section class="section infrastructure" id="infrastructure">
  <div class="section-intro"><h2>The systems<br>behind the work.</h2><p>We choose technology around the problem, your team and the environment it needs to run in. These are tools we build with.</p></div>
  <div class="stack">
    <article><h3>Cloud infrastructure</h3><div><p class="technology">Microsoft Azure · Container Apps · Blob Storage</p><p>Containerised applications, background services and managed file storage.</p></div></article>
    <article><h3>Models &amp; intelligence</h3><div><p class="technology">Azure OpenAI · Claude · Gemini · Ollama</p><p>Model integration, structured extraction, provider routing and self-hosted inference options.</p></div></article>
    <article><h3>Data &amp; orchestration</h3><div><p class="technology">PostgreSQL · Redis · Neo4j · BullMQ · Graphile Worker</p><p>Application data, caching, relationship graphs and reliable background processing.</p></div></article>
    <article><h3>Web &amp; mobile</h3><div><p class="technology">Next.js · React · TypeScript · Capacitor</p><p>Customer-facing products and the tools behind them, across web and mobile.</p></div></article>
  </div>
</section>
<section class="section approach" id="approach">
  <div class="section-intro"><h2>Think together.<br>Build with care.</h2><p>A clear path from an open question to a working system. We can help shape the whole product or join your team on a specific challenge.</p></div>
  <ol class="process">
    <li><span class="process-number">1</span><h3>Understand the work</h3><p>Start with the people, the data and the constraints. Agree on what a useful outcome looks like.</p></li>
    <li><span class="process-number">2</span><h3>Test the important idea</h3><p>Build a focused prototype. Evaluate the behaviour with real examples before expanding the scope.</p></li>
    <li><span class="process-number">3</span><h3>Make it ready to use</h3><p>Develop, integrate and deploy. Make the system understandable for the people who will run it.</p></li>
  </ol>
</section>
<section class="section contact" id="contact">
  <div class="contact-copy"><h2>What are you<br>working on?</h2><p>A new product, a difficult workflow, a model that needs to work better. Tell us a little about it.</p><a class="email-link" href="mailto:hello@leelaanalytics.com">hello@leelaanalytics.com</a><p class="contact-aside">Prefer a conversation? Email us and we’ll find a time.</p></div>
${contactForm}
</section>`;

const about=`
<section class="page-heading section"><h1>Curiosity, with<br>the craft to build.</h1><p>Leela Analytics is an AI and product engineering company. We work across the model, the application and the infrastructure to make useful ideas work in practice.</p></section>
<section class="section about-story"><div><h2>Close to the problem.<br>Involved in the details.</h2></div><div class="prose"><p>Building our own products has shaped how we approach a project. A promising model still needs clear interactions, dependable data and a place to run. Those connections are where much of the work happens.</p><p>We bring that perspective to teams building something new, adapting a language model, or improving a system already in use. We start by understanding the job it needs to do.</p><p>Our experience covers intelligence and analytics, multimodal consumer applications, document workflows, commerce and geospatial tools.</p></div></section>
<section class="section principles-section"><div class="section-intro"><h2>A few things<br>we care about.</h2><p>They guide the decisions we make, from the first prototype to the production system.</p></div><div class="principles"><article><h3>Make the behaviour visible.</h3><p>Evaluate with concrete examples. Make it possible to see where an answer came from and where a system can fail.</p></article><article><h3>Keep the user in the picture.</h3><p>Pay attention to the whole task: what happens before the model responds, and what someone needs to do next.</p></article><article><h3>Build for the people who maintain it.</h3><p>Choose understandable systems. Treat operational costs, documentation and handover as part of the work.</p></article></div></section>
<section class="section founder"><div><h2>Let’s work together.</h2><p>Leela is led by Babu Balasubramanian, Founder &amp; CEO. Start a conversation about your product, your team or a technical problem you’re working through.</p>${contactLink}</div><div class="founder-details"><h3>Babu Balasubramanian</h3><p>Founder &amp; CEO</p><a href="https://www.linkedin.com/in/bbalasubramanian/" rel="noopener noreferrer">Connect on LinkedIn ${arrow}</a></div></section>`;

const notes = [
{path:'evaluating-ai.html',title:'Start with the questions your AI needs to answer.',description:'A practical way to shape evaluation before choosing a model.',body:`<p>A model demo can make a project feel close to finished. The useful question is more specific: how does it behave on the work your users actually need to do?</p><h2>Collect examples before picking a winner.</h2><p>Start with representative inputs and the outcome you would consider useful. Include ordinary cases, incomplete information and situations where the system should ask for help. Keep a separate set of examples for checking changes.</p><h2>Decide what good means.</h2><p>A response may be accurate but unusable in the next step of a workflow. Look at factual correctness, required structure, source support and whether the user can act on it. Record the failures separately so improvements have a clear target.</p><h2>Evaluate the whole system.</h2><p>Prompts, retrieval, tools and interface decisions all affect the result. Compare changes against the same examples. Include latency and cost in the decision, alongside answer quality.</p><p>This gives the team a shared way to discuss progress and a more useful foundation for deciding whether adaptation or fine-tuning is the next step.</p>`},
{path:'designing-ai-workflows.html',title:'Design for the moments around the model.',description:'Good AI products make uncertainty and the next step understandable.',body:`<p>A model response is usually one moment in a longer task. A person supplied some information, waited for a result and now needs to decide what to do with it.</p><h2>Help people provide the right context.</h2><p>Clear questions, useful examples and well-chosen defaults can make an interaction easier. Ask for the information that changes the result. Avoid making people understand the implementation before they can begin.</p><h2>Make uncertainty useful.</h2><p>When information is missing, the interface can ask a follow-up question or offer a way to review the source. When extraction fails, people need a practical correction path. An error message should explain what happened and how to continue.</p><h2>Make the next action clear.</h2><p>A useful response might become an editable record, a comparison or a draft someone can review. Choose the format around the task. Give people control over consequential actions and make it easy to recover from mistakes.</p><p>These decisions are product work. They deserve the same attention as the model choice.</p>`},
{path:'practical-ai-infrastructure.html',title:'Give the prototype a sensible home.',description:'Think about running costs and operations while the system is still small.',body:`<p>The first deployment establishes habits that are easier to shape early: how work is queued, how failures are understood and how costs are tracked.</p><h2>Separate the request from longer work.</h2><p>Some tasks fit comfortably inside a web request. Document processing or multi-step analysis may need background execution. Make progress visible and decide what should happen if a job is retried.</p><h2>Know what failed.</h2><p>Useful logs connect a request to the services it touched without exposing private inputs unnecessarily. Distinguish a provider outage, an invalid result and a problem in your own application. They need different responses.</p><h2>Match infrastructure to actual usage.</h2><p>Choose deployment and storage around the workload and the team's operating capacity. Review idle resources as well as peak demand. Keep a route to change the setup when usage teaches you something new.</p><p>A modest, understandable starting point makes it easier to learn what the product really needs.</p>`}
];
const blog=`<section class="page-heading section"><h1>Notes from<br>building AI.</h1><p>Practical perspectives on the decisions between a promising idea and a useful product.</p></section><section class="section notes-list" aria-label="Engineering notes">${notes.map(n=>`<article><h2><a href="/${n.path}">${n.title}</a></h2><div><p>${n.description}</p><a class="text-link" href="/${n.path}" aria-label="Read: ${n.title}">Read the note ${arrow}</a></div></article>`).join('')}</section><section class="section small-contact"><h2>Have a question of your own?</h2>${contactLink}</section>`;

const legal={
'privacy-policy.html':{title:'Privacy policy',description:'How Leela Analytics handles website enquiries.',body:`<h2>Information you share</h2><p>When you contact Leela Analytics through this website, we receive the name, email address, company (if provided) and message you submit. We use these details to respond to your enquiry and discuss your requirements. Please avoid including sensitive personal information in your message.</p><h2>Service providers</h2><p>Contact-form messages are delivered through Resend, our email service provider. Hosting and email providers process technical information needed to deliver and protect their services, such as network and request information. The website does not use analytics or advertising trackers.</p><h2>Your information</h2><p>For questions about your information, or to request access, correction or deletion, email <a href="mailto:hello@leelaanalytics.com">hello@leelaanalytics.com</a>. We may need to verify that a request relates to you before acting on it.</p><h2>Changes to this notice</h2><p>We may update this notice as the website changes. The date above identifies the latest update.</p>`},
'cookie-policy.html':{title:'Cookie policy',description:'Cookies and similar technologies on this website.',body:`<h2>A simple browsing experience</h2><p>This website does not use analytics or advertising cookies. Its own application code does not set cookies or store information in your browser’s local storage. Fonts are served with the site rather than loaded from an external font service.</p><h2>Browser controls</h2><p>You can inspect, block or delete cookies through your browser settings. Hosting and security services may process technical request information needed to operate the website.</p><h2>Future changes</h2><p>If we introduce features that use optional cookies, we will update this page. Questions can be sent to <a href="mailto:hello@leelaanalytics.com">hello@leelaanalytics.com</a>.</p>`},
'terms-of-service.html':{title:'Website terms',description:'Terms for using the Leela Analytics website.',body:`<h2>About this website</h2><p>This website provides information about Leela Analytics and its services. Descriptions on this website do not define the scope, price or delivery terms of a particular engagement. Those details are agreed separately.</p><h2>Content and intellectual property</h2><p>Website content belongs to Leela Analytics or the relevant rights holder, unless otherwise stated. Contact us before republishing material. Technology names identify tools we work with and do not imply an endorsement or partnership.</p><h2>Acceptable use</h2><p>Please do not misuse the contact form, send malicious content, or attempt to disrupt or gain unauthorised access to the website.</p><h2>External links</h2><p>Links to other websites are provided for reference. Their content and policies are controlled by their operators.</p><h2>Contact</h2><p>Questions about this website can be sent to <a href="mailto:hello@leelaanalytics.com">hello@leelaanalytics.com</a>.</p>`}
};
export const pages={
'index.html':{title:'Leela Analytics — AI, grounded in your world.',description:'AI and LLM engineering, thoughtful product design, and dependable cloud infrastructure. Leela Analytics builds AI products and the systems behind them.',body:home,nav:'home'},
'about-us.html':{title:'About Leela — AI & product engineering',description:'Meet Leela Analytics: a team working across models, applications and infrastructure to make useful ideas work in practice.',body:about,nav:'about'},
'blog.html':{title:'Insights — Leela Analytics',description:'Practical notes on AI evaluation, product design and infrastructure from Leela Analytics.',body:blog,nav:'insights'},
'404.html':{title:'Page not found — Leela Analytics',description:'Return to the Leela Analytics website.',body:`<section class="section page-heading not-found"><h1>This page<br>isn’t here.</h1><p>The address may have changed. You can return to the homepage or get in touch with us.</p><a class="button" href="/">Back to Leela ${arrow}</a></section>`,noindex:true}
};
for(const n of notes) pages[n.path]={title:n.title+' — Leela',description:n.description,nav:'insights',body:`<article class="article section"><a class="back-link" href="/blog.html">All insights</a><h1>${n.title}</h1><p class="article-deck">${n.description}</p><div class="prose">${n.body}</div><div class="article-end">${contactLink}</div></article>`};
for(const [path,p] of Object.entries(legal)) pages[path]={title:p.title+' — Leela Analytics',description:p.description,body:`<article class="article legal section"><h1>${p.title}</h1><p class="updated">Updated 16 October 2026</p><div class="prose">${p.body}</div></article>`};

const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function renderPage(page,path,{contactMode='api',assetVersion=''}={}){
 let body = page.body;
 if (contactMode === 'email') {
  body = body.replace(contactForm,contactEmail)
   .replace('Contact-form messages are delivered through Resend, our email service provider. ', 'Enquiries are sent from your email service to our business inbox. ')
   .replace('Please do not misuse the contact form, send malicious content,', 'Please do not send malicious content');
 }
 const assetQuery=assetVersion?'?v='+assetVersion:'';
 const canonical='https://www.leelaanalytics.com/'+(path==='index.html'?'':path.replace(/\.html$/, ''));
 const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}">
${page.noindex?'<meta name="robots" content="noindex">':''}
<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.leelaanalytics.com/assets/leela-logo.png"><meta name="theme-color" content="#202a24">
<link rel="icon" type="image/png" href="/assets/leela-mark.png">
<link rel="preload" href="/fonts/manrope.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/styles.css${assetQuery}"><script src="/main.js${assetQuery}" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="masthead"><a class="brand" href="/" aria-label="Leela Analytics home"><img src="/assets/leela-logo.png" width="962" height="243" alt="LEELA — LLM alchemy labs"></a><nav aria-label="Main navigation"><a href="/#expertise">Expertise</a><a href="/about-us.html"${page.nav==='about'?' aria-current="page"':''}>About</a><a href="/blog.html"${page.nav==='insights'?' aria-current="page"':''}>Insights</a><a class="nav-contact" href="/#contact">Let’s talk ${arrow}</a></nav></header>
<main id="main">${body}</main>
<footer><div class="footer-top"><a class="footer-signature" href="/" aria-label="Leela Analytics home"><span class="compact-mark"><img src="/assets/leela-mark.png" width="73" height="65" alt=""></span><span><strong>Leela Analytics</strong><span>LLM alchemy labs</span></span></a><div class="footer-links"><a href="/#expertise">Expertise</a><a href="/about-us.html">About</a><a href="/blog.html">Insights</a><a href="https://www.linkedin.com/company/leela-analytics" rel="noopener noreferrer">LinkedIn</a></div></div><div class="footer-bottom"><p>© ${new Date().getUTCFullYear()} Leela Analytics</p><div><a href="/privacy-policy.html">Privacy</a><a href="/cookie-policy.html">Cookies</a><a href="/terms-of-service.html">Terms</a></div><a href="mailto:hello@leelaanalytics.com">hello@leelaanalytics.com</a></div></footer></body></html>`;
 return html.replace(/href="\/([a-z-]+)\.html"/g, 'href="/$1"');
}
