(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const navigation = document.querySelector(".document-nav");
  const navigationLinks = navigation
    ? [...navigation.querySelectorAll("a[href^='#']")]
    : [];
  const navigationSections = navigationLinks
    .map((link) => {
      const targetSelector = link.getAttribute("href");
      const target = targetSelector ? document.querySelector(targetSelector) : null;

      return target ? { id: target.id, target } : null;
    })
    .filter(Boolean);

  let sectionObserver;
  let observedNavigationHeight = 0;

  function setActiveNavigationLink(sectionId) {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateNavigationOffset() {
    if (!navigation) {
      return 0;
    }

    const navigationHeight = Math.ceil(navigation.getBoundingClientRect().height);
    document.documentElement.style.setProperty(
      "--document-nav-height",
      `${navigationHeight}px`,
    );

    return navigationHeight;
  }

  function observeNavigationSections() {
    if (
      !navigation ||
      !navigationSections.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const navigationHeight = updateNavigationOffset();

    if (navigationHeight === observedNavigationHeight && sectionObserver) {
      return;
    }

    observedNavigationHeight = navigationHeight;
    sectionObserver?.disconnect();
    sectionObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        if (window.scrollY <= 1 && !window.location.hash) {
          setActiveNavigationLink(navigationSections[0].id);
          return;
        }

        const visibleSections = navigationSections
          .filter(({ target }) => {
            const bounds = target.getBoundingClientRect();
            const observationTop = navigationHeight;
            const observationBottom = window.innerHeight * 0.45;

            return bounds.top < observationBottom && bounds.bottom > observationTop;
          })
          .sort(
            (first, second) =>
              second.target.getBoundingClientRect().top -
              first.target.getBoundingClientRect().top,
          );

        const primarySection = visibleSections[0];

        if (primarySection) {
          setActiveNavigationLink(primarySection.id);
        }
      },
      {
        rootMargin: `-${navigationHeight}px 0px -55% 0px`,
        threshold: [0, 0.1],
      },
    );

    navigationSections.forEach(({ target }) => {
      sectionObserver.observe(target);
    });
  }

  if (navigation && navigationSections.length) {
    const initialSection =
      navigationSections.find(({ id }) => `#${id}` === window.location.hash) ||
      navigationSections[0];

    setActiveNavigationLink(initialSection.id);
    observeNavigationSections();

    if ("ResizeObserver" in window) {
      const navigationResizeObserver = new ResizeObserver(observeNavigationSections);
      navigationResizeObserver.observe(navigation);
    } else {
      window.addEventListener("resize", observeNavigationSections);
    }
  }

  document.querySelectorAll("[data-scroll-target]").forEach((scrollTrigger) => {
    scrollTrigger.addEventListener("click", (event) => {
      const targetSelector = scrollTrigger.getAttribute("href");
      const target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      event.preventDefault();

      if (scrollTrigger.closest(".document-nav")) {
        setActiveNavigationLink(target.id);
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
      target.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll("[data-print-proposal]").forEach((printTrigger) => {
    printTrigger.addEventListener("click", () => {
      window.print();
    });
  });

  const portfolio = document.querySelector("[data-portfolio]");

  if (!portfolio) {
    return;
  }

  const sites = [
    {
      id: "site-17",
      name: "Site 17",
      condition: "PV underperformance",
      energy: "21.4 MWh",
      financial: "R61,300",
      priority: "Critical",
      priorityClass: "priority-critical",
      action: "Inspect cooling system and DC input channels within 48 hours.",
      analysis: {
        actual: "4.11 MWh",
        expected: "4.82 MWh",
        variance: "-14.7%",
        contributing: "Abnormal Inverter 4 performance",
        risk: "21.4 MWh",
        financial: "R61,300",
      },
    },
    {
      id: "site-04",
      name: "Site 04",
      condition: "Peak-demand exposure",
      energy: "Not applicable",
      financial: "R43,600",
      priority: "High",
      priorityClass: "priority-high",
      action: "Review the demand profile and assess a peak-shaving response.",
    },
    {
      id: "site-11",
      name: "Site 11",
      condition: "PV performance loss",
      energy: "13.8 MWh",
      financial: "R31,900",
      priority: "High",
      priorityClass: "priority-high",
      action: "Inspect PV performance and review available string-level diagnostics.",
    },
    {
      id: "site-08",
      name: "Site 08",
      condition: "Battery dispatch opportunity",
      energy: "9.2 MWh",
      financial: "R27,400",
      priority: "Medium",
      priorityClass: "priority-medium",
      action: "Assess a battery dispatch window against the load and tariff profile.",
    },
    {
      id: "site-03",
      name: "Site 03",
      condition: "Load-shifting opportunity",
      energy: "Not applicable",
      financial: "R19,700",
      priority: "Medium",
      priorityClass: "priority-medium",
      action: "Review flexible loads and schedule a controlled load-shifting trial.",
    },
  ];

  const interventionScenarios = Object.freeze({
    inspect: Object.freeze({
      label: "Inspect within 48 hours",
      energyAtRisk: "21.4 MWh",
      financial: "R61,300",
      interpretation:
        "Recommended scenario. Early inspection limits the period during which the suspected condition remains unresolved.",
    }),
    delay: Object.freeze({
      label: "Delay intervention by 7 days",
      energyAtRisk: "29.8 MWh",
      financial: "R85,400",
      interpretation:
        "Delayed intervention increases simulated exposure because the underperformance is assumed to continue for longer.",
    }),
    monitor: Object.freeze({
      label: "Monitor only",
      energyAtRisk: "36.5 MWh",
      financial: "R104,600",
      interpretation:
        "Highest simulated exposure. Monitoring alone does not address the assumed underlying condition.",
    }),
  });

  const similarEventDescriptions = Object.freeze({
    "cooling-obstruction":
      "Most frequently observed analogous condition in this illustrative history. Recommended first inspection: cooling path, ventilation and temperature-related evidence.",
    "dc-string-issue":
      "Second most common analogous condition. Recommended inspection: DC input channels, string-level current and associated connections.",
    "sensor-fault":
      "Less common analogous condition. Recommended validation: compare sensor readings against independent or neighbouring measurements before physical intervention.",
  });

  const siteButtons = [...portfolio.querySelectorAll("[data-site-id]")];
  const detailSiteName = portfolio.querySelector("#detail-site-name");
  const detailCondition = portfolio.querySelector("#detail-condition");
  const detailPriority = portfolio.querySelector("#detail-priority");
  const detailEnergy = portfolio.querySelector("#detail-energy");
  const detailFinancial = portfolio.querySelector("#detail-financial");
  const detailAnalysis = portfolio.querySelector("#detail-analysis");
  const detailAction = portfolio.querySelector("#detail-action");
  const detailActions = portfolio.querySelector("[data-site17-actions]");
  const evidenceToggle = portfolio.querySelector("[data-evidence-toggle]");
  const evidencePanel = portfolio.querySelector("#evidence-panel");
  const panelToggles = [...portfolio.querySelectorAll("[data-panel-toggle]")];
  const copilotPanel = portfolio.querySelector("#copilot-panel");
  const copilotModeButtons = copilotPanel
    ? [...copilotPanel.querySelectorAll("[data-copilot-mode]")]
    : [];
  const copilotQuestionGroups = copilotPanel
    ? [...copilotPanel.querySelectorAll("[data-copilot-question-group]")]
    : [];
  const copilotQuestionButtons = copilotPanel
    ? [...copilotPanel.querySelectorAll("[data-copilot-question]")]
    : [];
  const copilotForm = copilotPanel?.querySelector("[data-copilot-form]");
  const copilotInput = copilotPanel?.querySelector("#copilot-input");
  const copilotResponse = copilotPanel?.querySelector("#copilot-response");
  const copilotResponseQuestion = copilotPanel?.querySelector(
    "#copilot-response-question",
  );
  const copilotResponseBody = copilotPanel?.querySelector("#copilot-response-body");
  const copilotProductionDetails = copilotPanel?.querySelector(".copilot-production");
  const similarEventsPanel = portfolio.querySelector("#similar-events-panel");
  const similarEventButtons = similarEventsPanel
    ? [...similarEventsPanel.querySelectorAll("[data-event-type]")]
    : [];
  const similarEventDescription = similarEventsPanel?.querySelector(
    "#similar-event-description",
  );
  const interventionPanel = portfolio.querySelector("#intervention-panel");
  const interventionInputs = interventionPanel
    ? [...interventionPanel.querySelectorAll('input[name="intervention-scenario"]')]
    : [];
  const interventionResultTitle = interventionPanel?.querySelector(
    "#intervention-result-title",
  );
  const interventionEnergyRisk = interventionPanel?.querySelector(
    "#intervention-energy-risk",
  );
  const interventionFinancial = interventionPanel?.querySelector("#intervention-financial");
  const interventionInterpretation = interventionPanel?.querySelector(
    "#intervention-interpretation",
  );
  const priorityClasses = ["priority-critical", "priority-high", "priority-medium"];

  let selectedSiteId = "site-17";

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function getInterventionScenario(scenarioId) {
    return interventionScenarios[scenarioId] || interventionScenarios.inspect;
  }

  function parseFinancialValue(value) {
    return Number(String(value).replace(/[^0-9]/g, "")) || 0;
  }

  function getPortfolioRanking() {
    return [...sites].sort(
      (first, second) =>
        parseFinancialValue(second.financial) - parseFinancialValue(first.financial),
    );
  }

  function hideInteractivePanels() {
    panelToggles.forEach((toggle) => {
      const panelId = toggle.getAttribute("aria-controls");
      const panel = panelId ? portfolio.querySelector(`#${panelId}`) : null;

      toggle.setAttribute("aria-expanded", "false");

      if (panel) {
        panel.hidden = true;
      }
    });
  }

  function toggleInteractivePanel(panelId) {
    const panel = portfolio.querySelector(`#${panelId}`);

    if (!panel) {
      return;
    }

    const shouldOpen = panel.hidden;

    panelToggles.forEach((toggle) => {
      const isTarget = toggle.getAttribute("aria-controls") === panelId;
      const controlledPanelId = toggle.getAttribute("aria-controls");
      const controlledPanel = controlledPanelId
        ? portfolio.querySelector(`#${controlledPanelId}`)
        : null;
      const isOpen = shouldOpen && isTarget;

      toggle.setAttribute("aria-expanded", String(isOpen));

      if (controlledPanel) {
        controlledPanel.hidden = !isOpen;
      }
    });
  }

  function normaliseQuestion(question) {
    return String(question)
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function getCopilotQuestionType(question) {
    const normalised = normaliseQuestion(question);

    if (
      normalised.includes("site 17") &&
      normalised.includes("underperform") &&
      (normalised.includes("why") || normalised.includes("yesterday"))
    ) {
      return "underperformance";
    }

    if (
      (normalised.includes("five sites") || normalised.includes("5 sites")) &&
      normalised.includes("attention")
    ) {
      return "portfolio-ranking";
    }

    if (
      normalised.includes("greatest financial exposure") ||
      (normalised.includes("where") && normalised.includes("financial exposure"))
    ) {
      return "greatest-exposure";
    }

    if (normalised.includes("evidence") && normalised.includes("recommendation")) {
      return "recommendation-evidence";
    }

    if (
      normalised.includes("delay") &&
      normalised.includes("intervention") &&
      (normalised.includes("seven day") || normalised.includes("7 day"))
    ) {
      return "delayed-intervention";
    }

    if (
      normalised.includes("recoverable value") ||
      (normalised.includes("opportunities") && normalised.includes("recoverable"))
    ) {
      return "portfolio-ranking";
    }

    if (
      normalised.includes("intervention first") ||
      (normalised.includes("site") && normalised.includes("receive intervention"))
    ) {
      return "first-intervention";
    }

    if (
      normalised.includes("seen") &&
      normalised.includes("condition") &&
      normalised.includes("before")
    ) {
      return "similar-history";
    }

    if (normalised.includes("inspect") && normalised.includes("first")) {
      return "first-inspection";
    }

    return "unsupported";
  }

  function getCopilotResponse(question) {
    const ranking = getPortfolioRanking();
    const delayedScenario = getInterventionScenario("delay");

    switch (getCopilotQuestionType(question)) {
      case "underperformance":
        return {
          paragraphs: [
            "Site 17 produced 4.11 MWh against an expected 4.82 MWh, a performance variance of -14.7%.",
            "The strongest identified contributor in this illustrative scenario is abnormal Inverter 4 performance.",
            "Weather contribution has been assessed as low.",
            "If the condition persists, estimated Energy-at-Risk is 21.4 MWh with estimated financial exposure of R61,300.",
            "Recommended next action: inspect the inverter cooling system and DC input channels within 48 hours.",
          ],
          evidence: [
            "actual production",
            "expected production",
            "inverter condition",
            "weather assessment",
            "maintenance history availability",
          ],
        };
      case "portfolio-ranking":
        return {
          orderedItems: ranking.map(
            (site) => `${site.name}: ${site.financial}; ${site.priority}`,
          ),
          trailingParagraphs: [
            "Site 17 ranks first because it combines the highest estimated financial exposure with Critical priority in this simulated portfolio.",
          ],
        };
      case "greatest-exposure":
        return {
          paragraphs: [
            "Site 17 currently has the greatest estimated financial exposure at R61,300, followed by Site 04 at R43,600.",
          ],
        };
      case "recommendation-evidence":
        return {
          evidence: [
            "Actual production: 4.11 MWh",
            "Expected production: 4.82 MWh",
            "Performance variance: -14.7%",
            "Strongest contributing condition: abnormal Inverter 4 performance",
            "Weather contribution: low",
            "Maintenance history: available for review",
          ],
          trailingParagraphs: [
            "The recommendation is therefore based on multiple supporting signals rather than the anomaly alone.",
          ],
        };
      case "delayed-intervention":
        return {
          paragraphs: [
            `If intervention is delayed by seven days, estimated continuing Energy-at-Risk is ${delayedScenario.energyAtRisk} with estimated financial exposure of ${delayedScenario.financial}.`,
            delayedScenario.interpretation,
          ],
        };
      case "first-intervention":
        return {
          paragraphs: [
            "Site 17, based on the combination of Critical priority and the highest estimated financial exposure in the simulated portfolio.",
          ],
        };
      case "similar-history":
        return {
          paragraphs: [
            "Yes. The illustrative history contains 11 similar events: 7 cooling obstruction, 3 DC string issue and 1 sensor fault.",
          ],
        };
      case "first-inspection":
        return {
          paragraphs: [
            "Inspect the inverter cooling system and DC input channels first. This is an illustrative recommendation based on the strongest identified contributing condition.",
          ],
        };
      default:
        return {
          paragraphs: [
            "This concept demonstrator currently supports the suggested operational questions above.",
          ],
        };
    }
  }

  function appendResponseList(container, headingText, items, ordered) {
    const heading = document.createElement("h5");
    heading.className = "copilot-response-list-heading";
    heading.textContent = headingText;
    container.append(heading);

    const list = document.createElement(ordered ? "ol" : "ul");
    list.className = "copilot-response-list";

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.append(listItem);
    });

    container.append(list);
  }

  function renderCopilotResponse(question) {
    if (!copilotResponse || !copilotResponseQuestion || !copilotResponseBody) {
      return;
    }

    const response = getCopilotResponse(question);

    setText(copilotResponseQuestion, question);
    copilotResponseBody.replaceChildren();

    (response.paragraphs || []).forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      copilotResponseBody.append(paragraph);
    });

    if (response.orderedItems) {
      appendResponseList(
        copilotResponseBody,
        "Priority ranking",
        response.orderedItems,
        true,
      );
    }

    if (response.evidence) {
      appendResponseList(copilotResponseBody, "Evidence used:", response.evidence, false);
    }

    (response.trailingParagraphs || []).forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      copilotResponseBody.append(paragraph);
    });

    copilotResponse.hidden = false;
    copilotResponse.focus({ preventScroll: true });
  }

  function renderCopilotMode(mode) {
    const activeMode = mode === "executive" ? "executive" : "engineer";

    copilotModeButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.copilotMode === activeMode),
      );
    });

    copilotQuestionGroups.forEach((group) => {
      const isActive = group.dataset.copilotQuestionGroup === activeMode;
      group.hidden = !isActive;
      group.setAttribute("aria-hidden", String(!isActive));
    });
  }

  function renderSimilarEvent(eventType) {
    similarEventButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.eventType === eventType),
      );
    });

    setText(
      similarEventDescription,
      similarEventDescriptions[eventType] ||
        "Select an event type to review the illustrative inspection implication.",
    );
  }

  function renderInterventionScenario(scenarioId) {
    const scenario = getInterventionScenario(scenarioId);

    interventionInputs.forEach((input) => {
      const choice = input.closest(".intervention-choice");
      choice?.classList.toggle("is-selected", input.checked);
    });

    setText(interventionResultTitle, scenario.label);
    setText(interventionEnergyRisk, scenario.energyAtRisk);
    setText(interventionFinancial, scenario.financial);
    setText(interventionInterpretation, scenario.interpretation);
  }

  function resetEvidence() {
    if (evidenceToggle && evidencePanel) {
      evidenceToggle.setAttribute("aria-expanded", "false");
      evidencePanel.hidden = true;
    }

    hideInteractivePanels();
  }

  function renderSite(siteId) {
    const site = sites.find((candidate) => candidate.id === siteId);

    if (!site) {
      return;
    }

    selectedSiteId = site.id;

    siteButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.siteId === selectedSiteId));
    });

    setText(detailSiteName, site.name);
    setText(detailCondition, site.condition);
    setText(detailEnergy, site.energy);
    setText(detailFinancial, site.financial);
    setText(detailPriority, site.priority);
    setText(detailAction, site.action);

    if (detailPriority) {
      detailPriority.classList.remove(...priorityClasses);
      detailPriority.classList.add(site.priorityClass);
    }

    const hasRichAnalysis = Boolean(site.analysis);

    if (detailAnalysis) {
      detailAnalysis.hidden = !hasRichAnalysis;
    }

    if (detailActions) {
      detailActions.hidden = !hasRichAnalysis;
    }

    if (hasRichAnalysis) {
      setText(portfolio.querySelector("#detail-actual"), site.analysis.actual);
      setText(portfolio.querySelector("#detail-expected"), site.analysis.expected);
      setText(portfolio.querySelector("#detail-variance"), site.analysis.variance);
      setText(portfolio.querySelector("#detail-contributing"), site.analysis.contributing);
      setText(portfolio.querySelector("#detail-risk"), site.analysis.risk);
      setText(portfolio.querySelector("#detail-analysis-financial"), site.analysis.financial);
    }

    resetEvidence();
  }

  siteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderSite(button.dataset.siteId);
    });
  });

  if (evidenceToggle && evidencePanel) {
    evidenceToggle.addEventListener("click", () => {
      const isExpanded = evidenceToggle.getAttribute("aria-expanded") === "true";
      evidenceToggle.setAttribute("aria-expanded", String(!isExpanded));
      evidencePanel.hidden = isExpanded;
    });
  }

  panelToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const panelId = toggle.getAttribute("aria-controls");

      if (panelId) {
        toggleInteractivePanel(panelId);
      }
    });
  });

  copilotModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderCopilotMode(button.dataset.copilotMode);
    });
  });

  copilotQuestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.copilotQuestion || button.textContent.trim();

      if (copilotInput) {
        copilotInput.value = question;
      }

      renderCopilotResponse(question);
    });
  });

  copilotForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = copilotInput?.value.trim();

    if (question) {
      renderCopilotResponse(question);
    }
  });

  copilotProductionDetails?.addEventListener("toggle", () => {
    const summary = copilotProductionDetails.querySelector("summary");

    summary?.setAttribute("aria-expanded", String(copilotProductionDetails.open));
  });

  similarEventButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderSimilarEvent(button.dataset.eventType);
    });
  });

  interventionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      renderInterventionScenario(input.value);
    });
  });

  renderCopilotMode("engineer");
  renderInterventionScenario("inspect");

  renderSite(selectedSiteId);
})();

