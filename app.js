const main = document.querySelector("#main");
const nav = document.querySelector("#site-nav");
const header = document.querySelector("[data-header]");
const footer = document.querySelector(".site-footer");
const navToggle = document.querySelector(".nav-toggle");
const hashRouting = Boolean(window.HASH_ROUTING);

const contact = {
  phoneDisplay: "206-353-2551",
  phoneHref: "tel:+12063532551",
  email: "ctmagician@gmail.com",
  address: "6510 Gladys Ave. #329, El Cerrito, CA 94530"
};

const navItems = [
  ["Home", "/"],
  ["Booking", "/booking"],
  ["About", "/aboutcharles"],
  ["Shows", "/aboutcharlesshow"],
  ["Raves", "/raves-reviews"],
  ["Kids", "/just-for-kids"],
  ["Contact", "/contact"]
];

const featureCards = [
  ["Magic that laughs back", "Comedy magic, audience participation, and the famous become-a-clown routine."],
  ["Puppets with heart", "Warm, non-scary puppet moments that put kids at ease before the big laughs land."],
  ["Balloon comedy", "Balloon animals, balloon silliness, and tactile party moments children remember."],
  ["Developmentally tuned", "Shows are adjusted for age range, setting, attention span, and special needs."],
  ["Libraries and schools", "Performances for birthdays, classrooms, libraries, hospitals, holidays, and events."],
  ["Family-friendly rhythm", "The show keeps children engaged while giving adults real confidence in the room."]
];

const showCards = [
  ["Birthday Party Shows", "Magic, puppets, balloon comedy, balloon animals, and full-room participation for children three and older."],
  ["Library Performances", "Language-rich rhyming, storytelling energy, and friendly comedy for community audiences."],
  ["Hospital Shows", "Sensitive, respectful performances shaped for children and families in medical settings."],
  ["Pre Schools", "Gentle pacing, big visual beats, and developmentally appropriate silliness."],
  ["Elementary Schools", "Comic magic and participatory routines that hold attention for bigger groups."],
  ["Teen Show / Workshop", "Magic and balloon workshops for older kids who want to learn how the fun works."],
  ["Virtual Shows", "Remote party and classroom performances when an in-person show is not the right fit."]
];

const reviewSnippets = [
  ["A true children's comedian", "Billboard Magazine"],
  ["A clown for all seasons", "LA Times"],
  ["Best Bet", "Seattle Times"],
  ["Charles has that rare ability to truly reach the concerns of children.", "Susan Jayson, Children's Playce Museum"],
  ["The children were giggling through the entire thing. The parents raved about him.", "Diana J., Elgin"],
  ["This is the best day ever.", "A birthday child, quoted by a parent"]
];

const fallbackImages = [
  "/assets/native/images-makingtheclown.jpg",
  "/assets/native/images-2020-14.jpg",
  "/assets/native/images-new-Web-2031.jpg",
  "/assets/native/images-aboutshowslibrary.jpg",
  "/assets/native/images-liveatlibrary.jpg",
  "/assets/native/images-videoballoons.jpg"
];

const imageSkip = /(topnav|title_|indexbg|paypal|tube1|kidsbg|storiesbox|videoballoonsbg|videoballoonsbottom)/i;
let siteData;

init();

async function init() {
  const response = await fetch("data/pages.json");
  siteData = await response.json();
  renderNav();
  renderFooter();
  renderCurrentRoute();
  bindGlobalEvents();
}

function renderNav() {
  nav.innerHTML = navItems.map(([label, href]) => `<a href="${routeHref(href)}">${label}</a>`).join("");
  document.querySelectorAll("[data-route]").forEach(anchor => {
    anchor.setAttribute("href", routeHref(anchor.dataset.route));
  });
}

