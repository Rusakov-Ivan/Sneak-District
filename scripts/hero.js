const track = document.querySelector(".hero-track");
const slides = gsap.utils.toArray(".hero-slide");

gsap.to(track, {
    xPercent: (-100 * (slides.length - 1)) / slides.length,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: () => "+=" + window.innerWidth * (slides.length - 1),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
    }
});
