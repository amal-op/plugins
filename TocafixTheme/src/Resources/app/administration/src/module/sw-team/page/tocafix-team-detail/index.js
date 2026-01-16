import template from './tocafix-team-detail.html.twig';

const { Component, Mixin } = Shopware;
const { mapPropertyErrors } = Shopware.Component.getComponentHelper();

Component.register('tocafix-team-detail', {
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
            team: null,
            isLoading: false,
            processSuccess: false,
            repository: null
        };
    },

    computed: {
        ...mapPropertyErrors('team', [
            'name',
            'email',
            'position'
        ])
    },

    created() {
        this.repository = this.repositoryFactory.create('tocafix_team');
        this.getTeam();
    },

    methods: {
        getTeam() {
            this.repository
                .get(this.$route.params.id, Shopware.Context.api)
                .then((entity) => {
                    this.team = entity;
                });
        },

        onClickSave() {
            this.isLoading = true;

            this.repository
                .save(this.team, Shopware.Context.api)
                .then(() => {
                    this.getTeam();
                    this.isLoading = false;
                    this.processSuccess = true;
                }).catch((exception) => {
                    this.isLoading = false;
                    this.createNotificationError({
                        title: this.$t('tocafix-team.detail.errorTitle'),
                        message: exception
                    });
                });
        },

        saveFinish() {
            this.processSuccess = false;
        },

        onChangeLanguage() {
            this.getTeam();
        }
    }
});