(() => {
  "use strict";

  const simulator = document.querySelector("[data-customer-strategy]");

  if (!simulator) {
    return;
  }

  const availableBudget = 10;
  const defaultObjectiveId = "financial-return";

  const resilienceScores = Object.freeze({
    "Very High": 5,
    High: 4,
    Medium: 3,
    Low: 2,
    None: 1,
  });

  // Illustrative simulated values only. This model contains no customer data.
  const interventions = Object.freeze([
    Object.freeze({
      id: "battery",
      name: "Battery Energy Storage",
      investment: 8.0,
      annualSaving: 2.15,
      payback: 3.7,
      carbonReduction: 420,
      resilience: "Very High",
      sortOrder: 0,
    }),
    Object.freeze({
      id: "solar",
      name: "Additional Solar PV",
      investment: 10.0,
      annualSaving: 1.95,
      payback: 5.1,
      carbonReduction: 1480,
      resilience: "Low",
      sortOrder: 1,
    }),
    Object.freeze({
      id: "load-shifting",
      name: "Load Shifting & Demand Management",
      investment: 2.2,
      annualSaving: 1.05,
      payback: 2.1,
      carbonReduction: 180,
      resilience: "Low",
      sortOrder: 2,
    }),
    Object.freeze({
      id: "efficiency",
      name: "Energy Efficiency Programme",
      investment: 4.0,
      annualSaving: 1.3,
      payback: 3.1,
      carbonReduction: 610,
      resilience: "Low",
      sortOrder: 3,
    }),
    Object.freeze({
      id: "tariff",
      name: "Tariff Optimisation",
      investment: 0.8,
      annualSaving: 0.62,
      payback: 1.3,
      carbonReduction: 40,
      resilience: "None",
      sortOrder: 4,
    }),
  ]);

  const objectives = Object.freeze({
    "lowest-cost": Object.freeze({
      label: "Lowest Energy Cost",
      criterion: "Primary criterion: annual energy-cost saving (highest first).",
      note:
        "Ranking logic: annual energy-cost saving is the primary criterion for Lowest Energy Cost. All values are illustrative and simulated; options fit individually within the R10 million budget. Combined investment portfolios are not included.",
      compare: (first, second) => second.annualSaving - first.annualSaving,
      explain: (top) =>
        `${top.name} ranks first because it delivers the highest simulated annual energy-cost saving at ${formatMillionLong(top.annualSaving)}.`,
    }),
    "financial-return": Object.freeze({
      label: "Highest Financial Return",
      criterion: "Primary criterion: simple payback (shortest first).",
      note:
        "Ranking logic: shorter simple payback is the primary criterion for Highest Financial Return. All values are illustrative and simulated; options fit individually within the R10 million budget. Combined investment portfolios are not included.",
      compare: (first, second) => first.payback - second.payback,
      explain: (top) =>
        `${top.name} ranks first because it has the shortest simulated simple payback at ${top.payback.toFixed(1)} years while remaining comfortably within the R${availableBudget} million investment budget.`,
    }),
    "carbon-reduction": Object.freeze({
      label: "Highest Carbon Reduction",
      criterion: "Primary criterion: annual carbon reduction (highest first).",
      note:
        "Ranking logic: annual carbon reduction is the primary criterion for Highest Carbon Reduction. All values are illustrative and simulated; options fit individually within the R10 million budget. Combined investment portfolios are not included.",
      compare: (first, second) => second.carbonReduction - first.carbonReduction,
      explain: (top) =>
        `${top.name} ranks first because it delivers the highest simulated annual carbon reduction at ${formatCarbon(top.carbonReduction)}.`,
    }),
    resilience: Object.freeze({
      label: "Maximum Resilience",
      criterion:
        "Primary criterion: resilience contribution using the mapped score; annual energy-cost saving breaks ties.",
      note:
        "Ranking logic: resilience is scored Very High = 5, High = 4, Medium = 3, Low = 2 and None = 1; annual energy-cost saving breaks ties. All values are illustrative and simulated; options fit individually within the R10 million budget. Combined investment portfolios are not included.",
      compare: (first, second) =>
        resilienceScores[second.resilience] - resilienceScores[first.resilience] ||
        second.annualSaving - first.annualSaving,
      explain: (top) =>
        `${top.name} ranks first because it provides the strongest simulated resilience contribution while also reducing peak-demand exposure.`,
    }),
  });

  const objectiveButtons = [
    ...simulator.querySelectorAll("[data-strategy-objective]"),
  ];
  const rankingBody = simulator.querySelector("[data-strategy-ranking-body]");
  const rankingCriterion = simulator.querySelector("#customer-strategy-criterion");
  const rankingNote = simulator.querySelector("#customer-strategy-ranking-note");
  const recommendationTitle = simulator.querySelector(
    "#customer-strategy-recommendation-title",
  );
  const recommendationCopy = simulator.querySelector(
    "#customer-strategy-recommendation-copy",
  );
  const productionDetails = simulator.querySelector("[data-strategy-production]");
  const comparisonButton = simulator.querySelector("[data-strategy-compare]");
  const comparisonPanel = simulator.querySelector(
    "[data-strategy-comparison-panel]",
  );
  const comparisonList = simulator.querySelector(
    "[data-strategy-comparison-list]",
  );
  const comparisonObjectiveIds = [
    "lowest-cost",
    "financial-return",
    "carbon-reduction",
    "resilience",
  ];

  function formatInvestment(value) {
    return `R${value.toFixed(1)}m`;
  }

  function formatAnnualSaving(value) {
    return `R${value.toFixed(2)}m`;
  }

  function formatMillionLong(value) {
    return `R${value.toFixed(2)} million`;
  }

  function formatCarbon(value) {
    return `${value.toLocaleString("en-US")} tCO2e`;
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function getObjective(objectiveId) {
    return objectives[objectiveId] || objectives[defaultObjectiveId];
  }

  function rankInterventions(objectiveId) {
    const objective = getObjective(objectiveId);

    return [...interventions].sort(
      (first, second) =>
        objective.compare(first, second) || first.sortOrder - second.sortOrder,
    );
  }

  function createRankingCell(tagName, label, value) {
    const cell = document.createElement(tagName);
    cell.dataset.label = label;
    cell.textContent = value;
    return cell;
  }

  function renderRanking(objectiveId) {
    if (!rankingBody) {
      return;
    }

    const objective = getObjective(objectiveId);
    const ranking = rankInterventions(objectiveId);
    const topIntervention = ranking[0];

    objectiveButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.strategyObjective === objectiveId),
      );
    });

    rankingBody.replaceChildren();

    ranking.forEach((intervention, index) => {
      const row = document.createElement("tr");
      row.dataset.interventionId = intervention.id;

      if (index === 0) {
        row.classList.add("is-recommended");
      }

      row.append(
        createRankingCell("th", "Rank", String(index + 1)),
        createRankingCell("td", "Intervention", intervention.name),
        createRankingCell(
          "td",
          "Investment",
          formatInvestment(intervention.investment),
        ),
        createRankingCell(
          "td",
          "Annual saving",
          formatAnnualSaving(intervention.annualSaving),
        ),
        createRankingCell(
          "td",
          "Payback",
          `${intervention.payback.toFixed(1)} years`,
        ),
        createRankingCell(
          "td",
          "Carbon reduction",
          formatCarbon(intervention.carbonReduction),
        ),
        createRankingCell("td", "Resilience", intervention.resilience),
        createRankingCell(
          "td",
          "Fits budget",
          intervention.investment <= availableBudget ? "Yes" : "No",
        ),
      );

      row.querySelector("th")?.setAttribute("scope", "row");
      rankingBody.append(row);
    });

    setText(rankingCriterion, objective.criterion);
    setText(rankingNote, objective.note);
    setText(recommendationTitle, topIntervention.name);
    setText(recommendationCopy, objective.explain(topIntervention));
  }

  function renderComparison() {
    if (!comparisonList) {
      return;
    }

    comparisonList.replaceChildren();

    comparisonObjectiveIds.forEach((objectiveId) => {
      const objective = getObjective(objectiveId);
      const topIntervention = rankInterventions(objectiveId)[0];
      const item = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");

      term.textContent = objective.label;
      description.textContent = topIntervention.name;
      item.append(term, description);
      comparisonList.append(item);
    });
  }

  objectiveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderRanking(button.dataset.strategyObjective);
    });
  });

  comparisonButton?.addEventListener("click", () => {
    if (!comparisonPanel) {
      return;
    }

    const shouldExpand = comparisonPanel.hidden;
    comparisonButton.setAttribute("aria-expanded", String(shouldExpand));
    comparisonPanel.hidden = !shouldExpand;

    if (shouldExpand) {
      renderComparison();
    }
  });

  productionDetails?.addEventListener("toggle", () => {
    const summary = productionDetails.querySelector("summary");
    summary?.setAttribute("aria-expanded", String(productionDetails.open));
  });

  renderRanking(defaultObjectiveId);
})();

