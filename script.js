const CONTENT_PATH = "assets/docs/site-content.json";
const CONTENT_CACHE_KEY = "victoria-portfolio-content-v2";

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

function setText(id, value, options = {}) {
  const { allowEmpty = false } = options;
  const node = document.getElementById(id);
  if (node && typeof value === "string") {
    const normalized = value.trim();
    if (allowEmpty || normalized) {
      node.textContent = normalized;
    }
  }
}

function setHref(id, href) {
  const node = document.getElementById(id);
  if (node instanceof HTMLAnchorElement) {
    if (typeof href === "string" && href.trim()) {
      node.href = href;
    } else {
      node.removeAttribute("href");
    }
  }
}

function setImage(id, src, alt) {
  const node = document.getElementById(id);
  if (node instanceof HTMLImageElement) {
    if (typeof src === "string" && src.trim()) {
      node.src = src;
    } else {
      node.removeAttribute("src");
    }

    if (typeof alt === "string") {
      node.alt = alt;
    }
  }
}

function createJobBlurb(job) {
  return typeof job?.blurb === "string" ? job.blurb.trim() : "";
}

function createOrganizationBlurb(item) {
  return typeof item?.blurb === "string" ? item.blurb.trim() : "";
}

function createGapYearBlurb(gapYear) {
  return typeof gapYear?.blurb === "string" ? gapYear.blurb.trim() : "";
}

function renderLogos(logos) {
  const logoTrack = document.getElementById("experience-logos");
  if (!logoTrack) {
    return;
  }

  logoTrack.replaceChildren();
  if (!Array.isArray(logos)) {
    return;
  }

  logos.forEach((logo) => {
    if (!logo?.src) {
      return;
    }

    const image = document.createElement("img");
    image.src = logo.src;
    image.alt = logo.alt || "Company logo";
    image.className = logo.className || "logo-item";
    image.loading = "lazy";
    image.decoding = "async";
    logoTrack.appendChild(image);
  });
}

function renderJobs(jobs) {
  const container = document.getElementById("experience-jobs");
  if (!container) {
    return;
  }

  container.replaceChildren();
  if (!Array.isArray(jobs)) {
    return;
  }

  jobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = "card job-card";

    if (job?.image) {
      const image = document.createElement("img");
      image.src = job.image;
      image.alt = job.imageAlt || `${job.company || "Job"} media`;
      image.className = "job-media";
      image.loading = "lazy";
      image.decoding = "async";
      card.appendChild(image);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const heading = document.createElement("h3");
    heading.textContent = job?.company || "";
    body.appendChild(heading);

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = job?.meta || "";
    body.appendChild(meta);

    const blurb = createJobBlurb(job);
    if (blurb) {
      const blurbNode = document.createElement("p");
      blurbNode.className = "job-blurb";
      blurbNode.textContent = blurb;
      body.appendChild(blurbNode);
    }

    card.appendChild(body);
    container.appendChild(card);
  });
}

function renderOrganizations(items) {
  const container = document.getElementById("organizations-grid");
  if (!container) {
    return;
  }

  container.replaceChildren();
  if (!Array.isArray(items)) {
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = `card ${item?.cardClass || "org-card"}`;

    if (item?.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt || `${item.name || "Organization"} media`;
      image.className = item.imageClass || "org-media";
      image.loading = "lazy";
      image.decoding = "async";
      card.appendChild(image);
    }

    const heading = document.createElement("h3");
    heading.textContent = item?.name || "";
    card.appendChild(heading);

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = item?.meta || "";
    card.appendChild(meta);

    const blurb = createOrganizationBlurb(item);
    if (blurb) {
      const blurbNode = document.createElement("p");
      blurbNode.className = "org-blurb";
      blurbNode.textContent = blurb;
      card.appendChild(blurbNode);
    }

    container.appendChild(card);
  });
}

function renderGapPhotos(photos) {
  const collage = document.getElementById("gap-photos");
  if (!collage) {
    return;
  }

  collage.replaceChildren();
  if (!Array.isArray(photos)) {
    return;
  }

  photos.forEach((photo) => {
    if (!photo?.src) {
      return;
    }

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt || "Gap year photo";
    image.className = "gap-photo";
    image.loading = "lazy";
    image.decoding = "async";
    collage.appendChild(image);
  });
}

function renderGapBlurb(gapYear) {
  const node = document.getElementById("gap-blurb");
  if (!node) {
    return;
  }

  node.textContent = createGapYearBlurb(gapYear);
}

function applyContent(content) {
  if (!content || typeof content !== "object") {
    return;
  }

  setText("brand-name", content.siteName);
  setText("footer-name", content.siteName);

  const hero = content.hero || {};
  setText("hero-eyebrow", hero.eyebrow, { allowEmpty: true });
  setText("hero-title", hero.title);
  setText("hero-intro", hero.intro);
  setHref("hero-linkedin", hero.linkedinUrl);
  setHref("hero-resume", hero.resumePath);
  setHref("hero-email", hero.email ? `mailto:${hero.email}` : "");
  setImage("hero-photo", hero.headshot?.src, hero.headshot?.alt);

  const experience = content.experience || {};
  setText("experience-title", experience.title);
  renderLogos(experience.logos);
  renderJobs(experience.jobs);

  const organizations = content.organizations || {};
  setText("organizations-title", organizations.title);
  renderOrganizations(organizations.items);

  const gapYear = content.gapYear || {};
  setText("gap-title", gapYear.title);
  setText("gap-what-title", gapYear.whatIDidTitle);
  renderGapPhotos(gapYear.photos);
  renderGapBlurb(gapYear);

  const footer = content.footer || {};
  setHref("footer-email", footer.contactEmail ? `mailto:${footer.contactEmail}` : "");
}

function readCachedContent() {
  try {
    const raw = window.localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function cacheContent(content) {
  try {
    window.localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content));
  } catch {
    // Ignore cache write issues (e.g., private browsing storage restrictions).
  }
}

async function loadSiteContent() {
  const isLocalFilePreview = window.location.protocol === "file:";
  const cachedContent = isLocalFilePreview ? null : readCachedContent();

  if (isLocalFilePreview) {
    console.warn(
      "Local file preview detected. CMS content may not load from file:// URLs. Use a local server for accurate preview.",
    );
  }

  if (cachedContent) {
    applyContent(cachedContent);
  }

  try {
    const response = await fetch(CONTENT_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.status}`);
    }

    const content = await response.json();
    applyContent(content);
    if (!isLocalFilePreview) {
      cacheContent(content);
    }
  } catch (error) {
    if (cachedContent) {
      console.warn("Could not load CMS content file. Using cached content instead.", error);
      return;
    }

    if (isLocalFilePreview) {
      setText("hero-title", "Local preview mode cannot load CMS content.");
      setText(
        "hero-intro",
        "Open the site with a local server (for example: python3 -m http.server) to load assets/docs/site-content.json.",
      );
      setText("experience-title", "");
      setText("organizations-title", "");
      setText("gap-title", "");
      setText("gap-what-title", "");
      renderLogos([]);
      renderJobs([]);
      renderOrganizations([]);
      renderGapPhotos([]);
      renderGapBlurb({ blurb: "" });
    }

    console.warn("Using fallback inline content. Could not load CMS content file.", error);
  }
}

loadSiteContent();
