import './css/styles.css';

import { fetchPixabayApi } from './API/service-pixabay';
import galleryTemplateMarkup from './template/gallery-cards.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

searchFormRef.addEventListener('submit', onSearchForm);

function onSearchForm(e) {
  e.preventDefault();
  const { value } = e.target.searchQuery;
  if (value === '') {
    return;
  }
  clearGalleryInterface();
  NewRequestToServer(value);
}

async function NewRequestToServer(searchQuery) {
  try {
    const imagesDate = await fetchPixabayApi(searchQuery);
    const imagesDateHits = await imagesDate.hits;

    renderTemplate(imagesDateHits);
    return imagesDate;
  } catch (error) {
    console.log(error.message);
  }
}

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
