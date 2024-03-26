const parallaxEl = document.querySelectorAll(".parallax");
const hero = document.querySelector(".hero");

let x = 0,
  y = 0,
  z = 0;

window.addEventListener("mousemove", (e) => {
  x = e.clientX - window.innerWidth / 2;
  y = e.clientY - window.innerHeight / 2;

  parallaxEl.forEach((item) => {
    let speedX = item.dataset.speedx;
    let speedY = item.dataset.speedy;

    let isInLeft =
      parseFloat(getComputedStyle(item).left) < window.innerWidth / 2 ? 1 : -1;

    z = (e.clientX - parseFloat(getComputedStyle(item).left)) * isInLeft * 0.1;

    item.style.transform = `translateX(calc(-50% + ${
      -x * speedX
    }px)) translateY(calc(-50% + ${
      y * speedY
    }px)) perspective(2300px) translateZ(${z}px)`;
  });
});

if (window.innerWidth >= 725) {
  hero.style.maxHeight = `${window.innerWidth * 0.6}px`;
} else {
  hero.style.maxHeight = `${window.innerWidth * 1.6}px`;
}
