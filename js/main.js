var cashPopup = document.querySelector('.modal-cash');
var buyList = document.querySelectorAll('a.buy');
var cashCheckout = cashPopup.querySelector('.checkout');
var cashClose = cashPopup.querySelector('.modal-close');

var onModalClose = function (evt) {
  evt.preventDefault();
  document.querySelector('.modal-show').classList.remove('modal-show');
  window.removeEventListener('keydown', onEscapePress)
};

var onEscapePress = function (evt) {
  if (evt.keyCode === 27) {
    onModalClose(evt);
  }
};

cashClose.addEventListener('click', onModalClose);
cashCheckout.addEventListener('click', onModalClose);

for (var i = 0; i < buyList.length; i++) {
  buyList[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    cashPopup.classList.add('modal-show');
    window.addEventListener('keydown', onEscapePress);
  });
}

var enrtyRoom = document.querySelector('.authorization');
var buttonEntry = enrtyRoom.querySelector('.button-entry');
var closeRoom = enrtyRoom.querySelector('.exit');

var onEntryPress = function (evt) {
  evt.preventDefault();
  enrtyRoom.classList.toggle('room');
}

buttonEntry.addEventListener('click', onEntryPress);
closeRoom.addEventListener('click', onEntryPress);

if (document.querySelector('#modal-feedback')) {
  var link = document.querySelector('.button-modal');

  var modalFeedback = document.querySelector('#modal-feedback');
  var close = modalFeedback.querySelector('.modal-close');

  var feedbackForm = modalFeedback.querySelector('.feedback-form');
  var fullname = modalFeedback.querySelector('[name=fullname]');
  var email = modalFeedback.querySelector('[name=email]');

  var isStorageSupport = true;
  var storage = '';

  try {
    storage = localStorage.getItem('fullname');
  } catch (err) {
    isStorageSupport = false;
  }

  link.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalFeedback.classList.add('modal-show');
    window.addEventListener('keydown', onEscapePress);

    if (storage) {
      fullname.value = storage;
      email.focus();
    } else {
      fullname.focus();
    }
  });

  close.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalFeedback.classList.remove('modal-show');
    modalFeedback.classList.remove('modal-error');
  });

  feedbackForm.addEventListener('submit', function (evt) {
    if (!fullname.value || !email.value) {
      evt.preventDefault();
      modalFeedback.classList.remove('modal-error');
      modalFeedback.offsetWidth = modalFeedback.offsetWidth;
      modalFeedback.classList.add('modal-error');
    } else {
      if (isStorageSupport) {
        localStorage.setItem('fullname', fullname.value);
      }
    }
  });
}

if (document.querySelector('.modal-map-button')) {
  var mapLink = document.querySelector('.modal-map-button');

  var mapPopup = document.querySelector('.modal-map');
  var mapClose = mapPopup.querySelector('.modal-close');

  mapLink.addEventListener('click', function (evt) {
    evt.preventDefault();
    mapPopup.classList.add('modal-show');
    window.addEventListener('keydown', onEscapePress);
  });

  mapClose.addEventListener('click', onModalClose);

  function initMap() {
    var myLatLng = {
      lat: 59.938794,
      lng: 30.323083
    };
    var map = new google.maps.Map(document.querySelector('#map-container'), {
      center: myLatLng,
      disableDefaultUI: true,
      zoom: 16
    });
    var marker = new google.maps.Marker({
      map: map,
      position: myLatLng,
    });
  }
}

if (document.querySelector('#filter-form')) {
  var range = {
    min: 0,
    max: 37000,
    step: 100
  };
  var filterForm = document.querySelector('#filter-form');
  var rangeOutput = document.querySelectorAll('.range-output');
  var rangeBar = document.querySelector('.range-bar');
  var leverMin = document.querySelector('.range-lever-min');
  var leverMax = document.querySelector('.range-lever-max');
  var scaleLength = document.querySelector('.range-scale').offsetWidth;
  filterForm.price[0].step = range.step;
  filterForm.price[0].step = range.step;
  filterForm.price[1].max = range.max;

  var onValuesGetting = function () {
    var valueMin = filterForm.price[0].value;
    var valueMax = filterForm.price[1].value;
    var leverMinPos = 100 * valueMin / range.max + '%';
    var leverMaxPos = 100 * valueMax / range.max + '%';
    rangeOutput[0].innerHTML = valueMin;
    rangeOutput[1].innerHTML = valueMax;
    filterForm.price[0].max = valueMax;
    filterForm.price[1].min = valueMin;
    rangeBar.style.left = leverMinPos;
    rangeBar.style.right = 'calc(100% - ' + leverMaxPos + ')';
    leverMin.style.left = 'calc(' + leverMinPos + ' - ' + leverMin.offsetWidth / 2 + 'px)';
    leverMax.style.left = 'calc(' + leverMaxPos + ' - ' + leverMax.offsetWidth / 2 + 'px)';
  };

  var onLeverGrabbing = function (event) {
    event.preventDefault();
    var isEventTouch = event.type === 'touchstart';
    var eventMove = isEventTouch ? 'touchmove' : 'mousemove';
    var eventEnd = isEventTouch ? 'touchend' : 'mouseup';
    var control = event.target === leverMin ? filterForm.price[0] : filterForm.price[1];
    var moveStart = isEventTouch ? event.changedTouches[0].pageX : event.pageX;
    var moveEnd = moveStart;
    var initialValue = parseInt(control.value, 10);

    var getNewValue = function () {
      return Math.round((moveEnd - moveStart) * range.max / (range.step * scaleLength)) * range.step + initialValue;
    };

    var onLeverMoving = function (event) {
      moveEnd = isEventTouch ? event.changedTouches[0].pageX : event.pageX;
      control.value = getNewValue();
      onValuesGetting();
    };

    var onLeverReleasing = function (event) {
      event.preventDefault();
      document.removeEventListener(eventMove, onLeverMoving);
      document.removeEventListener(eventEnd, onLeverReleasing);
    };

    document.addEventListener(eventMove, onLeverMoving);
    document.addEventListener(eventEnd, onLeverReleasing);
  };

  filterForm.addEventListener('change', onValuesGetting);
  leverMin.addEventListener('mousedown', onLeverGrabbing);
  leverMax.addEventListener('mousedown', onLeverGrabbing);
  leverMin.addEventListener('touchstart', onLeverGrabbing);
  leverMax.addEventListener('touchstart', onLeverGrabbing);

  onValuesGetting();
}