function renderFooter() {
  const kidLinks = pageLinks("Just for Kids").slice(0, 6);
  const helpfulLinks = pageLinks("Helpful Info").slice(0, 6);
  footer.innerHTML = `
    <div class="footer-inner">
      <div>
        <p class="eyebrow">East Bay children's entertainer</p>
        <h2>Bring the room to full laugh.</h2>
        <p>Charles The Clown performs kind, non-scary comedy magic, puppets, balloons, and participatory party routines for birthdays, schools, libraries, hospitals, and family events.</p>
        <div class="button-row">
          <a class="button burst-link" href="${routeHref("/booking")}">Start booking</a>
          <a class="button alt burst-link" href="${contact.phoneHref}">Call ${contact.phoneDisplay}</a>
        </div>
      </div>
      <div>
        <h3>Explore</h3>
        <div class="footer-links">
          ${navItems.map(([label, href]) => `<a href="${routeHref(href)}">${label}</a>`).join("")}
          <a href="${routeHref("/videos")}">Videos</a>
          <a href="${routeHref("/party-planning")}">Party planning</a>
        </div>
      </div>
      <div>
        <h3>For Kids</h3>
        <div class="footer-links">
          ${kidLinks.map(link => `<a href="${routeHref(link.route)}">${escapeHtml(link.title)}</a>`).join("")}
          ${helpfulLinks.slice(0, 2).map(link => `<a href="${routeHref(link.route)}">${escapeHtml(link.title)}</a>`).join("")}
        </div>
      </div>
    </div>
    <p class="footer-small">Copyright 2026 Charles The Clown. Redesigned as a colorful, responsive static site with local routes for the original site content.</p>
  `;
}

function renderCurrentRoute() {
  const route = normalizeRoute(currentPath());
  const page = getPage(route);
  document.body.classList.remove("nav-open");
  header.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
  updateCurrentNav(route);

  if (!page) {
    renderNotFound(route);
    return;
  }

  document.title = `${page.route === "/" ? "Charles The Clown" : page.title} | Redesigned Kids Party Site`;
  main.innerHTML = pageHtml(page);
  main.focus({ preventScroll: true });
  hydratePage();
}

function pageHtml(page) {
  if (page.route === "/") return renderHome(page);
  if (page.route === "/booking") return renderBooking(page);
  if (page.route === "/aboutcharles") return renderAbout(page);
  if (page.route === "/aboutcharlesshow") return renderShows(page);
  if (page.route === "/raves-reviews") return renderRaves(page);
  if (page.route === "/videos") return renderVideos(page);
  if (page.route === "/contact") return renderContact(page);
  if (page.route === "/just-for-kids") return renderKids(page);
  if (page.route === "/booking/payment") return renderPayment(page);
  return renderArticle(page);
}

