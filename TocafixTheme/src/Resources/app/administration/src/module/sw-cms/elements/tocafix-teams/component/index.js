import template from './sw-cms-el-tocafix-teams.html.twig';
import './sw-cms-el-tocafix-teams.scss';

Shopware.Component.register('sw-cms-el-tocafix-teams', {
    template,

    mixins: [
        Shopware.Mixin.getByName('cms-element')
    ],

    computed: {
        numberOfPosts() {
            if(this.element.config.numberOfPosts.value == 0) {
                return 3;
            }

            return this.element.config.numberOfPosts.value;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('tocafixteams');
        }
    }
});
