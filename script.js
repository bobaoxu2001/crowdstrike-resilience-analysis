(function () {
    "use strict";

    /* ---------- Risk data (single source of truth) ---------- */
    var risks = [
        { id: 1, name: "Kernel modification", desc: "Changes to low\u2011level OS components can have cascading effects if not properly isolated.", impact: 5, likelihood: 3 },
        { id: 2, name: "Insufficient regression testing", desc: "Lack of broad test coverage across OS versions and configurations.", impact: 4, likelihood: 4 },
        { id: 3, name: "Overly aggressive rollout", desc: "Automated push to all endpoints without canary deployments or kill switch.", impact: 4, likelihood: 3 },
        { id: 4, name: "Communication & training gaps", desc: "IT staff overloaded; incident response playbooks outdated; lacking awareness of update risks.", impact: 3, likelihood: 4 },
        { id: 5, name: "Risk governance weaknesses", desc: "Inadequate risk registers and absence of enterprise\u2011level oversight for content updates.", impact: 4, likelihood: 3 }
    ];

    function severity(score) {
        if (score <= 4) return "low";
        if (score <= 9) return "medium";
        if (score <= 14) return "high";
        return "critical";
    }

    function severityLabel(level) {
        return level.charAt(0).toUpperCase() + level.slice(1);
    }

    /* ---------- Build the risk table ---------- */
    function buildTable() {
        var body = document.getElementById("riskTableBody");
        if (!body) return;
        risks.forEach(function (r) {
            var score = r.impact * r.likelihood;
            var level = severity(score);
            var tr = document.createElement("tr");
            tr.innerHTML =
                "<td>" + r.name + "</td>" +
                "<td>" + r.desc + "</td>" +
                "<td>" + r.impact + "</td>" +
                "<td>" + r.likelihood + "</td>" +
                '<td><span class="score-pill score-pill--' + level + '" title="' +
                severityLabel(level) + '">' + score + "</span></td>";
            body.appendChild(tr);
        });
    }

    /* ---------- Build the 5x5 heatmap ---------- */
    function buildHeatmap() {
        var grid = document.getElementById("heatmapGrid");
        if (!grid) return;

        // Map "impact-likelihood" -> array of risk ids in that cell
        var cellRisks = {};
        risks.forEach(function (r) {
            var key = r.impact + "-" + r.likelihood;
            (cellRisks[key] = cellRisks[key] || []).push(r.id);
        });

        // Rows: impact 5 (top) down to 1 (bottom). Cols: likelihood 1..5.
        for (var impact = 5; impact >= 1; impact--) {
            for (var likelihood = 1; likelihood <= 5; likelihood++) {
                var score = impact * likelihood;
                var level = severity(score);
                var cell = document.createElement("div");
                cell.className = "heat-cell heat-cell--" + level;
                cell.setAttribute("title",
                    "Impact " + impact + " \u00d7 Likelihood " + likelihood +
                    " = " + score + " (" + severityLabel(level) + ")");

                var ids = cellRisks[impact + "-" + likelihood];
                if (ids) {
                    var marker = document.createElement("div");
                    marker.className = "heat-cell__marker";
                    marker.innerHTML = "<span>" + ids.join(",") + "</span>";
                    cell.appendChild(marker);
                }
                grid.appendChild(cell);
            }
        }
    }

    /* ---------- Mobile nav toggle ---------- */
    function initNav() {
        var toggle = document.getElementById("navToggle");
        var nav = document.getElementById("primaryNav");
        if (!toggle || !nav) return;

        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        nav.addEventListener("click", function (e) {
            if (e.target.tagName === "A") {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---------- Active section highlighting ---------- */
    function initActiveNav() {
        var links = Array.prototype.slice.call(
            document.querySelectorAll(".primary-nav a"));
        if (!links.length || !("IntersectionObserver" in window)) return;

        var byId = {};
        links.forEach(function (a) {
            byId[a.getAttribute("href").slice(1)] = a;
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    links.forEach(function (a) { a.classList.remove("is-active"); });
                    var active = byId[entry.target.id];
                    if (active) active.classList.add("is-active");
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        Object.keys(byId).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) observer.observe(section);
        });
    }

    /* ---------- Scroll reveal ---------- */
    function initReveal() {
        var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
        if (!items.length) return;
        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Back to top + scroll progress ---------- */
    function initScrollUi() {
        var btn = document.getElementById("backToTop");
        var progress = document.getElementById("scrollProgress");

        function onScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - window.innerHeight;
            var pct = height > 0 ? (scrollTop / height) * 100 : 0;
            if (progress) progress.style.width = pct + "%";

            if (btn) {
                if (scrollTop > 400) {
                    btn.hidden = false;
                    btn.classList.add("is-visible");
                } else {
                    btn.classList.remove("is-visible");
                }
            }
        }

        if (btn) {
            btn.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    document.addEventListener("DOMContentLoaded", function () {
        buildTable();
        buildHeatmap();
        initNav();
        initActiveNav();
        initReveal();
        initScrollUi();
    });
})();