(() => {
  "use strict";

  const optimiser = document.querySelector("[data-optimisation]");

  if (!optimiser) {
    return;
  }

  const scenario = Object.freeze({
    batteryCapacityMwh: 1.8,
    currentSoc: 0.58,
    baselineReservePercent: 20,
    baselineTariff: 3.21,
  });

  const solarForecasts = Object.freeze({
    low: Object.freeze({
      label: "Low",
      solarFactor: 0.42,
      demandFactor: 0.72,
      chargePeriod: "11:00–13:00",
      dischargePeriod: "17:30–19:30",
    }),
    medium: Object.freeze({
      label: "Medium",
      solarFactor: 0.72,
      demandFactor: 0.88,
      chargePeriod: "10:30–14:00",
      dischargePeriod: "17:00–20:00",
    }),
    high: Object.freeze({
      label: "High",
      solarFactor: 1,
      demandFactor: 1,
      chargePeriod: "10:00–14:00",
      dischargePeriod: "17:00–20:00",
    }),
  });

  const chargeEfficiency = 0.86;
  const illustrativeDemandValuePerKwh = 3.1;
  const baselinePeakDemandReduction = 18;

  const form = optimiser.querySelector("[data-optimisation-form]");
  const reserveInput = optimiser.querySelector("#reserve-input");
  const reserveOutput = optimiser.querySelector("#reserve-output");
  const tariffInput = optimiser.querySelector("#tariff-input");
  const tariffOutput = optimiser.querySelector("#tariff-output");
  const forecastInput = optimiser.querySelector("#forecast-input");
  const forecastOutput = optimiser.querySelector("#forecast-output");
  const result = optimiser.querySelector("#optimisation-result");
  const resultSummary = optimiser.querySelector("#optimisation-result-summary");
  const resultChargePeriod = optimiser.querySelector("#result-charge-period");
  const resultDischargePeriod = optimiser.querySelector("#result-discharge-period");
  const resultReserve = optimiser.querySelector("#result-reserve");
  const resultSaving = optimiser.querySelector("#result-saving");
  const resultDemandReduction = optimiser.querySelector("#result-demand-reduction");
  const resultCycleEstimate = optimiser.querySelector("#result-cycle-estimate");

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function formatRand(value) {
    const roundedToTen = Math.round(value / 10) * 10;
    const formatted = String(roundedToTen).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `R${formatted}`;
  }

  function formatTariff(value) {
    return `R${Number(value).toFixed(2)}/kWh`;
  }

  function getDispatchableEnergy(reserveFraction, forecast) {
    // Energy above the reserve can be discharged, while the forecast controls
    // how much of the battery headroom can be topped up from solar.
    const energyAboveReserveMwh = Math.max(
      0,
      scenario.batteryCapacityMwh * (scenario.currentSoc - reserveFraction),
    );
    const chargeHeadroomMwh = scenario.batteryCapacityMwh * (1 - scenario.currentSoc);
    const solarChargeMwh = Math.min(
      chargeHeadroomMwh,
      chargeHeadroomMwh * forecast.solarFactor * chargeEfficiency,
    );

    // This cap makes it impossible for the dispatch to breach the selected reserve.
    return Math.min(
      scenario.batteryCapacityMwh * (1 - reserveFraction),
      energyAboveReserveMwh + solarChargeMwh,
    );
  }

  function calculateStrategy(reservePercent, peakTariff, forecastKey) {
    const reserveFraction = reservePercent / 100;
    const forecast = solarForecasts[forecastKey] || solarForecasts.high;
    const dispatchableEnergyMwh = getDispatchableEnergy(reserveFraction, forecast);
    const baselineEnergyMwh = getDispatchableEnergy(
      scenario.baselineReservePercent / 100,
      solarForecasts.high,
    );
    const equivalentCycles = dispatchableEnergyMwh / scenario.batteryCapacityMwh;

    // The illustrative saving combines the selected peak tariff with a fixed
    // placeholder for demand/network value; it is deliberately not a tariff model.
    const dailySaving =
      dispatchableEnergyMwh * (peakTariff + illustrativeDemandValuePerKwh) * 1000;
    const peakDemandReduction = Math.max(
      0,
      Math.min(
        35,
        Math.round(
          baselinePeakDemandReduction *
            (dispatchableEnergyMwh / baselineEnergyMwh) *
            forecast.demandFactor,
        ),
      ),
    );

    return {
      forecast,
      reservePercent,
      peakTariff,
      dailySaving,
      peakDemandReduction,
      equivalentCycles,
      chargePeriod: forecast.chargePeriod,
      dischargePeriod: forecast.dischargePeriod,
    };
  }

  function updateInputOutputs() {
    const reservePercent = Number(reserveInput?.value || scenario.baselineReservePercent);
    const peakTariff = Number(tariffInput?.value || scenario.baselineTariff);
    const forecast = solarForecasts[forecastInput?.value] || solarForecasts.high;

    setText(reserveOutput, `${reservePercent}%`);
    setText(tariffOutput, formatTariff(peakTariff));
    setText(forecastOutput, forecast.label);
  }

  if (!form || !reserveInput || !tariffInput || !forecastInput || !result) {
    return;
  }

  reserveInput.addEventListener("input", updateInputOutputs);
  tariffInput.addEventListener("input", updateInputOutputs);
  forecastInput.addEventListener("change", updateInputOutputs);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const reservePercent = Number(reserveInput.value);
    const peakTariff = Number(tariffInput.value);
    const strategy = calculateStrategy(reservePercent, peakTariff, forecastInput.value);

    setText(
      resultSummary,
      `Based on a ${strategy.forecast.label.toLowerCase()} solar forecast, a ${strategy.reservePercent}% reserve and a peak tariff of ${formatTariff(strategy.peakTariff)}.`,
    );
    setText(resultChargePeriod, strategy.chargePeriod);
    setText(resultDischargePeriod, strategy.dischargePeriod);
    setText(resultReserve, `${strategy.reservePercent}%`);
    setText(resultSaving, `≈ ${formatRand(strategy.dailySaving)}`);
    setText(resultDemandReduction, `≈ ${strategy.peakDemandReduction}%`);
    setText(resultCycleEstimate, `≈ ${strategy.equivalentCycles.toFixed(2)} equivalent cycles`);

    result.hidden = false;
    result.focus({ preventScroll: true });
  });

  updateInputOutputs();
})();

