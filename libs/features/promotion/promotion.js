import { loadArea, createTag } from '../../utils/utils.js';
/**
 * fetches promotion index.
 * @returns {object} index with data
 */
export async function fetchPromotionIndex() {
  const indexPath = '/drafts/mariia/promopoc/promotions/query-index.json';
  const response = await fetch(indexPath);
  const json = await response.json();
  return json;
}

export async function applyPromotions(activePromotions) {
  const promo = activePromotions[0];
  // fetch promotion data
  const promoPath = `${promo.path}`;
  const response = await fetch(`${promoPath}.plain.html`);
  if (!response.ok) {
    // todo lana log error
    return;
  }
  const html = await response.text();
  const doc = (new DOMParser()).parseFromString(html, 'text/html');

  // find the promotion for current page
  const promoAncher = doc.querySelector(`strong > a[href="${window.location.pathname}"]`);
  if (promoAncher) {
    // in promotion document get closest parent tag p
    const promoParagraph = promoAncher.closest('p');
    // in promo doc get next sibling - which is a block with promo content
    const promoSibling = promoParagraph.nextElementSibling;
    // in the current document find the element with the same class as promoSibling
    const currentSibling = document.querySelector(`.${promoSibling.className}`);
    // replace the content of currentSibling with promoSibling
    // render promoSibling
    const fragment = createTag('div', { class: 'fragment', 'data-path': 'relHref' });
    const subdiv = createTag('div', { });
    subdiv.append(promoSibling);
    fragment.append(subdiv);
    currentSibling.parentElement.replaceChild(fragment, currentSibling);
    await loadArea(fragment);
  }
}

export default async function loadPromotion() {
  const currentPath = window.location.pathname;
  const index = await fetchPromotionIndex();
  // for each promotion in index check if current time is between start and end time of promotion
  // if yes, check if current path is in promopages
  const activePromotions = index.data.filter((promotion) => {
    const currentTime = new Date().getTime();
    const promoStart = Date.parse(promotion.promostart);
    const promoEnd = Date.parse(promotion.promoend);
    const promoIsOn = currentTime >= promoStart && currentTime <= promoEnd;
    const SEPARATOR = ',';
    const KEYWORD = 'hlx.page';
    const promoPages = promotion.promopages.split(SEPARATOR).map((url) => {
      const startIndex = url.indexOf(KEYWORD);
      return url.substring(startIndex + KEYWORD.length);
    });
    const pageInPromo = promoPages.includes(currentPath);
    return promoIsOn && pageInPromo;
  });
  applyPromotions(activePromotions);
}
