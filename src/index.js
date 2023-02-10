import './css/styles.css';

import PixabayApiServis from './API/service-pixabay';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import galleryTemplateMarkup from './template/gallery-cards.hbs';
import LoadMoreBtn from './components/load-more-btn';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const sentinelRef = document.querySelector('#sentinel');
const pageLoadStatusRef = document.querySelector('.page-load-status');

searchFormRef.addEventListener('submit', onSearchForm);

const pixabayApiServis = new PixabayApiServis();

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);
pageLoadStatusRef.classList.add('is-hidden');

function onSearchForm(e) {
  e.preventDefault();
  const { value } = e.target.searchQuery;

  if (value === '') {
    Notify.info('Поле поиска не должно быть пустым!!!');
    return;
  }

  loadMoreBtn.hide();
  pageLoadStatusRef.classList.add('is-hidden');

  clearGalleryInterface();
  pixabayApiServis.resetPage();
  pixabayApiServis.query = value;
  requestToServer();
  loadMoreBtn.enable();
}

async function requestToServer() {
  const response = await pixabayApiServis.fetchPixabayApi();
  const imagesDateHits = await response.hits;
  const imageQuantity = await response.totalHits;

  if (!imageQuantity) {
    loadMoreBtn.hide();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (imagesDateHits.length <= 0) {
    console.log('На этом все');
    loadMoreBtn.hide();
    return;
  }
  renderTemplate(imagesDateHits);
  loadMoreBtn.show();

  return;
}

function onLoadMoreBtn() {
  pixabayApiServis.incrementPage();
  requestToServer();
  loadMoreBtn.disable();
}
// //! ==================================== ВЫНЕСИ В ОТДЕЛЬНЫЙ МОДУЛЬ!!!!? скролл пагинация
function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApiServis.query !== '') {
      pageLoadStatusRef.classList.remove('is-hidden');

      pixabayApiServis.incrementPage();
      requestToServer();
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

// observer.observe(sentinelRef);
// //! ==================================== ВЫНЕСИ В ОТДЕЛЬНЫЙ МОДУЛЬ!!!!

function renderTemplate(e) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplateMarkup(e));
  lightbox.refresh();
  loadMoreBtn.enable();
}

function clearGalleryInterface(e) {
  galleryRef.innerHTML = '';
}

var lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

//^ =============================== переключатель пагинации ПОДУМАЙ!!!
const paginationChoicesRef = document.querySelector('.pagination-choices');
// paginationChoicesRef.addEventListener('input', onPaginationChoices);
let checkTest;
function onPaginationChoices(e) {
  const { value } = e.target;
  console.log(value);
  if (value === 'scroll-check') {
    return (checkTest = value);
  } else {
    return (checkTest = value);
  }
}

//^ =============================== переключатель пагинации ПОДУМАЙ!!!