function renderHome(page) {
  const homeImages = [
    "/assets/native/images-makingtheclown.jpg",
    "/assets/native/images-2020-14.jpg",
    "/assets/native/images-new-Web-2031.jpg"
  ];
  return `
    <section class="hero">
      <div class="hero-collage" aria-hidden="true">
        ${photoSticker(homeImages[0], "Charles becoming a clown", "hero-photo-b")}
        ${photoSticker(homeImages[1], "Charles laughing with a child", "hero-photo-c")}
        ${photoSticker(homeImages[2], "Charles with puppets", "hero-photo-a")}
        <span class="sticker shape-star float-slow" style="--r:-8deg"></span>
        <span class="sticker shape-squiggle float-fast" style="--r:12deg"></span>
        <span class="sticker shape-burst spin-soft"></span>
        <span class="sticker shape-ribbon float-slow">12,000+ shows</span>
      </div>
      <div class="hero-inner">
        <div class="hero-copy reveal">
          <p class="eyebrow">Birthday parties, schools, libraries, hospitals</p>
          <h1>Charles The Clown</h1>
          <p class="hero-lede">A professional, trustworthy, developmentally appropriate, non-scary children's entertainer with comedy magic, puppets, balloons, rhyming, and decades of audience-tested joy.</p>
          <div class="hero-actions">
            <a class="button burst-link" href="${routeHref("/booking")}">Book the show</a>
            <a class="button alt" href="${routeHref("/aboutcharlesshow")}">See what happens</a>
            <a class="button green" href="${contact.phoneHref}">Call ${contact.phoneDisplay}</a>
          </div>
        </div>
      </div>
    </section>
    ${marquee([
      "Profiled in the Washington Post Extraordinary People series",
      "Billboard Magazine: A true children's comedian",
      "LA Times: A clown for all seasons",
      "Seattle Times: Best Bet",
      "Parenting Magazine award recognition",
      "Yelp quotes: all 5-star"
    ])}
    <section class="section paper">
      <div class="section-inner">
        <div class="stats-band reveal">
          ${stat("12,000+", "shows for kids world-wide")}
          ${stat("40+", "years performing")}
          ${stat("75+", "radio and TV programs")}
          ${stat("5-star", "parent review energy")}
        </div>
      </div>
    </section>
    <section class="section sky">
      <div class="section-inner">
        <div class="section-heading reveal">
          <p class="eyebrow">The show mix</p>
          <h2>Party comedy with a big heart and a bouncy brain.</h2>
          <p>Charles keeps kids laughing continuously while giving parents the calm confidence of an experienced performer who knows how to read the room.</p>
        </div>
        <div class="grid three">
          ${featureCards.map(([title, body]) => featureCard(title, body)).join("")}
        </div>
      </div>
    </section>
    ${photoStrip("/assets/native/images-aboutshowslibrary.jpg", "/assets/native/images-liveatlibrary.jpg", "/assets/native/aboutcharles-bio4.jpg")}
    <section class="section yellow">
      <div class="section-inner">
        <div class="section-heading center reveal">
          <div class="friendly-face reactive" aria-hidden="true"><span class="face-mouth"></span></div>
          <h2>Non-scary, silly, and tuned for actual children.</h2>
          <p>Magic tricks, puppets, balloon comedy, balloon animals, audience participation, and a famous become-a-clown routine all shaped for the age range and setting.</p>
          <div class="button-row" style="justify-content:center">
            <a class="button blue" href="${routeHref("/raves-reviews")}">Read raves</a>
            <a class="button" href="${routeHref("/contact")}">Ask about a date</a>
          </div>
        </div>
      </div>
    </section>
    ${quoteSection(reviewSnippets.slice(0, 3))}
    ${linkSection("Keep exploring", "Every original internal section has a redesigned local route.", [
      ["/just-for-kids", "Just for Kids", "Stories, magic, puppets, puzzles, and games."],
      ["/party-planning", "Party Planning", "Helpful planning articles from the original site."],
      ["/theory-of-silliness", "Silliness Education", "Charles' philosophy of comedy and children."]
    ])}
  `;
}

