const channelIdOrIds = await getChannelId(guild.id);

if (Array.isArray(channelIdOrIds)) {
  for (const id of channelIdOrIds) {
    const ch = client.channels.cache.get(id);
    if (ch) await ch.send({ embeds: [embed] });
  }
} else {
  const ch = client.channels.cache.get(channelIdOrIds);
  if (ch) await ch.send({ embeds: [embed] });
}
