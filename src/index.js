import axios from 'axios';
import './css/style.css';
import Notiflix from 'notiflix';
import { fetchImage } from './fetchForm';
import { createMarkup } from './createMarcup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  myInput: document.querySelector('.search-input'),
  wrapperGalery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const { form, myInput, wrapperGalery, loadMore } = refs;

let myPage = 1;

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', addImage);

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 300 });

//  click search //

async function onSubmit(event) {
  event.preventDefault();
  wrapperGalery.innerHTML = '';
  myPage = 1;

  const myInputValue = myInput.value;
  const myValue = myInputValue.trim();

  if (!myValue) {
    Notiflix.Notify.failure('Sorry, blank line. Enter your request!');
    loadMore.hidden = true;
    return;
  }

  return await fetchThen(myValue);
}


loadMore.hidden = true; // -

// request//

async function fetchThen(value) {
  try {
    const resp = await fetchImage(value);
    const myArr = resp.data.hits;
    const myNumber = resp.data.total;

    if (myArr.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      loadMore.hidden = true; // -
      return;
    }

    if (myNumber > 0) {
      Notiflix.Notify.info(`Hooray! We found ${myNumber} images.`);
    }

    createMarkup(myArr, wrapperGalery);
    lightbox.refresh();
    loadMore.hidden = false; // +

    if (myArr.length < 40) {
      loadMore.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

//  addImg //

async function addImage() {
  const value2 = myInput.value;
  let limitAdd;
  myPage += 1;
  try {
    const resp = await fetchImage(value2, myPage, limitAdd);
    createMarkup(resp.data.hits, wrapperGalery);
    onPageScrolling();
    lightbox.refresh();

    if (resp.data.hits.length < limitAdd) {
      loadMore.hidden = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//scroll//


function onPageScrolling() {
  const { height: cardHeight } =
    wrapperGalery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
