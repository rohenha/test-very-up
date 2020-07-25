/*global gsap */
window.testVeryUp.pages.home = {

    animateCards: function () {
        'use strict';
        var i = 0,
            single,
            length = this.cards.length;

        for (i; i < length; i += 1) {
            single = this.cards[i];
            single.enterAnimation.play();
        }
    },

    checkImagesLoaded: function (single) {
        'use strict';
        this.cardsLoaded += 1;
        this.initCard(single);
        if (this.cardsLoaded === this.cardsLength) {
            setTimeout(function () {
                this.loader.classList.remove('loader--active');
            }.bind(this), 500);
            setTimeout(this.animateCards.bind(this), 1000);
        }
    },

    hoverCard: function (single, state) {
        'use strict';
        var animation = state ? 'mouseEnterAnimation' : 'mouseLeaveAnimation',
            nextCard = this.cards[single.i + 1];
        if (nextCard) {
            nextCard.displacementAnimation.play(0);
        }
        single[animation].play(0);
    },

    init: function () {
        'use strict';
        this.container = document.querySelector('.js_home');
        this.deck = this.container.querySelector('.js_deck');
        this.loader = this.container.querySelector('.js_loader');
        this.cardsLoaded = 0;
        this.cards = [];
        this.page = {
            height: window.innerHeight,
            width: window.innerWidth
        };
        this.initImages();
    },

    initCard: function (single) {
        'use strict';
        var bounding = single.container.getBoundingClientRect();
        single.bounding = bounding;
        this.displacement = bounding.width / 3;
        this.deck.style.height = bounding.height + 'px';
        single.end = {
            delay: single.delay,
            duration: 0.7,
            opacity: 1,
            x: single.i * (bounding.width - this.displacement) - (this.cardsLength - 1) * (bounding.width - this.displacement) / 2,
            y: Math.floor(Math.random() * (bounding.height / 3))
        };
        single.start = {
            opacity: 0,
            x: 0,
            y: this.page.height - bounding.top + bounding.height / 2
        };

        single.end.rotation = -Math.atan((single.start.x - single.end.x) / Math.abs(single.start.y - single.end.y)) * 180 / Math.PI;
        this.setAnimations(single);
    },

    initImages: function () {
        'use strict';
        var i = 0,
            cards = this.container.querySelectorAll('.js_card_container'),
            single,
            el,
            delay = 0,
            length = cards.length;

        this.cardsLength = cards.length;
        for (i; i < length; i += 1) {
            el = cards[i];
            el.style.zIndex = i;
            single = {
                backed: false,
                card: el.querySelector('.js_card'),
                container: el,
                delay: delay,
                i: i
            };
            delay += 0.3;
            this.loadImage(single, el.querySelector('.js_card_image'));
            this.setEvents(single);
            this.cards.push(single);
        }
    },

    invoke: function () {
        'use strict';
        return {
            init: this.init.bind(this)
        };
    },

    loadImage: function (single, image) {
        'use strict';
        if (image.complete) {
            this.checkImagesLoaded(single);
        } else {
            image.addEventListener('load', this.checkImagesLoaded.bind(this, single));
        }
    },

    rotateCard: function (single, reset) {
        'use strict';
        var event,
            i = 0,
            card,
            length = this.cards.length;
        if (reset) {
            for (i; i < length; i += 1) {
                card = this.cards[i];
                if (card.backed && card !== single) {
                    this.rotateCard(card, false);
                }
            }
        }
        single.backed = !single.backed;
        event = single.backed ? 'play' : 'reverse';
        single.rotateAnimation[event](0);

    },

    setAnimations: function (single) {
        'use strict';
        gsap.set(single.container, single.start);
        single.enterAnimation = gsap.timeline({ paused: true });
        single.enterAnimation.fromTo(single.container, single.start, single.end);
        single.displacementAnimation = gsap.timeline({ paused: true });
        single.displacementAnimation.to(single.container, { duration: 0.5, x: single.end.x + single.bounding.width / 2 });
        single.displacementAnimation.to(single.container, { duration: 0.5, x: single.end.x });
        single.mouseEnterAnimation = gsap.timeline({ paused: true });
        single.mouseEnterAnimation.to(single.container, { duration: 0.3, scale: 1.1 });
        single.mouseEnterAnimation.set(single.container, { css: { zIndex: 10 } });
        single.mouseLeaveAnimation = gsap.timeline({ paused: true });
        single.mouseLeaveAnimation.to(single.container, { duration: 0.3, scale: 1 });
        single.mouseLeaveAnimation.set(single.container, { css: { zIndex: single.i } });
        single.rotateAnimation = gsap.timeline({ paused: true });
        single.rotateAnimation.to(single.card, { duration: 0.3, rotationY: 180 });
    },

    setEvents: function (single) {
        'use strict';
        single.card.addEventListener('click', this.rotateCard.bind(this, single, true));
        single.card.addEventListener('mouseenter', this.hoverCard.bind(this, single, true));
        single.card.addEventListener('mouseleave', this.hoverCard.bind(this, single, false));
    }

}.invoke();
