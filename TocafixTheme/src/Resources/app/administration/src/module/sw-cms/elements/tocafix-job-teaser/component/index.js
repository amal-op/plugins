import template from './sw-cms-el-tocafix-job-teaser.html.twig';
import './sw-cms-el-tocafix-job-teaser.scss';

Shopware.Component.register('sw-cms-el-tocafix-job-teaser', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('tocafix-job-teaser');
        }
    }
});