(() => {
  "use strict";

  const decisionSupport = document.querySelector("[data-trading-wheeling]");

  if (!decisionSupport) {
    return;
  }

  const scenario = Object.freeze({
    availableExcessSolarMwh: 12,
    receivingDemandMwh: 8,
    batteryAvailableCapacityMwh: 4,
    currentSoc: 0.45,
    localAvoidedCost: 2.55,
    wheelingDestinationAvoidedCost: 3.1,
    wheelingCharge: 0.42,
    exportValue: 1.85,
    roundTripEfficiency: 0.9,
    laterPeakEnergyValue: 3.35,
  });

  const wheelingChargeInput = decisionSupport.querySelector(
    "#wheeling-charge-input",
  );
  const wheelingChargeOutput = decisionSupport.querySelector(
    "#wheeling-charge-output",
  );
  const peakValueInput = decisionSupport.querySelector("#peak-value-input");
  const peakValueOutput = decisionSupport.querySelector("#peak-value-output");
  const receivingDemandInput = decisionSupport.querySelector(
    "#receiving-demand-input",
  );
  const receivingDemandOutput = decisionSupport.querySelector(
    "#receiving-demand-output",
  );
  const resultsBody = decisionSupport.querySelector(
    "#trading-wheeling-results-body",
  );
  const recommendation = decisionSupport.querySelector(
    ".commercial-decision-recommendation",
  );
  const recommendationOption = decisionSupport.querySelector(
    "#commercial-decision-recommendation-option",
  );
  const recommendationCopy = decisionSupport.querySelector(
    "#commercial-decision-recommendation-copy",
  );
  const wheelingFavourableButton = decisionSupport.querySelector(
    "[data-trading-wheeling-favourable]",
  );
  const resetButton = decisionSupport.querySelector(
    "[data-trading-wheeling-reset]",
  );
  const optionRows = resultsBody
    ? [...resultsBody.querySelectorAll("[data-allocation-option]")]
    : [];

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function formatRand(value) {
    const roundedValue = Math.round(value);
    const formatted = String(roundedValue).replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ",",
    );
    return `R${formatted}`;
  }

  function formatRate(value) {
    return `R${Number(value).toFixed(2)}/kWh`;
  }

  function formatMwh(value, suffix = "") {
    return `${Number(value).toFixed(1)} MWh${suffix}`;
  }

  function calculateAllocations(wheelingCharge, laterPeakValue, receivingDemand) {
    const availableEnergyKwh = scenario.availableExcessSolarMwh * 1000;
    const wheelingQuantityMwh = Math.min(
      scenario.availableExcessSolarMwh,
      receivingDemand,
    );
    const wheelingValuePerKwh =
      scenario.wheelingDestinationAvoidedCost - wheelingCharge;
    const storedEnergyMwh = Math.min(
      scenario.availableExcessSolarMwh,
      scenario.batteryAvailableCapacityMwh,
    );
    const deliveredPeakEnergyMwh =
      storedEnergyMwh * scenario.roundTripEfficiency;

    return [
      {
        id: "local",
        name: "Consume Locally",
        energyUtilised: formatMwh(scenario.availableExcessSolarMwh),
        valuePerKwh: scenario.localAvoidedCost,
        valuePerKwhLabel: formatRate(scenario.localAvoidedCost),
        totalValue: availableEnergyKwh * scenario.localAvoidedCost,
        order: 0,
      },
      {
        id: "store",
        name: "Store for Peak Use",
        energyUtilised: formatMwh(deliveredPeakEnergyMwh, " delivered"),
        valuePerKwh: laterPeakValue,
        valuePerKwhLabel: formatRate(laterPeakValue),
        totalValue: deliveredPeakEnergyMwh * 1000 * laterPeakValue,
        order: 1,
      },
      {
        id: "wheel",
        name: "Wheel to Receiving Site",
        energyUtilised: formatMwh(wheelingQuantityMwh),
        valuePerKwh: wheelingValuePerKwh,
        valuePerKwhLabel: `${formatRate(wheelingValuePerKwh)} net`,
        totalValue: wheelingQuantityMwh * 1000 * wheelingValuePerKwh,
        order: 2,
      },
      {
        id: "export",
        name: "Export / Sell",
        energyUtilised: formatMwh(scenario.availableExcessSolarMwh),
        valuePerKwh: scenario.exportValue,
        valuePerKwhLabel: formatRate(scenario.exportValue),
        totalValue: availableEnergyKwh * scenario.exportValue,
        order: 3,
      },
    ];
  }

  function getInputs() {
    return {
      wheelingCharge: Number(
        wheelingChargeInput?.value || scenario.wheelingCharge,
      ),
      laterPeakValue: Number(
        peakValueInput?.value || scenario.laterPeakEnergyValue,
      ),
      receivingDemand: Number(
        receivingDemandInput?.value || scenario.receivingDemandMwh,
      ),
    };
  }

  function getRecommendationCopy(option) {
    switch (option.id) {
      case "wheel":
        return "Wheeling ranks first because the receiving-site demand and net avoided cost after wheeling charges produce the greatest current value.";
      case "store":
        return "Storage ranks first because the simulated later peak value is high enough to outweigh conversion losses.";
      case "export":
        return "Export ranks first because the simulated sale value produces the greatest total value under the current assumptions.";
      case "local":
      default:
        return "Under the current simulated assumptions, local consumption produces the highest indicative total value because all 12 MWh can offset energy priced at R2.55/kWh.";
    }
  }

  function updateInputOutputs(inputs) {
    setText(wheelingChargeOutput, formatRate(inputs.wheelingCharge));
    setText(peakValueOutput, formatRate(inputs.laterPeakValue));
    setText(receivingDemandOutput, formatMwh(inputs.receivingDemand));
  }

  function updateScenarioButtonState(inputs) {
    const isWheelingFavourable =
      inputs.wheelingCharge === 0.2 && inputs.receivingDemand === 12;

    wheelingFavourableButton?.setAttribute(
      "aria-pressed",
      String(isWheelingFavourable),
    );
  }

  function render() {
    const inputs = getInputs();
    const rankedAllocations = calculateAllocations(
      inputs.wheelingCharge,
      inputs.laterPeakValue,
      inputs.receivingDemand,
    ).sort(
      (first, second) =>
        second.totalValue - first.totalValue || first.order - second.order,
    );

    updateInputOutputs(inputs);
    updateScenarioButtonState(inputs);

    rankedAllocations.forEach((allocation, index) => {
      const row = optionRows.find(
        (candidate) => candidate.dataset.allocationOption === allocation.id,
      );

      if (!row) {
        return;
      }

      const rank = row.querySelector('[data-result-field="rank"]');
      const name = row.querySelector('[data-result-field="name"]');
      const marker = row.querySelector('[data-result-field="marker"]');
      const energy = row.querySelector('[data-result-field="energy"]');
      const rate = row.querySelector('[data-result-field="rate"]');
      const total = row.querySelector('[data-result-field="total"]');
      const isRecommended = index === 0;

      setText(rank, String(index + 1));
      setText(name, allocation.name);
      setText(energy, allocation.energyUtilised);
      setText(rate, allocation.valuePerKwhLabel);
      setText(total, formatRand(allocation.totalValue));
      row.classList.toggle("is-recommended", isRecommended);
      marker?.toggleAttribute("hidden", !isRecommended);

      if (isRecommended) {
        row.setAttribute("aria-label", `${allocation.name}, recommended`);
      } else {
        row.removeAttribute("aria-label");
      }

      resultsBody?.appendChild(row);
    });

    const recommendedAllocation = rankedAllocations[0];

    if (!recommendedAllocation) {
      return;
    }

    setText(recommendationOption, recommendedAllocation.name);
    setText(recommendationCopy, getRecommendationCopy(recommendedAllocation));
    recommendation?.setAttribute(
      "aria-label",
      `Recommended allocation: ${recommendedAllocation.name}. ${getRecommendationCopy(recommendedAllocation)}`,
    );
  }

  function setInputs(values) {
    if (wheelingChargeInput) {
      wheelingChargeInput.value = String(values.wheelingCharge);
    }

    if (peakValueInput) {
      peakValueInput.value = String(values.laterPeakValue);
    }

    if (receivingDemandInput) {
      receivingDemandInput.value = String(values.receivingDemand);
    }

    render();
  }

  if (
    !wheelingChargeInput ||
    !peakValueInput ||
    !receivingDemandInput ||
    !resultsBody
  ) {
    return;
  }

  [wheelingChargeInput, peakValueInput, receivingDemandInput].forEach(
    (input) => input.addEventListener("input", render),
  );

  wheelingFavourableButton?.addEventListener("click", () => {
    setInputs({
      wheelingCharge: 0.2,
      laterPeakValue: Number(peakValueInput.value),
      receivingDemand: 12,
    });
  });

  resetButton?.addEventListener("click", () => {
    setInputs({
      wheelingCharge: scenario.wheelingCharge,
      laterPeakValue: scenario.laterPeakEnergyValue,
      receivingDemand: scenario.receivingDemandMwh,
    });
  });

  render();
})();

