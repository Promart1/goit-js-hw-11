import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GalleryApi from './js/gallery-API';


const galleryApi = new GalleryApi();
const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('button.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(ev) {
  ev.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
  galleryApi.query = ev.currentTarget.elements.searchQuery.value.trim();
  galleryApi.resetPage();
  if (galleryApi.query === '') {
    Notify.info('Please enter your search correct!');
    return;
  } else {
    galleryApi
      .getImage()
      .then(data => {
        let queriesArray = data.hits;
        if (queriesArray.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (queriesArray.length < 40) {
          renderImages(queriesArray);
          loadMoreBtn.classList.add('is-hidden');
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          // Notify.info(
          //   "We're sorry, but you've reached the end of search results."
          // );
        } else {
          renderImages(queriesArray);
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          loadMoreBtn.classList.remove('is-hidden');
        }
      })
      .catch(error => {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        console.log(error);
      });
  }
}

function onLoadMore() {
  galleryApi.getImage().then(data => {
    let queriesArray = data.hits;
    renderImages(queriesArray);
    if (queriesArray.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      
    }
  });
}

function renderImages(queriesArray) {
  const markup = queriesArray
    .map(item => {
      return `<div class="photo-card">
  <div class="thumb"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b><span>${item.likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b><span>${item.views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b><span>${item.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads:</b><span>${item.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}