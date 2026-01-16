const { Component } = Shopware;

Component.extend('tocafix-job-create', 'tocafix-job-detail', {
    methods: {
        getJob() {
            this.job = this.repository.create(Shopware.Context.api);
        },

        onClickSave() {
            this.isLoading = true;

            this.repository
                .save(this.job, Shopware.Context.api)
                .then(() => {
                    this.isLoading = false;
                    this.$router.push({ name: 'tocafix.job.detail', params: { id: this.job.id } });
                }).catch((exception) => {
                    this.isLoading = false;

                    this.createNotificationError({
                        title: this.$t('tocafix-job.detail.errorTitle'),
                        message: exception
                    });
                });
        }
    }
});