function renderBooking(page) {
  return `
    ${subhero("Book Charles", "Start with the date, ages, location, and event type. Charles' shows are customized for homes, parks, schools, libraries, hospitals, and special situations.", "pink", pageImages(page, 3))}
    <section class="section paper">
      <div class="section-inner core-copy">
        <aside class="side-ticket reveal">
          <h3>Booking checklist</h3>
          <ul>
            <li>Date and preferred time</li>
            <li>Birthday, school, holiday, library, or special event</li>
            <li>Children's ages and group size</li>
            <li>Location, parking, and access notes</li>
            <li>Any special needs or sensitivities</li>
          </ul>
          <div class="button-row" style="margin-top:18px">
            <a class="button blue burst-link" href="${routeHref("/contact")}">Contact Charles</a>
          </div>
        </aside>
        <div class="copy-stack reveal">
          ${paragraphs(page, 2, 13)}
          <div class="grid two">
            ${infoCard("How far in advance?", "Prime weekend times tend to fill quickly, but it always pays to ask. Sometimes the schedule can adjust for special situations.")}
            ${infoCard("Deposits", "Deposits generally hold the show date. Some families prefer to pay the full fee in advance after the performance is scheduled.")}
            ${infoCard("Cancellation policy", "Deposits are refunded with two weeks notice. If weather gets in the way, Charles works with you on a new date or future credit.")}
            ${infoCard("Payment", "Once charges are confirmed, you can use the redesigned payment information page or coordinate by phone/email.")}
          </div>
          <div class="button-row">
            <a class="button" href="${contact.phoneHref}">Call ${contact.phoneDisplay}</a>
            <a class="button alt" href="mailto:${contact.email}">Email Charles</a>
            <a class="button green" href="${routeHref("/booking/payment")}">Payment info</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAbout(page) {
  return `
    ${subhero("About Charles", "A children's comedian, magician, author, hospital performer, media guest, and award-recognized community entertainer with decades of experience.", "green", pageImages(page, 4))}
    <section class="section paper">
      <div class="section-inner core-copy">
        <aside class="side-ticket reveal">
          <h3>Proof points</h3>
          <ul>
            <li>Performed for more than 40 years</li>
            <li>Appeared on more than 75 radio and television programs</li>
            <li>Recipient of a Dr. Martin Luther King Jr. Humanitarian Award</li>
            <li>Author of books and audio stories used by libraries</li>
          </ul>
        </aside>
        <div class="copy-stack reveal">
          ${paragraphs(page, 3, 12)}
        </div>
      </div>
    </section>
    ${photoStrip("/assets/native/Pictures-Cross-CountrySm.jpg", "/assets/native/Pictures-Tall-TalesSm.jpg", "/assets/native/Pictures-Not-Just-ClowningSm.jpg")}
    ${linkSection("More about the work", "The original site included deeper pages about shows, reviews, philosophy, and party planning.", [
      ["/aboutcharlesshow", "About the shows", "Birthday, library, hospital, school, teen, and virtual formats."],
      ["/raves-reviews", "Raves and reviews", "Parents, educators, hospitals, and publications."],
      ["/theory-of-silliness", "Theory of Silliness", "Charles' own philosophy of comedy for children."]
    ])}
  `;
}

function renderShows(page) {
  return `
    ${subhero("About the Shows", "Comedy magic, puppets, balloons, rhyming, and audience participation for kids three and older, with show choices for many settings.", "yellow", pageImages(page, 4))}
    <section class="section sky">
      <div class="section-inner">
        <div class="section-heading reveal">
          <p class="eyebrow">Choose the moment</p>
          <h2>One performer, many rooms, always tuned to the audience.</h2>
        </div>
        <div class="grid three">
          ${showCards.map(([title, body]) => featureCard(title, body)).join("")}
        </div>
      </div>
    </section>
    <section class="section paper">
      <div class="section-inner core-copy">
        <aside class="side-ticket reveal">
          <h3>In the show</h3>
          <ul>
            <li>Award-winning become-a-clown routine</li>
            <li>Comedy magic</li>
            <li>Puppets</li>
            <li>Balloon comedy and animals</li>
            <li>Audience participation</li>
          </ul>
          <a class="button burst-link" href="${routeHref("/booking")}">Book a date</a>
        </aside>
        <div class="copy-stack reveal">
          ${paragraphs(page, 5, 16)}
        </div>
      </div>
    </section>
    ${quoteSection(reviewSnippets)}
  `;
}

function renderRaves(page) {
  const quotes = [...reviewSnippets, ...extractQuotes(page.paragraphs).slice(0, 3)].slice(0, 9);
  return `
    ${subhero("Raves, Reviews, and Clients", "Parents, educators, hospitals, museums, newspapers, and families describe Charles as warm, intelligent, funny, and deeply tuned to children.", "pink", pageImages(page, 4))}
    ${quoteSection(quotes.length ? quotes : reviewSnippets)}
    <section class="section paper">
      <div class="section-inner article-body reveal">
        <p class="lead">More original review text from the legacy site:</p>
        ${articleParagraphs(page.paragraphs.slice(1, 24))}
      </div>
    </section>
  `;
}

function renderVideos(page) {
  const embeds = unique(siteData.videoLinks)
    .filter(url => /embed/i.test(url))
    .slice(0, 4);
  return `
    ${subhero("Videos", "Watch Charles in action through the original video collection and linked YouTube appearances.", "green", pageImages(page, 3))}
    <section class="section paper">
      <div class="section-inner">
        <div class="section-heading reveal">
          <p class="eyebrow">Charles in action</p>
          <h2>Vintage clips, school performances, and party-room energy.</h2>
        </div>
        <div class="video-grid">
          ${embeds.map((url, index) => videoCard(url, `Charles video ${index + 1}`)).join("")}
        </div>
        <div class="button-row" style="margin-top:28px">
          <a class="button blue" href="${routeHref("/videos/samples")}">Vintage sample notes</a>
          <a class="button alt" href="https://www.youtube.com/user/iCharlesTheClown" target="_blank" rel="noreferrer">YouTube channel</a>
        </div>
      </div>
    </section>
  `;
}

function renderContact() {
  return `
    ${subhero("Contact", "Call or email Charles to check dates, ask about ages and settings, and start planning the right show.", "yellow", fallbackImages.slice(1, 4))}
    <section class="section paper">
      <div class="section-inner contact-panel">
        <div class="contact-details reveal">
          ${contactDetail("Phone", `<a href="${contact.phoneHref}">${contact.phoneDisplay}</a>`)}
          ${contactDetail("Email", `<a href="mailto:${contact.email}">${contact.email}</a>`)}
          ${contactDetail("Mail", contact.address)}
          ${contactDetail("Fastest path", "Send the date, time, event type, children's ages, approximate group size, and location.")}
        </div>
        <form class="contact-form reveal" data-contact-form>
          <h2>Ask about a party date</h2>
          <div class="field-grid">
            <label>Your name <input name="name" autocomplete="name" required></label>
            <label>Email <input name="email" type="email" autocomplete="email" required></label>
          </div>
          <div class="field-grid">
            <label>Event date <input name="date" placeholder="Saturday, March 14"></label>
            <label>Kids' ages <input name="ages" placeholder="4-6 years old"></label>
          </div>
          <label>Message <textarea name="message" placeholder="Tell Charles about the party, location, group size, and what you are imagining." required></textarea></label>
          <button class="button blue burst-link" type="submit">Open email</button>
        </form>
      </div>
    </section>
  `;
}

function renderKids(page) {
  return `
    ${subhero("Just For Kids", "Stories, easy magic tricks, puppet biographies, puzzles, games, and playful pages from Charles' original kids section.", "pink", pageImages(page, 3))}
    ${linkSection("Pick something fun", "All original kids pages have been brought into the new design as local routes.", pageLinks("Just for Kids").filter(link => link.route !== "/just-for-kids").map(link => [link.route, link.title, routeBlurb(link.route)]))}
    ${photoStrip("/assets/native/justforkids-images-cards1.jpg", "/assets/native/justforkids-images-horatio.jpg", "/assets/native/justforkids-Web-27.jpg")}
  `;
}

function renderPayment(page) {
  return `
    ${subhero("Payment Info", "Payment is coordinated after charges are confirmed. This redesigned page keeps visitors inside the new site while preserving the original booking guidance.", "green", pageImages(page, 3))}
    <section class="section paper">
      <div class="section-inner core-copy">
        <aside class="side-ticket reveal">
          <h3>Before payment</h3>
          <ul>
            <li>Confirm the date and fee with Charles</li>
            <li>Use phone or email for any questions</li>
            <li>Include your event name/date in notes</li>
          </ul>
          <a class="button blue" href="${routeHref("/contact")}">Contact first</a>
        </aside>
        <div class="copy-stack reveal">
          ${paragraphs(page, 0, 12)}
          <div class="button-row">
            <a class="button" href="mailto:${contact.email}?subject=Charles%20The%20Clown%20payment%20question">Email about payment</a>
            <a class="button alt" href="${contact.phoneHref}">Call ${contact.phoneDisplay}</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderArticle(page) {
  const related = pageLinks(page.category).filter(link => link.route !== page.route).slice(0, 8);
  const theme = page.category === "Just for Kids" ? "pink" : page.category === "Helpful Info" ? "green" : "yellow";
  return `
    ${subhero(page.title, articleIntro(page), theme, pageImages(page, 3))}
    <section class="section paper">
      <div class="section-inner article-layout">
        <aside class="article-rail reveal">
          <h3>${escapeHtml(page.category)}</h3>
          <ul>
            ${related.map(link => `<li><a href="${routeHref(link.route)}">${escapeHtml(link.title)}</a></li>`).join("")}
          </ul>
          <div class="button-row" style="margin-top:18px">
            <a class="button alt" href="${routeHref("/contact")}">Book</a>
          </div>
        </aside>
        <article class="article-body reveal">
          ${articleParagraphs(page.paragraphs)}
        </article>
      </div>
    </section>
  `;
}

function renderNotFound(route) {
  updateCurrentNav("/");
  main.innerHTML = `
    ${subhero("Page not found", `The route ${escapeHtml(route)} is not part of the rebuilt map. Try one of the redesigned sections below.`, "pink", fallbackImages.slice(0, 3))}
    ${linkSection("Available redesigned pages", "These are the main local routes.", navItems.map(([label, href]) => [href, label, "Open the redesigned page."]))}
  `;
  hydratePage();
}

function subhero(title, lede, theme, images) {
  return `
    <section class="subhero ${theme}">
      <div class="sticker shape-star float-slow" style="right:7%;top:18%;--r:9deg" aria-hidden="true"></div>
      <div class="sticker shape-squiggle float-fast" style="left:5%;bottom:14%;--r:-12deg" aria-hidden="true"></div>
      <div class="subhero-inner">
        <div class="reveal">
          <p class="eyebrow">Charles The Clown</p>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(lede)}</p>
        </div>
        <div class="mini-collage reveal" aria-label="Photo collage">
          ${pageImages({ images }, 3).map((src, index) => photoSticker(src, `${title} photo ${index + 1}`, "")).join("")}
        </div>
      </div>
    </section>
  `;
}

function linkSection(title, body, links) {
  return `
    <section class="section paper">
      <div class="section-inner">
        <div class="section-heading reveal">
          <p class="eyebrow">Local routes</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(body)}</p>
        </div>
        <div class="link-grid">
          ${links.map(([href, label, blurb]) => `
            <a class="link-card reveal" href="${routeHref(href)}">
              <span>${escapeHtml(label)}</span>
              <small>${escapeHtml(blurb)}</small>
            </a>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function quoteSection(quotes) {
  return `
    <section class="section blue quote-section">
      <div class="section-inner">
        <div class="section-heading center reveal">
          <p class="eyebrow">Parent proof</p>
          <h2>Reviews with real lift.</h2>
        </div>
        <div class="quote-grid">
          ${quotes.map(([quote, cite]) => `
            <blockquote class="quote-card reveal">
              <p>"${escapeHtml(stripQuotes(quote))}"</p>
              <cite>${escapeHtml(cite || "Charles The Clown archive")}</cite>
            </blockquote>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function photoStrip(a, b, c) {
  return `
    <section class="section green">
      <div class="section-inner photo-strip reveal">
        ${[a, b, c].map((src, i) => `
          <figure class="photo-tile">
            <img src="${assetSrc(src)}" alt="Charles The Clown performance moment ${i + 1}" loading="lazy">
          </figure>
        `).join("")}
      </div>
    </section>
  `;
}

function marquee(items) {
  const track = [...items, ...items].map(item => `<span>${escapeHtml(item)}</span>`).join("");
  return `<div class="marquee" aria-label="Press and proof highlights"><div class="marquee-track">${track}</div></div>`;
}

function stat(number, label) {
  return `<div class="stat-bubble reveal"><strong>${escapeHtml(number)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function featureCard(title, body) {
  return `
    <article class="feature-card reveal">
      <span class="card-label">party spark</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </article>
  `;
}

function infoCard(title, body) {
  return `
    <article class="info-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </article>
  `;
}

function contactDetail(title, body) {
  return `<div class="contact-detail"><strong>${escapeHtml(title)}</strong><span>${body}</span></div>`;
}

function videoCard(src, title) {
  return `
    <article class="video-card reveal">
      <div class="video-frame">
        <iframe src="${src}" title="${escapeHtml(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <h3>${escapeHtml(title)}</h3>
    </article>
  `;
}

function photoSticker(src, alt, extraClass) {
  return `<figure class="photo-sticker ${extraClass || ""}"><img src="${assetSrc(src)}" alt="${escapeHtml(alt)}" loading="lazy"></figure>`;
}

function paragraphs(page, start = 0, end = 8) {
  return articleParagraphs(page.paragraphs.slice(start, end));
}

function articleParagraphs(lines) {
  return lines.map((line, index) => {
    const text = escapeHtml(line);
    if (index > 0 && isHeadingLine(line)) return `<h2>${text}</h2>`;
    return `<p class="${index === 0 ? "lead" : ""}">${text}</p>`;
  }).join("");
}

function isHeadingLine(line) {
  if (line.length > 78) return false;
  if (/[.!?]$/.test(line)) return false;
  if (/^[-()"']/.test(line)) return false;
  return /[A-Za-z]/.test(line);
}

function pageImages(page, count = 4) {
  const images = unique([...(page.images || []), ...fallbackImages])
    .filter(src => !imageSkip.test(src))
    .slice(0, count);
  return images.length ? images : fallbackImages.slice(0, count);
}

function pageLinks(category) {
  return siteData.entries
    .filter(page => page.category === category)
    .map(page => ({ route: page.route, title: displayTitle(page) }));
}

function routeBlurb(route) {
  if (route.includes("magic")) return "Easy tricks kids can learn with household props.";
  if (route.includes("puppet")) return "Meet the puppet cast from the original site.";
  if (route.includes("puzzle")) return "Word finds, games, and playful clues.";
  if (route.includes("story")) return "Readable stories and audio-story pages.";
  if (route.includes("bones")) return "Poems by Bones the Dog.";
  return "A redesigned page from the original kids section.";
}

function articleIntro(page) {
  if (page.category === "Just for Kids") return "A playful page from Charles' original kid activity section, rebuilt with the new animated party style.";
  if (page.category === "Helpful Info") return "Helpful original planning guidance, now in a cleaner, parent-friendly article layout.";
  return page.paragraphs[0] || "A redesigned page from the original Charles The Clown site.";
}

function extractQuotes(lines) {
  const quotes = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const next = lines[i + 1] || "";
    if (line.length > 55 && line.length < 260) {
      const cite = /^[-~]/.test(next) || /^[A-Z][a-z]+\\s/.test(next) ? next.replace(/^[-~]\\s*/, "") : "Charles The Clown archive";
      quotes.push([line, cite]);
    }
  }
  return quotes;
}

function bindGlobalEvents() {
  document.addEventListener("click", event => {
    const anchor = event.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#main" || href.startsWith("mailto:") || href.startsWith("tel:")) {
      if (anchor.classList.contains("burst-link")) burstAtElement(anchor);
      return;
    }
    if (href.startsWith("#/")) {
      event.preventDefault();
      if (anchor.classList.contains("burst-link")) burstAtElement(anchor);
      navigate(href.slice(1));
      return;
    }
    const url = new URL(anchor.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    if (anchor.classList.contains("burst-link")) burstAtElement(anchor);
    navigate(url.pathname);
  });

  navToggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  window.addEventListener("popstate", renderCurrentRoute);
  window.addEventListener("hashchange", renderCurrentRoute);
  window.addEventListener("mousemove", pointerEffects);
}

function hydratePage() {
  document.body.classList.remove("motion-enabled");
  const reveals = [...document.querySelectorAll(".reveal")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
  reveals.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.08) item.classList.add("is-visible");
    else observer.observe(item);
  });
  requestAnimationFrame(() => document.body.classList.add("motion-enabled"));

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      const body = [
        `Name: ${values.name || ""}`,
        `Email: ${values.email || ""}`,
        `Event date: ${values.date || ""}`,
        `Kids' ages: ${values.ages || ""}`,
        "",
        values.message || ""
      ].join("\\n");
      burstAtElement(form.querySelector("button"));
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Charles The Clown booking question")}&body=${encodeURIComponent(body)}`;
    });
  }
}