(() => {
  "use strict";

  const explorer = document.querySelector("[data-capability-explorer]");

  if (!explorer) {
    return;
  }

  const capabilities = [
    {
      id: "foundation-models",
      name: "Foundation Models",
      approach: "BUY",
      why: "General-purpose foundation models are widely available and expensive to reproduce.",
      own: "Prompts, tool definitions, evaluation criteria, domain workflows and application logic.",
      partner: "Foundation model capability.",
    },
    {
      id: "weather-external-data",
      name: "Weather & External Data",
      approach: "PARTNER / LICENSE",
      why: "Specialist providers already collect and maintain these datasets.",
      own: "How external data is used within energy models and decisions.",
      partner: "Weather, market or other specialist data feeds.",
    },
    {
      id: "esums-existing-energy-technology",
      name: "eSUMS / Existing Energy Technology",
      approach: "INTEGRATE / PARTNER",
      why: "LTM already has an established digital-energy ecosystem. The CoE should extend useful capabilities rather than unnecessarily recreate them.",
      own: "Business priorities, customer experience, strategic product direction and LTM-specific intelligence.",
      partner: "Existing platform and specialist technology capabilities.",
    },
    {
      id: "intervention-outcome-intelligence",
      name: "LTM Intervention & Outcome Intelligence",
      approach: "OWN",
      why: "This can reflect LTM’s accumulated engineering and operating experience and may become increasingly valuable as more interventions and outcomes are captured.",
      own: "Structured intervention history, outcome knowledge, benchmarks and associated decision logic.",
      partner: "Supporting infrastructure where required.",
    },
    {
      id: "energy-optimisation",
      name: "Energy Optimisation",
      approach: "HYBRID",
      why: "Optimisation may require specialist mathematical methods and data, while the business objectives and operational constraints are specific to LTM and its customers.",
      own: "Objectives, constraints, customer-specific logic, workflow and commercial application.",
      partner: "Specialist optimisation technology or data where justified.",
    },
    {
      id: "energy-copilot",
      name: "Energy Copilot",
      approach: "BUILD / INTEGRATE",
      why: "The underlying language model is commodity technology, but the useful product comes from how it connects to LTM’s tools, data, engineering workflows and governance.",
      own: "Tool architecture, workflows, permissions, evaluation, user experience and LTM-specific business logic.",
      partner: "Foundation model and selected specialist services.",
    },
  ];

  const capabilityButtons = [...explorer.querySelectorAll("[data-capability-id]")];
  const detailTitle = explorer.querySelector("#capability-detail-title");
  const detailApproach = explorer.querySelector("#capability-approach");
  const detailWhy = explorer.querySelector("#capability-why");
  const detailOwn = explorer.querySelector("#capability-own");
  const detailPartner = explorer.querySelector("#capability-partner");

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function renderCapability(capabilityId) {
    const capability = capabilities.find((candidate) => candidate.id === capabilityId);

    if (!capability) {
      return;
    }

    capabilityButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.capabilityId === capability.id));
    });

    setText(detailTitle, capability.name);
    setText(detailApproach, capability.approach);
    setText(detailWhy, capability.why);
    setText(detailOwn, capability.own);
    setText(detailPartner, capability.partner);
  }

  capabilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderCapability(button.dataset.capabilityId);
    });
  });

  renderCapability("intervention-outcome-intelligence");
})();

