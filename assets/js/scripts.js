
document.addEventListener('DOMContentLoaded', function(){
	let swiper = new Swiper(".sale__slider", {
		slidesPerView: 3,
		spaceBetween: 40,
		centeredSlides: true,
		initialSlide: 1,

		pagination: {
			el: '.sale__pagination',
			type: 'bullets',
			clickable: true,
		},

		breakpoints: {
			// when window width is >= 320px
			320: {
			  slidesPerView: 1,
			  spaceBetween: 20
			},

			768: {
			  slidesPerView: 2,
			  spaceBetween: 30
			},

			1240: {
			  slidesPerView: 3,
			  spaceBetween: 40
			},

			1540: {
			  slidesPerView: 4,
			  spaceBetween: 40
			},
		}
	});
});


