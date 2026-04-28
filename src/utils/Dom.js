export const $ = (id) => document.getElementById(id);

export const cacheElements = (ids) => {
    return ids.reduce((acc, id) => {
        const key = id.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc[key] = $(id);
        return acc;
    }, { settingsTemplate: $('settings-template') });
};
 