(() => {
  "use strict";

  const explorer = document.querySelector("[data-opportunity-explorer]");

  if (!explorer) {
    return;
  }

  const opportunities = [
    {
      id: "solar",
      name: "Solar",
      problem:
        "Portfolio teams need to distinguish weather-driven variance from equipment or operational underperformance.",
      capability:
        "Cross-site performance intelligence that compares expected and actual production, identifies material deviations and prioritises investigation by economic impact.",
      methods: [
        "solar forecasting",
        "performance models",
        "anomaly detection",
        "deterministic loss calculations",
        "AI explanation",
      ],
      value:
        "Faster diagnosis, reduced avoidable generation loss and clearer prioritisation across solar assets.",
      kpi: "Energy recovered / investigation time / false-positive reduction",
      approach:
        "HYBRID: integrate existing forecasting and monitoring capabilities while LTM owns portfolio prioritisation and decision workflows.",
    },
    {
      id: "bess",
      name: "BESS",
      problem:
        "Battery operation must balance tariff value, renewable generation, resilience, operating limits and degradation.",
      capability:
        "Intelligent operating recommendations that determine when storage should charge, discharge or preserve reserve.",
      methods: [
        "load forecasting",
        "solar forecasting",
        "mathematical optimisation",
        "battery constraints",
        "tariff models",
        "AI explanation",
      ],
      value:
        "Improved storage economics, peak reduction and better utilisation of installed battery capacity.",
      kpi: "Economic value per cycle / peak reduction / constraint compliance",
      approach:
        "HYBRID: LTM owns objectives, customer constraints and workflow while specialist optimisation capability can be partnered where useful.",
    },
    {
      id: "engineering",
      name: "Engineering",
      problem:
        "Engineering knowledge can be distributed across calculations, reports, drawings, manuals and individual experience.",
      capability:
        "Engineering Knowledge Assistant that retrieves approved technical information and supports evidence-backed engineering investigation.",
      methods: [
        "retrieval",
        "document search",
        "engineering tools",
        "controlled AI agent",
        "source citation",
      ],
      value:
        "Reduced information-retrieval time, faster investigations and improved reuse of engineering knowledge.",
      kpi: "Engineering hours saved / retrieval accuracy / investigation time",
      approach:
        "BUILD / INTEGRATE: LTM owns knowledge structures, permissions and workflow; commodity retrieval/model infrastructure can be sourced.",
    },
    {
      id: "esums",
      name: "eSUMS",
      problem:
        "Operational intelligence becomes more valuable when users can move from monitoring to explanation, prioritisation and recommended action.",
      capability:
        "Energy Intelligence layer combining portfolio prioritisation, economic consequence and controlled conversational access.",
      methods: [
        "existing eSUMS data",
        "deterministic analytics",
        "APIs",
        "tool-calling agents",
        "workflow integration",
      ],
      value:
        "Higher value from existing digital services, stronger customer experience and potential premium functionality.",
      kpi: "Feature adoption / investigation time / recurring digital revenue",
      approach:
        "INTEGRATE / PARTNER: build around existing eSUMS and partner capability rather than recreating the platform.",
    },
    {
      id: "energy-management",
      name: "Energy Management",
      problem:
        "Customers must decide how to combine efficiency, solar, storage, load shifting and tariff strategies.",
      capability:
        "Energy Economics engine that evaluates technical options according to financial and operational objectives.",
      methods: [
        "load analysis",
        "tariff models",
        "scenario simulation",
        "optimisation",
        "engineering constraints",
      ],
      value: "Better investment prioritisation and measurable energy-cost reduction.",
      kpi: "Verified savings / ROI of recommended interventions / demand reduction",
      approach: "BUILD / HYBRID: LTM should own customer-specific decision logic and economic models.",
    },
    {
      id: "carbon-sustainability",
      name: "Carbon & Sustainability",
      problem:
        "Energy and carbon decisions can involve data spread across consumption, generation, projects and reporting workflows.",
      capability:
        "Carbon intelligence that links operational energy decisions with verified sustainability and reporting outcomes.",
      methods: [
        "deterministic carbon calculations",
        "data integration",
        "anomaly checks",
        "reporting automation",
        "AI explanation",
      ],
      value:
        "Lower reporting effort, stronger evidence and clearer links between energy interventions and carbon outcomes.",
      kpi: "Reporting time / data completeness / verified emissions impact",
      approach:
        "HYBRID: retain LTM-specific reporting and decision workflows while using established standards and external data where required.",
    },
    {
      id: "trading-wheeling",
      name: "Trading & Wheeling",
      problem:
        "Commercial energy decisions increasingly depend on forecasts, contracts, settlement rules, loads, generation and market conditions.",
      capability:
        "Decision-support intelligence for evaluating wheeling, trading and future market opportunities under defined constraints.",
      methods: [
        "forecasting",
        "deterministic settlement calculations",
        "economic optimisation",
        "scenario modelling",
        "market data",
      ],
      value:
        "Improved commercial decision-making and potential expansion of energy-management services.",
      kpi: "Forecast error / settlement accuracy / economic value identified",
      approach:
        "HYBRID / PARTNER: LTM owns commercial decision objectives while specialist market systems and data may come from partners.",
    },
    {
      id: "operations",
      name: "Operations",
      problem:
        "Operational teams need to decide which interventions deserve attention first across multiple assets and customers.",
      capability:
        "Portfolio Opportunity & Risk Intelligence ranked by technical consequence, financial exposure, urgency and confidence.",
      methods: [
        "telemetry",
        "analytics",
        "anomaly data",
        "financial calculation",
        "workflow automation",
      ],
      value:
        "Better resource allocation, faster response and reduced avoidable energy loss.",
      kpi: "MTTR / Energy-at-Risk addressed / intervention acceptance",
      approach:
        "BUILD / INTEGRATE: combine existing operational systems with LTM-specific prioritisation and workflow intelligence.",
    },
    {
      id: "sales-business-development",
      name: "Sales & Business Development",
      problem:
        "Commercial teams need to identify where customer portfolios contain the strongest technical and economic opportunities.",
      capability:
        "AI-assisted opportunity intelligence that combines approved customer information, energy analysis and LTM service capabilities to support solution development.",
      methods: [
        "customer data",
        "tariff/load analysis",
        "retrieval",
        "deterministic calculations",
        "proposal assistance",
      ],
      value:
        "Faster opportunity qualification, more evidence-based proposals and improved cross-selling of LTM services.",
      kpi: "Proposal preparation time / qualified opportunities / conversion rate",
      approach:
        "BUILD / INTEGRATE: LTM owns commercial workflow and customer logic while using commodity AI services where appropriate.",
    },
  ];

  const opportunityButtons = [...explorer.querySelectorAll("[data-opportunity-id]")];
  const detailTitle = explorer.querySelector("#opportunity-detail-title");
  const detailProblem = explorer.querySelector("#opportunity-problem");
  const detailCapability = explorer.querySelector("#opportunity-capability");
  const detailMethods = explorer.querySelector("#opportunity-methods");
  const detailValue = explorer.querySelector("#opportunity-value");
  const detailKpi = explorer.querySelector("#opportunity-kpi");
  const detailApproach = explorer.querySelector("#opportunity-approach");

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function renderOpportunity(opportunityId) {
    const opportunity = opportunities.find(
      (candidate) => candidate.id === opportunityId,
    );

    if (!opportunity) {
      return;
    }

    opportunityButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.opportunityId === opportunity.id),
      );
    });

    setText(detailTitle, opportunity.name);
    setText(detailProblem, opportunity.problem);
    setText(detailCapability, opportunity.capability);
    setText(detailValue, opportunity.value);
    setText(detailKpi, opportunity.kpi);
    setText(detailApproach, opportunity.approach);

    if (detailMethods) {
      detailMethods.replaceChildren();

      opportunity.methods.forEach((method) => {
        const listItem = document.createElement("li");
        listItem.textContent = method;
        detailMethods.append(listItem);
      });
    }
  }

  opportunityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderOpportunity(button.dataset.opportunityId);
    });
  });

  renderOpportunity("bess");
})();