function pointerEffects(event) {
  const spark = document.querySelector(".cursor-spark");
  if (spark) {
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;
    spark.style.opacity = "0.8";
  }

  const x = (event.clientX / window.innerWidth - 0.5) * 7;
  const y = (event.clientY / window.innerHeight - 0.5) * 7;
  document.querySelectorAll(".reactive").forEach(el => {
    el.style.setProperty("--eye-x", `${x}px`);
    el.style.setProperty("--eye-y", `${y}px`);
  });
}

function burstAtElement(el) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const colors = ["#ff72c8", "#ffe34d", "#24c66b", "#34b8ff", "#ff7b22", "#a87cff"];
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dx", `${Math.cos(i) * (60 + Math.random() * 80)}px`);
    piece.style.setProperty("--dy", `${Math.sin(i) * (50 + Math.random() * 70) - 35}px`);
    piece.style.setProperty("--rot", `${Math.random() * 360}deg`);
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 900);
  }
}

function navigate(path) {
  const route = normalizeRoute(path);
  if (hashRouting) {
    const nextHash = `#${route}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      renderCurrentRoute();
    }
  } else if (window.location.pathname !== route) {
    history.pushState({}, "", route);
    renderCurrentRoute();
  } else {
    renderCurrentRoute();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function normalizeRoute(path) {
  let route = decodeURIComponent(path || "/");
  if (!route.startsWith("/")) route = `/${route}`;
  route = route.replace(/\/index\.(php|html?)$/i, "").replace(/\/$/, "") || "/";
  route = siteData?.aliases?.[route] || siteData?.aliases?.[`${route}/`] || route;
  return route;
}

function getPage(route) {
  return siteData.entries.find(page => page.route === route);
}

function updateCurrentNav(route) {
  [...nav.querySelectorAll("a")].forEach(anchor => {
    const href = anchor.getAttribute("href") || "/";
    const target = href.startsWith("#") ? href.slice(1) : href;
    const active = target === "/" ? route === "/" : route.startsWith(target);
    if (active) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
  });
}

function currentPath() {
  if (hashRouting) return window.location.hash.replace(/^#/, "") || "/";
  return window.location.pathname;
}

function routeHref(route) {
  if (!route || /^(mailto:|tel:|https?:)/i.test(route)) return route;
  if (!route.startsWith("/")) return route;
  return hashRouting ? `#${route}` : route;
}

function assetSrc(src) {
  if (!src || /^(https?:|data:|mailto:|tel:)/i.test(src)) return src;
  return src.startsWith("/") ? src.slice(1) : src;
}

function displayTitle(page) {
  if (page.route === "/") return "Home";
  if (page.route === "/aboutcharlesshow") return "About the Shows";
  return page.title === "Clown" ? "Charles The Clown" : page.title;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function stripQuotes(value) {
  return value.replace(/^[""']+|[""']+$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
