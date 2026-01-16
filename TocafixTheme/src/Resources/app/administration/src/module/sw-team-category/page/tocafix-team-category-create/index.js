const { Component } = Shopware;

Component.extend('tocafix-team-category-create', 'tocafix-team-category-detail', {
    methods: {
        getTeamCategory() {
            this.teamCategory = this.repository.create(Shopware.Context.api);
        },

        onClickSave() {
            this.isLoading = true;

            this.repository
                .save(this.teamCategory, Shopware.Context.api)
                .then(() => {
                    this.isLoading = false;
                    this.$router.push({ name: 'tocafix.team.category.detail', params: { id: this.teamCategory.id } });
                }).catch((exception) => {
                    this.isLoading = false;

                    this.createNotificationError({
                        title: this.$t('tocafix-team-category.detail.errorTitle'),
                        message: exception
                    });
                });
        }
    }
});
