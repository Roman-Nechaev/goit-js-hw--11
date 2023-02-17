import Pagination from 'tui-pagination';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PixabayApiServis from './API/service-pixabay';
import galleryTemplateMarkup from './template/gallery-cards.hbs';
import LoadMoreBtn from './components/load-more-btn';

import './css/styles.css';
import 'tui-pagination/dist/tui-pagination.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const sentinelRef = document.querySelector('#sentinel');
const pageLoadStatusRef = document.querySelector('.page-load-status');
const endOfContent = document.querySelector('.end-content');
const paginationChoicesRef = document.querySelector('.pagination-choices');
const paginContainerRef = document.getElementById('pagination');

const pixabayApiServis = new PixabayApiServis();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

paginationChoicesRef.addEventListener('input', onPaginationChoices);
searchFormRef.addEventListener('submit', onSearchForm);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);
pageLoadStatusRef.classList.add('is-hidden');
endOfContent.classList.add('is-hidden');

let isFlagForQuantity = false;
let isFlagCheckScroll;

function onSearchForm(e) {
  e.preventDefault();
  let { value } = e.target.searchQuery;
  value = value.trim();

  if (!value) {
    Notify.info('The search field should not be empty!');
    return;
  }
  paginationChoicesRef.classList.add('is-hidden');

  loadMoreBtn.hide();
  pageLoadStatusRef.classList.add('is-hidden');
  endOfContent.classList.add('is-hidden');
  paginContainerRef.classList.add('is-hidden');

  pixabayApiServis.resetPage();
  clearGalleryInterface();

  pixabayApiServis.query = value;

  requestToServer();
  loadMoreBtn.enable();
  isFlagForQuantity = true;
}

async function requestToServer() {
  try {
    const response = await pixabayApiServis.fetchPixabayApi();
    const imagesDateHits = await response.hits;
    const imageQuantity = await response.totalHits;
    if (!imageQuantity) {
      pageLoadStatusRef.classList.add('is-hidden');
      loadMoreBtn.hide();

      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (imagesDateHits.length <= 0) {
      loadMoreBtn.hide();
      pageLoadStatusRef.classList.add('is-hidden');
      endOfContent.classList.remove('is-hidden');
      return;
    }

    if (isFlagForQuantity) {
      Notify.info(` Hooray! We found ${imageQuantity} images.`);
      onUsePagination(imageQuantity);
    }

    renderTemplate(imagesDateHits);

    isFlagForQuantity = false;

    paginContainerRef.classList.add('is-hidden');

    if (isFlagCheckScroll === 'scroll-check') {
      observer.observe(sentinelRef);
    } else if (isFlagCheckScroll === 'pagin-check') {
      paginContainerRef.classList.remove('is-hidden');
    } else {
      loadMoreBtn.show();
    }
  } catch (error) {
    Notify.failure(`Sorry, something went wrong. Try again later`);
    console.log(error.message);
  }
}

function onLoadMoreBtn() {
  pixabayApiServis.incrementPage();
  requestToServer();
  loadMoreBtn.disable();
}

function renderTemplate(e) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplateMarkup(e));
  lightbox.refresh();
  loadMoreBtn.enable();
}

function clearGalleryInterface() {
  galleryRef.innerHTML = '';
}

var lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

function onPaginationChoices(e) {
  const { value } = e.target;

  return (isFlagCheckScroll = value);
}

function onEntry([entries]) {
  if (entries.isIntersecting) {
    pageLoadStatusRef.classList.remove('is-hidden');
    pixabayApiServis.incrementPage();
    requestToServer();
  }
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
  threshold: 1,
});

// ================================================

function onUsePagination(quantityImg) {
  const instance = new Pagination(paginContainerRef, {
    totalItems: quantityImg,
    itemsPerPage: 40,
    visiblePages: 10,
  });

  instance.on('afterMove', event => {
    const currentPage = event.page;

    paginContainerRef.classList.add('is-hidden');
    pixabayApiServis.UsePage(currentPage);
    clearGalleryInterface();
    requestToServer();
  });
}
