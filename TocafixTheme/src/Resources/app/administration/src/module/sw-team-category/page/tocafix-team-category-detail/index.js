import template from './tocafix-team-category-detail.html.twig';

const { Component, Mixin } = Shopware;
const { mapPropertyErrors } = Shopware.Component.getComponentHelper();

Component.register('tocafix-team-category-detail', {
    template,

    inject: [
        'repositoryFactory'
    ],

    mixins: [
        Mixin.getByName('notification')
    ],

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    data() {
        return {
            teamCategory: null,
            isLoading: false,
            processSuccess: false,
            repository: null
        };
    },

    computed: {
        ...mapPropertyErrors('teamCategory', [
            'name',
        ])
    },

    created() {
        this.repository = this.repositoryFactory.create('tocafix_team_category');
        this.getTeamCategory();
    },

    methods: {
        getTeamCategory() {
            this.repository
                .get(this.$route.params.id, Shopware.Context.api)
                .then((entity) => {
                    this.teamCategory = entity;
                });
        },

        onClickSave() {
            this.isLoading = true;

            this.repository
                .save(this.teamCategory, Shopware.Context.api)
                .then(() => {
                    this.getTeamCategory();
                    this.isLoading = false;
                    this.processSuccess = true;
                }).catch((exception) => {
                    this.isLoading = false;
                    this.createNotificationError({
                        title: this.$t('tocafix-team-category.detail.errorTitle'),
                        message: exception
                    });
                });
        },

        saveFinish() {
            this.processSuccess = false;
        },

        onChangeLanguage() {
            this.getTeamCategory();
        },
    }
});