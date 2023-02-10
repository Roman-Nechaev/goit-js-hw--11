import './css/styles.css';

import PixabayApiServis from './API/service-pixabay';
import galleryTemplateMarkup from './template/gallery-cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const sentinelRef = document.querySelector('#sentinel');

searchFormRef.addEventListener('submit', onSearchForm);

const pixabayApiServis = new PixabayApiServis();

function onSearchForm(e) {
  e.preventDefault();
  const { value } = e.target.searchQuery;
  if (value === '') {
    return;
  }
  pixabayApiServis.resetPage();
  requestToServer(value);
}

async function requestToServer(searchQuery) {
  clearGalleryInterface();
  pixabayApiServis.query = searchQuery;

  const response = await pixabayApiServis.fetchPixabayApi();
  const imagesDateHits = response.hits;
  console.log(imagesDateHits);
  renderTemplate(imagesDateHits);
}

// //! ==================================== ВЫНЕСИ В ОТДЕЛЬНЫЙ МОДУЛЬ!!!!
// async function onEntry(entries) {
//   console.log(entries);
//   const response = await pixabayApiServis.fetchPixabayApi();
//   const imagesDateHits = response.hits;
//   entries.forEach(entry => {
//     if (entry.isIntersecting && pixabayApiServis.query !== '') {
//       renderTemplate(imagesDateHits);
//       pixabayApiServis.incrementPage();
//     }
//   });
// }

// const observer = new IntersectionObserver(onEntry, {
//   rootMargin: '150px',
// });

// observer.observe(sentinelRef);
// //! ==================================== ВЫНЕСИ В ОТДЕЛЬНЫЙ МОДУЛЬ!!!!

function renderTemplate(e) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplateMarkup(e));
  lightbox.refresh();
}

function clearGalleryInterface(e) {
  galleryRef.innerHTML = '';
}

var lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
