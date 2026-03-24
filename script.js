const CONTENT_PATH = "assets/docs/site-content.json";

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

function setText(id, value) {
  if (!value) {
    return;
  }

  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function setHref(id, href) {
  if (!href) {
    return;
  }

  const node = document.getElementById(id);
  if (node instanceof HTMLAnchorElement) {
    node.href = href;
  }
}

function setImage(id, src, alt) {
  if (!src) {
    return;
  }

  const node = document.getElementById(id);
  if (node instanceof HTMLImageElement) {
    node.src = src;
    if (alt) {
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
  if (!Array.isArray(logos)) {
    return;
  }

  const logoTrack = document.getElementById("experience-logos");
  if (!logoTrack) {
    return;
  }

  logoTrack.replaceChildren();
  logos.forEach((logo) => {
    if (!logo?.src) {
      return;
    }

    const image = document.createElement("img");
    image.src = logo.src;
    image.alt = logo.alt || "Company logo";
    image.className = logo.className || "logo-item";
    logoTrack.appendChild(image);
  });
}

function renderJobs(jobs) {
  if (!Array.isArray(jobs)) {
    return;
  }

  const container = document.getElementById("experience-jobs");
  if (!container) {
    return;
  }

  container.replaceChildren();

  jobs.forEach((job) => {
    const card = document.createElement("article");
    card.className = "card job-card";

    if (job?.image) {
      const image = document.createElement("img");
      image.src = job.image;
      image.alt = job.imageAlt || `${job.company || "Job"} media`;
      image.className = "job-media";
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
  if (!Array.isArray(items)) {
    return;
  }

  const container = document.getElementById("organizations-grid");
  if (!container) {
    return;
  }

  container.replaceChildren();

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = `card ${item?.cardClass || "org-card"}`;

    if (item?.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt || `${item.name || "Organization"} media`;
      image.className = item.imageClass || "org-media";
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
  if (!Array.isArray(photos)) {
    return;
  }

  const collage = document.getElementById("gap-photos");
  if (!collage) {
    return;
  }

  collage.replaceChildren();
  photos.forEach((photo) => {
    if (!photo?.src) {
      return;
    }

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt || "Gap year photo";
    image.className = "gap-photo";
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
  setText("hero-eyebrow", hero.eyebrow);
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

async function loadSiteContent() {
  try {
    const response = await fetch(CONTENT_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.status}`);
    }

    const content = await response.json();
    applyContent(content);
  } catch (error) {
    console.warn("Using fallback inline content. Could not load CMS content file.", error);
  }
}

loadSiteContent();
