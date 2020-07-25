window.testVeryUp.app = {
    init: function () {
        'use strict';
        this.page = document.body.dataset.page;
        if (this.page !== '' && window.testVeryUp.pages[this.page]) {
            window.testVeryUp.pages[this.page].init();
        }
    },

    invoke: function () {
        'use strict';
        return {
            init: this.init.bind(this)
        };
    }

}.invoke();
