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
