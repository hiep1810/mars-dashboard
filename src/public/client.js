let store = Immutable.Map({
  currentRover: 'curiosity',
  loading: false,
  curiosity: {},
  opportunity: {},
  spirit: {},
});

// add our markup to the page
const root = document.getElementById('root');

function updateStore(state, newState) {
  store = state.merge(newState);
  render(root, store.toJS());
}

//render:
const render = async (root, state) => {
  root.innerHTML = App(state);
};

// HOF 1:
const AppGenerator = (Component) => {
  return function (state) {
    return state.loading === true ? Loading() : Component(state);
  };
};

const App = AppGenerator((state) => {
  const curRover = state[state.currentRover];
  const RandomLastestImgs = !state.loading
    ? LastestImageGenerator(curRover.lastest_images)
    : null;

  return `
    ${Rover(curRover)}
    <div class="divider"><p><strong>Lastest Images</strong></p></div>
    <div class="slideshow">${RandomLastestImgs(3)}</div>
  `;
});

//Rover:
const Rover = (state) => {
  let { name, launch_date, landing_date, status } = state;
  return `
    <div class="card">
        <img src="/assets/images/${name.toLowerCase()}.jpg" alt="item image" />
        <div class="card-content">
            <h2>${name}</h2>
            <ul>
                <li><strong>Launch Date: </strong><span>${launch_date}</span></li>
                <li><strong>Landing Date: </strong><span>${landing_date}</span></li>
                <li><strong>Status:</strong><span>${status}</span></li>
            </ul>
        </div>  
    </div>
        `;
};

// HOF 2:
const LastestImageGenerator = (lastest_images) => {
  const data = lastest_images.map((data) => {
    return LastestImage(data);
  });
  return function randomImages(numberOfImages) {
    randImgs = [];
    const max = numberOfImages > data.length ? data.length : numberOfImages;

    for (let i = 0; i < max; i += 1) {
      randImgs.push(data[Math.floor(Math.random() * data.length)]);
    }
    return randImgs.join(' ');
  };
};

const LastestImage = (state) => {
  let { img_src, earth_date, camera_full_name } = state;
  return `
    <div class="slide">
        <img src="${img_src}" alt="image1" />
        <div class="camera-properties">
            <ul>
            <li><strong>Earth Date: </strong><span>${earth_date}</span></li>
            <li><strong>Camera: </strong><span>${camera_full_name}</span></li>
            </ul>
        </div>
    </div>
    `;
};

//Loading:
const Loading = () => {
  return `
    <div class="load-container">
        <div class="load"></div>
    </div>
    <div class="load-text">Loading</div>
    `;
};

async function getRoverData(rover) {
  const res = await fetch(
    `http://localhost:3000/rovers/${rover.toLowerCase()}`
  );
  return await res.json();
}

async function onRoverClick(event) {
  const roverName = event.target.id.replace('navbar-', '');
  setSelectedRover(roverName);
  updateStore(store, { loading: true });
  const data = await getRoverData(roverName);
  updateStore(store, {
    [roverName]: data,
    currentRover: roverName,
    loading: false,
  });
}

function setSelectedRover(rover) {
  const items = document.getElementById('navbar-items').children;

  for (let i = 0; i < items.length; i += 1) {
    items[i].classList.remove('selected');
  }
  document.getElementById(`navbar-${rover}`).classList.add('selected');
}

document
  .getElementById('navbar-curiosity')
  .addEventListener('click', onRoverClick);
document
  .getElementById('navbar-opportunity')
  .addEventListener('click', onRoverClick);
document
  .getElementById('navbar-spirit')
  .addEventListener('click', onRoverClick);

// add event to toggle button
document
  .querySelector('.toggle')
  .addEventListener('click', function classToggle() {
    document.getElementById('navbar-items').classList.toggle('navbar-hide');
  });

window.addEventListener('resize', function windowResize() {
  if (this.window.innerWidth > 768) {
    document.getElementById('navbar-items').classList.remove('navbar-hide');
  }
});
