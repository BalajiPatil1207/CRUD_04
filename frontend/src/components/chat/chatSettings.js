const buildDefaultChatSettings = () => ({
  notificationsEnabled: true,
  soundEnabled: true,
  autoSortEnabled: true,
  hiddenContacts: [],
  mutedContacts: [],
  pinnedContacts: [],
});

const getSettingsKey = (userId) => `chat_settings_${userId}`;

export const getChatSettings = (userId) => {
  if (!userId) return buildDefaultChatSettings();

  try {
    const raw = localStorage.getItem(getSettingsKey(userId));
    if (!raw) return buildDefaultChatSettings();

    const parsed = JSON.parse(raw);
    return {
      ...buildDefaultChatSettings(),
      ...parsed,
      hiddenContacts: Array.isArray(parsed.hiddenContacts) ? parsed.hiddenContacts : [],
      mutedContacts: Array.isArray(parsed.mutedContacts) ? parsed.mutedContacts : [],
      pinnedContacts: Array.isArray(parsed.pinnedContacts) ? parsed.pinnedContacts : [],
    };
  } catch {
    return buildDefaultChatSettings();
  }
};

export const saveChatSettings = (userId, settings) => {
  if (!userId) return;
  localStorage.setItem(getSettingsKey(userId), JSON.stringify(settings));
};

export const updateChatSettings = (userId, patch) => {
  const current = getChatSettings(userId);
  const next = {
    ...current,
    ...patch,
    hiddenContacts: Array.isArray(patch.hiddenContacts)
      ? patch.hiddenContacts
      : current.hiddenContacts,
    mutedContacts: Array.isArray(patch.mutedContacts)
      ? patch.mutedContacts
      : current.mutedContacts,
    pinnedContacts: Array.isArray(patch.pinnedContacts)
      ? patch.pinnedContacts
      : current.pinnedContacts,
  };
  saveChatSettings(userId, next);
  return next;
};

export const toggleHiddenContact = (userId, contactId) => {
  const current = getChatSettings(userId);
  const contactKey = Number(contactId);
  const hiddenContacts = current.hiddenContacts.includes(contactKey)
    ? current.hiddenContacts.filter((id) => id !== contactKey)
    : [...current.hiddenContacts, contactKey];

  const next = { ...current, hiddenContacts };
  saveChatSettings(userId, next);
  return next;
};

export const toggleMutedContact = (userId, contactId) => {
  const current = getChatSettings(userId);
  const contactKey = Number(contactId);
  const mutedContacts = current.mutedContacts.includes(contactKey)
    ? current.mutedContacts.filter((id) => id !== contactKey)
    : [...current.mutedContacts, contactKey];

  const next = { ...current, mutedContacts };
  saveChatSettings(userId, next);
  return next;
};

export const togglePinnedContact = (userId, contactId) => {
  const current = getChatSettings(userId);
  const contactKey = Number(contactId);
  const pinnedContacts = current.pinnedContacts.includes(contactKey)
    ? current.pinnedContacts.filter((id) => id !== contactKey)
    : [...current.pinnedContacts, contactKey];

  const next = { ...current, pinnedContacts };
  saveChatSettings(userId, next);
  return next;
};
