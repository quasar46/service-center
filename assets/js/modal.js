class Modal {
	constructor(options) {
		let defaultOptions = {
			isOpen: () => { },
			isClose: () => { },
			container: '1',
		}
		this.options = Object.assign(defaultOptions, options);
		this.modal = document.querySelector('.modal');
		this.modal2 = document.querySelector('.modal2');
		this.container = 1;
		this.target = null;
		this.openedContainer = 0;
		this.speed = false;
		this.animation = false;
		this.isOpen = false;
		this.modalContainer = false;
		this.modalContainerNew = false;
		this.previousActiveElement = false;
		this.fixBlocks = document.querySelectorAll('.fix-block');
		this.fixBlocksMargin = document.querySelectorAll('.fix-block-margin');

		this.focusElements = [
			'a[href]',
			'input',
			'button',
			'select',
			'textarea',
			'[tabindex]'
		];
		this.events();
	}

	events() {
		if (this.modal) {
			document.addEventListener('click', function (e) {

				const clickedElement = e.target.closest('[data-vkpath]');

				if (clickedElement) {
					e.preventDefault();

					let target = clickedElement.dataset.vkpath;
					let animation = clickedElement.dataset.animation;
					let speed = clickedElement.dataset.speed;
					let container = parseInt(clickedElement.dataset.vkcontainer);

					this.container = container ? container : 1;
					this.animation = animation ? animation : 'fade';
					this.speed = speed ? parseInt(speed) : 300;

					this.target = target;

					// Сохраняем только в случае, если ранее не было открыто модального окна
					if (!this.isOpen) {
						this.modalContainer = document.querySelector(`[data-vktarget="${target}"]`);
					}

					this.modalContainerNew = document.querySelector(`[data-vktarget="${target}"]`);

					clickedElement.classList.add('js-active');

					this.open();
					return;
				}

				if (e.target.closest('.modal__close')) {
					this.close();
					return;
				}

			}.bind(this));

			window.addEventListener('keydown', function (e) {
				if (e.keyCode == 27) {
					if (this.isOpen) {
						this.close();
					}
				}

				if (e.keyCode == 9 && this.isOpen) {
					this.focusCatch(e);
					return;
				}

			}.bind(this));

			this.modal.addEventListener('click', function (ev) {
				if (!ev.target.classList.contains('modal__content') && !ev.target.closest('.modal__content') && this.isOpen) {
					this.close();
				}
			}.bind(this));

			this.modal2.addEventListener('click', function (ev) {
				if (!ev.target.classList.contains('modal__content') && !ev.target.closest('.modal__content') && this.isOpen) {
					this.close();
				}
			}.bind(this));

		}
	}

	open() {

		this.previousActiveElement = document.activeElement;
		if (this.modalContainer && this.modalContainerNew) {

			if (0 == this.openedContainer) {

				// Открывается новая модалка впервые

				if (1 == this.container) {
					this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
					this.modal.classList.add('is-open');
				} else if (2 == this.container) {
					this.modal2.style.setProperty('--transition-time', `${this.speed / 1000}s`);
					this.modal2.classList.add('is-open');
				}

				this.disableScroll();

			} else if (this.container == this.openedContainer) {

				// Открывается новая модалка в том же конейнере (modal, modal2)

				// Если была окрыта таже модалка, просто закрываем её
				if (this.modalContainer == this.modalContainerNew) {
					this.close();
					return;
				}

				// ОТкрывается другая модалка
				this.modalContainer.classList.remove('animate-open');
				this.modalContainer.classList.remove(this.animation);
				this.modalContainer.classList.remove('modal-open');
				this.modalContainer = this.modalContainerNew;

			} else {

				// Открывается новая модалка в другом контейнере

				this.modalContainer.classList.remove('animate-open');
				this.modalContainer.classList.remove(this.animation);
				if (1 == this.openedContainer) {
					this.modal.classList.remove('is-open');
				} else if (2 == this.openedContainer) {
					this.modal2.classList.remove('is-open');
				}
				this.modalContainer.classList.remove('modal-open');

				this.modalContainer = this.modalContainerNew;

				if (1 == this.container) {
					this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
					this.modal.classList.add('is-open');
				} else if (2 == this.container) {
					this.modal2.style.setProperty('--transition-time', `${this.speed / 1000}s`);
					this.modal2.classList.add('is-open');
				}

			}

			this.modalContainer.classList.add('modal-open');
			this.modalContainer.classList.add(this.animation);
			setTimeout(() => {
				this.options.isOpen(this);
				this.modalContainer.classList.add('animate-open');
				this.isOpen = true;
				this.openedContainer = this.container;
				this.focusTrap();
			}, this.speed);
		}

	}

	close(vktarget) {

		if (this.modalContainer) {


			// Removing js-active class from button
			if (this.target) {
				const buttonEl = document.querySelector(`[data-vkpath="${this.target}"]`);
				if (buttonEl) {
					buttonEl.classList.remove('js-active');
				}
			}

			this.modalContainer.classList.remove('animate-open');
			this.modalContainer.classList.remove(this.animation);

			if (1 == this.container) {
				this.modal.classList.remove('is-open');
			} else if (2 == this.container) {
				this.modal2.classList.remove('is-open');
			}

			this.modalContainer.classList.remove('modal-open');

			this.enableScroll();
			this.options.isClose(this);
			this.isOpen = false;
			this.openedContainer = 0;
			this.focusTrap();

		}

	}

	focusCatch(e) {
		const focusable = this.modalContainer.querySelectorAll(this.focusElements);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}

		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}

	focusTrap() {
		const focusable = this.modalContainer.querySelectorAll(this.focusElements);
		if (this.isOpen) {
			focusable[0].focus();
		} else {
			this.previousActiveElement.focus();
		}
	}

	disableScroll() {

		const stickyHeaderEl = document.querySelector('.header.js-sticky-header');
		if (stickyHeaderEl) {
			stickyHeaderEl.classList.add('js-modal-header');
		}

		let pagePosition = window.scrollY;
		this.lockPadding();
		document.body.classList.add('disable-scroll');
		document.body.dataset.position = pagePosition;
		document.body.style.top = -pagePosition + 'px';
	}

	enableScroll() {

		let pagePosition = parseInt(document.body.dataset.position, 10);
		this.unlockPadding();
		document.body.style.top = 'auto';
		document.body.classList.remove('disable-scroll');
		window.scroll({ top: pagePosition, left: 0 });
		document.body.removeAttribute('data-position');

		const stickyHeaderEl = document.querySelector('.header.js-sticky-header');
		if (stickyHeaderEl) {

			setTimeout(() => {
				stickyHeaderEl.classList.remove('js-modal-header');
			}, 50);

		}

	}

	lockPadding() {
		let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
		this.fixBlocks.forEach((el) => {
			if (window.getComputedStyle(el).position != 'relative') {
				el.style.paddingRight = paddingOffset;
			}
		});
		this.fixBlocksMargin.forEach((el) => {
			el.style.marginRight = paddingOffset;
		});

		document.body.style.paddingRight = paddingOffset;
	}

	unlockPadding() {
		this.fixBlocks.forEach((el) => {
			el.style.paddingRight = '0px';
		});
		this.fixBlocksMargin.forEach((el) => {
			el.style.marginRight = '0px';
		});
		document.body.style.paddingRight = '0px';
	}
}

const modal = new Modal({
	isOpen: (modal) => {
		// console.log('opened');
	},
	isClose: () => {
		// console.log('closed');
	},
});
