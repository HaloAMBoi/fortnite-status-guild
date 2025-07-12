// status.js
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(tz);

const TIMEZONE = 'Europe/Istanbul'; // GMT+3

function formatTime(iso) {
  return dayjs(iso).tz(TIMEZONE).format('DD MMM YYYY HH:mm');
}

async function fetchFormattedStatus() {
  try {
    const { data } = await axios.get('https://status.epicgames.com/api/v2/summary.json');
    const fortniteComponent = data.components.find(c => c.name.toLowerCase().includes('fortnite'));

    if (!fortniteComponent || fortniteComponent.status === 'operational') {
      // No active issues
      return null;
    }

    const activeIncidents = data.incidents.filter(incident =>
      incident.impact !== 'none' && incident.status !== 'resolved'
    );

    if (activeIncidents.length === 0) return null;

    const lines = activeIncidents.map(incident => {
      const firstUpdate = incident.incident_updates?.[0];
      return `🆘 **${incident.name}**
Status: ${incident.status}
Started: ${formatTime(incident.created_at)}
Details: ${firstUpdate?.body || 'No additional info'}`;
    });

    return lines.join('\n\n');
  } catch (error) {
    console.error('[Status] Fetch error:', error.message);
    return '⚠️ Unable to fetch Fortnite status at the moment.';
  }
}

async function fetchUpcomingMaintenance() {
  try {
    const { data } = await axios.get('https://status.epicgames.com/api/v2/scheduled-maintenances/upcoming.json');
    const upcoming = data.scheduled_maintenances.find(m =>
      m.name.toLowerCase().includes('fortnite')
    );

    if (!upcoming) {
      return '✅ No upcoming maintenance scheduled.';
    }

    const scheduledFor = formatTime(upcoming.scheduled_for);
    const details = upcoming.incident_updates?.[0]?.body || 'No details available.';

    return `🔧 **Upcoming Maintenance**
Scheduled for: ${scheduledFor}
Details: ${details}`;
  } catch (error) {
    console.error('[Maintenance] Fetch error:', error.message);
    return '⚠️ Could not fetch upcoming maintenance data.';
  }
}

module.exports = {
  fetchFormattedStatus,
  fetchUpcomingMaintenance
};
