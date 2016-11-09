'use strict';

const query = decodeURIComponent(window.location.search.substring(1));
const indexNext = query.indexOf('next');
const indexAmp = query.indexOf('&', indexNext);
const next = indexAmp === -1 ? query.slice(indexNext + 5) : query.slice(indexNext + 5, indexAmp);
document.querySelector('[name="next"]').value = next;
