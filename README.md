<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lesson 1: How firewalls work — SecSkills</title>
  <link rel="stylesheet" href="../../css/style.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
</head>
<body>

<nav>
  <a class="nav-logo" href="../../index.html">SECSKILLS</a>
  <div class="nav-links">
    <a href="../../index.html">Home</a>
    <a href="../tracks.html">Tracks</a>
    <a href="firewall-01.html" class="active">Lessons</a>
    <a href="../tracks.html" class="nav-cta">All tracks</a>
  </div>
</nav>

<div class="container">
  <div class="lesson-layout">

    <aside class="lesson-sidebar">
      <div class="sidebar-track">FIREWALL CONFIGURATION</div>
      <ul class="sidebar-lessons">
        <li><a href="firewall-01.html" class="active"><span class="lesson-num">01</span> How firewalls work</a></li>
        <li><a href="#"><span class="lesson-num">02</span> Stateful vs stateless filtering</a></li>
        <li><a href="#"><span class="lesson-num">03</span> iptables fundamentals</a></li>
        <li><a href="#"><span class="lesson-num">04</span> Writing your first rule set</a></li>
        <li><a href="#"><span class="lesson-num">05</span> Rule order and short-circuiting</a></li>
        <li><a href="#"><span class="lesson-num">06</span> Introduction to nftables</a></li>
        <li><a href="#"><span class="lesson-num">07</span> NAT and port forwarding</a></li>
        <li><a href="#"><span class="lesson-num">08</span> Logging and auditing rules</a></li>
        <li><a href="#"><span class="lesson-num">09</span> Rate limiting with iptables</a></li>
        <li><a href="#"><span class="lesson-num">10</span> IPv6 firewall rules</a></li>
        <li><a href="#"><span class="lesson-num">11</span> pfSense introduction</a></li>
        <li><a href="#"><span class="lesson-num">12</span> Auditing an existing policy</a></li>
        <li><a href="#"><span class="lesson-num">13</span> Track review &amp; certificate</a></li>
      </ul>
    </aside>

    <main class="lesson-content">
      <div class="lesson-header">
        <div class="lesson-track-tag" style="color:var(--purple);">FIREWALL CONFIGURATION · LESSON 01 OF 13</div>
        <h1>How firewalls work</h1>
        <div class="lesson-meta">
          <span><i class="ti ti-clock" style="vertical-align:-2px;"></i> 16 min read</span>
          <span><i class="ti ti-signal" style="vertical-align:-2px;"></i> Intermediate</span>
          <span><i class="ti ti-code" style="vertical-align:-2px;"></i> No setup required</span>
        </div>
      </div>

      <div class="lesson-body">

        <h2>The job of a firewall</h2>
        <p>A firewall sits between two networks — usually your internal network and the internet — and decides which traffic is allowed through. Every packet that arrives gets checked against a list of rules. The firewall either permits it, drops it silently, or rejects it with an error.</p>
        <p>That sounds simple, but the details matter enormously. The wrong rule order, a missing default-deny at the end, or a rule that's too broad can leave you exposed in ways that aren't obvious until an incident.</p>

        <h2>Packet filtering: the basics</h2>
        <p>The most fundamental firewall operation is packet filtering. Each rule matches on some combination of:</p>
        <ul>
          <li>Source IP address or range</li>
          <li>Destination IP address or range</li>
          <li>Protocol (TCP, UDP, ICMP, etc.)</li>
          <li>Source port</li>
          <li>Destination port</li>
          <li>Network interface (incoming or outgoing)</li>
        </ul>
        <p>Rules are evaluated top to bottom. The first matching rule wins — everything below it is ignored for that packet. This makes rule order critical.</p>

        <h2>Stateful vs stateless</h2>
        <p>Early firewalls were <strong>stateless</strong>: they evaluated each packet independently with no memory of previous packets. This meant you had to explicitly allow return traffic — if you let traffic out on port 80, you also had to write a rule allowing inbound replies on high ports.</p>
        <p>Modern firewalls are <strong>stateful</strong>: they track connection state and automatically allow return traffic for established connections. When a packet comes in, the firewall checks whether it belongs to an existing tracked connection. If it does, it's allowed without hitting the rule list again.</p>
        <p>Stateful firewalls use a connection tracking table (often called <code>conntrack</code> on Linux) that records:</p>
        <ul>
          <li>Source IP + port</li>
          <li>Destination IP + port</li>
          <li>Protocol</li>
          <li>Connection state (NEW, ESTABLISHED, RELATED, INVALID)</li>
        </ul>

        <div class="callout">
          <div class="callout-label">KEY CONCEPT</div>
          <p>With a stateful firewall, you only need to write rules for <em>initiating</em> connections. Return traffic is handled automatically by connection tracking. This makes rule sets much simpler and reduces the chance of errors.</p>
        </div>

        <h2>The default policy</h2>
        <p>Every firewall needs a default policy: what happens to traffic that doesn't match any rule. There are two philosophies:</p>
        <ul>
          <li><strong>Default allow</strong> — permit everything not explicitly blocked. Easier to set up but dangerous: you have to anticipate every attack.</li>
          <li><strong>Default deny</strong> — block everything not explicitly permitted. Harder to configure but far more secure: you only allow what you specifically need.</li>
        </ul>
        <p>Any production firewall should use default deny. Default allow is how you end up with a server accidentally accepting connections on port 5432 (PostgreSQL) from the whole internet.</p>

        <div class="callout warn">
          <div class="callout-label">COMMON MISTAKE</div>
          <p>Setting default deny without first allowing your own SSH access will lock you out of a remote server immediately. Always add a rule to permit your management access <em>before</em> setting the default policy.</p>
        </div>

        <h2>Where firewalls live</h2>
        <p>Firewalls exist at multiple layers of your infrastructure:</p>
        <ul>
          <li><strong>Network perimeter</strong> — a dedicated device or VM between your network and the internet (pfSense, Cisco ASA, Palo Alto).</li>
          <li><strong>Host-based</strong> — running on every individual server (<code>iptables</code>, <code>nftables</code>, Windows Firewall). Defense-in-depth: even if traffic gets through the perimeter, a host firewall provides a second barrier.</li>
          <li><strong>Cloud security groups</strong> — virtual firewalls provided by cloud platforms (AWS Security Groups, GCP Firewall Rules). Stateful, and often the primary perimeter for cloud workloads.</li>
        </ul>

        <!-- Quiz -->
        <div class="quiz-block" id="quiz-fw1">
          <div class="quiz-q">A stateful firewall tracking a connection records which of the following?</div>
          <div class="quiz-options">
            <button class="quiz-option">Only the destination IP and port</button>
            <button class="quiz-option">The full packet payload</button>
            <button class="quiz-option">Source IP/port, destination IP/port, protocol, and connection state</button>
            <button class="quiz-option">Only the protocol type</button>
          </div>
          <div class="quiz-feedback"></div>
        </div>

        <div class="lesson-nav">
          <a href="../tracks.html" class="btn btn-ghost">← Back to tracks</a>
          <a href="#" class="btn btn-primary">Next: Stateful vs stateless →</a>
        </div>

      </div>
    </main>
  </div>
</div>

<footer>
  <div class="container">
    <div class="footer-inner">
      <span class="footer-logo">SECSKILLS — open source security education</span>
      <div class="footer-links">
        <a href="../tracks.html">Tracks</a>
        <a href="https://github.com/" target="_blank">GitHub</a>
      </div>
    </div>
  </div>
</footer>

<script src="../../js/main.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => initQuiz('quiz-fw1', 2));
</script>
</body>
</html>