(() => {
  "use strict";

  const assistant = document.querySelector("[data-engineering-knowledge]");

  if (!assistant) {
    return;
  }

  const sources = Object.freeze({
    manual: Object.freeze({
      name: "Inverter Manufacturer Manual",
      type: "OEM manual",
      reference: "Section 9.3: Thermal and DC Input Diagnostics",
      extract:
        "“Where abnormal operating temperature is detected, confirm airflow, cooling-path condition and fan operation before extended operation. If output remains abnormal, inspect DC input current consistency and connection integrity.”",
    }),
    commissioning: Object.freeze({
      name: "Site 17 Commissioning Report",
      type: "Commissioning record",
      reference: "Section 4.2: Inverter Commissioning Observations",
      extract:
        "“Inverter 4 showed normal performance following commissioning. DC input channels were balanced within the commissioning acceptance range. No persistent thermal abnormality was recorded.”",
    }),
    maintenance: Object.freeze({
      name: "Site 17 Maintenance Record",
      type: "Maintenance history",
      reference: "Work Order M-017-042",
      extract:
        "“Previous inspection identified restricted airflow caused by accumulated debris around the inverter cooling intake. Cleaning restored normal temperature behaviour.”",
    }),
    procedure: Object.freeze({
      name: "LTM Engineering Inspection Procedure",
      type: "Engineering procedure",
      reference: "Procedure EP-PV-07: Inverter Underperformance Investigation",
      extract:
        "“Recommended investigation sequence: verify environmental conditions; inspect cooling and ventilation; compare inverter output against neighbouring units; inspect DC input channels; validate sensor readings; record intervention and post-intervention performance.”",
    }),
  });

  const questionLabels = Object.freeze({
    "first-inspection": "What should the engineer inspect first?",
    "manual-guidance":
      "What does the inverter manual recommend for abnormal temperature behaviour?",
    "commissioning-history": "Was a similar issue seen during commissioning?",
    "maintenance-history": "What previous maintenance is relevant?",
    "investigation-checklist": "Generate an investigation checklist",
  });

  const responses = Object.freeze({
    "first-inspection": Object.freeze({
      paragraphs: [
        "Based on the simulated approved sources, the first inspection should focus on the inverter cooling path and ventilation condition, followed by DC input consistency if the abnormal behaviour remains.",
      ],
      evidence: [
        "LTM Engineering Procedure EP-PV-07",
        "Inverter Manufacturer Manual §9.3",
        "Maintenance Record M-017-042",
      ],
      trailingParagraphs: [
        "Previous Site 17 maintenance history makes cooling obstruction particularly relevant in this illustrative scenario.",
      ],
      sourceIds: ["procedure", "manual", "maintenance"],
    }),
    "manual-guidance": Object.freeze({
      paragraphs: [
        "The simulated manufacturer guidance recommends checking airflow, cooling-path condition and fan operation first. If abnormal output continues, the next inspection should include DC input current consistency and connection integrity.",
      ],
      sourceIds: ["manual"],
    }),
    "commissioning-history": Object.freeze({
      paragraphs: [
        "No persistent thermal abnormality was recorded in the simulated Site 17 commissioning report. Inverter 4 was reported as operating normally, with balanced DC inputs within the commissioning acceptance range.",
      ],
      interpretations: [
        "This suggests the current condition is more likely to have developed during operation rather than being a known commissioning defect in this illustrative scenario.",
      ],
      sourceIds: ["commissioning"],
    }),
    "maintenance-history": Object.freeze({
      paragraphs: [
        "A previous simulated maintenance event on Site 17 identified restricted airflow around the inverter cooling intake. Cleaning restored normal temperature behaviour.",
      ],
      interpretations: [
        "This does not prove that the current condition has the same cause, but it increases the relevance of cooling-path inspection.",
      ],
      sourceIds: ["maintenance"],
    }),
    "investigation-checklist": Object.freeze({
      checklist: [
        "Confirm current environmental and irradiance conditions.",
        "Inspect Inverter 4 cooling intake and ventilation path.",
        "Verify fan operation and temperature-related indicators.",
        "Compare Inverter 4 output with neighbouring units.",
        "Inspect DC input channels and connection integrity.",
        "Validate relevant sensor readings.",
        "Record findings and intervention performed.",
        "Compare post-intervention performance against expected production.",
      ],
      trailingParagraphs: [
        "Checklist generated from the simulated engineering procedure and supporting records.",
      ],
      sourceIds: ["procedure", "manual", "commissioning", "maintenance"],
    }),
  });

  const questionButtons = [
    ...assistant.querySelectorAll("[data-engineering-question]"),
  ];
  const form = assistant.querySelector("[data-engineering-form]");
  const input = assistant.querySelector("#engineering-knowledge-input");
  const response = assistant.querySelector("#engineering-knowledge-response");
  const responseQuestion = assistant.querySelector(
    "#engineering-knowledge-response-question",
  );
  const responseBody = assistant.querySelector(
    "#engineering-knowledge-response-body",
  );
  const sourceList = assistant.querySelector("#engineering-source-list");
  const sourcePanel = assistant.querySelector("#engineering-source-panel");
  const productionDetails = assistant.querySelector(
    ".engineering-knowledge-production",
  );

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function normaliseQuestion(question) {
    return String(question)
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function getQuestionId(question) {
    const normalised = normaliseQuestion(question);

    return (
      Object.entries(questionLabels).find(
        ([, label]) => normaliseQuestion(label) === normalised,
      )?.[0] || null
    );
  }

  function appendParagraph(container, paragraphText, className = "") {
    const paragraph = document.createElement("p");

    if (className) {
      paragraph.className = className;
    }

    paragraph.textContent = paragraphText;
    container.append(paragraph);
  }

  function appendResponseList(container, headingText, items, ordered = false) {
    const heading = document.createElement("h5");
    heading.className = "engineering-response-list-heading";
    heading.textContent = headingText;
    container.append(heading);

    const list = document.createElement(ordered ? "ol" : "ul");
    list.className = "engineering-response-list";

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.append(listItem);
    });

    container.append(list);
  }

  function renderSource(sourceId) {
    const source = sources[sourceId];

    if (!source || !sourcePanel) {
      return;
    }

    sourceList?.querySelectorAll("[data-engineering-source]").forEach((button) => {
      const isActive = button.dataset.engineeringSource === sourceId;
      button.setAttribute("aria-expanded", String(isActive));
    });

    sourcePanel.replaceChildren();

    const title = document.createElement("h6");
    title.id = "engineering-source-panel-title";
    title.className = "engineering-source-panel-title";
    title.textContent = source.name;
    sourcePanel.append(title);
    sourcePanel.setAttribute("aria-labelledby", title.id);

    const status = document.createElement("p");
    status.className = "engineering-source-panel-status";
    status.textContent = "Simulated illustrative source";
    sourcePanel.append(status);

    const details = document.createElement("dl");
    details.className = "engineering-source-details";

    [
      ["Source type", source.type],
      ["Reference", source.reference],
    ].forEach(([label, value]) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");

      term.textContent = label;
      description.textContent = value;
      details.append(term, description);
    });

    sourcePanel.append(details);

    const extract = document.createElement("p");
    extract.className = "engineering-source-extract";
    extract.textContent = `Relevant extract: ${source.extract}`;
    sourcePanel.append(extract);

    sourcePanel.hidden = false;
  }

  function collapseSourcePanel() {
    sourceList?.querySelectorAll("[data-engineering-source]").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    if (sourcePanel) {
      sourcePanel.hidden = true;
      sourcePanel.replaceChildren();
      sourcePanel.removeAttribute("aria-labelledby");
    }
  }

  function renderSourceList(sourceIds) {
    if (!sourceList) {
      return;
    }

    sourceList.replaceChildren();

    if (!sourceIds.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "engineering-source-empty";
      emptyMessage.textContent = "No simulated sources were retrieved for this unsupported question.";
      sourceList.append(emptyMessage);

      if (sourcePanel) {
        sourcePanel.hidden = true;
        sourcePanel.replaceChildren();
        sourcePanel.removeAttribute("aria-labelledby");
      }

      return;
    }

    sourceIds.forEach((sourceId) => {
      const source = sources[sourceId];

      if (!source) {
        return;
      }

      const button = document.createElement("button");
      button.className = "engineering-source-button";
      button.type = "button";
      button.dataset.engineeringSource = sourceId;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", "engineering-source-panel");
      button.setAttribute(
        "aria-label",
        `Show or hide ${source.name}, simulated illustrative source`,
      );
      button.textContent = source.name;
      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          collapseSourcePanel();
        } else {
          renderSource(sourceId);
        }
      });
      sourceList.append(button);
    });

    if (sourcePanel) {
      sourcePanel.hidden = true;
      sourcePanel.replaceChildren();
      sourcePanel.removeAttribute("aria-labelledby");
    }
  }

  function renderResponse(question, questionId) {
    if (!response || !responseQuestion || !responseBody) {
      return;
    }

    const responseData =
      (questionId && responses[questionId]) || {
        paragraphs: [
          "This concept demonstrator currently supports the suggested engineering questions above.",
        ],
        sourceIds: [],
      };

    questionButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.engineeringQuestion === questionId),
      );
    });

    setText(responseQuestion, question);
    responseBody.replaceChildren();

    (responseData.paragraphs || []).forEach((paragraphText) => {
      appendParagraph(responseBody, paragraphText);
    });

    if (responseData.evidence) {
      appendResponseList(responseBody, "Evidence:", responseData.evidence);
    }

    if (responseData.checklist) {
      appendResponseList(
        responseBody,
        "Suggested investigation checklist",
        responseData.checklist,
        true,
      );
    }

    (responseData.interpretations || []).forEach((interpretation) => {
      const heading = document.createElement("h5");
      heading.className = "engineering-response-list-heading";
      heading.textContent = "Interpretation:";
      responseBody.append(heading);
      appendParagraph(responseBody, interpretation, "engineering-response-interpretation");
    });

    (responseData.trailingParagraphs || []).forEach((paragraphText) => {
      appendParagraph(responseBody, paragraphText);
    });

    renderSourceList(responseData.sourceIds || []);
    response.hidden = false;
    response.focus({ preventScroll: true });
  }

  questionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = button.dataset.engineeringQuestion;
      const question = questionLabels[questionId] || button.textContent.trim();

      if (input) {
        input.value = question;
      }

      renderResponse(question, questionId);
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = input?.value.trim();

    if (question) {
      renderResponse(question, getQuestionId(question));
    }
  });

  productionDetails?.addEventListener("toggle", () => {
    const summary = productionDetails.querySelector("summary");
    summary?.setAttribute("aria-expanded", String(productionDetails.open));
  });
})();
