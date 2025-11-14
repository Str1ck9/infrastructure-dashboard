// Shared data for all themes. Edit to suit your environment.
// Each category contains services with { name, url, desc }.
window.SERVICES = [
  {
    title: "Primary Systems",
    services: [
      { name: "SonicWall", url: "https://10.0.0.1", desc: "Network Security Appliance" },
      { name: "TrueNAS", url: "https://10.0.0.4", desc: "Primary Storage Server" }
    ]
  },
  {
    title: "Data Storage",
    services: [
      { name: "Plex Media Server", url: "http://10.0.0.4:32400/web", desc: ":32400" },
      { name: "NextCloud", url: "http://10.0.0.4:30027", desc: ":30027" }
    ]
  },
  {
    title: "Media Retrieval",
    services: [
      { name: "Radarr (Movies)", url: "http://10.0.0.4:7878", desc: ":7878" },
      { name: "Sonarr (TV)", url: "http://10.0.0.4:8989", desc: ":8989" },
      { name: "Lidarr (Music)", url: "http://10.0.0.4:30071", desc: ":30071" },
      { name: "Prowlarr (Indexers)", url: "http://10.0.0.4:9696", desc: ":9696" },
      { name: "Bazarr (Subtitles)", url: "http://10.0.0.4:6767", desc: ":6767" },
      { name: "qBittorrent", url: "http://10.0.0.4:13000", desc: ":13000" }
    ]
  },
  {
    title: "Network Control",
    services: [
      { name: "Pantry Switch", url: "http://10.0.0.2", desc: "10.0.0.2" },
      { name: "NWA110AX WAP", url: "http://10.0.0.10", desc: "10.0.0.10" },
      { name: "Cisco Switch", url: "http://10.0.0.47", desc: "10.0.0.47" },
      { name: "NSG50 Firewall", url: "http://10.0.0.144", desc: "10.0.0.144" }
    ]
  },
  {
    title: "Sensor Array",
    services: [
      { name: "Camera Server", url: "http://10.0.0.248:81/ui3.htm", desc: "Blue Iris :81" },
      { name: "DrivewayCAM", url: "http://10.0.0.8", desc: "10.0.0.8" },
      { name: "FrontDrBellCam", url: "http://10.0.0.22", desc: "10.0.0.22" }
    ]
  }
];

// Tiny helper: mark reachability in a best-effort way (no-cors/timeout)
window.pingService = async function (url, ms = 4000) {
  try {
    await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(ms) });
    return true;
  } catch (e) {
    return false;
  }
}
