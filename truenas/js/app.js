(function () {
  const $ = (selector) => document.querySelector(selector);

  function formatTime(date) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
  }

  function relativeTime(minutesAgo) {
    if (minutesAgo < 1) return 'just now';
    if (minutesAgo < 60) return `${minutesAgo} min ago`;
    const hours = Math.floor(minutesAgo / 60);
    const mins = minutesAgo % 60;
    if (!mins) return `${hours} hr ago`;
    return `${hours} hr ${mins} min ago`;
  }

  function randomInRange(min, max, precision = 0) {
    const factor = Math.pow(10, precision);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
  }

  function updateClock() {
    const clock = $('#clusterClock');
    if (!clock) return;
    const now = new Date();
    clock.textContent = `${formatTime(now)} UTC`;
  }

  function updateMetrics() {
    const cpu = randomInRange(24, 58);
    const memory = randomInRange(48, 72);
    const pool = randomInRange(32, 55);
    const network = randomInRange(7.4, 14.2, 1);

    $('#cpuValue').textContent = `${cpu}%`;
    $('#cpuBar').style.width = `${cpu}%`;

    $('#memoryValue').textContent = `${memory}%`;
    $('#memoryBar').style.width = `${memory}%`;

    $('#poolValue').textContent = `${pool}%`;
    $('#poolBar').style.width = `${pool}%`;

    $('#networkValue').textContent = `${network.toFixed(1)} Gb/s`;
    const networkPercent = Math.min((network / 20) * 100, 100);
    $('#networkBar').style.width = `${networkPercent}%`;

    const updateLabel = $('#updateLabel');
    if (updateLabel) {
      const now = new Date();
      updateLabel.textContent = `Updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  }

  function populateSnapshots() {
    const snapshotList = $('#snapshotList');
    if (!snapshotList) return;

    const snapshots = [
      { name: 'tank/home@autosnap_15m', minutes: 6 },
      { name: 'tank/vmstore@autosnap_hourly', minutes: 21 },
      { name: 'backup/media@sync', minutes: 47 },
    ];

    snapshotList.innerHTML = '';
    snapshots.forEach((snapshot) => {
      const li = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = snapshot.name;
      const time = document.createElement('span');
      time.className = 'snapshot-time';
      time.textContent = relativeTime(snapshot.minutes);
      li.appendChild(title);
      li.appendChild(time);
      snapshotList.appendChild(li);
    });
  }

  function populatePools() {
    const tankPercent = randomInRange(54, 63, 1);
    const backupPercent = randomInRange(41, 49, 1);
    $('#tankUsage').textContent = `${tankPercent}%`;
    $('#backupUsage').textContent = `${backupPercent}%`;
  }

  function populateServices() {
    const container = $('#serviceGroups');
    if (!container || !window.SERVICES) return;

    container.innerHTML = '';
    window.SERVICES.forEach((category) => {
      const section = document.createElement('section');
      section.className = 'service-category';

      const header = document.createElement('header');
      const title = document.createElement('span');
      title.textContent = category.title;
      const count = document.createElement('span');
      count.textContent = `${category.services.length} services`;
      header.appendChild(title);
      header.appendChild(count);

      const list = document.createElement('div');
      list.className = 'service-list';

      category.services.forEach((service) => {
        const card = document.createElement('article');
        card.className = 'service-card';

        const name = document.createElement('h3');
        name.textContent = service.name;
        card.appendChild(name);

        const desc = document.createElement('p');
        desc.textContent = service.desc;
        card.appendChild(desc);

        const footer = document.createElement('footer');
        const url = document.createElement('span');
        url.textContent = service.url;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Open';
        button.addEventListener('click', () => window.open(service.url, '_blank'));
        footer.appendChild(url);
        footer.appendChild(button);

        card.appendChild(footer);
        list.appendChild(card);
      });

      section.appendChild(header);
      section.appendChild(list);
      container.appendChild(section);
    });
  }

  function populateEvents() {
    const events = [
      { label: 'Scrub completed for tank', minutes: 42 },
      { label: 'SMB share "Media" reconnected', minutes: 18 },
      { label: 'Cloud sync job "Backblaze" finished', minutes: 12 },
      { label: 'Replication from tank ➜ backup succeeded', minutes: 6 },
    ];

    const feed = $('#eventFeed');
    if (!feed) return;
    feed.innerHTML = '';

    events.forEach((event) => {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = event.label;
      const meta = document.createElement('span');
      meta.className = 'event-meta';
      meta.textContent = relativeTime(event.minutes);
      li.appendChild(text);
      li.appendChild(meta);
      feed.appendChild(li);
    });
  }

  function refreshStatus() {
    const syncMinutes = randomInRange(2, 9);
    const backupHours = randomInRange(11, 22);
    const syncStatus = $('#syncStatus');
    const backupStatus = $('#backupStatus');
    if (syncStatus) syncStatus.textContent = `${syncMinutes} min ago`;
    if (backupStatus) backupStatus.textContent = `${backupHours} hr ago`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    updateMetrics();
    populateSnapshots();
    populatePools();
    populateServices();
    populateEvents();
    refreshStatus();

    setInterval(updateClock, 1000 * 60);
    setInterval(updateMetrics, 1000 * 8);
    setInterval(populatePools, 1000 * 30);
    setInterval(refreshStatus, 1000 * 45);
  });
})();
