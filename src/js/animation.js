import gsap from "gsap";

let tl = gsap.timeline();

console.log(
  tl.from(".parallax", {
    top: `${+document.querySelector(".parallax").offsetHeight / 2}px`,
    duration: 3.5,
  })
);
