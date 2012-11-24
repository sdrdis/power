function strtr (str, replacements) {
    for (var key in replacements) {
        str = str.replace(new RegExp('{' + key + '}', 'g'), replacements[key]);
    }
    return str;
}