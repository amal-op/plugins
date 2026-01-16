import template from './tocafix-team-category-list.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('tocafix-team-category-list', {
    template,

    inject: [
        'repositoryFactory'
    ],

    data() {
        return {
            isLoading: false,
            repository: null,
            teamCategories: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        columns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                label: this.$t('tocafix-team-category.list.columnName'),
                routerLink: 'tocafix.team.category.detail',
                inlineEdit: 'string',
                allowResize: true,
                primary: true
            }];
        }
    },

    created() {
        this.loadList();
    },
    
    methods: {
        loadList() {
            this.isLoading = true;
            this.repository = this.repositoryFactory.create('tocafix_team_category');
            const teamCategoryCriteria = new Criteria();

            this.repository
                .search(teamCategoryCriteria, Shopware.Context.api)
                .then((result) => {
                    this.teamCategories = result;
                    this.isLoading = false;
                });
        },

        onChangeLanguage() {
            this.loadList();
        }
    }
});