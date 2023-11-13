import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';
import '../../deps/merch-offers.js';
import '../../deps/merch-offer.js';

function createDynamicSlots(el, bodySlot) {
  const price = createTag('h5', { style: 'margin-top: 8px; margin-bottom: 16px;' });
  price.append(createTag('span', { slot: 'price', is: 'inline-price' }));
  bodySlot.append(price);

  const p = createTag('p', { class: 'action-area' });
  p.append(createTag('a', { slot: 'cta', is: 'checkout-link' }));
  // decorateButtons(p);
  const footer = el.querySelector('div[slot="footer"]');
  footer.append(p);
  // footer.append(createTag('a', { slot: 'cta', is: 'checkout-link' }));
  // el.append(footer);

  // el.querySelector('div[slot="footer"] a[is="checkout-link"]')?.setAttribute('slot', 'cta');
  bodySlot.querySelector('p')?.setAttribute('slot', 'description');
}
function createMerchOffer(option) {
  const merchOffer = createTag('merch-offer', { text: option.childNodes[0].textContent.trim() });
  // const overrides = option.querySelector('ul');

  [...option.querySelector('ul').children].forEach((li, index) => {
    const override = li.childNodes[0];
    if (override.nodeName === '#text') {
      if (index === 0) {
        merchOffer.setAttribute('badge-text', override.textContent.trim());
      } else {
        const desc = createTag('p', { slot: 'description' });
        desc.textContent = override.textContent.trim();
        merchOffer.append(desc);
      }
    } else {
      merchOffer.append(override);
    }
  });
  decorateButtons(merchOffer);
  return merchOffer;
}

export const initOfferSelection = (el, merchCard, offerSelection) => {
  const bodySlot = merchCard.querySelector('div[slot="body-xs"]');
  createDynamicSlots(merchCard, bodySlot);
  const merchOffers = createTag('merch-offers', { container: 'merch-card' });
  [...offerSelection.children].forEach((option) => {
    merchOffers.append(createMerchOffer(option));
  });
  merchOffers.querySelectorAll('a[is="checkout-link"]').forEach((link) => { link.setAttribute('slot', 'cta'); });
  merchOffers.querySelectorAll('span[is="inline-price"]').forEach((price) => { price.setAttribute('slot', 'price'); });
  bodySlot.append(merchOffers);
};

export default initOfferSelection;
