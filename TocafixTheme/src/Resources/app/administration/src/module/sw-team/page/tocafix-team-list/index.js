import template from './tocafix-team-list.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('tocafix-team-list', {
    template,

    inject: [
        'repositoryFactory'
    ],

    data() {
        return {
            isLoading: false,
            repository: null,
            teams: null
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
                label: this.$t('tocafix-team.list.columnName'),
                routerLink: 'tocafix.team.detail',
                inlineEdit: 'string',
                allowResize: true,
                primary: true
            }, {
                property: 'position',
                dataIndex: 'position',
                label: this.$t('tocafix-team.list.columnPosition'),
                allowResize: true
            }, {
                property: 'email',
                dataIndex: 'email',
                label: this.$t('tocafix-team.list.columnEmail'),
                allowResize: true
            }, {
                property: 'phoneNumber',
                dataIndex: 'phoneNumber',
                label: this.$t('tocafix-team.list.columnPhoneNumber'),
                allowResize: true
            }, {
                property: 'sortOrder',
                dataIndex: 'sortOrder',
                label: this.$t('tocafix-team.list.columnSortOrder'),
                allowResize: true
            }];
        }
    },

    created() {
        this.loadList();
    },

    methods: {
        loadList() {
            this.isLoading = true;
            this.repository = this.repositoryFactory.create('tocafix_team');
            const teamCriteria = new Criteria();
            teamCriteria.addSorting(Criteria.sort('sortOrder', 'ASC'));

            this.repository
                .search(teamCriteria, Shopware.Context.api)
                .then((result) => {
                    this.teams = result;
                    this.isLoading = false;
                });
        },

        onChangeLanguage() {
            this.loadList();
        }
    }
});