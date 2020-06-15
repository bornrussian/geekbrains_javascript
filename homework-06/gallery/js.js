'use strict';

//
// Задача:
// 
// 1. Доработать функцию замены картинки в галерее таким образом, 
// чтобы она проверяла наличие картинки по указанному в src адресу.
//
// 3. *Добавить в галерею функцию перехода к следующему изображению. 
// По сторонам от большой картинки должны быть стрелки «вперед» и «назад», 
// по нажатию на которые происходит замена изображения на следующее или предыдущее.
//

function ifImageExists(image_url, func_true, func_false)
{
    var image = new Image();
    image.src = image_url;

    image.onload = function()
    {
        func_true();
    }
    image.onerror = function()
    {
        func_false();
    }
}

const gallery = {
    settings: {
        previewSelector: '.mySuperGallery',
        openedImageWrapperClass: 'galleryWrapper',
        openedImageClass: 'galleryWrapper__image',
        openedImageScreenClass: 'galleryWrapper__screen',
        openedImageCloseBtnClass: 'galleryWrapper__close',
        openedImageCloseBtnSrc: 'images/gallery/close.png',
        openedImageNextBtnClass: 'galleryWrapper__next',
        openedImageNextBtnSrc: 'images/gallery/next.png',
        openedImagePrevBtnClass: 'galleryWrapper__prev',
        openedImagePrevBtnSrc: 'images/gallery/prev.png',
		
    },

    init(userSettings = {}) {
        Object.assign(this.settings, userSettings);
        // const foo = (args..) => {};
        // function foo (args..) {};
        document
            .querySelector(this.settings.previewSelector)
            .addEventListener('click', (event) => {
                this.containerClickHandler(event);
            });
    },

    containerClickHandler(event) {
        if (event.target.tagName !== 'IMG') return;
		this.openImage(event);
    },
	
    openImage(event) {
		console.log(event);
		ifImageExists(event.target.dataset.full_image_url, 
			// если большая картинка существует, то откроем её 
			() => {this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = event.target.dataset.full_image_url}, 
			// если большой картинки нет, то откроем хотя бы маленькую
			() => {this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = event.target.src} 
		);
		
		// вычисляем предыдущую и следующую картинку	
		let allImages = event.target.parentElement.children;
		let ourCurrentImageIndex = -1;
		for (let i=0; i<allImages.length; i++) {
			if (allImages[i].src === event.target.src) {
				ourCurrentImageIndex = i;
				break;
			}
		}
		let prevIMG, nextIMG;
		if (ourCurrentImageIndex === 0 ) {
			prevIMG = allImages[allImages.length-1];
			nextIMG = allImages[ourCurrentImageIndex+1];
		} else if (ourCurrentImageIndex === allImages.length-1) {
			prevIMG = allImages[ourCurrentImageIndex-1];
			nextIMG = allImages[0];
		} else {
			prevIMG = allImages[ourCurrentImageIndex-1];
			nextIMG = allImages[ourCurrentImageIndex+1];
		}
		
		// назначаем кнопкам "prev" и "next" функцию openImage с соответствующей картинкой
		this.getScreenContainer()
			.querySelector(`.${this.settings.openedImagePrevBtnClass}`)
			.addEventListener('click', () => this.openImage({target:prevIMG}));
		this.getScreenContainer()
			.querySelector(`.${this.settings.openedImageNextBtnClass}`)
			.addEventListener('click', () => this.openImage({target:nextIMG}));
		
    },
	

    getScreenContainer() {
        const galleryWrapperElement = document
            .querySelector(`.${this.settings.openedImageWrapperClass}`);

        if (galleryWrapperElement) return galleryWrapperElement;

        return this.createScreenContainer();
    },

    createScreenContainer() {
        const galleryWrapperElement = document.createElement('div');
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

        const galleryScreenElement = document.createElement('div');
        galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
        galleryWrapperElement.appendChild(galleryScreenElement);

        const closeImageElement = new Image();
        closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
        closeImageElement.src = this.settings.openedImageCloseBtnSrc;
        closeImageElement.addEventListener('click', () => this.close());
        galleryWrapperElement.appendChild(closeImageElement);

        const prevImageElement = new Image();
        prevImageElement.classList.add(this.settings.openedImagePrevBtnClass);
        prevImageElement.src = this.settings.openedImagePrevBtnSrc;
        galleryWrapperElement.appendChild(prevImageElement);

        const nextImageElement = new Image();
        nextImageElement.classList.add(this.settings.openedImageNextBtnClass);
        nextImageElement.src = this.settings.openedImageNextBtnSrc;
        galleryWrapperElement.appendChild(nextImageElement);

        const image = new Image();
        image.classList.add(this.settings.openedImageClass);
        galleryWrapperElement.appendChild(image);

        document.body.appendChild(galleryWrapperElement);

        return galleryWrapperElement;
    },

    close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
    },
}

window.addEventListener('load', () => {
    gallery.init({previewSelector: '.galleryPreviewsContainer'});
});
