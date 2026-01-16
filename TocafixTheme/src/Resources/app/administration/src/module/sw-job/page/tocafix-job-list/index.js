import template from './tocafix-job-list.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('tocafix-job-list', {
    template,

    inject: [
        'repositoryFactory'
    ],

    data() {
        return {
            isLoading: false,
            repository: null,
            jobs: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    filters: {
        dateFilter: function(value) {
            if (value === null) {
                return '';
            }

            const dateObj = new Date(value);
            // eslint-disable-next-line
            if (isNaN(dateObj)) {
                return '';
            }

            const langCode = navigator.language;
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
            const dateTimeFormatter = new Intl.DateTimeFormat(langCode, options);

            return dateTimeFormatter.format(dateObj);
        }
    },

    computed: {
        columns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                label: this.$t('tocafix-job.list.columnName'),
                routerLink: 'tocafix.job.detail',
                inlineEdit: 'string',
                allowResize: true,
                primary: true
            }, {
                property: 'jobDate',
                dataIndex: 'jobDate',
                label: this.$t('tocafix-job.list.columnJobDate'),
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
            this.repository = this.repositoryFactory.create('tocafix_job');
            const jobCriteria = new Criteria();

            this.repository
                .search(jobCriteria, Shopware.Context.api)
                .then((result) => {
                    this.jobs = result;
                    this.isLoading = false;
                });
        },

        onChangeLanguage() {
            this.loadList();
        }
    }
});