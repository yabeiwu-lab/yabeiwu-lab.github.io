(() => {
  const tool = document.getElementById("openalex-citation-tool");
  const status = document.getElementById("openalex-citation-status");
  const hIndexElement = document.getElementById("openalex-h-index");
  const i10IndexElement = document.getElementById("openalex-i10-index");

  if (!tool || !status || !hIndexElement || !i10IndexElement) {
    return;
  }

  const authorId = tool.dataset.authorId;
  const publicationItems = [...document.querySelectorAll(".page-body .article-style ol > li")]
    .map((item) => ({ item, link: item.querySelector("a[href]") }))
    .filter(({ link }) => link);

  const normalize = (value) => value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const extractDoi = (href) => {
    const decoded = decodeURIComponent(href).toLowerCase();
    const direct = decoded.match(/10\.\d{4,9}\/[^\s?#]+/);

    if (direct) {
      return direct[0]
        .replace(/\/(?:meta|full|pdf)$/, "")
        .replace(/[).,;]+$/, "");
    }

    const nature = decoded.match(/\/articles\/(s\d{5}-\d{3}-\d{5}-\d)/);
    if (nature) {
      return `10.1038/${nature[1]}`;
    }

    const rsc = decoded.match(/\/(?:cp|nr)\/([a-z]\d[a-z]{2}\d+[a-z])/);
    if (rsc) {
      return `10.1039/${rsc[1]}`;
    }

    return "";
  };

  const tokenScore = (left, right) => {
    const leftTokens = new Set(normalize(left).split(" ").filter(Boolean));
    const rightTokens = new Set(normalize(right).split(" ").filter(Boolean));
    const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
    const union = new Set([...leftTokens, ...rightTokens]).size;

    return union ? intersection / union : 0;
  };

  const findWork = (link, works, worksByDoi, worksByTitle) => {
    const doi = extractDoi(link.href);
    if (doi && worksByDoi.has(doi)) {
      return worksByDoi.get(doi);
    }

    const title = normalize(link.textContent);
    if (worksByTitle.has(title)) {
      return worksByTitle.get(title);
    }

    let bestMatch = null;
    let bestScore = 0;

    works.forEach((work) => {
      const score = tokenScore(link.textContent, work.title);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = work;
      }
    });

    return bestScore >= 0.72 ? bestMatch : null;
  };

  const renderCitation = (item, work) => {
    const row = document.createElement("div");
    const journal = document.createElement("span");
    const badge = document.createElement("a");
    const lineBreak = item.querySelector("br");

    row.className = "citation-meta-row";
    journal.className = "citation-journal";
    badge.className = "citation-badge";
    badge.href = work.id;
    badge.target = "_blank";
    badge.rel = "noopener";
    badge.textContent = `被引 ${work.cited_by_count} 次`;
    badge.title = "在 OpenAlex 查看引用信息";

    if (lineBreak) {
      while (lineBreak.nextSibling) {
        journal.appendChild(lineBreak.nextSibling);
      }
      lineBreak.remove();
    }

    row.appendChild(journal);
    row.appendChild(badge);
    item.appendChild(row);
  };

  const createEndpoint = (filter) => {
    const endpoint = new URL("https://api.openalex.org/works");
    endpoint.searchParams.set("filter", filter);
    endpoint.searchParams.set("per-page", "100");
    endpoint.searchParams.set("select", "id,doi,title,cited_by_count");
    endpoint.searchParams.set("mailto", "wuyb3@sustech.edu.cn");
    return endpoint;
  };

  const fetchWorks = (endpoint) => fetch(endpoint).then((response) => {
    if (!response.ok) {
      throw new Error("OpenAlex request failed");
    }
    return response.json();
  });

  const dois = [...new Set(publicationItems.map(({ link }) => extractDoi(link.href)).filter(Boolean))];
  const requests = [fetchWorks(createEndpoint(`author.id:${authorId}`))];

  if (dois.length) {
    requests.push(fetchWorks(createEndpoint(`doi:${dois.join("|")}`)));
  }

  Promise.all(requests)
    .then((responses) => {
      const uniqueWorks = new Map();
      responses.flatMap(({ results }) => results).forEach((work) => uniqueWorks.set(work.id, work));
      const works = [...uniqueWorks.values()];
      const worksByDoi = new Map();
      const worksByTitle = new Map();

      works.forEach((work) => {
        if (work.doi) {
          worksByDoi.set(work.doi.replace("https://doi.org/", "").toLowerCase(), work);
        }
        worksByTitle.set(normalize(work.title), work);
      });

      let matched = 0;
      let citationTotal = 0;
      const citationCounts = [];

      publicationItems.forEach(({ item, link }) => {
        const work = findWork(link, works, worksByDoi, worksByTitle);
        if (!work) {
          return;
        }

        matched += 1;
        citationTotal += work.cited_by_count;
        citationCounts.push(work.cited_by_count);
        renderCitation(item, work);
      });

      citationCounts.sort((left, right) => right - left);
      const hIndex = citationCounts.filter((count, index) => count >= index + 1).length;
      const i10Index = citationCounts.filter((count) => count >= 10).length;

      hIndexElement.textContent = hIndex;
      i10IndexElement.textContent = i10Index;
      status.textContent = `已匹配 ${matched}/${publicationItems.length} 篇论文，合计被引 ${citationTotal} 次；数据随页面访问自动更新。`;
    })
    .catch(() => {
      status.textContent = "引用数据暂时无法加载，请稍后刷新页面。";
    });
})();
