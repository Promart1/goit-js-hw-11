import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GalleryApi from './js/gallery-API';
import { insertContent } from './js/content';

const galleryApi = new GalleryApi();
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const endOfGallery = document.querySelector('.end');


const onSearch = async ev => {
  ev.preventDefault();
  galleryApi.name = input.value.trim();
  galleryApi.resetPage();

  if (galleryApi.name === '') {
    return Notify.failure('Please input valid name');
  }

  try {
    const response = await galleryApi.getImages();
    gallery.innerHTML = '';

    galleryApi.totalPages = Math.ceil(
      response.data?.totalHits / response.config.params.per_page
    );

    if (response.data.hits.length === 0) {
     
      observer.unobserve(endOfGallery);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (
      galleryApi.page > galleryApi.totalPages ||
      response.data.totalHits < galleryApi.perPage
    ) {
    
      observer.unobserve(endOfGallery);
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images`);
      
      observer.observe(endOfGallery);
    }

    insertContent(response.data.hits);
  } catch (error) {
    console.log(error);
  }
};

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && galleryApi.name !== '') {
      galleryApi
        .getImages()
        .then(response => {
          if (
            galleryApi.page > galleryApi.totalPages ||
            response.data.totalHits < galleryApi.perPage
          ) {
            observer.unobserve(endOfGallery);
            Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
          insertContent(response.data.hits);
        })
        .catch(error => console.log(error));
    }
  });
};

const observerOptions = {
  rootMargin: '300px',
};

const observer = new IntersectionObserver(onEntry, observerOptions);

form.addEventListener('submit', onSearch);